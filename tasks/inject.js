'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var utils = require('./utils');

var $ = require('gulp-load-plugins')();
var rename = require('gulp-rename');

var wiredep = require('wiredep').stream;
var _ = require('lodash');

const { styles } = require('./styles');

function partials() {
  const parentDirs = path.join(conf.paths.src, '/app/');
  return gulp.src(path.join(conf.paths.src, '/app/**/*.html'))
    .pipe(rename(p => {
      if (p.dirname.startsWith(parentDirs)) {
        p.dirname = p.dirname.substring(parentDirs.length);
      }
    }))
    .pipe($.sort())
    .pipe($.htmlmin({
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: false,
      removeComments: true,
      removeRedundantAttributes: true,
      removeTagWhitespace: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'PAT',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/serve/app/'));
}

function finalizeInject() {
  var injectAppStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/**/bootstrap.css')
  ], {read: false});
  var injectBootstrapStyles = gulp.src([path.join(conf.paths.tmp, '/serve/app/**/bootstrap.css')], {read: false});
  var injectScripts = gulp.src([path.join(conf.paths.tmp, '/serve/app/**/*.module.js')], {read: false});
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/serve/app/templateCacheHtml.js'), {read: false});

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };
  var bootstrapInjectOptions = _.extend({}, injectOptions, {starttag: '<!-- inject:bootstrap -->'});
  var partialsInjectOptions = _.extend({}, injectOptions, {starttag: '<!-- inject:partials -->'});


  var stream = gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectAppStyles, injectOptions))
    .pipe($.inject(injectBootstrapStyles, bootstrapInjectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions));

  if (utils.getEnvName() == 'development') {
    var injectBrowsersyncHelper = gulp.src(path.join(conf.paths.tmp, '/serve/app/browsersync_helper.js'), {read: false});
    var browsersyncInjectOptions = _.extend({}, injectOptions, {starttag: '<!-- inject:browsersync -->'});
    stream = stream.pipe($.inject(injectBrowsersyncHelper, browsersyncInjectOptions));
  }

  return stream.pipe(wiredep(conf.wiredep))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
}

exports.partials = partials;
exports.inject = gulp.series(gulp.parallel(partials, styles), finalizeInject);
