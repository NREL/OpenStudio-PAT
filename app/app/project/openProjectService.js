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
      vm.$log.debug('in open modal result function, project should be set');
      deferred.resolve('resolved');
    }, () => {
      // Modal canceled
      deferred.reject('rejected');
    });
    return deferred.promise;
  }

}
