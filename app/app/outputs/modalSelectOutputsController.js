export class ModalSelectOutputsController {

  constructor($log, $uibModalInstance, params, $scope) {
    'ngInject';

    // ignore camelcase for this file
    /* eslint camelcase: 0 */

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.params = params;
    vm.$scope = $scope;

    vm.$scope.measure = vm.params.measure;
    vm.$log.debug('Measure: ', vm.$scope.measure);

    vm.$scope.allSelected = false;

    // toggle selected
    vm.$scope.toggleSelected = function() {
      vm.$scope.allSelected = !vm.$scope.allSelected;
      _.forEach($scope.measure.outputs, function(out){
        out.checked = vm.$scope.allSelected;
      });
    };

  }

  ok() {
    const vm = this;
    // add/remote Outputs to analysisOutputs
    _.forEach(vm.$scope.measure.outputs, (output) => {
      if (output.checked && !_.find(vm.$scope.measure.analysisOutputs, {name: output.name})){
        // add
        vm.$scope.measure.analysisOutputs.push(output);
      } else if (!output.checked && _.find(vm.$scope.measure.analysisOutputs, {name: output.name})) {
        // remove
        _.remove(vm.$scope.measure.analysisOutputs, {name: output.name});
      }
    });
    // check for userDefined Outputs
    _.forEach(vm.$scope.measure.userDefinedOutputs, (output) => {
      if (!_.find(vm.$scope.measure.analysisOutputs, {name: output.name})) {
        // add
        output.display_name = output.display_name ? output.display_name : output.name;
        output.short_name = output.short_name ? output.short_name : output.name;
        vm.$scope.measure.analysisOutputs.push(output);
      }
    });

    vm.$uibModalInstance.close(vm.$scope.measure);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

  addOutput() {
    const vm = this;
    vm.$scope.measure.userDefinedOutputs.push({name: '', userDefined: true});
  }

  deleteOutput(output) {
    const vm = this;
    // remove from userDefinedArray
    _.remove(vm.$scope.measure.userDefinedOutputs, {name: output.name});
    // remove from analysisOutputs also
    _.remove(vm.$scope.measure.analysisOutputs, {name: output.name, userDefined: true});
  }

}
