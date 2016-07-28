export class RunController {

  constructor($log, Project, OsServer, $scope, $interval) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$interval = $interval;
    vm.$scope = $scope;
    vm.Project = Project;
    vm.OsServer = OsServer;

    vm.runTypes = vm.Project.getRunTypes();
    vm.$scope.selectedRunType = vm.Project.getRunType();
    vm.$scope.analysisID = vm.OsServer.getAnalysisID();
    vm.$scope.analysisStatus = vm.OsServer.getAnalysisStat();
    vm.$scope.serverStatus = vm.OsServer.getServerStatus();
    vm.$log.debug('SERVER STATUS: ', vm.$scope.serverStatus);

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();
    vm.$scope.disabledButtons = vm.OsServer.getDisabledButtons();
    vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

    vm.$scope.datapoints = vm.OsServer.getDatapoints();

    // TODO: refresh this
    vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

  }

  setRunType() {
    const vm = this;
    vm.Project.setRunType(vm.$scope.selectedRunType);
  }

  viewServer() {
    const vm = this;
    require('shell').openExternal(vm.OsServer.getServerURL());
  }

  runEntireWorkflow() {
    const vm = this;
    vm.$log.debug('***** In runController::runEntireWorkflow() *****');
    vm.toggleButtons();

    // 1: make/get OSA
    // 2: make/get zip file?

    vm.$scope.analysisStatus = '';

    // 3: hit PAT CLI to start server (local or remote)
    vm.OsServer.setProgressAmount('15');
    vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

    vm.OsServer.setProgressMessage('Starting server');
    vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

    vm.$log.debug('***** In runController::runEntireWorkflow() ready to start server *****');
    //vm.OsServer.startServer().then(response => { // TODO: To start local server, uncomment this part 1 of 3
      vm.$log.debug('***** In runController::runEntireWorkflow() server started *****');
      //vm.$log.debug('Start Server response: ', response); // TODO: To start local server, uncomment this part 2 of 3

      vm.OsServer.setProgressMessage('Server started');
      vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

      vm.$scope.serverStatus = vm.OsServer.getServerStatus();
      vm.$log.debug('Server Status: ', vm.$scope.serverStatus);

      // 4: hit PAT CLI to start run
      // TODO: for now, use an already-created OSA
      vm.OsServer.setProgressMessage('Starting analysis run');
      vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

      vm.OsServer.setProgressAmount(30);
      vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

      vm.$log.debug('***** In runController::runEntireWorkflow() ready to run analysis *****');
      vm.OsServer.runAnalysis().then(response => {
        vm.$log.debug('***** In runController::runEntireWorkflow() analysis running *****');
        vm.$log.debug('Run Analysis response: ', response);

        vm.OsServer.setProgressMessage('Analysis started');
        vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

        vm.OsServer.setProgressAmount(45);
        vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

        vm.$scope.analysisID = vm.OsServer.getAnalysisID();

        // 5: until complete, hit serverAPI for updates (errors, warnings, status)
        vm.getStatus = vm.$interval(function() {

          vm.OsServer.getAnalysisStatus().then( response => {
            vm.$log.debug('GET ANALYSIS STATUS RESPONSE: ', response);
            vm.$scope.analysisStatus = 'In progress';
            //vm.$scope.analysisStatus = response.data.analysis.status;
            //vm.$log.debug('analysis status: ', vm.$scope.analysisStatus);

            // workaround until the item below is fixed
            vm.OsServer.setIsDone(true);
            vm.isDone = vm.OsServer.getIsDone();

            vm.$scope.datapoints = response.data.analysis.data_points;

            vm.$log.debug('DATAPOINTS: ', vm.$scope.datapoints);
            _.forEach(response.data.analysis.data_points, dp => {
              if (dp.status != 'completed') {
             vm.OsServer.setIsDone(false);
            vm.isDone = vm.OsServer.getIsDone();
              }
            });

            if (vm.isDone) {
              vm.OsServer.setAnalysisStatus('completed');
              vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
              // cancel loop
              vm.stopAnalysisStatus();
            }

            // TODO: this doesn't work yet b/c analysis status is always completed
            //if (response.data.analysis.status == 'completed') {
            //  // cancel loop
            //  vm.stopAnalysisStatus();
            //}

          }, response => {
            vm.$log.debug('analysis status retrieval error: ', response);
          });

        }, 20000);  // once per 20 seconds

      }, response => {
        // analysis not started
        vm.OsServer.setProgressMessage('Analysis Error');
        vm.$scope.progressMessage = vm.OsServer.getProgressMessage();
        vm.$log.debug('ANALYSIS NOT STARTED, ERROR: ', response);
        // TODO: show status as 'ERROR'
        vm.toggleButtons();
      });

    //}, response => { // TODO: To start local server, uncomment this part 3 of 3
    //  vm.OsServer.setProgressMessage('Server Error');
    //  vm.$scope.progressMessage = vm.OsServer.getProgressMessage();
    //  vm.$log.debug('SERVER NOT STARTED, ERROR: ', response);
    //  // TODO: show status as 'ERROR'
    //  vm.toggleButtons();
    //});
  }

  stopAnalysisStatus() {
    const vm = this;
    vm.$log.debug('***** In runController::stopAnalysisStatus() *****');
    if (angular.isDefined(vm.getStatus)){
      vm.$interval.cancel(vm.getStatus);
      vm.getStatus = undefined;
    }
    // toggle button back to 'run' when done
    // TODO: show status as 'COMPLETED' (once it actually is)
    vm.OsServer.setProgressMessage('Analysis complete');
    vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

    vm.OsServer.setProgressAmount(100);
    vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

    vm.OsServer.setDisabledButtons(false);
    vm.$scope.disabledButtons = vm.OsServer.getDisabledButtons();
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
