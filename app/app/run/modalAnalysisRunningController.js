export class ModalAnalysisRunningController {

  constructor($log, $uibModalInstance, OsServer, Message) {
    'ngInject';

    const vm = this;
    vm.OsServer = OsServer;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.Message = Message;
    if (vm.Message.showDebug()) vm.$log.debug('in Modal Analysis Controller');
    if (vm.Message.showDebug()) vm.$log.debug('Analysis Status: ', vm.OsServer.getAnalysisStatus());

  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

}
