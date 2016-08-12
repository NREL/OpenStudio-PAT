import {remote} from 'electron';
const {app} = remote;

export class MeasureManager {
  constructor($log, $http, $q) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$http = $http;
    vm.$q = $q;

    let exeExt = '';
    if( process.platform == 'win32' ) {
      exeExt = '.exe';
    }

    // to run cli
    vm.spawn = require('child_process').spawn;
    vm.cliPath = app.getPath('userData') + '/openstudioCLI/bin/openstudio' + exeExt;
    vm.cliPath = vm.cliPath.replace(' ', '\ ');

    vm.url = 'http://localhost:1234';
  }

  startMeasureManager() {
    const vm = this;
    vm.$log.debug('Start Measure Manager Server: ', vm.cliPath);
    vm.cli = vm.spawn(vm.cliPath, ['measure', '-s']);
    vm.cli.stdout.on('data', (data) => {
      vm.$log.debug(`MeasureManager: ${data}`);
    });
    vm.cli.stderr.on('data', (data) => {
      vm.$log.debug(`MeasureManager: ${data}`);
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
  // Probably in my measures, or local bcl
  // parms should look like this
  // params {
  //   old_measure_dir:
  //   measure_dir:
  //   name:
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

    vm.$http.post(vm.url + '/duplicate_measure', params)
      .success( (data, status, headers, config) => {
        vm.$log.debug(`Measure Manager reply ${data}`);
        deferred.resolve();
      })
      .error( (data, status, header, config) => {
        vm.$log.debug(`Measure Manager error ${data}`);
        deferred.reject();
      });

    return deferred.promise;
  }
}
