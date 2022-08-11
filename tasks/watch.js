'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

const { partials } = require('./inject');
const { scriptsWatch } = require('./scripts');
const { styles } = require('./styles');

function watch() {
  console.info('**', path.join(conf.paths.src, '/**/*.scss'));
  gulp.watch(path.join(conf.paths.src, '/**/*.scss'), styles);
  gulp.watch(path.join(conf.paths.src, '/**/*.js'), scriptsWatch);
  gulp.watch(path.join(conf.paths.src, '/**/*.html'), partials);
}

exports.watch = watch;
