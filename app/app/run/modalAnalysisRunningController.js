export class ModalAnalysisRunningController {

  constructor($log, $uibModalInstance, OsServer) {
    'ngInject';

    const vm = this;
    vm.OsServer = OsServer;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebug = false;
    if (vm.showDebug) vm.$log.debug('in Modal Analysis Controller');
    if (vm.showDebug) vm.$log.debug('Analysis Status: ', vm.OsServer.getAnalysisStatus());

  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

}
