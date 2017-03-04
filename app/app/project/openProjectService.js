import {remote} from 'electron';

const {dialog} = remote;

export class OpenProject {
  constructor($q, $log, $uibModal) {
    'ngInject';
    const vm = this;
    vm.$q = $q;
    vm.$log = $log;
    vm.$uibModal = $uibModal;
    vm.dialog = dialog;
    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebug = false;
  }

  openModal() {
    const vm = this;
    const deferred = vm.$q.defer();
    if (vm.showDebug) vm.$log.debug('OpenProject::openModal');

    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalOpenProjectController',
      controllerAs: 'modal',
      templateUrl: 'app/project/open_project.html'
    });

    modalInstance.result.then(() => {
      if (vm.showDebug) vm.$log.debug('in open modal result function, project should be set');
      deferred.resolve('resolved');
    }, () => {
      // Modal canceled
      deferred.reject('rejected');
    });
    return deferred.promise;
  }

}
