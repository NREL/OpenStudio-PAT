import jetpack from 'fs-jetpack';

export class ModalDuplicateMeasureController {

  constructor($log, $uibModalInstance, measure, Project, Message) {
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
    vm.Message = Message;
  }

  ok() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('Duplicate Measure measure: ', vm.measure);
    //const oldMeasureDir = vm.measure.measure_dir;

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
      old_measure_dir: vm.measure.measure_dir,
      measure_dir: measureDir,
      display_name: displayName,
      class_name: _.upperFirst(_.camelCase(displayName)),
      taxonomy_tag: vm.measure.tags,
      measure_type: vm.measure.type,
      description: vm.newDescription,
      modeler_description: vm.newModelerDescription,
      force_reload: 0
    };

    if (vm.Message.showDebug()) vm.$log.debug('Duplicate Measure params: ', params);
    vm.$uibModalInstance.close(params);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
