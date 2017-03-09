export class ModalProjectNameController {

  constructor($log, $scope, $uibModalInstance, SetProject, Message) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.$uibModalInstance = $uibModalInstance;
    vm.SetProject = SetProject;
    vm.Message = Message;
  }

  ok() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalProjectNameController ok');
    const noWhitespace = vm.$scope.name;
    // if (vm.$scope.name.indexOf(' ') >= 0) {
    //   noWhitespace = vm.$scope.name.replace(/\s/g, '');
    // }
    vm.SetProject.newProjectName = noWhitespace;
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalProjectNameController cancel');
    vm.$uibModalInstance.dismiss('cancel');
  }
}
