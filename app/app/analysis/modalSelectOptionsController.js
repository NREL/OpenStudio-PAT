export class ModalSelectOptionsController {

  constructor($log, $uibModalInstance, params, $scope) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.params = params;
    vm.$scope = $scope;

    vm.$scope.measure = vm.params.measure;

    vm.$scope.allSelected = false;

    // toggle selected
    vm.$scope.toggleSelected = function() {
      vm.$scope.allSelected = !vm.$scope.allSelected;
      _.forEach($scope.measure.options, function(option){
        option.checked = vm.$scope.allSelected;
      });
    };
  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close(vm.$scope.measure);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
