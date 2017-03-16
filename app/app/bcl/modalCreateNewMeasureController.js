/***********************************************************************************************************************
 *  OpenStudio(R), Copyright (c) 2008-2017, Alliance for Sustainable Energy, LLC. All rights reserved.
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
import jetpack from 'fs-jetpack';

export class ModalCreateNewMeasureController {

  constructor($log, $uibModalInstance, $scope, BCL, Project, Message) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$scope = $scope;
    vm.BCL = BCL;
    vm.Project = Project;
    vm.measure = '';
    vm.newDisplayName = '';
    vm.newDescription = '';
    vm.newModelerDescription = '';
    vm.measureTypes = ['OpenStudio', 'EnergyPlus', 'Reporting'];
    vm.measureType = vm.measureTypes[0];
    vm.Message = Message;

    vm.bclCategories = vm.BCL.getBCLCategories();

    vm.taxonomies = [];
    _.forEach(vm.bclCategories, (category) => {
      vm.taxonomies.push(category.name);
    });
    vm.taxonomy = vm.taxonomies[0];

    vm.$scope.child = '';
    vm.$scope.children = [];
    vm.getTaxonomyChildren(vm.taxonomy);

    vm.tags = '';
    vm.makeMeasureTags();

    //TODO: which folder should receive the new measure?
    //vm.measureDir = vm.Project.getProjectMeasuresDir();
    vm.measureDir = vm.Project.getMeasuresDir();

    vm.jetpack = jetpack;
  }

  getTaxonomyChildren(taxonomy) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalCreateNewMeasureController::getTaxonomyChildren');
    const index = vm.taxonomies.indexOf(taxonomy);

    vm.$scope.children = [];
    if (vm.bclCategories && vm.bclCategories.length > 0 && index >= 0) {
      _.forEach(vm.bclCategories[index].children, (child) => {
        vm.$scope.children.push(child.name);
      });
      vm.$scope.child = vm.$scope.children[0];
      vm.makeMeasureTags();
    }
  }

  makeMeasureTags() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalCreateNewMeasureController::makeMeasueTag');
    vm.tags = vm.taxonomy + '.' + vm.$scope.child;
  }

  ok() {
    const vm = this;

    if (vm.measureType == 'OpenStudio')
      vm.measureType = 'ModelMeasure';
    else if (vm.measureType == 'EnergyPlus')
      vm.measureType = 'EnergyPlusMeasure';
    else if (vm.measureType == 'Reporting')
      vm.measureType = 'ReportingMeasure';
    else
      vm.$log.error('Unhandled measure type');

    // Find a unique measure_dir
    let count = 0;
    let displayName = vm.newDisplayName;
    let measureDir = vm.Project.getMeasuresDir().path(_.snakeCase(displayName));
    if (vm.Message.showDebug()) vm.$log.debug('measureDir: ', measureDir);
    while (vm.jetpack.exists(measureDir)) {
      count++;
      displayName = vm.newDisplayName + count.toString();
      measureDir = vm.Project.getMeasuresDir().path(_.snakeCase(displayName));
      if (vm.Message.showDebug()) vm.$log.debug('measureDir: ', measureDir);
    }

    const params = {
      measure_dir: measureDir,
      display_name: displayName,
      class_name: _.upperFirst(_.camelCase(displayName)),
      taxonomy_tag: vm.tags,
      measure_type: vm.measureType,
      description: vm.newDescription,
      modeler_description: vm.newModelerDescription
    };

    if (vm.Message.showDebug()) vm.$log.debug('ModalCreateNewMeasureController::ok params: ', params);
    vm.$uibModalInstance.close(params);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
