'use strict';

var Q = require('q');
var electron = require('electron');
var path = require('path');
var childProcess = require('child_process');
var kill = require('tree-kill');
var util = require('util');
var conf = require('./conf');
var utils = require('./utils');

var env = utils.getEnvName();
var watch;

var browserSync = require('browser-sync').create();
var browserSyncSpa = require('browser-sync-spa');

browserSync.use(browserSyncSpa({selector: '[ng-app]'}));
function browserSyncInit(baseDir, callback) {

  var routes = null;
  if (baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  browserSync.init({
    browser: 'default',
    files: [
      path.join(conf.paths.tmp, '/serve/app/index.css'),
      path.join(conf.paths.tmp, '/serve/app/index.module.js'),
      path.join(conf.paths.tmp, '/serve/app/templateCacheHtml.js')
    ],
    open: false,
    server: server,
    startPath: '/',
    ui: false,
    watchOptions: {
      awaitWriteFinish: true,
      ignoreInitial: true
    }
  }, callback);
}

var gulpPath = path.resolve('./node_modules/.bin/gulp');
if (process.platform === 'win32') {
  gulpPath += '.cmd';
}

var runBuild = function () {
  var deferred = Q.defer();

  var build = childProcess.spawn(gulpPath, [
    'build',
    '--env=' + env,
    '--color'
  ], {
    stdio: 'inherit'
  });

  build.on('close', function (/*code*/) {
    deferred.resolve();
  });

  return deferred.promise;
};

var runGulpWatch = function () {
  watch = childProcess.spawn(gulpPath, [
    'watch',
    '--env=' + env,
    '--color'
  ], {
    stdio: 'inherit'
  });

  watch.on('close', function (/*code*/) {
    // Gulp watch exits when error occurred during build.
    // Just respawn it then.
    runGulpWatch();
  });
};

var runElectronApp = function () {
  var app = childProcess.spawn(electron, ['./build'], {
    stdio: 'inherit'
  });

  app.on('close', function (/*code*/) {
    // User closed the app. Kill the host process.
    kill(watch.pid, 'SIGKILL', function () {
      process.exit();
    });
  });
};

var runApp = function () {
  env == 'development'
    ? browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src], runElectronApp)
    : runElectronApp();
};

runBuild().then(function () {
  runGulpWatch();
  runApp();
});
