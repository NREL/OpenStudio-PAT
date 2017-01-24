export class ModalSelectOutputsController {

  constructor($log, $uibModalInstance, params, $scope) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.params = params;
    vm.$scope = $scope;

    vm.$scope.measure = vm.params.measure;
    vm.$log.debug('Measure: ', vm.$scope.measure);

  }

  ok() {
    const vm = this;
    // add/remote Outputs to analysisOutputs
    _.forEach(vm.$scope.measure.outputs, (output) => {
      if (output.checked && !_.find(vm.$scope.measure.analysisOutputs, {name: output.name})){
        //add
        vm.$scope.measure.analysisOutputs.push(output);
      } else if (!output.checked && _.find(vm.$scope.measure.analysisOutputs, {name: output.name})) {
        // remote
        _.remove(vm.$scope.measure.analysisOutputs, {name: output.name});
      }

    });
    vm.$uibModalInstance.close(vm.$scope.measure);

  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
