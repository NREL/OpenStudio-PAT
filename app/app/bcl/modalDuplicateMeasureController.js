import jetpack from 'fs-jetpack';

export class ModalDuplicateMeasureController {

  constructor($log, $uibModalInstance, measure, Project) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.measure = measure;
    vm.newName = measure.name;
    vm.newDisplayName = measure.displayName;
    vm.newDescription = measure.description;
    vm.newModelerDescription = measure.modelerDescription;
    //vm.MeasureManager = MeasureManager;
    vm.jetpack = jetpack;
  }

  ok() {
    const vm = this;
    vm.$log.debug('Duplicate Measure measure: ',vm.measure);
    const oldMeasureDir = vm.measure.measureDir;
    // store duplicated measures in 'Measures' folder (not LocalBCL)
    const params = {
      old_measure_dir: vm.measure.measureDir,
      measure_dir: vm.jetpack.cwd(oldMeasureDir).path('..', '..', 'Measures', _.snakeCase(vm.newName)),
      name: vm.newName,
      class_name: _.capitalize(_.camelCase(vm.newName)),
      taxonomy_tag: vm.measure.tags,
      measure_type: vm.measure.type,
      description: vm.newDescription,
      modeler_description: vm.newModelerDescription,
      force_reload: 0
    };
    vm.$log.debug('Duplicate Measure params: ',params);
    vm.$uibModalInstance.close(params);
    //vm.MeasureManager.duplicateMeasure(params).then( () => {
    //}, () => {
    //} );
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
