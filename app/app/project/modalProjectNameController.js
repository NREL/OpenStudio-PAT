export class ModalProjectNameController {

  constructor($log, $scope, $uibModalInstance, Project) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.$uibModalInstance = $uibModalInstance;
    vm.project = Project;

    //const updateStatus = function (status) {
    //  vm.status = status;
    //  vm.$scope.$digest();
    //};
  }

  ok() {
    const vm = this;
    vm.$log.debug('ModalProjectNameController ok');
    vm.project.setProjectName(vm.$scope.name);
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.close();
  }
}
