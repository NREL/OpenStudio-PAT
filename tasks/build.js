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

function downloadDeps() {

  // List the dependencies to download here
  // These should correspond to keys in the manifest

  console.log('Dependencies: ' + dependencies.sort().join(', '));
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
      // Properly encode the filename to handle special characters like + 
      var uri = manifest.endpoint + encodeURIComponent(fileName);
      var destName = fileName;
    }

    console.log(`Downloading ${depend} from ${uri}...`);

    return progress(request({
      uri: uri, 
      timeout: 30000, // Increased timeout for ARM64 dependencies which may be larger
      followRedirect: true,
      maxRedirects: 5
    }))
      .on('progress', state => {
        console.log(`Downloading ${depend}, ${(state.percent * 100).toFixed(0)}%`);
      })
      .on('error', (err) => {
        console.error(`Download error for ${depend}: ${err.message}`);
        console.error(`URI: ${uri}`);
        throw new Error(`Failed to download ${depend}: ${err.message}`);
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

    // Note JM 2018-0913:
    // Usually deps are properly zipped to that the extracted root folder
    // is adequately named, but when using absolute http:// resources (not
    // packaged specifically by us), we must rename to ensure it's correct
    var properName = fileInfo.type;

    // What we do is to extract to properName and remove the leading (root)
    // directory level
    const properDestinationDir = path.join(destination, properName);
    jetpack.remove(properDestinationDir);
    
    const filePath = path.join(destination, destName);
    console.log(`Extracting ${depend} from ${filePath}...`);
    
    // Verify file exists before attempting extraction
    if (!jetpack.exists(filePath)) {
      throw new Error(`Dependency file not found: ${filePath}`);
    }
    
    // Check file size to detect incomplete downloads
    const fileStats = jetpack.inspect(filePath);
    if (!fileStats || fileStats.size === 0) {
      throw new Error(`Dependency file is empty or corrupted: ${filePath} (size: ${fileStats ? fileStats.size : 'unknown'})`);
    }
    
    console.log(`File ${destName} size: ${fileStats.size} bytes`);
    
    return jetpack.createReadStream(filePath)
      .pipe(zlib.createGunzip())
      .on('error', (err) => {
        console.error(`Error extracting ${depend}: ${err.message}`);
        console.error(`File path: ${filePath}`);
        console.error(`File size: ${fileStats.size} bytes`);
        throw new Error(`Extraction failed for ${depend}: ${err.message}. File may be corrupted.`);
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
      .on('error', (err) => {
        console.error(`Error during tar extraction for ${depend}: ${err.message}`);
        throw err;
      });
  });

  const tasksAsPromises = tasks.map(task => new Promise((resolve, reject) => task.on('finish', resolve).on('error', reject)));
  return Promise.all(tasksAsPromises);
}

function verifyDeps() {
  console.log('Verifying downloaded dependencies...');
  var tasks = dependencies.map(depend => {
    const fileInfo = getActualFileInfo(manifest, depend, platform, arch);
    const fileName = fileInfo.name;

    if( fileName.includes("http") ) {
      var destName = fileName.replace(/^.*[\\/]/, '');
    } else {
      var destName = fileName;
    }

    const filePath = path.join(destination, destName);
    
    return new Promise((resolve, reject) => {
      if (!jetpack.exists(filePath)) {
        reject(new Error(`Dependency file not found: ${filePath}`));
        return;
      }
      
      const fileStats = jetpack.inspect(filePath);
      if (!fileStats || fileStats.size === 0) {
        reject(new Error(`Dependency file is empty: ${filePath}`));
        return;
      }
      
      console.log(`✓ ${depend}: ${destName} (${fileStats.size} bytes)`);
      
      // Test gzip header for compressed files
      if (destName.endsWith('.tar.gz') || destName.endsWith('.tgz')) {
        const stream = jetpack.createReadStream(filePath);
        const chunks = [];
        
        stream.on('data', chunk => {
          chunks.push(chunk);
          if (chunks.length === 1) {
            // Check gzip magic number (1f 8b)
            const buffer = chunk;
            if (buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b) {
              console.log(`✓ ${depend}: Valid gzip header detected`);
              stream.destroy();
              resolve();
            } else {
              stream.destroy();
              reject(new Error(`Invalid gzip header in ${destName}. Expected magic bytes 1f 8b, got ${buffer[0].toString(16)} ${buffer[1].toString(16)}`));
            }
          }
        });
        
        stream.on('error', (err) => {
          reject(new Error(`Error reading ${destName}: ${err.message}`));
        });
        
        stream.on('end', () => {
          if (chunks.length === 0) {
            reject(new Error(`No data read from ${destName}`));
          }
        });
      } else {
        resolve();
      }
    });
  });

  return Promise.all(tasks);
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
exports.installDeps = gulp.series(downloadDeps, verifyDeps, extractDeps, cleanDeps);
exports.downloadDeps = downloadDeps;
exports.verifyDeps = verifyDeps;
exports.extractDeps = extractDeps;
exports.cleanDeps = cleanDeps;
