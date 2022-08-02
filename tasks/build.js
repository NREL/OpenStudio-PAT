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
var decompress = require('gulp-decompress');
var gulpClean = require('gulp-clean');
var merge = require('merge-stream');
var rename = require("gulp-rename");

const { inject } = require('./inject');
const { scripts } = require('./scripts');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'del', 'lazypipe', 'streamify']
});

function background() {
  return gulp.src(path.join(conf.paths.tmp, '/serve/app/background.js'))
  .pipe($.uglify()).on('error', conf.errorHandler('Uglify background.js'))
  .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
}

function preload() {
  return gulp.src(path.join(conf.paths.src, '/app/reports/preload.js'))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/scripts')));
}

function finalizeHtml() {
  var htmlFilter = $.filter('*.html', {restore: true});
  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.useref({}, $.lazypipe().pipe($.sourcemaps.init, {loadMaps: true})))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.rev())
    .pipe($.uglify()).on('error', conf.errorHandler('Uglify'))
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))
    .pipe($.replace(/url\('ui-grid.(.+?)'\)/g, 'url(\'../fonts/ui-grid.$1\')'))
    .pipe($.rev())
    .pipe($.csso())
    .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
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

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
function fonts() {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
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
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
}

function nodeModules() {
  return gulp.src(path.join(conf.paths.src, '/node_modules/**/*'), {base: conf.paths.src})
    .pipe($.filter(file => file.stat.isFile()))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
}

function clean() {
  return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
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
const arch = os.arch();

function downloadDeps() {

  // List the dependencies to download here
  // These should correspond to keys in the manifest

  console.log('Dependencies: ' + dependencies.sort().join(', '));
  var tasks = dependencies.map(depend => {
    const fileInfo = _.find(manifest[depend], {platform: platform});
    const fileName = fileInfo.name;

    // Note JM 2018-09-13: Allow other resources in case AWS isn't up to date
    // and for easier testing of new deps
    if( fileName.includes("http") ) {
      // Already a URI
      var uri = fileName;
      var destName = fileName.replace(/^.*[\\\/]/, '');
    } else {
      // Need to concat endpoint (AWS) with the fileName
      var uri = manifest.endpoint + fileName;
      var destName = fileName;
    }

    return progress(request({uri: uri, timeout: 5000}))
      .on('progress', state => {
        console.log(`Downloading ${depend}, ${(state.percentage * 100).toFixed(0)}%`);
      })
      .pipe(source(destName))
      .pipe(gulp.dest(destination));
  });

  return merge(tasks);
}

function extractDeps() {
  var tasks = dependencies.map(depend => {
    const fileInfo = _.find(manifest[depend], {platform: platform});
    const fileName = fileInfo.name;

    if( fileName.includes("http") ) {
      var destName = fileName.replace(/^.*[\\\/]/, '');
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
    return gulp.src(path.join(destination, destName))
      .pipe( decompress({strip: 1}) )
      .pipe(gulp.dest(path.join(destination, properName)));  });

  return merge(tasks);
}

function cleanDeps() {
  var tasks = dependencies.map(depend => {
    const fileInfo = _.find(manifest[depend], {platform: platform});
    const fileName = fileInfo.name;

    if( fileName.includes("http") ) {
      var destName = fileName.replace(/^.*[\\\/]/, '');
    } else {
      var destName = fileName;
    }

    return gulp.src(path.join(destination, fileName), {read: false})
      .pipe(gulpClean());
  });

  return merge(tasks);
}

exports.build = gulp.series(gulp.parallel(html, fonts, nodeModules, other, environment), finalizeBuild);
exports.clean = clean;
exports.copyManifest = copyManifest;
exports.installDeps = gulp.series(downloadDeps, extractDeps, cleanDeps);
