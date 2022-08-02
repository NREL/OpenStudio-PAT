'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

const { partials } = require('./inject');
const { scriptsWatch } = require('./scripts');
const { styles } = require('./styles');

function watch() {
  gulp.watch(path.join(conf.paths.src, '/app/**/*.scss'), styles);
  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), scriptsWatch);
  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), partials);
}

exports.watch = watch;
