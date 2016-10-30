export class ModalOpenProjectController {

  constructor($log, $scope, $uibModalInstance, SetProject) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.$uibModalInstance = $uibModalInstance;
    vm.setProject = SetProject;

    //const updateStatus = function (status) {
    //  vm.status = status;
    //  vm.$scope.$digest();
    //};
  }

  open() {
    const vm = this;
    //vm.project.setProjectName(vm.$scope.name);
    vm.$uibModalInstance.close();
  }

  new() {
    const vm = this;
    //vm.project.setProjectName(vm.$scope.name);
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.close();
  }
}
