'use strict';

var Q = require('q');
var electron = require('electron-prebuilt');
var path = require('path');
var childProcess = require('child_process');
var kill = require('tree-kill');
var util = require('util');
var conf = require('./conf');
var utils = require('./utils');
var watch;

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

browserSync.use(browserSyncSpa({selector: '[ng-app]'}));
function browserSyncInit(baseDir) {

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

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */
  // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: 'default'
  });
}

var gulpPath = path.resolve('./node_modules/.bin/gulp');
if (process.platform === 'win32') {
  gulpPath += '.cmd';
}

var runBuild = function () {
  var deferred = Q.defer();

  var build = childProcess.spawn(gulpPath, [
    'build',
    '--env=' + utils.getEnvName(),
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
    '--env=' + utils.getEnvName(),
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

var runApp = function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
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

runBuild().then(function () {
  //runGulpWatch();
  runApp();
});
