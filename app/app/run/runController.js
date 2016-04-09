export class RunController {

  constructor($log, Project, $scope) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;
    vm.runTypes = ['Run Locally', 'Run on Cloud'];
    vm.runTypes = vm.Project.getRunTypes();
    vm.$scope.runType = vm.Project.getRunType();

  }

  setRunType() {
    const vm = this;
    vm.Project.setRunType(vm.runType);
  }



}
