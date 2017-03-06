export class ModalNestedProjectWarningController {

  constructor($log, $uibModalInstance, Message) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$uibModalInstance = $uibModalInstance;
    vm.Message = Message;
  }

  ok() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalNestedProjectWarningController ok');
    vm.$uibModalInstance.close();
  }
}
