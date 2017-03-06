export class ModalWhitespaceWarningController {

  constructor($log, $uibModalInstance, Message) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.Message = Message;
  }

  ok() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalWhitespaceWarningController ok');
    vm.$uibModalInstance.close();
  }
}
