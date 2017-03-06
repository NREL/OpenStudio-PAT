export class ModalSelectOutputsController {

  constructor($log, $uibModalInstance, params, $scope) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.params = params;
    vm.$scope = $scope;
    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebug = false;

    vm.$scope.measure = vm.params.measure;
    if (vm.showDebug) vm.$log.debug('Measure: ', vm.$scope.measure);

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
      if (output.checked && !_.find(vm.$scope.measure.analysisOutputs, {display_name: output.display_name})){
        // add
        vm.$scope.measure.analysisOutputs.push(output);
      } else if (!output.checked && _.find(vm.$scope.measure.analysisOutputs, {display_name: output.display_name})) {
        // remove
        _.remove(vm.$scope.measure.analysisOutputs, {display_name: output.display_name});
      }
    });
    // check for userDefined Outputs
    _.forEach(vm.$scope.measure.userDefinedOutputs, (output) => {

      if (output.newOut){
        // create name and make sure output name includes measure name
        let name = _.snakeCase(output.display_name);
        if (name.indexOf(vm.$scope.measure.name + '.') == -1) {
          output.name = vm.$scope.measure.name + '.' + name;
        }
        // TODO: Is this a unique name?
        // add to analysisOutputs
        output.display_name = output.display_name ? output.display_name : output.display_name;
        output.short_name = output.short_name ? output.short_name : _.snakeCase(output.display_name);
        vm.$scope.measure.analysisOutputs.push(output);
        output.newOut = false;
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
    // use epoch time as temporary unique name
    vm.$scope.measure.userDefinedOutputs.push({name: (new Date).getTime(), userDefined: true, newOut: true});
  }

  deleteOutput(output) {
    const vm = this;
    // remove from userDefinedArray
    _.remove(vm.$scope.measure.userDefinedOutputs, {name: output.name});
    // remove from analysisOutputs also
    _.remove(vm.$scope.measure.analysisOutputs, {name: output.name, userDefined: true});
  }

}
