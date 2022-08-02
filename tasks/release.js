'use strict';

var gulp = require('gulp');
var utils = require('./utils');
var conf = require('./conf');
var path = require('path');

const { build } = require('./build');

var releaseForOs = {
  osx: require('./release_osx'),
  linux: require('./release_linux'),
  windows: require('./release_windows')
};

function reports() {
  return gulp.src(path.join(conf.paths.src, 'app/reports/projectReports/*.html'))
    .pipe(gulp.dest(conf.paths.dist));
}

function finalizeRelease() {
  return releaseForOs[utils.os()]();
}

exports.release = gulp.series(gulp.parallel(build, reports), finalizeRelease);
