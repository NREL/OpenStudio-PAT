import jetpack from 'fs-jetpack';

export class ModalUpdateMeasureController {

  constructor($log, $uibModalInstance, measure) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.measure = measure;
    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebug = false;
    if (vm.showDebug) vm.$log.debug('in Modal Update Measure Controller constructor');
    if (vm.showDebug) vm.$log.debug('measure: ', measure);
    vm.jetpack = jetpack;
  }

  updateProject() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('Update Project');
    const action = 'updateProject';
    vm.$uibModalInstance.close(action);
  }

  updateLocalLib() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('Update LocalBCL from Online BCL only: ', vm.measure);
    const action = 'updateLocalLib';
    vm.$uibModalInstance.close(action);
  }

  updateLocalLibAndProject() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('Update LocalBCL from Online BCL and update Project: ', vm.measure);
    const action = 'updateLocalLibAndProject';
    vm.$uibModalInstance.close(action);

  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
