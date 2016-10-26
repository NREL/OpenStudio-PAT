export class ModalAnalysisRunningController {

  constructor($log, $uibModalInstance, OsServer) {
    'ngInject';

    const vm = this;
    vm.OsServer = OsServer;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.$log.debug('in Modal Analysis Controller');
    vm.$log.debug('Analysis Status: ', vm.OsServer.getAnalysisStatus());

  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

}
