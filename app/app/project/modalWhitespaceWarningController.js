export class ModalWhitespaceWarningController {

  constructor($log, $uibModalInstance) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$uibModalInstance = $uibModalInstance;
    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebug = false;
  }

  ok() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('ModalWhitespaceWarningController ok');
    vm.$uibModalInstance.close();
  }
}
