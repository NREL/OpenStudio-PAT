export class ModalNestedProjectWarningController {

  constructor($log, $uibModalInstance) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$uibModalInstance = $uibModalInstance;
  }

  ok() {
    const vm = this;
    vm.$log.debug('ModalNestedProjectWarningController ok');
    vm.$uibModalInstance.close();
  }
}
