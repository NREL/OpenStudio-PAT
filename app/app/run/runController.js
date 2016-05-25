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
    vm.$scope.analysisID = vm.OsServer.getAnalysisID();
    vm.$scope.analysisStatus = '';

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
    // 2: make/get zip file?

    // 3: hit PAT CLI to start server (local or remote)
    vm.$scope.progressAmount = '15';
    vm.$scope.progressMessage = 'Starting server';

    vm.OsServer.startServer().then(response => {
      vm.$log.debug("Start Server response: ", response);
      vm.$scope.progressMessage = 'Server started';

      // 4: hit PAT CLI to start run
      // TODO: for now, use an already-created OSA
      vm.$scope.progressMessage = 'Starting analysis run';
      vm.$scope.progressAmount = 30;
      vm.OsServer.runAnalysis().then(response => {
        vm.$log.debug('Run Analysis response: ', response);
        vm.$scope.progressMessage = 'Analysis started';
        vm.$scope.progressAmount = 45;
        vm.$scope.analysisID = vm.OsServer.getAnalysisID();

        // 5: until complete, hit serverAPI for updates (errors, warnings, status)
        // TODO: this disconnects dev tools...look into it!
        //while (vm.$scope.analysisStatus != 'completed' || vm.$scope.analysisStatus != 'error') {
        //  // get analysis status
          vm.OsServer.getAnalysisStatus().then( response => {
             vm.$log.debug('GET ANALYSIS STATUS RESPONSE: ', response);
             vm.$scope.analysisStatus = response.data.analysis.status;
             vm.$log.debug('analysis status: ', vm.$scope.analysisStatus);

             // 6: toggle button back to 'run' when done
             // TODO: show status as 'COMPLETED' (once it actually is)
             vm.$scope.progressMessage = 'Analysis complete';
             vm.$scope.progressAmount = 100;
             vm.toggleButtons();
          });
        //}



      }, response => {
        // analysis not started
        vm.$scope.progressMessage = 'Analysis Error';
        vm.$log.debug("ANALYSIS NOT STARTED, ERROR: ", response);
        // TODO: show status as 'ERROR'
        vm.toggleButtons();

      });

    }, response => {

      vm.$scope.progressMessage = 'Server Error';
      vm.$log.debug("SERVER NOT STARTED, ERROR: ", response);
      // TODO: show status as 'ERROR'
      vm.toggleButtons();


    });
  }

  exportPAT() {
    const vm = this;
    vm.Project.exportPAT();

  }

  exportOSA() {
    const vm = this;
    vm.Project.exportOSA();
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
