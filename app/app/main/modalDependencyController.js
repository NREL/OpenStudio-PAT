export class ModalDependencyController {

  constructor($scope, $uibModalInstance, DependencyManager) {
    'ngInject';

    const vm = this;
    vm.$scope = $scope;
    vm.$uibModalInstance = $uibModalInstance;
    vm.DependencyManager = DependencyManager;
    vm.downloadStatus = DependencyManager.downloadStatus;

    const updateStatus = function (status) {
      vm.status = status;
      vm.$scope.$digest();
    };

    DependencyManager.registerObserver(updateStatus);
  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

}

