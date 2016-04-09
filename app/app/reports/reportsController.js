export class ReportsController {

  constructor($log, Project, $scope) {
    'ngInject';

    const vm = this;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;

    vm.reportTypes = vm.Project.getReportTypes();
    vm.$scope.selectedReportType = vm.Project.getReportType();

  }

  setType() {
    const vm = this;
    vm.Project.setReportType(vm.$scope.selectedReportType);
  }

}
