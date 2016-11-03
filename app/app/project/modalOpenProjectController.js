import {remote} from 'electron';

const {app} = remote;

export class ModalOpenProjectController {

  constructor($log, $scope, $uibModalInstance, SetProject) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.$uibModalInstance = $uibModalInstance;
    vm.app = app;
    vm.setProject = SetProject;

    //const updateStatus = function (status) {
    //  vm.status = status;
    //  vm.$scope.$digest();
    //};
  }

  openProject() {
    const vm = this;
    vm.$log.debug('ModalOpenProjectController::openProject');
    vm.setProject.openProject().then(() => {
      vm.$uibModalInstance.close();
    }, () => {
      vm.$uibModalInstance.close();
    });
  }

  newProject() {
    const vm = this;
    vm.$log.debug('ModalOpenProjectController::newProject');
    vm.setProject.newProject().then(() => {
      vm.$uibModalInstance.close();
    }, () => {
      vm.$uibModalInstance.close();
    });

  }

  cancel() {
    const vm = this;
    vm.$log.debug('ModalOpenProjectController::cancel');
    vm.app.quit();
    vm.$uibModalInstance.close();
  }
}
