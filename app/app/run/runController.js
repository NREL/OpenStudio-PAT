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
    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();
    vm.$scope.disabledButtons = false;

    // TODO: refresh this
    vm.$scope.progress_amt = 66;

  }

  setRunType() {
    const vm = this;
    vm.Project.setRunType(vm.runType);
  }

  runEntireWorkflow() {
    const vm = this;
    vm.toggleButtons();

    // 1: make/get OSA
    // 2: make/get other files?
    // 3: start server (local or remote)
    // 4: hit serverAPI to start run
    // 5: until complete, hit serverAPI for updates (errors, warnings, reports?)
    // 6: toggle button back to 'run' when done


  }

  runCloud() {
    const vm = this;
    vm.toggleButtons();
    // temp: save PAT format
    // export OSA
  }

  exportPAT() {
    const vm = this;

  }

  exportOSA() {
    const vm = this;

  }

  runSelected() {
    const vm = this;
    vm.toggleButtons();
  }

  runUpdated() {
    const vm = this;
    vm.toggleButtons();
  }

  runEnergyPlus() {
    const vm = this;
    vm.toggleButtons();
  }

  runReportingMeasures() {
    const vm = this;
    vm.toggleButtons();
  }

  toggleButtons() {
    const vm = this;
    vm.$scope.disabledButtons = !vm.$scope.disabledButtons;

  }

  cancelRun() {
    const vm = this;
    vm.toggleButtons();

  }


}
