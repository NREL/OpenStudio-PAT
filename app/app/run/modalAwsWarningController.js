export class ModalAwsWarningController {

  constructor($log, $uibModalInstance, Message) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.Message = Message;
    if (vm.Message.showDebug()) vm.$log.debug('in Modal Aws Warning Controller');

  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
