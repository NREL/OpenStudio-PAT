import { app } from 'remote';
import * as jetpack from 'fs-jetpack';
import * as AdmZip from 'adm-zip';
import * as https from 'https';
import * as os from 'os';

export class DependencyManager {
  constructor($q, $http, $log) {
    'ngInject';

    const vm = this;
    vm.$http = $http;
    vm.$q = $q;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.AdmZip = AdmZip;

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
    if (platform == 'win32') {
      rubyPath += '.exe';
      mongoPath += '.exe';
    }

    if (!src.exists(rubyPath)) {
      vm.$log.debug('Ruby not found, downloading');
      const rubyManifest = _.find(vm.manifest.ruby, {platform: platform});
      if (_.isEmpty(rubyManifest)) {
        vm.$log.error(`No ruby download found for platform ${platform}`);
        return;
      }
      vm._downloadDependency(_.assign({}, rubyManifest, {type: 'ruby'}));
    }

    if (!src.exists(mongoPath)) {
      vm.$log.debug('Mongo not found, downloading');
      const mongoManifest = _.find(vm.manifest.mongo, {platform: platform, arch: arch});
      if (_.isEmpty(mongoManifest)) {
        vm.$log.error(`No mongo download found for platform ${platform}`);
        return;
      }
      vm._downloadDependency(_.assign({}, mongoManifest, {type: 'mongo'}));
    }

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
      console.error('Failed to fetch md5:', e);
      deferred.reject(e);
    });

    return deferred.promise;
  }

  /*_getLocalChecksum(path) {

  }*/

  _downloadDependency(downloadManifest) {
    const vm = this;
    const deferred = vm.$q.defer();

    const filename = `${downloadManifest.name}-${os.platform()}.zip`;
    vm._getOnlineChecksum(filename).then(expectedMD5 => {
      const tempDir = jetpack.cwd(app.getPath('temp'));
      if (tempDir.exists(filename)) tempDir.remove(filename);
      https.get(`${vm.manifest.endpoint}${filename}`, res => {
        const contentLength = parseInt(res.headers['content-length']);
        let bytesReceived = 0;
        console.debug('Content Length:', contentLength);
        console.time(`${_.startCase(downloadManifest.type)} downloaded`);
        res.on('data', d => {
          bytesReceived += d.length;
          console.debug(`Downloading ${_.startCase(downloadManifest.type)} (${Math.floor(bytesReceived / contentLength * 100)}%)`);
          tempDir.append(filename, d);
        });
        res.on('end', () => {
          console.timeEnd(`${_.startCase(downloadManifest.type)} downloaded`);
          const actualMD5 = jetpack.inspect(tempDir.path(filename), {checksum: 'md5'}).md5;
          if (expectedMD5 === actualMD5) {
            const zip = new AdmZip(tempDir.path(filename));
            const dest = jetpack.dir(`${app.getPath('userData')}/${downloadManifest.type}`, {empty: true});

            console.time(`${_.startCase(downloadManifest.type)} extracted`);
            zip.extractAllTo(dest.path(), true);
            console.timeEnd(`${_.startCase(downloadManifest.type)} extracted`);

            tempDir.remove(filename);
            deferred.resolve();
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
