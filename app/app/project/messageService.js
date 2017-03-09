export class Message {
  constructor($q, $log) {
    'ngInject';
    const vm = this;
    vm.$q = $q;
    vm.$log = $log;

    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebugMessages = false;
    if (vm.showDebugMessages) vm.$log.info('showDebugMessages = ', vm.showDebugMessages);

    vm.showInfoMessages = true;
    if (vm.showInfoMessages) vm.$log.info('showInfoMessages = ', vm.showInfoMessages);

    vm.showErrorMessages = true;
    if (vm.showErrorMessages) vm.$log.info('showErrorMessages = ', vm.showErrorMessages);
  }

  showDebug() {
    const vm = this;
    return vm.showDebugMessages;
  }

  setShowDebug(show) {
    const vm = this;
    vm.showDebugMessages = show;
    if (vm.showDebugMessages) vm.$log.info('showDebugMessages = ', vm.showDebugMessages);
  }

  showInfo() {
    const vm = this;
    return vm.showInfoMessages;
  }

  setShowInfog(show) {
    const vm = this;
    vm.showInfoMessages = show;
  }

  showError() {
    const vm = this;
    return vm.showErrorMessages;
  }

  setShowError(show) {
    const vm = this;
    vm.showErrorMessages = show;
  }
}
