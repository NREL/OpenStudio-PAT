import jetpack from 'fs-jetpack';

export class ModalUpdateMeasureController {

  constructor($log, $uibModalInstance, measure, Message) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.measure = measure;
    vm.Message = Message;
    if (vm.Message.showDebug()) vm.$log.debug('in Modal Update Measure Controller constructor');
    if (vm.Message.showDebug()) vm.$log.debug('measure: ', measure);
    vm.jetpack = jetpack;
  }

  updateProject() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('Update Project');
    const action = 'updateProject';
    vm.$uibModalInstance.close(action);
  }

  updateLocalLib() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('Update LocalBCL from Online BCL only: ', vm.measure);
    const action = 'updateLocalLib';
    vm.$uibModalInstance.close(action);
  }

  updateLocalLibAndProject() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('Update LocalBCL from Online BCL and update Project: ', vm.measure);
    const action = 'updateLocalLibAndProject';
    vm.$uibModalInstance.close(action);

  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
