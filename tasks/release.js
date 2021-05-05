'use strict';

var gulp = require('gulp');
var utils = require('./utils');
var conf = require('./conf');
var path = require('path');

var releaseForOs = {
  osx: require('./release_osx'),
  linux: require('./release_linux'),
  windows: require('./release_windows')
};

gulp.task('reports', function () {
  return gulp.src(path.join(conf.paths.src, 'app/reports/projectReports/*.html'))
    .pipe(gulp.dest(conf.paths.dist));
});

gulp.task('release', ['build','reports'], function () {
  return releaseForOs[utils.os()]();
});
