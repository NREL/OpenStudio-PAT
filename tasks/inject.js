'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

//var browserSync = require('browser-sync');

/*gulp.task('inject-reload', ['inject'], function() {
 browserSync.reload();
 });*/

gulp.task('inject', ['scripts', 'styles'], function () {
  var injectAppStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/**/bootstrap.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], {read: false});
  var injectBootstrapStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/bootstrap.css')
  ], {read: false});

  var injectScripts = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.module.js')
  ], {read: false});

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };
  var bootstrapInjectOptions = _.extend({}, injectOptions, {
    starttag: '<!-- inject:bootstrap -->'
  });

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectAppStyles, injectOptions))
    .pipe($.inject(injectBootstrapStyles, bootstrapInjectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(conf.wiredep))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
