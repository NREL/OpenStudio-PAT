export class ModalViewReportController {

  constructor($log, $uibModalInstance, params, $scope, Project, $sce, Message) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.params = params;
    vm.$scope = $scope;
    vm.Project = Project;
    vm.$sce = $sce;
    vm.Message = Message;

    if (vm.Message.showDebug()) vm.$log.debug('in Modal View Report Controller');

    // set datapoint and report name
    vm.$scope.datapoint = vm.params.datapoint;
    vm.$scope.report = vm.params.report;

    // report URL
    vm.$scope.reportURL = vm.$sce.trustAsResourceUrl('file://' + vm.Project.getProjectLocalResultsDir().path(vm.$scope.datapoint.id, vm.$scope.report));
    if (vm.Message.showDebug()) vm.$log.debug('Report PATH: ', vm.$scope.reportURL);
  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

}
