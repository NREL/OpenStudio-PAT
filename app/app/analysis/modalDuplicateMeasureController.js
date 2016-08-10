export class ModalDuplicateMeasureController {

  constructor($log, $uibModalInstance, $scope, measure, Project) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;
    vm.measure = measure;
  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

}
