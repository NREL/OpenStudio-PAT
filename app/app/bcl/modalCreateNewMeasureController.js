export class ModalCreateNewMeasureController {

  constructor($log, $uibModalInstance, $scope, BCL, Project, jetpack) {
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
    vm.$log.debug('ModalCreateNewMeasureController::getTaxonomyChildren');
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
    vm.$log.debug('ModalCreateNewMeasureController::makeMeasueTag');
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
    vm.$log.debug('measureDir: ', measureDir);
    while (vm.jetpack.exists(measureDir)) {
      count++;
      displayName = vm.newDisplayName + count.toString();
      measureDir = vm.Project.getMeasuresDir().path(_.snakeCase(displayName));
      vm.$log.debug('measureDir: ', measureDir);
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

    vm.$log.debug('ModalCreateNewMeasureController::ok params: ', params);
    vm.$uibModalInstance.close(params);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
