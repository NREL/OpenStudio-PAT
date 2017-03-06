export class ModalModifiedController {

  constructor($log, $scope, $uibModalInstance, Project, Message) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.$uibModalInstance = $uibModalInstance;
    vm.Project = Project;
    vm.Message = Message;
  }

  ok() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalModifiedController ok');
    vm.Project.exportPAT();
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalModifiedController cancel');
    vm.$uibModalInstance.dismiss('cancel');
  }
}
