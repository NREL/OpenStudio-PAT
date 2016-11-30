export class ModalModifiedController {

  constructor($log, $scope, $uibModalInstance, Project) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.$uibModalInstance = $uibModalInstance;
    vm.Project = Project;
  }

  ok() {
    const vm = this;
    vm.$log.debug('ModalModifiedController ok');
    vm.Project.exportPAT();
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;
    vm.$log.debug('ModalModifiedController cancel');
    vm.$uibModalInstance.dismiss('cancel');
  }
}
