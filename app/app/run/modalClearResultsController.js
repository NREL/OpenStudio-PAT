export class ModalClearResultsController {

  constructor($log, $uibModalInstance, params, $scope) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.params = params;
    vm.$scope = $scope;

    vm.$scope.type = vm.params.type;
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
