export class ModalEditOptionDescriptionController {

  constructor($log, $uibModalInstance, params) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.params = params;
    vm.optionDescription = vm.params.optionDescription;
  }

  ok() {
    const vm = this;
    vm.params.optionDescription = vm.optionDescription;
    vm.$uibModalInstance.close(vm.params.optionDescription);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
