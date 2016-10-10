import {remote} from 'electron';
const {app} = remote;
import jetpack from 'fs-jetpack';
import AdmZip from 'adm-zip';
import https from 'https';
import os from 'os';
import path from 'path';
import url from 'url';

export class DependencyManager {
  constructor($q, $http, $log, $translate, $uibModal, StatusBar, Project) {
    'ngInject';

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
    vm.rubyMD5 = vm.Project.getRubyMD5();
    vm.mongoMD5 = vm.Project.getMongoMD5();
    vm.openstudioServerMD5 = vm.Project.getOpenstudioServerMD5();
    vm.openstudioCLIMD5 = vm.Project.getOpenstudioCLIMD5();
    vm.openstudioMD5 = vm.Project.getOpenstudioMD5();
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
    vm.src = jetpack.cwd(app.getPath('userData'));
    vm.$log.debug('src:', vm.src.path());

    vm.manifest = {
      endpoint: 'https://openstudio-resources.s3.amazonaws.com/pat-dependencies/',
      ruby: [{
        name: 'ruby-2.0.0-p648',
        platform: 'win32',
        arch: 'ia32'
      }, {
        name: 'ruby-2.0.0-p648',
        platform: 'darwin',
        arch: 'x64'
      }],
      mongo: [{
        name: 'mongodb-3.2.5',
        platform: 'win32',
        arch: 'x64'
      }, {
        name: 'mongodb-3.2.5',
        platform: 'win32',
        arch: 'ia32'
      }, {
        name: 'mongodb-3.2.5',
        platform: 'darwin',
        arch: 'x64'
      }],
      openstudioServer: [{
        name: 'openstudio-server',
        platform: 'win32',
        arch: 'x64'
      }, {
        name: 'openstudio-server',
        platform: 'darwin',
        arch: 'x64'
      }],
      openstudioCLI: [{
        name: 'OpenStudio2-1.13.0.fb588cc683',
        platform: 'win32',
        arch: 'x64'
      }, {
        name: 'OpenStudio2-1.13.0.fb588cc683',
        platform: 'darwin',
        arch: 'x64'
      }],
      openstudio: [{
        name: 'OpenStudio-1.13.0.fb588cc683',
        platform: 'win32',
        arch: 'x64'
      }, {
        name: 'OpenStudio-1.13.0.fb588cc683',
        platform: 'darwin',
        arch: 'x64'
      }]
    };

    vm.deregisterObserver();
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

    // Open modal dialog to "disable app during downloads, and inform user of any issues
    vm.openDependencyModal();

    const platform = os.platform();
    const arch = os.arch();

    // Check for Ruby
    let rubyPath = 'ruby/bin/ruby';
    let mongoPath = 'mongo/bin/mongod';
    const openstudioServerPath = 'openstudioServer/bin/openstudio_meta';
    let openstudioCLIPath = 'openstudioCLI/bin/openstudio';
    const openstudioPath = 'openstudio/';

    if (platform == 'win32') {
      rubyPath += '.exe';
      mongoPath += '.exe';
      openstudioCLIPath += '.exe';
    }

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

      if (!vm.src.exists(rubyPath)) {
        downloadDependency = true;
        vm.$log.debug('Ruby not found, downloading');
        vm.downloadStatus = 'Ruby not found, downloading';
      } else if (!manifestEmpty) {
        const filename = vm._dependencyFilename(dependencyManifest);
        vm._getOnlineChecksum(filename).then(expectedMD5 => {
          if (expectedMD5.trim() !== vm.rubyMD5.trim()) {
            vm.rubyMD5 = expectedMD5.trim();
            vm.Project.setRubyMD5(vm.rubyMD5);
            downloadDependency = true;
            vm.$log.debug('Ruby not up to date, updating');
            vm.downloadStatus = 'Ruby not up to date, updating. ';
            const rubyDir = jetpack.dir(path.resolve(vm.src.path() + '/ruby'));
            vm.$log.debug('rubyDir: ', rubyDir.path());
            vm.downloadStatus += 'rubyDir: ';
            vm.downloadStatus += rubyDir.path();
            jetpack.remove(rubyDir.path());
          }
        });
      }

      if (downloadDependency) {
        if (manifestEmpty) {
          const errorMsg = `No ruby download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          vm.downloadStatus = errorMsg;
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(_.assign({}, dependencyManifest, {type: 'ruby'}));
      }
      return vm.$q.resolve();
    }

    function downloadMongo() {
      let downloadDependency = false;
      const dependencyManifest = _.find(vm.manifest.mongo, {platform: platform, arch: arch});
      const manifestEmpty = _.isEmpty(dependencyManifest);

      if (!vm.src.exists(mongoPath)) {
        downloadDependency = true;
        vm.$log.debug('Mongo not found, downloading');
        vm.downloadStatus = 'Mongo not found, downloading';
      } else if (!manifestEmpty) {
        const filename = vm._dependencyFilename(dependencyManifest);
        vm._getOnlineChecksum(filename).then(expectedMD5 => {
          if (expectedMD5.trim() !== vm.mongoMD5.trim()) {
            vm.mongoMD5 = expectedMD5.trim();
            vm.Project.setMongoMD5(vm.mongoMD5);
            downloadDependency = true;
            vm.$log.debug('Mongo not up to date, updating');
            vm.downloadStatus = 'Mongo not up to date, updating. ';
            const mongoDir = jetpack.dir(path.resolve(vm.src.path() + '/mongo'));
            vm.$log.debug('mongoDir: ', mongoDir.path());
            vm.downloadStatus += 'mongoDir: ';
            vm.downloadStatus += mongoDir.path();
            jetpack.remove(mongoDir.path());
          }
        });
      }

      if (downloadDependency) {
        if (manifestEmpty) {
          const errorMsg = `No mongo download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          vm.downloadStatus = errorMsg;
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(_.assign({}, dependencyManifest, {type: 'mongo'}));
      }
      return vm.$q.resolve();
    }

    function downloadOpenstudioServer() {
      let downloadDependency = false;
      const dependencyManifest = _.find(vm.manifest.openstudioServer, {platform: platform, arch: arch});
      const manifestEmpty = _.isEmpty(dependencyManifest);

      if (!vm.src.exists(openstudioServerPath)) {
        downloadDependency = true;
        vm.$log.debug('OpenstudioServer not found, downloading');
        vm.downloadStatus = 'OpenstudioServer not found, downloading';
      } else if (!manifestEmpty) {
        const filename = vm._dependencyFilename(dependencyManifest);
        vm._getOnlineChecksum(filename).then(expectedMD5 => {
          if (expectedMD5.trim() !== vm.openstudioServerMD5.trim()) {
            vm.openstudioServerMD5 = expectedMD5.trim();
            vm.Project.setOpenstudioServerMD5(vm.openstudioServerMD5);
            downloadDependency = true;
            vm.$log.debug('OpenstudioServer not up to date, updating');
            vm.downloadStatus = 'OpenstudioServer not up to date, updating. ';
            const openstudioServerDir = jetpack.dir(path.resolve(vm.src.path() + '/openstudioServer'));
            vm.$log.debug('openstudioServerDir: ', openstudioServerDir.path());
            vm.downloadStatus += 'openstudioServerDir: ';
            vm.downloadStatus += openstudioServerDir.path();
            jetpack.remove(openstudioServerDir.path());
          }
        });
      }

      if (downloadDependency) {
        if (manifestEmpty) {
          const errorMsg = `No openstudioServer download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          vm.downloadStatus = errorMsg;
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(_.assign({}, dependencyManifest, {type: 'openstudioServer'}));
      }
      return vm.$q.resolve();
    }

    function downloadOpenstudioCLI() {
      let downloadDependency = false;
      const dependencyManifest = _.find(vm.manifest.openstudioCLI, {platform: platform, arch: arch});
      const manifestEmpty = _.isEmpty(dependencyManifest);

      if (!vm.src.exists(openstudioCLIPath)) {
        downloadDependency = true;
        vm.$log.debug('OpenstudioCLI not found, downloading');
        vm.downloadStatus = 'OpenstudioCLI not found, downloading';
      } else if (!manifestEmpty) {
        const filename = vm._dependencyFilename(dependencyManifest);
        vm._getOnlineChecksum(filename).then(expectedMD5 => {
          if (expectedMD5.trim() !== vm.openstudioCLIMD5.trim()) {
            vm.openstudioCLIMD5 = expectedMD5.trim();
            vm.Project.setOpenstudioCLIMD5(vm.openstudioCLIMD5);
            downloadDependency = true;
            vm.$log.debug('OpenstudioCLI not up to date, updating');
            vm.downloadStatus = 'OpenstudioCLI not up to date, updating. ';
            const openstudioCLIDir = jetpack.dir(path.resolve(vm.src.path() + '/openstudioCLI'));
            vm.$log.debug('openstudioCLIDir: ', openstudioCLIDir.path());
            vm.downloadStatus += 'openstudioCLIDir: ';
            vm.downloadStatus += openstudioCLIDir.path();
            jetpack.remove(openstudioCLIDir.path());
          }
        });
      }

      if (downloadDependency) {
        if (manifestEmpty) {
          const errorMsg = `No OpenstudioCLI download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          vm.downloadStatus = errorMsg;
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(_.assign({}, dependencyManifest, {type: 'openstudioCLI'}));
      }
      return vm.$q.resolve();
    }

    function downloadOpenstudio() {
      let downloadDependency = false;
      const dependencyManifest = _.find(vm.manifest.openstudio, {platform: platform, arch: arch});
      const manifestEmpty = _.isEmpty(dependencyManifest);

      if (!vm.src.exists(openstudioPath)) {
        downloadDependency = true;
        vm.$log.debug('Openstudio not found, downloading');
        vm.downloadStatus = 'Openstudio not found, downloading';
      } else if (!manifestEmpty) {
        const filename = vm._dependencyFilename(dependencyManifest);
        vm._getOnlineChecksum(filename).then(expectedMD5 => {
          if (expectedMD5.trim() !== vm.openstudioMD5.trim()) {
            vm.openstudioMD5 = expectedMD5.trim();
            vm.Project.setOpenstudioMD5(vm.openstudioMD5);
            downloadDependency = true;
            vm.$log.debug('Openstudio not up to date, updating');
            vm.downloadStatus = 'Openstudio not up to date, updating. ';
            const openstudioDir = jetpack.dir(path.resolve(vm.src.path() + '/openstudio'));
            vm.$log.debug('openstudioDir: ', openstudioDir.path());
            vm.downloadStatus += 'openstudioDir: ';
            vm.downloadStatus += openstudioDir.path();
            jetpack.remove(openstudioDir.path());
          }
        });
      }

      if (downloadDependency) {
        if (manifestEmpty) {
          const errorMsg = `No Openstudio download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          vm.downloadStatus = errorMsg;
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(_.assign({}, dependencyManifest, {type: 'openstudio'}));
      }
      return vm.$q.resolve();
    }

    const deferred = vm.$q.defer();

    downloadRuby()
      .then(downloadMongo, downloadMongo)
      .then(downloadOpenstudioServer, downloadOpenstudioServer)
      .then(downloadOpenstudioCLI, downloadOpenstudioCLI)
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
        vm.$log.debug(filename, 'found.');
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
        deferred.reject('File not found');
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

            const dest = jetpack.dir(`${app.getPath('userData')}/${type}`, {empty: true});

            vm.StatusBar.set(`${vm.translations.Extracting} ${_.startCase(type)}`, true);
            vm.set(`${vm.translations.Extracting} ${_.startCase(type)}`, true);
            console.time(`${_.startCase(type)} extracted`);
            _.defer(() => {
              if (vm.platform == 'darwin') {
                const command = 'unzip "' + vm.tempDir.path(filename) + '" -d "' + dest.path() + '"';
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
