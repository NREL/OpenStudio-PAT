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
    let noWhitespace = vm.$scope.name;
    if (vm.$scope.name.indexOf(' ') >= 0) {
      noWhitespace = vm.$scope.name.replace(/\s/g, '');
    }
    vm.project.setProjectName(noWhitespace);
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.close();
  }
}
