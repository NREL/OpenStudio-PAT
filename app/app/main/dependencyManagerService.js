import {remote} from 'electron';
const {app} = remote;
import jetpack from 'fs-jetpack';
import AdmZip from 'adm-zip';
import https from 'https';
import os from 'os';
import path from 'path';
import url from 'url';
const env = jetpack.cwd(app.getAppPath()).read('env.json', 'json');

export class DependencyManager {

  constructor($q, $http, $log, $translate, $uibModal, StatusBar, Project) {
    'ngInject';

    console.log(`this is a test : ${env.testing}`);

    const vm = this;
    vm.$http = $http;
    vm.$q = $q;
    vm.$log = $log;
    vm.$translate = $translate;
    vm.jetpack = jetpack;
    vm.AdmZip = AdmZip;
    vm.StatusBar = StatusBar;
    vm.Project = Project;
    vm.translations = {};
    vm.exec = require('child_process').exec;
    vm.platform = os.platform();
    vm.$q = $q;
    vm.$uibModal = $uibModal;
    vm.downloadStatus = 'N/A';

    // 2MB buffer
    vm.bufferSize = 2 * 0x100000;
    vm.initializeBuffer();
    vm.contentLength = 0;
    vm.bytesReceived = 0;

    vm.tempDir = jetpack.cwd(app.getPath('temp'));
    vm.$log.debug('TEMPDIR HERE: ', app.getPath('temp'));
    vm.src = jetpack.cwd(app.getPath('home') + "/OpenStudio/Pat/Support/");
    vm.$log.debug('src:', vm.src.path());

    vm.manifest = {
      endpoint: 'https://openstudio-resources.s3.amazonaws.com/pat-dependencies2/',
      ruby: [{
        name: 'ruby-2.0.0-p648',
        platform: 'win32',
        arch: 'ia32',
        type: 'ruby'
      }, {
        name: 'ruby-2.0.0-p648',
        platform: 'darwin',
        arch: 'x64',
        type: 'ruby'
      }],
      mongo: [{
        name: 'mongodb-3.2.5',
        platform: 'win32',
        arch: 'x64',
        type: 'mongo'
      }, {
        name: 'mongodb-3.2.5',
        platform: 'win32',
        arch: 'ia32',
        type: 'mongo'
      }, {
        name: 'mongodb-3.2.5',
        platform: 'darwin',
        arch: 'x64',
        type: 'mongo'
      }],
      openstudioServer: [{
        name: 'OpenStudio-server-f9c68107af',
        platform: 'win32',
        arch: 'x64',
        type: 'OpenStudio-server'
      }, {
        name: 'OpenStudio-server-f9c68107af',
        platform: 'darwin',
        arch: 'x64',
        type: 'OpenStudio-server'
      }],
      openstudio: [{
        name: 'OpenStudio-1.13.0.fb588cc683',
        platform: 'win32',
        arch: 'x64',
        type: 'OpenStudio'
      }, {
        name: 'OpenStudio2-1.13.1.ec682bda8a',
        platform: 'darwin',
        arch: 'x64',
        type: 'OpenStudio'
      }]
    };

    vm.deregisterObserver();
  }

  // The following are valid names to ask for
  // "PAT_OS_CLI_PATH" "PAT_OS_BINDING_PATH" "PAT_OS_SERVER_PATH" "PAT_RUBY_PATH" "PAT_MONGO_PATH"
  getPath(name) {
    const vm = this;
    //const prefixPath = app.getPath('home') + 'OpenStudio/PAT/Support';

    let exeExt = '';
    if( os.platform() == 'win32' ) {
      exeExt = '.exe';
    }
    let bindingExt = '.bundle';
    if( os.platform() == 'win32' ) {
      bindingExt = '.so';
    }

    if( env.name == 'production' ) {
      // If the environment is "production" then
      // we should be in a release build, which means 
      // we should also be in the install tree 

      // Parse a pat_config.json file dropped by the installer
      // or better yet just assume the os install layout here and 
      // find stuff based on relative location from the pat exe (aka electron exe).
    } else if( env[name] ) {
      // Look in the env.json file 
      return env[name];
    } else if( process.env[name] ) {
      // Look for a system environment variable
      return process.env[name];  
    } else {
      // Look in a default location
      if( name == 'PAT_OS_CLI_PATH' ) {
         return vm.src.path('OpenStudio/bin/openstudio' + exeExt);
      } else if( name == 'PAT_OS_BINDING_PATH' ) {
        return vm.src.path('OpenStudio/Ruby/openstudio' + bindingExt);
      } else if( name == 'PAT_OS_META_CLI_PATH' ) {
        return vm.src.path('OpenStudio-server/bin/openstudio_meta');
      } else if( name == 'PAT_RUBY_PATH' ) {
        return vm.src.path('ruby/bin/ruby' + exeExt);
      } else if( name == 'PAT_MONGO_PATH' ) {
        return vm.src.path('mongo/bin/mongod' + exeExt);
      }
    }
  }

  initializeBuffer() {
    const vm = this;

    vm.bufferFilled = 0;
    vm.buf = new Buffer(vm.bufferSize);
  }

  write(filename, data) {
    const vm = this;

    if (_.isNil(vm.buf)) vm.initializeBuffer();

    if (data.length < (vm.bufferSize - vm.bufferFilled)) {
      data.copy(vm.buf, vm.bufferFilled);
      vm.bufferFilled += data.length;
    } else if (data.length == (vm.bufferSize - vm.bufferFilled)) {
      data.copy(vm.buf, vm.bufferFilled);
      vm.tempDir.append(filename, vm.buf);
      vm.initializeBuffer();
    } else {
      const bufferSplit = vm.bufferSize - vm.bufferFilled;
      data.copy(vm.buf, vm.bufferFilled, 0, bufferSplit);
      vm.tempDir.append(filename, vm.buf);
      vm.initializeBuffer();
      vm.write(filename, data.slice(bufferSplit));
    }

    // If all bytes received, write slice of buffer
    if (vm.bytesReceived == vm.contentLength && vm.bufferFilled) {
      vm.tempDir.append(filename, vm.buf.slice(0, vm.bufferFilled));
      vm.initializeBuffer();
    }
  }

  checkDependencies() {
    const vm = this;

    // TEMPORARY! (UNCOMMENT TO STOP AUTO DOWNLOADS)
    //return vm.$q.resolve();

    // Open modal dialog to "disable app during downloads, and inform user of any issues
    vm.openDependencyModal();

    const platform = os.platform();
    const arch = os.arch();

    vm.$translate(['statusBar.Downloading', 'statusBar.Extracting']).then(translations => {
      vm.translations.Downloading = translations['statusBar.Downloading'];
      vm.translations.Extracting = translations['statusBar.Extracting'];
    });

    vm.$translate(['dependencyManager.Downloading', 'dependencyManager.Extracting']).then(translations => {
      vm.translations.Downloading = translations['dependencyManager.Downloading'];
      vm.translations.Extracting = translations['dependencyManager.Extracting'];
    });

    function downloadRuby() {
      let downloadDependency = false;
      const dependencyManifest = _.find(vm.manifest.ruby, {platform: platform});
      const manifestEmpty = _.isEmpty(dependencyManifest);

      if (!vm.src.exists(vm.getPath('PAT_RUBY_PATH'))) {
        downloadDependency = true;
        vm.$log.debug('Ruby not found, downloading');
        vm.downloadStatus = 'Ruby not found, downloading';
      }

      if (downloadDependency) {
        if (manifestEmpty) {
          const errorMsg = `No ruby download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          vm.downloadStatus = errorMsg;
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(dependencyManifest);
      }
      return vm.$q.resolve();
    }

    function downloadMongo() {
      let downloadDependency = false;
      const dependencyManifest = _.find(vm.manifest.mongo, {platform: platform, arch: arch});
      const manifestEmpty = _.isEmpty(dependencyManifest);

      if (!vm.src.exists(vm.getPath('PAT_MONGO_PATH'))) {
        downloadDependency = true;
        vm.$log.debug('Mongo not found, downloading');
        vm.downloadStatus = 'Mongo not found, downloading';
      }

      if (downloadDependency) {
        if (manifestEmpty) {
          const errorMsg = `No mongo download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          vm.downloadStatus = errorMsg;
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(dependencyManifest);
      }
      return vm.$q.resolve();
    }

    function downloadOpenstudioServer() {
      let downloadDependency = false;
      const dependencyManifest = _.find(vm.manifest.openstudioServer, {platform: platform, arch: arch});
      const manifestEmpty = _.isEmpty(dependencyManifest);

      if (!vm.src.exists(vm.getPath('PAT_OS_META_CLI_PATH'))) {
        downloadDependency = true;
        vm.$log.debug('OpenstudioServer not found, downloading');
        vm.downloadStatus = 'OpenstudioServer not found, downloading';
      }

      if (downloadDependency) {
        if (manifestEmpty) {
          const errorMsg = `No openstudioServer download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          vm.downloadStatus = errorMsg;
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(dependencyManifest);
      }
      return vm.$q.resolve();
    }

    function downloadOpenstudio() {
      let downloadDependency = false;
      const dependencyManifest = _.find(vm.manifest.openstudio, {platform: platform, arch: arch});
      const manifestEmpty = _.isEmpty(dependencyManifest);

      if (!vm.src.exists(vm.getPath('PAT_OS_CLI_PATH'))) {
        downloadDependency = true;
        vm.$log.debug(`Openstudio not found in ${vm.getPath('PAT_OS_CLI_PATH')}, downloading`);
        vm.downloadStatus = 'Openstudio not found, downloading';
      }

      if (downloadDependency) {
        if (manifestEmpty) {
          const errorMsg = `No Openstudio download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          vm.downloadStatus = errorMsg;
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(dependencyManifest);
      }
      return vm.$q.resolve();
    }

    const deferred = vm.$q.defer();

    downloadRuby()
      .then(downloadMongo, downloadMongo)
      .then(downloadOpenstudioServer, downloadOpenstudioServer)
      .then(downloadOpenstudio, downloadOpenstudio)
      .finally(() => {
        deferred.resolve();
        vm.StatusBar.clear();
        //vm.clear();
        vm.downloadStatus = 'complete';
      });

    // Save manifest
    vm.manifest.lastCheckForUpdates = Date.now();
    vm.src.write('manifest.json', vm.manifest);

    function downloadData(dataPath, dataFilename, dataLocalDir) {
      vm.$log.debug('Downloading analysis data: ', dataFilename);
      vm.downloadStatus = 'Downloading analysis data: ';
      vm.downloadStatus += dataFilename;
      return vm.downloadZip(dataPath, dataFilename, 'dataLocalDir');
    }

    return deferred.promise;
  }

  _urlExists(Url, callback) {
    const vm = this;
    var options = {
      method: 'HEAD',
      host: url.parse(Url).host,
      path: url.parse(Url).pathname
    };
    const req = https.request(options, r => callback(r.statusCode == 200));
    req.end();
  }

  _getOnlineChecksum(filename) {
    const vm = this;
    const deferred = vm.$q.defer();

    let urlExists = vm._urlExists(`${vm.manifest.endpoint}${filename}.md5`, exists => {
      if (exists) {
        vm.$log.debug(filename, 'found online.');
        vm.downloadStatus = filename;
        vm.downloadStatus += ' found.';
        https.get(`${vm.manifest.endpoint}${filename}.md5`, res => {
          let body = '';
          res.on('data', d => body += d);
          res.on('end', () => deferred.resolve(body));
        }).on('error', e => {
          vm.$log.error('Failed to fetch md5:', e);
          vm.downloadStatus += ' Failed to fetch md5: ';
          vm.downloadStatus += e;
          deferred.reject(e);
        });
      } else {
        deferred.reject('File not found online');
      }
    });

    return deferred.promise;
  }

  // "type" is used to name the local download folder
  downloadZip(path, filename, type, useMD5 = false) {
    const vm = this;
    const deferred = vm.$q.defer();

    vm._getOnlineChecksum(filename).then(expectedMD5 => {
      if (vm.tempDir.exists(filename)) vm.tempDir.remove(filename);
      https.get(`${path}${filename}`, res => {
        vm.bytesReceived = 0;
        vm.contentLength = parseInt(res.headers['content-length']);

        console.time(`${_.startCase(type)} downloaded`);
        res.on('data', d => {
          vm.bytesReceived += d.length;
          vm.StatusBar.set(`${vm.translations.Downloading} ${_.startCase(type)} (${_.floor(vm.bytesReceived / vm.contentLength * 100)}%)`, true);
          vm.set(`${vm.translations.Downloading} ${_.startCase(type)} (${_.floor(vm.bytesReceived / vm.contentLength * 100)}%)`, true);
          vm.write(filename, d);
        });
        res.on('end', () => {
          console.timeEnd(`${_.startCase(type)} downloaded`);
          const actualMD5 = jetpack.inspect(vm.tempDir.path(filename), {checksum: 'md5'}).md5;
          if (expectedMD5.trim() == actualMD5.trim() || !useMD5) {
            let zip;
            if (vm.platform != 'darwin')
              zip = new AdmZip(vm.tempDir.path(filename));

            const dest = jetpack.dir(vm.src.path(type), {empty: true});

            vm.StatusBar.set(`${vm.translations.Extracting} ${_.startCase(type)}`, true);
            vm.set(`${vm.translations.Extracting} ${_.startCase(type)}`, true);
            console.time(`${_.startCase(type)} extracted`);
            _.defer(() => {
              if (vm.platform == 'darwin') {
                const command = 'unzip "' + vm.tempDir.path(filename) + '" -d "' + vm.src.path() + '"';
                console.log('UNZIP COMMAND: ', command);
                const child = vm.exec(command,
                  (error, stdout, stderr) => {
                    vm.$log.debug('Exit code: ', child.exitCode);
                    vm.downloadStatus = 'Exit code: ';
                    vm.downloadStatus += child.exitCode;
                    vm.$log.debug('child: ', child);
                    vm.downloadStatus += ', child: ';
                    vm.downloadStatus += child;
                    console.timeEnd(`${_.startCase(type)} extracted`);
                    vm.tempDir.remove(filename);
                    deferred.resolve();
                  });
              } else {
                zip.extractAllTo(dest.path(), true);
                console.timeEnd(`${_.startCase(type)} extracted`);
                vm.tempDir.remove(filename);
                deferred.resolve();
              }

            });
          } else {
            console.groupCollapsed('Failed download: MD5 mismatch');
            vm.$log.debug('Expected MD5:', expectedMD5);
            vm.downloadStatus = 'Expected MD5: ';
            vm.downloadStatus += expectedMD5;
            vm.$log.debug('Actual MD5:', actualMD5);
            vm.downloadStatus += '. Actual MD5r: ';
            vm.downloadStatus += actualMD5;
            console.groupEnd();
            vm.tempDir.remove(filename);
            deferred.reject();
          }
        });
      }).on('error', e => deferred.reject(e));
    });

    return deferred.promise;
  }

  _downloadDependency(downloadManifest) {
    const vm = this;
    const deferred = vm.$q.defer();

    vm.downloadZip(vm.manifest.endpoint, vm._dependencyFilename(downloadManifest), downloadManifest.type, true).then(deferred.resolve, deferred.reject);

    return deferred.promise;
  }

  _dependencyFilename(downloadManifest) {
    const vm = this;

    let append = '';
    if (_.isMatch(downloadManifest, {
        type: 'mongo',
        platform: 'win32',
        arch: 'x64'
      })) append = `-${downloadManifest.arch}`;

    const filename = `${downloadManifest.name}-${downloadManifest.platform}${append}.zip`;
    vm.$log.debug('filename:', filename);
    vm.downloadStatus = 'filename: ';
    vm.downloadStatus += filename;

    return filename;
  }

  openDependencyModal() {
    const vm = this;
    vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalDependencyController',
      controllerAs: 'modal',
      size: 'lg',
      templateUrl: 'app/main/dependency.html',
      windowClass: 'wide-modal'
    });
  }

  registerObserver(cb) {
    const vm = this;
    vm.observerCallback = cb;
  }

  deregisterObserver() {
    const vm = this;
    vm.observerCallback = null;
  }

  set(downloadStatus) {
    const vm = this;
    if (vm.downloadStatus !== downloadStatus) {
      vm.downloadStatus = downloadStatus;
      vm.observerCallback(status);
    }
  }

  clear() {
    const vm = this;
    vm.set('');
  }

}
