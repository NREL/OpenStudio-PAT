import {shell} from 'electron';
import jetpack from 'fs-jetpack';

export class RunController {

  constructor($log, Project, OsServer, $scope, $interval, $uibModal, $q, toastr) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$interval = $interval;
    vm.$uibModal = $uibModal;
    vm.$scope = $scope;
    vm.$q = $q;
    vm.Project = Project;
    vm.OsServer = OsServer;
    vm.toastr = toastr;
    vm.shell = shell;
    vm.jetpack = jetpack;

    vm.runTypes = vm.Project.getRunTypes();
    // TEMPORARY:  only show local server
    //vm.runTypes = _.filter(vm.runTypes, {name: 'local'});
    vm.$scope.selectedRunType = vm.Project.getRunType();
    vm.$scope.analysisID = vm.Project.getAnalysisID();
    vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
    vm.$scope.serverStatuses = vm.OsServer.getServerStatuses();

    // remote settings
    vm.$scope.remoteSettings = vm.Project.getRemoteSettings();
    vm.$log.debug("REMOTE SETTINGS: ", vm.$scope.remoteSettings);
    vm.$scope.remoteTypes = vm.Project.getRemoteTypes();
    vm.$log.debug('Selected Remote Type: ', vm.$scope.remoteSettings.remoteType);

    vm.$scope.datapoints = vm.Project.getDatapoints();
    vm.$log.debug('Datapoints: ', vm.$scope.datapoints);
    // TODO: do we still need datapointsStatus?
    vm.$scope.datapointsStatus = vm.OsServer.getDatapointsStatus();
    vm.$log.debug('SERVER STATUS for ', vm.$scope.selectedRunType.name, ': ', vm.$scope.serverStatuses[vm.$scope.selectedRunType.name]);

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();
    vm.$scope.selectedSamplingMethod = vm.Project.getSamplingMethod();
    vm.$scope.disabledButtons = vm.OsServer.getDisabledButtons();
    vm.$log.debug('DISABLED BUTTONS? ', vm.$scope.disabledButtons);
    vm.$scope.progress = vm.OsServer.getProgress();

    // DEBUG
    vm.$log.debug('Run Type: ', vm.$scope.selectedRunType);
    vm.$log.debug('Analysis Type: ', vm.$scope.selectedAnalysisType);
    vm.$log.debug('Sampling Method: ', vm.$scope.selectedSamplingMethod);

    // TROUBLESHOOTING PANEL STATUS
    vm.$scope.dev = {open: true};

    // don't show out.osw and objectives.json reports in dropdown
    vm.$scope.filterReports = function (item) {
      return (item.type == 'Report' && item.attachment_file_name != 'out.osw' && item.attachment_file_name != 'objectives.json');
    };

    // don't show skipped measures in datapoint accordion
    vm.$scope.filterSkipped = function (item) {
      let isSkipped = false;
      let firstArg = undefined;
      const skipArg = '__SKIP__';
      if (item.arguments){
        if (_.find(_.keys(item.arguments)), skipArg){
          // found a skip..is it TRUE?
          if (item.arguments['__SKIP__'] == true){
            vm.$log.debug('Found SKIP=true in item: ', item);
            isSkipped = true;
          }
        }
      }
      return !isSkipped;
    };

  }

  setRunType() {
    // TODO: warn users that datapoints will be deleted first
    const vm = this;
    vm.deleteResults();
    vm.$log.debug('old run type: ', vm.Project.getRunType());
    vm.$log.debug('new run type: ', vm.$scope.selectedRunType);
    vm.Project.setRunType(vm.$scope.selectedRunType);
    vm.OsServer.resetSelectedServerURL();

  }

  viewServer() {
    const vm = this;
    vm.shell.openExternal(vm.OsServer.getSelectedServerURL());
  }

  viewReportModal(datapoint, report) {
    const vm = this;
    // TODO: implement
    vm.$log.debug('In viewReport- ', report);
    const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalViewReportController',
      controllerAs: 'modal',
      templateUrl: 'app/run/viewReport.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            datapoint: datapoint,
            report: report
          };
        }
      }
    });

    modalInstance.result.then(() => {
      deferred.resolve('resolved');
    }, () => {
      // Modal canceled
      deferred.reject('rejected');
    });
    return deferred.promise;
  }

  getRunTime(startStr, endStr) {
    const vm = this;
    let result = '';
    if (startStr && endStr) {
      const start = vm.Project.makeDate(startStr);
      const end = vm.Project.makeDate(endStr);

      const diff = end - start;
      let sec = parseInt((end - start) / 1000);
      sec = (sec < 10) ? '0' + sec : sec;
      let min = parseInt(sec / 60);
      min = (min < 10) ? '0' + min : min;
      let hours = parseInt(min / 60);
      hours = (hours < 10) ? '0' + hours : hours;
      result = hours + ":" + min + ":" + sec;
    }
    return result;
  }

  calculateWarnings(dp) {
    let warn = 0;
    if (dp && dp.steps) {
      _.forEach(dp.steps, step => {
        if (step.result && step.result.step_warnings)
          warn = warn + step.result.step_warnings.length;
      });
    }
    return warn;
  }

  calculateErrors(dp) {
    let err = 0;
    if (dp && dp.steps) {
      _.forEach(dp.steps, step => {
        if (step.result && step.result.step_errors)
          err = err + step.result.step_errors.length;
      });
    }
    return err;
  }

  calculateNAs(dp) {
    let nas = 0;
    if (dp && dp.steps) {
      _.forEach(dp.steps, step => {
        if (step.step_result == 'NotApplicable') {
          nas = nas + 1;
        }
      });
    }
    return nas;
  }

  resetRemoteServerURL() {
    const vm = this;
    vm.OsServer.stopServer().then(response => {
      vm.OsServer.resetSelectedServerURL();
    }, error => {
      vm.$log.debug('Couldn\'t disconnect from server');
      // reset anyway
      vm.OsServer.resetSelectedServerURL();
    });
  }

  stopServer(force = false) {
    const vm = this;
    vm.OsServer.stopServer(force).then(response => {
      vm.$log.debug('***** ', vm.$scope.selectedRunType.name, ' Server Stopped *****');
      vm.OsServer.setProgress(0, '');
      //vm.$scope.serverStatuses = vm.OsServer.getServerStatus();
      if (vm.$scope.selectedRunType.name != 'local' && vm.$scope.remoteSettings.remoteType == 'Existing Remote Server') {
        vm.toastr.success('PAT successfully disconnected from remote server');
      } else {
        vm.toastr.success('Server stopped successfully');
      }

    }, response => {
      vm.OsServer.setProgress(0, 'Error Stopping Server');
      vm.$log.debug('ERROR STOPPING SERVER, ERROR: ', response);
      if (vm.$scope.selectedRunType.name != 'local' && vm.$scope.remoteSettings.remoteType == 'Existing Remote Server') {
        vm.toastr.error('PAT could not disconnect from remote server');
      } else {
        vm.toastr.error('Error: server could not be stopped');
      }
    });
  }

  // // to start server on its own
  // startServer(force = false) {
  //   const vm = this;
  //   vm.OsServer.startServer(force).then(response => {
  //     vm.$log.debug('Server Status for ', vm.$scope.selectedRunType.name, ': ', vm.$scope.serverStatuses[vm.$scope.selectedRunType.name]);
  //     if (vm.$scope.selectedRunType.name != 'local' && vm.$scope.remoteSettings.remoteType == 'Existing Remote Server') {
  //       vm.toastr.success('Connected to remote server!');
  //     } else {
  //       vm.toastr.success('Server started!');
  //     }
  //
  //   }, response => {
  //     vm.$log.debug('SERVER NOT STARTED, ERROR: ', response);
  //     if (vm.$scope.selectedRunType.name != 'local' && vm.$scope.remoteSettings.remoteType == 'Existing Remote Server') {
  //       vm.toastr.error('Error: could not connect to remote server');
  //     } else {
  //       vm.toastr.error('Error: server did not start');
  //     }
  //   });
  // }
  //
  // // check if server is alive, if so set its status to 'started', otherwise set status to 'stopped'
  // pingServer() {
  //   const vm = this;
  //   vm.OsServer.pingServer().then(response => {
  //     vm.toastr.success('Server is Alive');
  //   }, error => {
  //     vm.toastr.error('Server is Offline');
  //   });
  // }

  warnBeforeDelete(type) {
    // type could be 'run' (warning before running an new analysis), or 'runtype' (warning before setting new run type)
    const vm = this;
    const deferred = vm.$q.defer();

    vm.$log.debug('**** In RunController::WarnBeforeDeleting ****');

    const contents = vm.jetpack.find(vm.Project.getProjectLocalResultsDir().path(), {matching: '*'});
    vm.$log.debug('Local results size:', contents.length);

    if (contents.length > 0) {
      // local results exist
      const modalInstance = vm.$uibModal.open({
        backdrop: 'static',
        controller: 'ModalClearResultsController',
        controllerAs: 'modal',
        templateUrl: 'app/run/clearResults.html',
        resolve: {
          params: function () {
            return {
              type: type
            };
          }
        }
      });

      modalInstance.result.then(() => {
        // go on to run workflow
        deferred.resolve();
        if (type == 'run') {
          vm.runEntireWorkflow();
        } else if (type == 'runtype') {
          vm.setRunType();
        }

      }, () => {
        // Modal canceled
        if (type == 'runtype') {
          // reset to previous runtype
          vm.$scope.selectedRunType = vm.Project.getRunType();
        }
        deferred.reject();
      });
    } else {
      // no local results
      deferred.resolve();
      if (type == 'run') {
        vm.runEntireWorkflow();
      } else if (type == 'runtype') {
        vm.setRunType();
      }

    }

    return deferred.promise;
  }

  deleteResults() {
    const vm = this;
    // remove localResults contents
    vm.jetpack.dir(vm.Project.getProjectLocalResultsDir().path(), {empty: true});

    // reset analysis
    vm.OsServer.resetAnalysis();
    vm.$scope.analysisID = vm.Project.getAnalysisID();
    vm.$scope.datapoints = vm.Project.getDatapoints();
    vm.$scope.datapointsStatus = vm.OsServer.getDatapointsStatus();
  }

  runEntireWorkflow() {
    const vm = this;
    vm.$log.debug('***** In runController::runEntireWorkflow() *****');
    vm.toggleButtons();

    // 1: delete old results (this sets modified flag)
    vm.deleteResults();

    // 2: make OSA and zip file
    vm.exportOSA();

    // 3: hit PAT CLI to start server (local or remote)
    vm.OsServer.setProgress(15, 'Starting server');

    vm.$log.debug('***** In runController::runEntireWorkflow() ready to start server *****');

    vm.OsServer.startServer().then(response => {

      vm.OsServer.setAnalysisRunningFlag(true);
      vm.$log.debug('***** In runController::runEntireWorkflow() server started *****');
      vm.$log.debug('Start Server response: ', response);

      vm.OsServer.setProgress(30, 'Server started');

      //vm.$scope.serverStatuses = vm.OsServer.getServerStatuses();
      //vm.$log.debug('Server Statuses: ', vm.$scope.serverStatuses);

      // 4: hit PAT CLI to start run
      vm.OsServer.setProgress(40, 'Starting analysis run');

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
        vm.OsServer.setProgress(45, 'Analysis started');

        vm.$scope.analysisID = vm.Project.getAnalysisID();

        // 5: until complete, hit serverAPI for updates (errors, warnings, status)
        vm.getStatus = vm.$interval(function () {

          vm.OsServer.retrieveAnalysisStatus().then(response => {
            vm.$log.debug('GET ANALYSIS STATUS RESPONSE: ', response);
            vm.OsServer.setAnalysisStatus(response.data.analysis.status);
            vm.$scope.analysisStatus = response.data.analysis.status;
            vm.$log.debug('analysis status: ', vm.$scope.analysisStatus);
            vm.OsServer.setDatapointsStatus(response.data.analysis.data_points);
            vm.$scope.datapointsStatus = vm.OsServer.getDatapointsStatus();
            vm.$log.debug('DATAPOINTS Status: ', vm.$scope.datapointsStatus);

            // download/replace out.osw
            // Should we do this only once at the end?
            vm.OsServer.updateDatapoints().then(response2 => {
              // refresh datapoints
              vm.$scope.datapoints = vm.Project.getDatapoints();

              // download reports
              vm.OsServer.downloadReports().then(response3 => {
                vm.$log.debug('downloaded all available reports');
                // refresh datapoints again
                vm.$scope.datapoints = vm.Project.getDatapoints();
                vm.$log.debug('datapoints after download: ', vm.$scope.datapoints);

              }, response3 => {
                // error in downloadReports
                vm.$log.debug('download reports error: ', response3);
              });
              vm.$log.debug('update datapoints succeeded: ', response2);
              if (response.data.analysis.status == 'completed') {
                // cancel loop
                vm.stopAnalysisStatus('completed');
              }

            }, response2 => {
              // error in updateDatapoints
              vm.$log.debug('update datapoints error: ', response2);
            });

          }, response => {
            vm.$log.debug('analysis status retrieval error: ', response);
          });

        }, 20000);  // once per 20 seconds

      }, response => {
        // analysis not started
        vm.OsServer.setProgress(45, 'Analysis Error');

        vm.$log.debug('ANALYSIS NOT STARTED, ERROR: ', response);
        vm.OsServer.setAnalysisStatus('error');
        vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
        vm.OsServer.setAnalysisRunningFlag(false);
        vm.toggleButtons();

      });

    }, response => {
      vm.OsServer.setProgress(25, 'Server Error');
      vm.$log.debug('SERVER NOT STARTED, ERROR: ', response);
      vm.OsServer.setAnalysisStatus('');
      vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
      vm.OsServer.setAnalysisRunningFlag(false);
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
    vm.OsServer.setProgress(100, 'Analysis ' + status);

    vm.OsServer.setDisabledButtons(false);
    vm.$scope.disabledButtons = vm.OsServer.getDisabledButtons();

    vm.OsServer.setAnalysisRunningFlag(false);

  }

  downloadResults(datapoint) {
    const vm = this;
    vm.OsServer.downloadResults(datapoint).then(() => {
      vm.toastr.success('Results downloaded successfully!');
    }, () => {
      vm.toastr.error('Error downloading Results zip file');
    });
  }

  downloadAllResults() {
    const vm = this;
    vm.OsServer.downloadAllResults().then(() => {
      vm.toastr.success('All Results downloaded successfully!');
    }, () => {
      vm.toastr.error('Error downloading Results zip files');
    });
  }

  downloadOSM(datapoint) {
    const vm = this;
    vm.OsServer.downloadOSM(datapoint).then(() => {
      vm.toastr.success('OSM downloaded successfully!');
    }, () => {
      vm.toastr.error('Error downloading OSM');
    });
  }

  downloadAllOSMs() {
    const vm = this;
    vm.OsServer.downloadAllOSMs().then(() => {
      vm.toastr.success('All OSMs downloaded successfully!');
    }, () => {
      vm.toastr.error('Error downloading OSMs');
    });
  }

  clearDatapoint(datapoint) {
    const vm = this;
    vm.$log.debug('In clear datapoint');
    // clear from disk
    vm.jetpack.remove(vm.Project.getProjectLocalResultsDir().path(datapoint.id));
    // clear from PAT
    const index = _.findIndex(vm.$scope.datapoints, {id: datapoint.id});
    if (index != -1) {
      // datapoint found, delete
      vm.$scope.datapoints.splice(index, 1);
      vm.Project.setModified(true);
    } else {
      vm.$log.debug('Datapoint ID not found in array');
    }
  }

  clearAllDatapoints() {
    const vm = this;
    vm.$log.debug('In clear ALL Datapoints');
    // force delete everything in localResults folder in case there is leftover junk not associated with current datapoints
    vm.jetpack.dir(vm.Project.getProjectLocalResultsDir().path(), {empty: true});

    vm.Project.setDatapoints([]);
    vm.$scope.datapoints = vm.Project.getDatapoints();
  }

  exportPAT() {
    // this saves PAT
    // TODO: deprecate.
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
    // TODO
  }

  runUpdated() {
    const vm = this;
    vm.toggleButtons();
    // TODO
  }

  runEnergyPlus() {
    const vm = this;
    vm.toggleButtons();
    // TODO
  }

  runReportingMeasures() {
    const vm = this;
    vm.toggleButtons();
    // TODO
  }

  toggleButtons() {
    const vm = this;
    vm.OsServer.setDisabledButtons(!vm.$scope.disabledButtons);
    vm.$scope.disabledButtons = vm.OsServer.getDisabledButtons();
  }

  cancelRun() {
    const vm = this;
    vm.OsServer.stopAnalysis().then(response => {
      //vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
      vm.toggleButtons();
      vm.OsServer.setProgress(0, '');

      vm.stopAnalysisStatus('canceled');
    }, response => {
      vm.$log.debug('ERROR attempting to stop analysis / cancel run');

    });
  }

}
