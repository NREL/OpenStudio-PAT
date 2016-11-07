export class ModalWhitespaceWarningController {

  constructor($log, $uibModalInstance) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$uibModalInstance = $uibModalInstance;
  }

  ok() {
    const vm = this;
    vm.$log.debug('ModalWhitespaceWarningController ok');
    vm.$uibModalInstance.close();
  }
}
