import jetpack from 'fs-jetpack';

export class ModalDuplicateMeasureController {

  constructor($log, $uibModalInstance, measure, Project) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.Project = Project;
    vm.$log = $log;
    vm.measure = measure;
    vm.newDisplayName = measure.display_name;
    vm.newDescription = measure.description;
    vm.newModelerDescription = measure.modeler_description;
    //vm.MeasureManager = MeasureManager;
    vm.jetpack = jetpack;
  }

  ok() {
    const vm = this;
    vm.$log.debug('Duplicate Measure measure: ', vm.measure);
    const oldMeasureDir = vm.measure.measure_dir;
    // store duplicated measures in 'Measures'
    const params = {
      old_measure_dir: vm.measure.measure_dir,
      measure_dir: vm.Project.getMeasuresDir().path(_.snakeCase(vm.newDisplayName)),
      display_name: vm.newDisplayName,
      class_name: _.upperFirst(_.camelCase(vm.newDisplayName)),
      taxonomy_tag: vm.measure.tags,
      measure_type: vm.measure.type,
      description: vm.newDescription,
      modeler_description: vm.newModelerDescription,
      force_reload: 0
    };

    vm.$log.debug('Duplicate Measure params: ', params);
    vm.$uibModalInstance.close(params);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
