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
    vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
    vm.$scope.serverStatus = vm.OsServer.getServerStatus();
    vm.$log.debug('SERVER STATUS: ', vm.$scope.serverStatus);

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();
    vm.$scope.selectedSamplingMethod = vm.Project.getSamplingMethod();
    vm.$scope.disabledButtons = vm.OsServer.getDisabledButtons();
    vm.$log.debug('DISABLED BUTTONS? ', vm.$scope.disabledButtons);
    vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

    vm.$scope.datapoints = vm.OsServer.getDatapoints();

    // TODO: refresh this
    vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

    // DEBUG
    vm.$log.debug('Run Type: ', vm.$scope.selectedRunType);
    vm.$log.debug('Analysis Type: ', vm.$scope.selectedAnalysisType);
    vm.$log.debug('Sampling Method: ', vm.$scope.selectedSamplingMethod);

  }

  setRunType() {
    const vm = this;
    vm.Project.setRunType(vm.$scope.selectedRunType);
  }

  viewServer() {
    const vm = this;
    require('shell').openExternal(vm.OsServer.getServerURL());
  }

  stopServer() {
    const vm = this;
    vm.OsServer.stopServer().then(response => {
      vm.$log.debug('***** Server Stopped *****');

      vm.OsServer.setProgressAmount(0);
      vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

      vm.OsServer.setProgressMessage('');
      vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

      vm.$scope.serverStatus = vm.OsServer.getServerStatus();

    }, response => {
      vm.OsServer.setProgressMessage('Error Stopping Server');
      vm.$scope.progressMessage = vm.OsServer.getProgressMessage();
      vm.$log.debug('ERROR STOPPING SERVER, ERROR: ', response);
    });
  }

  runEntireWorkflow() {
    const vm = this;
    vm.$log.debug('***** In runController::runEntireWorkflow() *****');
    vm.toggleButtons();

    // 1: make/get OSA
    // 2: make/get zip file?

    // 3: hit PAT CLI to start server (local or remote)
    vm.OsServer.setProgressAmount('15');
    vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

    vm.OsServer.setProgressMessage('Starting server');
    vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

    vm.$log.debug('***** In runController::runEntireWorkflow() ready to start server *****');

    vm.OsServer.startServer().then(response => {
      vm.$log.debug('***** In runController::runEntireWorkflow() server started *****');
      vm.$log.debug('Start Server response: ', response);

      vm.OsServer.setProgressMessage('Server started');
      vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

      vm.$scope.serverStatus = vm.OsServer.getServerStatus();
      vm.$log.debug('Server Status: ', vm.$scope.serverStatus);

      // 4: hit PAT CLI to start run
      vm.OsServer.setProgressMessage('Starting analysis run');
      vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

      vm.OsServer.setProgressAmount(30);
      vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

      vm.$log.debug('***** In runController::runEntireWorkflow() ready to run analysis *****');

      // set analysis type (sampling method).  batch_datapoints is for manual runs only
      let analysis_param = '';
      if (vm.$scope.selectedAnalysisType == 'Manual')
        analysis_param = 'batch_datapoints';
      else
        analysis_param = vm.$scope.samplingMethod.id;

      vm.OsServer.setAnalysisStatus('starting');
      vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
      vm.OsServer.runAnalysis(analysis_param).then(response => {
        vm.$log.debug('***** In runController::runEntireWorkflow() analysis running *****');
        vm.$log.debug('Run Analysis response: ', response);
        vm.OsServer.setAnalysisStatus('in progress');
        vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();

        vm.OsServer.setProgressMessage('Analysis started');
        vm.$scope.progressMessage = vm.OsServer.getProgressMessage();

        vm.OsServer.setProgressAmount(45);
        vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

        vm.$scope.analysisID = vm.OsServer.getAnalysisID();

        // 5: until complete, hit serverAPI for updates (errors, warnings, status)
        vm.getStatus = vm.$interval(function () {

          vm.OsServer.retrieveAnalysisStatus().then(response => {
            vm.$log.debug('GET ANALYSIS STATUS RESPONSE: ', response);

            vm.$scope.analysisStatus = response.data.analysis.status;
            vm.$log.debug('analysis status: ', vm.$scope.analysisStatus);

            vm.$scope.datapoints = response.data.analysis.data_points;
            vm.$log.debug('DATAPOINTS: ', vm.$scope.datapoints);


            // workaround until the item below is fixed
            // vm.OsServer.setIsDone(true);
            // vm.isDone = vm.OsServer.getIsDone();
            //
            // vm.$scope.datapoints = response.data.analysis.data_points;
            //
            // vm.$log.debug('DATAPOINTS: ', vm.$scope.datapoints);
            // _.forEach(response.data.analysis.data_points, dp => {
            //   if (dp.status != 'completed') {
            //  vm.OsServer.setIsDone(false);
            // vm.isDone = vm.OsServer.getIsDone();
            //   }
            // });
            //
            // if (vm.isDone) {
            //   vm.OsServer.setAnalysisStatus('completed');
            //   vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
            //   // cancel loop
            //   vm.stopAnalysisStatus();
            // }

            if (response.data.analysis.status == 'completed') {
             // cancel loop
             vm.stopAnalysisStatus('completed');
            }

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
        vm.OsServer.setAnalysisStatus('error');
        vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
        vm.toggleButtons();
      });

    }, response => {
      vm.OsServer.setProgressMessage('Server Error');
      vm.$scope.progressMessage = vm.OsServer.getProgressMessage();
      vm.$log.debug('SERVER NOT STARTED, ERROR: ', response);
      vm.OsServer.setAnalysisStatus('');
      vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
      vm.toggleButtons();
    });
  }

  stopAnalysisStatus(status = 'completed') {
    const vm = this;
    vm.$log.debug('***** In runController::stopAnalysisStatus() *****');
    if (angular.isDefined(vm.getStatus)) {
      vm.$interval.cancel(vm.getStatus);
      vm.getStatus = undefined;
    }
    // set analysis status
    vm.OsServer.setAnalysisStatus(status);
    vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();

    // toggle button back to 'run' when done
    // TODO: show status as 'COMPLETED' (once it actually is)
    vm.OsServer.setProgressMessage('Analysis ' + status);
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
    vm.OsServer.setDisabledButtons(!vm.$scope.disabledButtons);
    vm.$scope.disabledButtons = vm.OsServer.getDisabledButtons();
  }

  cancelRun() {
    const vm = this;
    vm.OsServer.stopAnalysis().then(response => {
      vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
      vm.toggleButtons();
      vm.OsServer.setProgressMessage('');
      vm.$scope.progressMessage = vm.OsServer.getProgressMessage();
      vm.OsServer.setProgressAmount(0);
      vm.$scope.progressAmount = vm.OsServer.getProgressAmount();

      vm.stopAnalysisStatus('canceled');
    }, response => {
      vm.$log.debug('ERROR attempting to stop analysis / cancel run');

    });


  }


}
