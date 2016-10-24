export class ModalProjectNameController {

  constructor($log, $scope, $uibModalInstance, Project) {
    'ngInject';

    const vm = this;
    //vm.$scope = $scope;
    vm.$log = $log;
    vm.$uibModalInstance = $uibModalInstance;
    //vm.Project = Project;
    vm.projectName = '';
    vm.project = Project;

    //const updateStatus = function (status) {
    //  vm.status = status;
    //  vm.$scope.$digest();
    //};
  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
    //vm.$log.debug('HELLO!');
    //vm.project.setProjectName(vm.projectName);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.close();
  }
}
