export class ModalModifiedController {

  constructor($log, $scope, $uibModalInstance, Project) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.$uibModalInstance = $uibModalInstance;
    vm.Project = Project;
    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebug = false;
  }

  ok() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('ModalModifiedController ok');
    vm.Project.exportPAT();
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('ModalModifiedController cancel');
    vm.$uibModalInstance.dismiss('cancel');
  }
}
