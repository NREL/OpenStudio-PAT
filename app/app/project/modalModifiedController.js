export class ModalModifiedController {

  constructor($log, $scope, $uibModalInstance, Project) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.$uibModalInstance = $uibModalInstance;
    vm.Project = Project;

    //const updateStatus = function (status) {
    //  vm.status = status;
    //  vm.$scope.$digest();
    //};
  }

  ok() {
    const vm = this;
    vm.$log.debug('ModalModifiedController ok');
    // TODO do something vm.Project.modified
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

}
