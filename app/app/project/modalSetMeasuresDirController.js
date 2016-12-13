import {remote} from 'electron';
const {dialog} = remote;

export class ModalSetMeasuresDirController {

  constructor($log, $scope, $uibModalInstance, MeasureManager, toastr, Project) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.toastr = toastr;
    vm.MeasureManager = MeasureManager;
    vm.Project = Project;
    vm.dialog = dialog;

    vm.$scope.currentDir = vm.Project.getMeasuresDir().path();

  }

  selectDir() {
    const vm = this;
    const result = vm.dialog.showOpenDialog({
      title: 'Select MyMeasures Dir',
      properties: ['openDirectory']
    });

    if (!_.isEmpty(result)) {
      // copy and select the file
      vm.$scope.currentDir = result[0];
      vm.$log.debug('New Dir:', vm.$scope.currentDir);

    }
  }


  ok() {
    const vm = this;
    // set new My Measures Dir
    vm.MeasureManager.setMyMeasuresDir(vm.$scope.currentDir).then(response => {
      vm.$log.debug('Successfully set MyMeasures Directory! ',  response);
      // set measureDir in Project
      vm.Project.setMeasuresDir(vm.$scope.currentDir);
      vm.$uibModalInstance.close();
    }, () => {
      vm.$log.debug('Could not set MyMeasures Directory');
      vm.$uibModalInstance.close();
    });

  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }
}
