import {remote} from 'electron';
const {app} = remote;

export class MeasureManager {
  constructor($log) {
    'ngInject';

    const vm = this;
    vm.$log = $log;

    let exe_ext = '';
    if( process.platform == 'win32' ) {
      exe_ext = '.exe';
    }

    // to run cli
    vm.spawn = require('child_process').spawn;
    vm.cliPath = app.getPath('userData') + '/openstudioCLI/bin/openstudio' + exe_ext;
    vm.cliPath = vm.cliPath.replace(' ', '\ ');
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
}
