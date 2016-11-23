export class ModalClearResultsController {

  constructor($log, $uibModalInstance, params) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.params = params;
  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
