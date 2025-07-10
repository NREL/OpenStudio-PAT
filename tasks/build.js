'use strict';

var path = require('path');
var gulp = require('gulp');
var request = require('request');
var progress = require('request-progress');
var source = require('vinyl-source-stream');
var jetpack = require('fs-jetpack');
var conf = require('./conf');
var utils = require('./utils');
var _ = require('lodash');
var os = require('os');
var zlib = require('zlib');
var tar = require('tar-fs');
var gulpClean = require('gulp-clean');
var merge = require('merge-stream');
var rename = require('gulp-rename');

const { inject } = require('./inject');
const { scripts } = require('./scripts');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'lazypipe', 'streamify']
});

async function background() {
  return gulp.src(path.join(conf.paths.tmp, '/serve/app/background.js'))
  .pipe($.uglify()).on('error', await conf.errorHandler('Uglify background.js'))
  .pipe($.flatten())
  .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
}

function preload() {
  return gulp.src(path.join(conf.paths.src, '/app/reports/preload.js'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/scripts')));
}

async function finalizeHtml() {
  const htmlFilter = $.filter('*.html', {restore: true});
  const jsFilter = $.filter('**/*.js', {restore: true});
  const cssFilter = $.filter('**/*.css', {restore: true});
  const notSourceMapFilter = $.filter(['**', '!*.map'], {restore: true});

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'), { base: conf.paths.dist })
    .pipe($.flatten())
    .pipe($.useref({}, $.lazypipe().pipe($.sourcemaps.init, {loadMaps: true})))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.rev())
    .pipe($.uglify()).on('error', await conf.errorHandler('Uglify'))
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.replace('../node_modules/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))
    .pipe($.replace(/url\('ui-grid.(.+?)'\)/g, 'url(\'../fonts/ui-grid.$1\')'))
    .pipe($.rev())
    .pipe($.csso())
    .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe(notSourceMapFilter)
    .pipe($.revReplace())
    .pipe(notSourceMapFilter.restore)
    .pipe(htmlFilter)
    .pipe($.htmlmin({
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeTagWhitespace: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({
      title: path.join(conf.paths.dist, '/'),
      showFiles: true
    }));
}

const html = gulp.series(scripts, gulp.parallel(background, preload, inject), finalizeHtml);

// Only applies for fonts from bootstrap-sass & angular-ui-grid modules
// Custom fonts are handled by the "other" task
function fonts() {
  const NPM_FONT_DIRS = ['bootstrap-sass', 'angular-ui-grid'];
  const FONT_EXTENSIONS_GLOB = '/**/*.{eot,svg,ttf,woff,woff2}';

  return gulp.src(NPM_FONT_DIRS.map(fontDir => utils.mapNpmFilePath(`${fontDir}${FONT_EXTENSIONS_GLOB}`)))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
}

function other() {
  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/node_modules/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
  ])
    .pipe($.filter(file => file.stat.isFile()))
    .pipe(rename(p => {
      if (p.dirname.startsWith(conf.paths.src)) {
        p.dirname = p.dirname.substring(conf.paths.src.length);
      }
    }))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
}

function nodeModules() {
  return gulp.src(path.join(conf.paths.src, '/node_modules/**/*'), {base: conf.paths.src})
    .pipe($.filter(file => file.stat.isFile()))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
}

async function clean() {
  await jetpack.removeAsync(conf.paths.dist);
  await jetpack.removeAsync(conf.paths.tmp);
}

function environment() {
  var configFile = 'config/env_' + utils.getEnvName() + '.json';
  return jetpack.copyAsync(configFile, path.join(conf.paths.dist, '/env.json'), {overwrite: true});
}

function finalizeBuild() {
  // Finalize
  var manifest = jetpack.read(path.join(__dirname, '..', conf.paths.src, 'package.json'), 'json');

  // Add "dev" or "test" suffix to name, so Electron will write all data
  // like cookies and localStorage in separate places for each environment.
  switch (utils.getEnvName()) {
    case 'development':
      manifest.name += '-dev';
      manifest.productName += 'Dev';
      break;
    case 'test':
      manifest.name += '-test';
      manifest.productName += 'Test';
      break;
  }

  return jetpack.writeAsync(path.join(__dirname, '..', conf.paths.dist, 'package.json'), manifest);
}

function copyManifest() {
  jetpack.copy('manifest.json', path.join(conf.paths.dist, '/manifest.json'), {overwrite: true});
}

// Binary dependency management

var argv = require('yargs').argv;

let destination = path.join(conf.paths.dist, '..', 'depend');
let dependencies = ['openstudio', 'energyplus', 'ruby', 'mongo', 'openstudioServer'];

if (argv.prefix) {
  destination = argv.prefix;
}

if (argv.exclude) {
  const without = argv.exclude.split(',');
  dependencies = _.difference(dependencies, without);
}

const manifest = jetpack.read('manifest.json', 'json');

const platform = os.platform();
// Priority: MATRIX_ARCH (set by workflow) > CMAKE_OSX_ARCHITECTURES > os.arch()
const cmakeArch = process.env.CMAKE_OSX_ARCHITECTURES ? process.env.CMAKE_OSX_ARCHITECTURES.split(';')[0] : null;
const arch = process.env.MATRIX_ARCH || cmakeArch || os.arch();

// Helper function for manifest lookup with arch fallback
function getActualFileInfo(manifest, depend, platform, arch) {
  const fileInfo = _.find(manifest[depend], {platform, arch});
  if (fileInfo) return fileInfo;
  console.warn(`No dependency found for ${depend} on ${platform}/${arch}, falling back to x64`);
  const fallback = _.find(manifest[depend], {platform, arch: 'x64'});
  if (!fallback) throw new Error(`No dependency found for ${depend} on ${platform}`);
  return fallback;
}

// Retry wrapper for critical operations
function withRetry(operation, maxRetries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    function attempt() {
      attempts++;
      operation()
        .then(resolve)
        .catch(err => {
          if (attempts >= maxRetries) {
            console.error(`Operation failed after ${maxRetries} attempts:`, err.message);
            reject(err);
          } else {
            console.warn(`Attempt ${attempts} failed, retrying in ${delay}ms...`);
            setTimeout(attempt, delay);
          }
        });
    }
    
    attempt();
  });
}

function downloadDeps() {

  // List the dependencies to download here
  // These should correspond to keys in the manifest
  // Enhanced with better error handling, logging, and progress reporting

  console.log('Dependencies: ' + dependencies.sort().join(', '));
  console.log(`Platform: ${platform}, Architecture: ${arch}`);
  console.log(`Destination: ${destination}`);
  
  var tasks = dependencies.map(depend => {
    const fileInfo = getActualFileInfo(manifest, depend, platform, arch);
    const fileName = fileInfo.name;

    // Note JM 2018-09-13: Allow other resources in case AWS isn't up to date
    // and for easier testing of new deps
    if( fileName.includes("http") ) {
      // Already a URI
      var uri = fileName;
      var destName = fileName.replace(/^.*[\\/]/, '');
    } else {
      // Need to concat endpoint (AWS) with the fileName
      var uri = manifest.endpoint + fileName;
      var destName = fileName;
    }

    console.log(`Downloading ${depend}: ${uri}`);
    
    const requestOptions = {
      uri: uri, 
      timeout: 30000, // Increased timeout to 30 seconds
      headers: {
        'User-Agent': 'OpenStudio-PAT-Builder/1.0'
      }
    };

    return progress(request(requestOptions))
      .on('progress', state => {
        const percent = (state.percent * 100).toFixed(1);
        const speed = state.speed ? `(${(state.speed / 1024 / 1024).toFixed(2)} MB/s)` : '';
        console.log(`Downloading ${depend}: ${percent}% ${speed}`);
      })
      .on('error', err => {
        console.error(`Error downloading ${depend} from ${uri}:`, err.message);
        if (err.code === 'ETIMEDOUT') {
          console.error(`Download timeout for ${depend}. Check network connection or try again.`);
        } else if (err.code === 'ENOTFOUND') {
          console.error(`Host not found for ${depend}. Check the URL: ${uri}`);
        }
      })
      .on('response', response => {
        console.log(`Response for ${depend}: ${response.statusCode} ${response.statusMessage}`);
        if (response.statusCode !== 200) {
          console.error(`HTTP ${response.statusCode} for ${depend}: ${uri}`);
        }
        if (response.headers['content-length']) {
          const sizeMB = (parseInt(response.headers['content-length']) / 1024 / 1024).toFixed(2);
          console.log(`Expected size for ${depend}: ${sizeMB} MB`);
        }
      })
      .pipe(source(destName))
      .pipe(gulp.dest(destination));
  });

  return merge(tasks);
}

function extractDeps() {
  var tasks = dependencies.map(depend => {
    const fileInfo = getActualFileInfo(manifest, depend, platform, arch);
    const fileName = fileInfo.name;

    if( fileName.includes("http") ) {
      var destName = fileName.replace(/^.*[\\/]/, '');
    } else {
      var destName = fileName;
    }

    // File integrity check before extraction
    const filePath = path.join(destination, destName);
    const fileStats = jetpack.inspect(filePath, { checksum: 'md5' });
    
    if (!fileStats) {
      throw new Error(`Downloaded file not found: ${filePath}`);
    }
    
    console.log(`Extracting ${depend}:`);
    console.log(`  File: ${destName}`);
    console.log(`  Size: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  MD5: ${fileStats.md5}`);
    
    // Basic size validation (warn if file is suspiciously small)
    if (fileStats.size < 1024) { // Less than 1KB
      console.warn(`Warning: ${depend} file is very small (${fileStats.size} bytes). This may indicate a download error.`);
    }

    // Note JM 2018-0913:
    // Usually deps are properly zipped to that the extracted root folder
    // is adequately named, but when using absolute http:// resources (not
    // packaged specifically by us), we must rename to ensure it's correct
    var properName = fileInfo.type;

    // What we do is to extract to properName and remove the leading (root)
    // directory level
    const properDestinationDir = path.join(destination, properName);
    jetpack.remove(properDestinationDir);
    
    console.log(`  Extracting to: ${properDestinationDir}`);
    
    return jetpack.createReadStream(filePath)
      .on('error', err => {
        console.error(`Error reading ${depend} file: ${err.message}`);
        throw err;
      })
      .pipe(zlib.createGunzip())
      .on('error', err => {
        console.error(`Error decompressing ${depend}: ${err.message}`);
        console.error(`This may indicate file corruption. Try re-downloading the dependency.`);
        throw err;
      })
      .pipe(tar.extract(properDestinationDir, {
        strip: 1,
        // There is a bug in tar-fs where, because stripped files & directories
        // are given an empty header.name, having multiple stripped items
        // results in having multiple headers with the same (empty) name,
        // causing the extraction to either fail or hang.
        //
        // We avoid this issue by ignoring stripped items (ie, items with empty names)
        ignore: (__, header) => {
          return header.name.length === 0;
        }
      }))
      .on('error', err => {
        console.error(`Error extracting ${depend}: ${err.message}`);
        throw err;
      })
      .on('finish', () => {
        console.log(`Successfully extracted ${depend}`);
      });
  });

  const tasksAsPromises = tasks.map(task => new Promise((resolve, reject) => task.on('finish', resolve).on('error', reject)));
  return Promise.all(tasksAsPromises);
}

function cleanDeps() {
  var tasks = dependencies.map(depend => {
    const fileInfo = getActualFileInfo(manifest, depend, platform, arch);
    const fileName = fileInfo.name;

    if( fileName.includes("http") ) {
      var destName = fileName.replace(/^.*[\\/]/, '');
    } else {
      var destName = fileName;
    }

    return gulp.src(path.join(destination, destName), {read: false})
      .pipe(gulpClean());
  });

  return merge(tasks);
}

exports.build = gulp.series(gulp.parallel(html, fonts, nodeModules, other, environment), finalizeBuild);
exports.clean = clean;
exports.copyManifest = copyManifest;
exports.installDeps = gulp.series(downloadDeps, extractDeps, cleanDeps);
