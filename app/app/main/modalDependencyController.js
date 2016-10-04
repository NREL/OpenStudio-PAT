export class ModalDependencyController {

  constructor($uibModalInstance, DependencyManager) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.DependencyManager = DependencyManager;
    vm.downloadStatus = DependencyManager.downloadStatus;
  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

}
