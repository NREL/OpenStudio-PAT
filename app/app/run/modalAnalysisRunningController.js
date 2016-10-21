export class ModalAnalysisRunningController {

  constructor($log, $uibModalInstance) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.$log.debug('in Modal Analysis Controller');

  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

}
