import jetpack from 'fs-jetpack';
import {remote} from 'electron';
import fs from 'fs';

const {dialog} = remote;

export class OpenProject {
  constructor($q, $log, $uibModal, SetProject) {
    'ngInject';
    const vm = this;
    vm.$q = $q;
    vm.$log = $log;
    vm.$uibModal = $uibModal;
    vm.fs = fs;
    vm.jetpack = jetpack;
    vm.dialog = dialog;
    vm.setProject = SetProject;
  }

  newProject() {
    const vm = this;
    vm.$log.debug('newProject');
    vm.setProject.newProject();
  }

  openProject() {
    const vm = this;
    vm.$log.debug('openProject');
    vm.setProject.openProject();
  }

  cancel() {
    const vm = this;
    vm.$log.debug('cancel');
  }

  openModal() {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.$log.debug('OpenProject::openModal');

    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalOpenProjectController',
      controllerAs: 'modal',
      templateUrl: 'app/project/open_project.html'
    });

    modalInstance.result.then(() => {
      deferred.resolve('resolved');
    }, () => {
      // Modal canceled
      deferred.reject('rejected');
    });
    return deferred.promise;
  }

}
