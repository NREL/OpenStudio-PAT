import {remote} from 'electron';
const {app} = remote;

export class MeasureManager {
  constructor($log, $http, $q, DependencyManager) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$http = $http;
    vm.$q = $q;

    let exeExt = '';
    if (process.platform == 'win32') {
      exeExt = '.exe';
    }

    // to run cli
    vm.spawn = require('child_process').spawn;
    vm.cliPath = DependencyManager.getPath('PAT_OS_CLI_PATH');

    vm.url = 'http://localhost:1234';

    // measure Manager ready promise
    vm.mmReadyDeferred = vm.$q.defer();

  }

  isReady() {
    const vm = this;
    return vm.mmReadyDeferred.promise;
  }

  startMeasureManager() {
    const vm = this;
    vm.$log.debug('Start Measure Manager Server: ', vm.cliPath);
    vm.cli = vm.spawn(vm.cliPath, ['measure', '-s']);
    vm.cli.stdout.on('data', (data) => {
      vm.$log.debug(`MeasureManager: ${data}`);
      // check that the mm was started correctly: resolve readyDeferred
      const str = data.toString();
      if (str.indexOf('WEBrick::HTTPServer#start: pid=') !== -1) {
        vm.$log.debug('Found WEBrick Start!, resolve promise');
        vm.mmReadyDeferred.resolve();
      }
      // TODO: THIS IS TEMPORARY (windows):
      else if (str.indexOf('Only one usage of each socket address') !== -1) {
        vm.$log.debug('WEBrick already running...assuming MeasureManager is already up');
        vm.mmReadyDeferred.resolve();
      }
      // TODO: THIS IS TEMPORARY (mac):
      else if (str.indexOf('Error: Address already in use') !== -1) {
        vm.$log.debug ('WEBrick already running...assuming MeasureManager is already up');
        vm.mmReadyDeferred.resolve();
      }

    });
    vm.cli.stderr.on('data', (data) => {
      vm.$log.debug(`MeasureManager: ${data}`);
      // check that the mm was started correctly: resolve readyDeferred
      const str = data.toString();
      if (str.indexOf('WEBrick::HTTPServer#start: pid=') !== -1) {
        vm.$log.debug('Found WEBrick Start!, resolve promise');
        vm.mmReadyDeferred.resolve();
      }
      // TODO: THIS IS TEMPORARY (windows):
      else if (str.indexOf('Only one usage of each socket address') !== -1) {
        vm.$log.debug('WEBrick already running...using tempMeasureManager');
        vm.mmReadyDeferred.resolve();
      }
      // TODO: THIS IS TEMPORARY (mac):
      else if (str.indexOf('Error: Address already in use') !== -1) {
        vm.$log.debug ('WEBrick already running...using tempMeasureManager');
        vm.mmReadyDeferred.resolve();
      }
    });
    vm.cli.on('close', (code) => {
      vm.$log.debug(`Measure Manager exited with code ${code}`);
    });
  }

  stopMeasureManager() {
    const vm = this;

    vm.$log.debug('Stop Measure Manager Server');
    vm.cli.kill('SIGINT');
  }

  // This function make a copy of a measure on the file system.
  // Copy should be in 'my measures' (actual folder name: 'Measures')
  // params should look like this
  // params {
  //   old_measure_dir:
  //   measure_dir:
  //   display_name:
  //   class_name:
  //   taxonomy_tag:
  //   measure_type:
  //   description:
  //   modeler_description:
  //   force_reload:
  // }
  duplicateMeasure(params) {
    const vm = this;
    const deferred = vm.$q.defer();

    vm.$log.debug('params one more time: ', params);
    vm.$http.post(vm.url + '/duplicate_measure', params)
      .success((data, status, headers, config) => {
        vm.$log.debug('Measure Manager reply: ', data);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.debug('Measure Manager DuplicateMeasure error: ', data);
        deferred.reject();
      });

    return deferred.promise;
  }

  // Update Measures
  // This function updates measures at specified path
  // Expects a measurePath
  updateMeasures(measurePath) {

    const vm = this;
    // fix path for windows
    const newMeasurePath = measurePath.replace(/\\/g, '/'); // Evan: how to normalize the path
    const params = {measures_dir: newMeasurePath};
    vm.$log.debug('PARAMS: ', params);

    const deferred = vm.$q.defer();

    vm.$http.post(vm.url + '/update_measures', params)
      .success((data, status, headers, config) => {
        vm.$log.debug('updateMeasures Success!, status: ', status);
        // vm.$log.debug('Measure Manager reply: ', data);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.debug('Measure Manager UpdateMeasures error: ', data);
        deferred.reject([]);
      });

    return deferred.promise;
  }

  // Returns the path to the myMeasures directory
  getMyMeasuresDir() {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.$http.get(vm.url, {
      params: {}})
      .success((data, status, headers, config) => {
        vm.$log.debug('Measure Manager getMyMeasuresDir Success!, status: ', status);
        deferred.resolve(data);
      })
    .error((data, status, headers, config) => {
      vm.$log.debug('Measure Manager getMyMeasuresDir Error: ', data);
      deferred.reject([]);
    });
    return deferred.promise;
  }

  setMyMeasuresDir(path) {
    const vm = this;
    const deferred = vm.$q.defer();
    const params = {my_measures_dir: path};
    vm.$http.post(vm.url + '/set', params)
      .success((data, status, headers, config) => {
        vm.$log.debug('Measure Manager setMyMeasuresDir Success!, status: ', status);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.debug('Measure Manager SetMyMeasuresDir Error: ', data);
        deferred.reject([]);
      });
    return deferred.promise;
  }

  // Retrieve Local BCL measures
  getLocalBCLMeasures(){
    const vm = this;
    const deferred = vm.$q.defer();
    const params = {};
    vm.$http.post(vm.url + '/bcl_measures', params)
      .success((data, status, headers, config) => {
        vm.$log.debug('Measure Manager bcl_measures Success!, status: ', status);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.debug('Measure Manager bcl_measures Error: ', data);
        deferred.reject([]);
      });
    return deferred.promise;
  }

  // Download a measure from online BCL
  downloadBCLMeasure(uid) {
    const vm = this;
    const deferred = vm.$q.defer();
    const params = {uid: uid};

    vm.$http.post(vm.url + '/download_bcl_measure', params)
      .success((data, status, headers, config) => {
        vm.$log.debug('Measure Manager download_bcl_measure Success!, status: ', status);
        vm.$log.debug('Data: ', data);
        deferred.resolve(data[0]);
      })
      .error((data, status, headers, config) => {
        vm.$log.debug('Measure Manager download_bcl_measure Error: ', data);
        deferred.reject([]);
      });


    return deferred.promise;
  }


  // Compute Arguments
  // This function computes arguments and returns all metadata for a single measure
  // Expects a measurePath.  and osmPath if evaluating against a specific model
  computeArguments(measurePath, osmPath = null) {
    const vm = this;

    // TODO: is there a situation where we want to use an empty model even though we have a seed model defined?
    if (!osmPath){
      osmPath = (vm.defaultSeed == null) ? null : vm.seedDir.path(vm.defaultSeed);
    }
    const params =  {measure_dir: measurePath, osm_path: osmPath};
    vm.$log.debug('computeArguments params', params);
    const deferred = vm.$q.defer();

    vm.$http.post(vm.url + '/compute_arguments', params)
      .success((data, status, headers, config) => {
        vm.$log.debug('computeArguments Success!, status: ', status);
        // vm.$log.debug('Measure Manager reply: ', data);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.debug('Measure Manager ComputeArguments error: ', data);
        deferred.reject([]);
      });

    return deferred.promise;
  }
}

