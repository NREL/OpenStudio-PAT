import {remote} from 'electron';

const {app} = remote;

export class ModalOpenProjectController {

  constructor($log, $scope, $uibModalInstance, SetProject, Project) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.$uibModalInstance = $uibModalInstance;
    vm.app = app;
    vm.setProject = SetProject;
    vm.Project = Project;
    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebug = false;
  }

  openProject() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('ModalOpenProjectController::openProject');
    vm.setProject.openProject().then(() => {
      vm.$uibModalInstance.close();
    }, () => {
      if (vm.showDebug) vm.$log.debug('ModalOpenProjectController::openProject rejected, allow user to try again');
      //vm.$uibModalInstance.close();
    });
  }

  newProject() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('ModalOpenProjectController::newProject');
    vm.setProject.newProject().then(() => {
      vm.$uibModalInstance.close();
    }, () => {
      vm.$uibModalInstance.close();
    });
  }

  cancel() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('ModalOpenProjectController::cancel');
    vm.app.quit();
    vm.$uibModalInstance.dismiss('cancel');
  }
}
