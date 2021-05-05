'use strict';

var path = require('path');
var gulp = require('gulp');
var Q = require('q');
var jetpack = require('fs-jetpack');
var conf = require('./conf');
var utils = require('./utils');
var $ = require('gulp-load-plugins')();

var rollup = require('rollup');
var babel = require('rollup-plugin-babel');

var eslint = function (fix) {
  fix = !!fix;
  return gulp.src([
      path.join(conf.paths.src, '**/*.js'),
      '!' + path.join(conf.paths.src, 'node_modules/**')
    ], {base: '.'})
    .pipe($.eslint({fix: fix}))
    .pipe($.eslint.format())
    .pipe(fix ? gulp.dest('.') : $.util.noop());
    //.pipe($.eslint.failAfterError());
};

gulp.task('lint', function () {
  return eslint();
});

gulp.task('lint:fix', function () {
  return eslint(true);
});

var bundle = function (src, dest) {
  var deferred = Q.defer();
  var buildSourcemap = path.basename(dest) == 'index.module.js';

  rollup.rollup({
    entry: src,
    external: ['adm-zip', 'electron', 'fs', 'fs-jetpack', 'http', 'https', 'jszip', 'os', 'path', 'remote', 'url', 'xml2js', 'archiver', 'openport', 'version_compare','yamljs'],
    plugins: [
      babel({exclude: 'node_modules/**'})
    ]
  }).then(function (bundle) {
    var filename = path.basename(dest);
    var result = bundle.generate({
      format: 'cjs',
      sourceMap: buildSourcemap,
      sourceMapFile: filename
    });
    // Wrap code in self invoking function so the variables don't
    // pollute the global namespace.
    var isolatedCode = '(function () {' + result.code + '\n}());';
    if (buildSourcemap) {
      return Q.all([
        jetpack.writeAsync(dest, isolatedCode + '\n//# sourceMappingURL=' + filename + '.map'),
        jetpack.writeAsync(dest + '.map', result.map.toString())
      ]);
    } else {
      return jetpack.writeAsync(dest, isolatedCode);
    }
  }).then(function () {
    return gulp.src(dest, {base: '.'})
      .pipe($.ngAnnotate())
      .pipe(gulp.dest('.'));
  }).then(function () {
    deferred.resolve();
  }).catch(function (err) {
    console.error('Build: Error during rollup', err.stack);
    deferred.reject();
  });

  return deferred.promise;
};

var compileScripts = function () {
  var promises = [
    bundle(path.join(conf.paths.src, '/background.js'), path.join(conf.paths.tmp, 'serve/app/background.js')),
    bundle(path.join(conf.paths.src, '/app/index.module.js'), path.join(conf.paths.tmp, 'serve/app/index.module.js'))
  ];

  if (utils.getEnvName() == 'development') {
    promises.push(bundle(path.join(conf.paths.src, '/electron/browsersync_helper.js'), path.join(conf.paths.tmp, 'serve/app/browsersync_helper.js')));
  }

  return Q.all(promises);
};

gulp.task('scripts', ['lint'], function () {
  return compileScripts();
});

gulp.task('scripts:watch', function () {
  return compileScripts();
});
