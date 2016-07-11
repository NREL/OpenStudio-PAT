import { app } from 'remote';
import * as jetpack from 'fs-jetpack';
import * as AdmZip from 'adm-zip';
import * as https from 'https';
import * as os from 'os';

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
      }]
    };
  }

  checkDependencies() {
    const vm = this;
    const src = jetpack.cwd(app.getPath('userData'));

    const platform = os.platform();
    const arch = os.arch();

    // Check for Ruby
    let rubyPath = 'ruby/bin/ruby';
    let mongoPath = 'mongo/bin/mongod';
    let openstudioServerPath = 'openstudioServer/bin/openstudioServer';
    let openstudioCLIPath = 'openstudioCLI/bin/openstudioCLI';

    if (platform == 'win32') {
      rubyPath += '.exe';
      mongoPath += '.exe';
      openstudioServerPath += '.exe';
      openstudioCLIPath += '.exe';
    }

    vm.$translate(['statusBar.Downloading', 'statusBar.Extracting']).then(translations => {
      vm.translations.Downloading = translations['statusBar.Downloading'];
      vm.translations.Extracting = translations['statusBar.Extracting'];
    });

    function downloadRuby() {
      if (!src.exists(rubyPath)) {
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
      if (!src.exists(mongoPath)) {
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
      if (!src.exists(openstudioServerPath)) {
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
      if (!src.exists(openstudioCLIPath)) {
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

    downloadRuby()
      .then(downloadMongo, downloadMongo)
      .then(downloadOpenstudioServer, downloadOpenstudioServer)
      .then(downloadOpenstudioCLI, downloadOpenstudioCLI)
      .finally(() => {
        vm.StatusBar.clear();
      });

    // Save manifest
    vm.manifest.lastCheckForUpdates = Date.now();
    src.write('manifest.json', vm.manifest);
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

  /*_getLocalChecksum(path) {

   }*/

  _downloadDependency(downloadManifest) {
    const vm = this;
    const deferred = vm.$q.defer();

    // 2MB buffer
    const bufferSize = 2 * 0x100000;

    let contentLength, buf, bytesReceived, bufferFilled;
    const tempDir = jetpack.cwd(app.getPath('temp'));

    function initializeBuffer() {
      bufferFilled = 0;
      buf = new Buffer(bufferSize);
    }

    function write(filename, data) {
      if (_.isNil(buf)) initializeBuffer();

      if (data.length < (bufferSize - bufferFilled)) {
        data.copy(buf, bufferFilled);
        bufferFilled += data.length;
      } else if (data.length == (bufferSize - bufferFilled)) {
        data.copy(buf, bufferFilled);
        tempDir.append(filename, buf);
        initializeBuffer();
      } else {
        const bufferSplit = bufferSize - bufferFilled;
        data.copy(buf, bufferFilled, 0, bufferSplit);
        tempDir.append(filename, buf);
        initializeBuffer();
        write(filename, data.slice(bufferSplit));
      }

      // If all bytes received, write slice of buffer
      if (bytesReceived == contentLength && bufferFilled) {
        tempDir.append(filename, buf.slice(0, bufferFilled));
        initializeBuffer();
      }
    }

    let append = '';
    if (_.isMatch(downloadManifest, {type: 'mongo', platform: 'win32', arch: 'x64'})) append = `-${downloadManifest.arch}`;
    const filename = `${downloadManifest.name}-${downloadManifest.platform}${append}.zip`;
    vm.$log.debug('filename:', filename);
    vm._getOnlineChecksum(filename).then(expectedMD5 => {
      if (tempDir.exists(filename)) tempDir.remove(filename);
      https.get(`${vm.manifest.endpoint}${filename}`, res => {
        bytesReceived = 0;
        contentLength = parseInt(res.headers['content-length']);

        console.time(`${_.startCase(downloadManifest.type)} downloaded`);
        res.on('data', d => {
          bytesReceived += d.length;
          vm.StatusBar.set(`${vm.translations.Downloading} ${_.startCase(downloadManifest.type)} (${_.floor(bytesReceived / contentLength * 100)}%)`, true);
          write(filename, d);
        });
        res.on('end', () => {
          console.timeEnd(`${_.startCase(downloadManifest.type)} downloaded`);
          const actualMD5 = jetpack.inspect(tempDir.path(filename), {checksum: 'md5'}).md5;
          if (expectedMD5 === actualMD5) {
            const zip = new AdmZip(tempDir.path(filename));
            const dest = jetpack.dir(`${app.getPath('userData')}/${downloadManifest.type}`, {empty: true});

            vm.StatusBar.set(`${vm.translations.Extracting} ${_.startCase(downloadManifest.type)}`, true);
            console.time(`${_.startCase(downloadManifest.type)} extracted`);
            _.defer(() => {
              zip.extractAllTo(dest.path(), true);
              console.timeEnd(`${_.startCase(downloadManifest.type)} extracted`);
              tempDir.remove(filename);
              deferred.resolve();
            });
          } else {
            console.groupCollapsed('Failed download: MD5 mismatch');
            vm.$log.debug('Expected MD5:', expectedMD5);
            vm.$log.debug('Actual MD5:', actualMD5);
            console.groupEnd();
            tempDir.remove(filename);
            deferred.reject();
          }
        });
      }).on('error', e => deferred.reject(e));
    });

    return deferred.promise;
  }

}
