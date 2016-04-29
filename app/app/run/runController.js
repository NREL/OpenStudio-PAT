export class RunController {

  constructor($log, Project, OsServer, $scope) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;
    vm.OsServer = OsServer;

    vm.runTypes = vm.Project.getRunTypes();
    vm.$scope.selectedRunType = vm.Project.getRunType();

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();
    vm.$scope.disabledButtons = false;
    vm.$scope.progressMessage = '';

    // TODO: refresh this
    vm.$scope.progressAmount = 0;

  }

  setRunType() {
    const vm = this;
    vm.Project.setRunType(vm.$scope.selectedRunType);
  }

  runEntireWorkflow() {
    const vm = this;
    vm.toggleButtons();

    // 1: make/get OSA
    // 2: make/get other files?

    // 3: (if needed) hit PAT CLI to start server (local or remote)
    vm.status = vm.OsServer.getServerStatus();
    if (vm.status != 'started') {
      vm.$scope.progressAmount = '15';
      vm.$scope.progressMessage = 'Starting server';
      // todo: .then() here?
      vm.response = vm.OsServer.startServer(vm.$scope.selectedRunType);

      if (vm.response) {
        vm.$scope.progressMessage = 'Server started';

        //// 4: hit PAT CLI to start run
        //vm.$scope.progressMessage = 'Starting analysis run';
        //vm.run_status = vm.OsServer.runAnalysis();
        //if (vm.run_status) {
        //  vm.$scope.progressMessage = 'Analysis started'
        //
        //  // 5: until complete, hit serverAPI for updates (errors, warnings, status)
        //  // vm.analysis_status = vm.OsServer.getAnalysisStatus();
        //
        //  // 6: toggle button back to 'run' when done
        //}
        //else {
        //  // analysis not started
        //  vm.$scope.progressMessage = 'Analysis not started - Error';
        //  // TODO: display error message
        //  vm.toggleButtons();
        //}

      } else {
        vm.$scope.progressMessage = 'Server Error';
        // ERROR
        //TODO: display error message somewhere (toaster?)
        vm.toggleButtons();
      }
    }
  }

  exportPAT() {
    const vm = this;
    vm.Project.exportPAT();

  }

  exportOSA() {
    const vm = this;
    // TODO: implement
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
    vm.$scope.progressMessage = '';
    vm.$scope.progressAmount = 0;

  }


}
