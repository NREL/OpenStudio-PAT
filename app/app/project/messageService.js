export class Message {
  constructor($q, $log) {
    'ngInject';
    const vm = this;
    vm.$q = $q;
    vm.$log = $log;

    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebugMessages = false;
    vm.$log.info('showDebugMessages = ', vm.showDebugMessages);

    vm.showInfoMessages = true;
    vm.$log.info('showInfoMessages = ', vm.showInfoMessages);

    vm.showErrorMessages = true;
    vm.$log.info('showErrorMessages = ', vm.showErrorMessages);
  }

  showDebug() {
    const vm = this;
    return vm.showDebug;
  }

  showInfo() {
    const vm = this;
    return vm.showInfo;
  }

  showError() {
    const vm = this;
    return vm.showError;
  }
}
