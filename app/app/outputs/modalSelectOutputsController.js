/***********************************************************************************************************************
 *  OpenStudio(R), Copyright (c) 2008-2018, Alliance for Sustainable Energy, LLC. All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 *  following conditions are met:
 *
 *  (1) Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 *  disclaimer.
 *
 *  (2) Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 *  following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 *  (3) Neither the name of the copyright holder nor the names of any contributors may be used to endorse or promote
 *  products derived from this software without specific prior written permission from the respective party.
 *
 *  (4) Other than as required in clauses (1) and (2), distributions in any form of modifications or other derivative
 *  works may not use the "OpenStudio" trademark, "OS", "os", or any other confusingly similar designation without
 *  specific prior written permission from Alliance for Sustainable Energy, LLC.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 *  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER, THE UNITED STATES GOVERNMENT, OR ANY CONTRIBUTORS BE LIABLE FOR
 *  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 *  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 *  AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **********************************************************************************************************************/
export class ModalSelectOutputsController {

  constructor($log, $uibModalInstance, params, $scope, Message) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.params = params;
    vm.$scope = $scope;
    vm.Message = Message;

    vm.$scope.measure = vm.params.measure;
    if (vm.Message.showDebug()) vm.$log.debug('Measure: ', vm.$scope.measure);

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
        output.visualize = 'true'; // default to true
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
        const name = _.snakeCase(output.display_name);
        const prefix = vm.$scope.measure.name;
        if (vm.Message.showDebug()) vm.$log.debug('Output Prefix: ', prefix);
        if ((!_.isNil(prefix) && prefix != '') && name.indexOf(prefix + '.') == -1) {
          output.name = prefix + '.' + name;
        }
        // TODO: Is this a unique name?
        // add to analysisOutputs
        output.display_name = output.display_name ? output.display_name : output.display_name;
        output.short_name = output.short_name ? output.short_name : _.snakeCase(output.display_name);
        output.visualize = 'true';  // default to true
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
