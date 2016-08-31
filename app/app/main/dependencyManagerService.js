import {remote} from 'electron';
const {app} = remote;
import jetpack from 'fs-jetpack';
import AdmZip from 'adm-zip';
import https from 'https';
import os from 'os';

export class DependencyManager {
  constructor($q, $http, $log, $translate, StatusBar) {
    'ngInject';

    const vm = this;
    vm.$http = $http;
    vm.$q = $q;
    vm.$log = $log;
    vm.$translate = $translate;
    vm.jetpack = jetpack;
    vm.AdmZip = AdmZip;
    vm.StatusBar = StatusBar;
    vm.translations = {};

    // 2MB buffer
    vm.bufferSize = 2 * 0x100000;
    vm.initializeBuffer();
    vm.contentLength = 0;
    vm.bytesReceived = 0;

    vm.tempDir = jetpack.cwd(app.getPath('temp'));
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
        name: 'OpenStudio2-1.12.0.58d7efc146',
        platform: 'win32',
        arch: 'x64'
      }, {
        name: 'OpenStudio2-1.12.0.58d7efc146',
        platform: 'darwin',
        arch: 'x64'
      }],
      openstudio: [{
        name: 'OpenStudio-1.12.0.58d7efc146',
        platform: 'win32',
        arch: 'x64'
      }, {
        name: 'OpenStudio-1.12.0.58d7efc146',
        platform: 'darwin',
        arch: 'x64'
      }]
    };
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

    const platform = os.platform();
    const arch = os.arch();

    // Check for Ruby
    let rubyPath = 'ruby/bin/ruby';
    let mongoPath = 'mongo/bin/mongod';
    let openstudioServerPath = 'openstudioServer/bin/openstudio_meta';
    let openstudioCLIPath = 'openstudioCLI/bin/openstudio';
    let openstudioPath = 'openstudio/';

    if (platform == 'win32') {
      rubyPath += '.exe';
      mongoPath += '.exe';
      openstudioCLIPath += '.exe';
    }

    vm.$translate(['statusBar.Downloading', 'statusBar.Extracting']).then(translations => {
      vm.translations.Downloading = translations['statusBar.Downloading'];
      vm.translations.Extracting = translations['statusBar.Extracting'];
    });

    function downloadRuby() {
      if (!vm.src.exists(rubyPath)) {
        vm.$log.debug('Ruby not found, downloading');
        const rubyManifest = _.find(vm.manifest.ruby, {platform: platform});
        if (_.isEmpty(rubyManifest)) {
          const errorMsg = `No ruby download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(_.assign({}, rubyManifest, {type: 'ruby'}));
      }
      return vm.$q.resolve();
    }

    function downloadMongo() {
      if (!vm.src.exists(mongoPath)) {
        vm.$log.debug('Mongo not found, downloading');
        const mongoManifest = _.find(vm.manifest.mongo, {platform: platform, arch: arch});
        if (_.isEmpty(mongoManifest)) {
          const errorMsg = `No mongo download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(_.assign({}, mongoManifest, {type: 'mongo'}));
      }
      return vm.$q.resolve();
    }

    function downloadOpenstudioServer() {
      if (!vm.src.exists(openstudioServerPath)) {
        vm.$log.debug('OpenstudioServer not found, downloading');
        const openstudioServerManifest = _.find(vm.manifest.openstudioServer, {platform: platform, arch: arch});
        if (_.isEmpty(openstudioServerManifest)) {
          const errorMsg = `No openstudioServer download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(_.assign({}, openstudioServerManifest, {type: 'openstudioServer'}));
      }
      return vm.$q.resolve();
    }

    function downloadOpenstudioCLI() {
      if (!vm.src.exists(openstudioCLIPath)) {
        vm.$log.debug('OpenstudioCLI not found, downloading');
        const openstudioCLIManifest = _.find(vm.manifest.openstudioCLI, {platform: platform, arch: arch});
        if (_.isEmpty(openstudioCLIManifest)) {
          const errorMsg = `No openstudioCLI download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(_.assign({}, openstudioCLIManifest, {type: 'openstudioCLI'}));
      }
      return vm.$q.resolve();
    }

    function downloadOpenstudio() {
      if (!vm.src.exists(openstudioPath)) {
        vm.$log.debug('Openstudio not found, downloading');
        const openstudioManifest = _.find(vm.manifest.openstudio, {platform: platform, arch: arch});
        if (_.isEmpty(openstudioManifest)) {
          const errorMsg = `No openstudio download found for platform ${platform}`;
          vm.$log.error(errorMsg);
          return vm.$q.reject(errorMsg);
        }
        return vm._downloadDependency(_.assign({}, openstudioManifest, {type: 'openstudio'}));
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
      });

    // Save manifest
    vm.manifest.lastCheckForUpdates = Date.now();
    vm.src.write('manifest.json', vm.manifest);

    function downloadData(dataPath, dataFilename, dataLocalDir) {
      vm.$log.debug('downloading analysis data: ', dataFilename);
      return vm.downloadZip(dataPath, dataFilename, 'dataLocalDir');
    }

    //downloadData(dataPath, dataFilename, dataLocalDir)
    //  .finally(() => {
    //    vm.StatusBar.clear();
    //});

    return deferred.promise;
  }

  _getOnlineChecksum(filename) {
    const vm = this;
    const deferred = vm.$q.defer();

    https.get(`${vm.manifest.endpoint}${filename}.md5`, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => deferred.resolve(body));
    }).on('error', e => {
      vm.$log.error('Failed to fetch md5:', e);
      deferred.reject(e);
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
          vm.write(filename, d);
        });
        res.on('end', () => {
          console.timeEnd(`${_.startCase(type)} downloaded`);
          const actualMD5 = jetpack.inspect(vm.tempDir.path(filename), {checksum: 'md5'}).md5;
          if (expectedMD5.trim() === actualMD5.trim() || !useMD5) {
            const zip = new AdmZip(vm.tempDir.path(filename));
            const dest = jetpack.dir(`${app.getPath('userData')}/${type}`, {empty: true});

            vm.StatusBar.set(`${vm.translations.Extracting} ${_.startCase(type)}`, true);
            console.time(`${_.startCase(type)} extracted`);
            _.defer(() => {
              vm.$log.debug('dest.path():', dest.path());
              zip.extractAllTo(dest.path(), true);
              console.timeEnd(`${_.startCase(type)} extracted`);
              vm.tempDir.remove(filename);
              deferred.resolve();
            });
          } else {
            console.groupCollapsed('Failed download: MD5 mismatch');
            vm.$log.debug('Expected MD5:', expectedMD5);
            vm.$log.debug('Actual MD5:', actualMD5);
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

    let append = '';
    if (_.isMatch(downloadManifest, {
        type: 'mongo',
        platform: 'win32',
        arch: 'x64'
      })) append = `-${downloadManifest.arch}`;

    const filename = `${downloadManifest.name}-${downloadManifest.platform}${append}.zip`;
    vm.$log.debug('filename:', filename);

    vm.downloadZip(vm.manifest.endpoint, filename, downloadManifest.type, true).then(deferred.resolve, deferred.reject);

    return deferred.promise;
  }

}
