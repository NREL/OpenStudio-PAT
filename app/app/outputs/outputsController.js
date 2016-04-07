export class OutputsController {

  constructor($log, Project, $scope) {
    'ngInject';

    const vm = this;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();

  }

}
