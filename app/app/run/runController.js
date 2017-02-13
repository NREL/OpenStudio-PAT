import {shell} from 'electron';
import jetpack from 'fs-jetpack';
import YAML from 'yamljs';

export class RunController {

  constructor($log, Project, OsServer, $scope, $interval, $uibModal, $q, toastr) {
    'ngInject';

    // ignore camelcase for this file
    /* eslint camelcase: 0 */

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

    vm.$scope.clusterData = {};
    // if remote and amazon is selected, ping cluster
    if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Amazon Cloud') {
      vm.checkIfClusterIsRunning();
      vm.$scope.clusterData = vm.Project.readClusterFile(vm.$scope.remoteSettings.aws.cluster_name);
    }

    vm.$scope.remoteTypes = vm.Project.getRemoteTypes();
    vm.$log.debug('Selected Remote Type: ', vm.$scope.remoteSettings.remoteType);
    vm.$scope.osServerVersions = vm.Project.getOsServerVersions();
    vm.$scope.serverInstanceTypes = vm.Project.getServerInstanceTypes();
    // only valid region is us-east-1 for now
    vm.$scope.awsRegions = vm.Project.getAwsRegions()[0];
    vm.$scope.clusters = vm.Project.getClusters();
    vm.$scope.awsYamlFiles = vm.Project.getAwsYamlFiles();

    // clear out aws settings if can't find file
    vm.resetAwsCredentials();

    vm.$scope.datapoints = vm.Project.getDatapoints();
    vm.$log.debug('Datapoints: ', vm.$scope.datapoints);
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

    // disabled button class
    vm.$scope.disabledButtonClass = function() {
      const disable = vm.OsServer.getRemoteStartInProgress() ? 'disabled' : '';
      return disable;
    };

    // disabled stop button class
    vm.$scope.disabledStopButtonClass = function() {
      const disable = vm.OsServer.getRemoteStopInProgress() ? 'disabled' : '';
      return disable;
    };

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


  remoteTypeChange() {
    const vm = this;
    vm.OsServer.resetSelectedServerURL();
    // if switching to remote and amazon is selected, ping cluster
    if (vm.$scope.remoteSettings.remoteType == 'Amazon Cloud'){
      vm.checkIfClusterIsRunning();
      vm.$scope.clusterData = vm.Project.readClusterFile(vm.$scope.remoteSettings.aws.cluster_name);
    }
  }

  setRunType() {
    const vm = this;
    vm.deleteResults();
    vm.$log.debug('old run type: ', vm.Project.getRunType());
    vm.$log.debug('new run type: ', vm.$scope.selectedRunType);
    vm.Project.setRunType(vm.$scope.selectedRunType);
    vm.OsServer.resetSelectedServerURL();
    vm.OsServer.setProgress(0, '');

    // if switching to remote and amazon is selected, ping cluster
    if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Amazon Cloud') {
      vm.checkIfClusterIsRunning();
    }
  }

  viewServer() {
    const vm = this;
    vm.$log.debug("in Run::viewServer");
    vm.$log.debug("selected Server URL: ", vm.OsServer.getSelectedServerURL());
    vm.shell.openExternal(vm.OsServer.getSelectedServerURL());
  }

  viewAwsConsole() {
    const vm = this;
    vm.shell.openExternal('https://console.aws.amazon.com');
  }

  selectAwsCredentials() {
    const vm = this;
    // open file, set truncatedAccessKey
    const yamlStr = vm.jetpack.read(vm.Project.getAwsDir().path(vm.$scope.remoteSettings.credentials.yamlFilename + '.yml'));
    let yamlData = YAML.parse(yamlStr);
    vm.$scope.remoteSettings.credentials.accessKey = yamlData.accessKey.substr(0,4) + '****';
    yamlData = null;
  }

  resetAwsCredentials() {
    const vm = this;
    if (vm.$scope.remoteSettings && vm.$scope.remoteSettings.credentials && vm.$scope.remoteSettings.yamlFilename){
      if (_.find(vm.$scope.awsYamlFiles, vm.$scope.remoteSettings.credentials.yamlFilename) == undefined) {
        vm.$scope.remoteSettings.credentials.accessKey = null;
        vm.$scope.remoteSettings.credentials.awsYamlFile = null;
      }
    }
  }

  newAwsCredentialsModal(){
    const vm = this;
    const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalNewAwsCredentialsController',
      controllerAs: 'modal',
      templateUrl: 'app/run/newAwsCredentials.html'
    });

    modalInstance.result.then((name, truncatedAccessKey) => {
      vm.$log.debug('In modal new credentials result function, name: ', name);
      vm.$scope.awsYamlFiles = vm.Project.getAwsYamlFiles();
      // set selected file to new file
      vm.$scope.remoteSettings.credentials.yamlFilename = name;
      vm.$scope.remoteSettings.credentials.accessKey = truncatedAccessKey;
      deferred.resolve();
    }, () => {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;
  }

  newClusterModal(){
    const vm = this;
    const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalNewClusterController',
      controllerAs: 'modal',
      templateUrl: 'app/run/newCluster.html'
    });

    modalInstance.result.then((name) => {
      vm.$log.debug('In modal new cluster result function, name: ', name);
      // get cluster files
      vm.$scope.clusters = vm.Project.getClusters();
      // select new one
      vm.$scope.remoteSettings.aws = {};
      vm.$scope.remoteSettings.aws.cluster_name = name;
      // run the onclick function to set fields in remote settings)
      vm.resetClusterSettings();
      deferred.resolve();
    }, () => {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;
  }

  checkIfClusterIsRunning(){
    const vm = this;
    // see if cluster is running; if so, set status
    if (vm.$scope.remoteSettings.aws && vm.$scope.remoteSettings.aws.cluster_name){
      vm.Project.pingCluster(vm.$scope.remoteSettings.aws.cluster_name).then((dns) => {
        // running
        vm.$scope.remoteSettings.aws.cluster_status = 'running';
        vm.$log.debug('Run::checkIfClusterIsRunning Current Cluster RUNNING!');
      }, () => {
        // terminated
        vm.$scope.remoteSettings.aws.cluster_status = 'terminated';
        vm.$log.debug("Run::checkIfClusterIsRunning Current cluster TERMINATED");
      });
    } else {
      vm.$scope.remoteSettings.aws = {};
      vm.$scope.remoteSettings.aws.cluster_status;
    }
  }

  resetClusterSettings(){
    const vm = this;
    // read in json file
    const clusterFile = vm.jetpack.read(vm.Project.getProjectDir().path(vm.$scope.remoteSettings.aws.cluster_name + '_cluster.json'), 'json');
    vm.$scope.remoteSettings.aws.connected = false;

    // see if cluster is running; if so, set status
    vm.Project.pingCluster(vm.$scope.remoteSettings.aws.cluster_name).then((dns) => {
      // running
      vm.$scope.remoteSettings.aws.cluster_status = 'running';
    }, () => {
      // terminated
      vm.$scope.remoteSettings.aws.cluster_status = 'terminated';
    });

    // set variables
    vm.$scope.remoteSettings.aws.server_instance_type = null;
    if (clusterFile.server_instance_type) {
      const match = _.find(vm.$scope.serverInstanceTypes, {name: clusterFile.server_instance_type});
      vm.$log.debug("Server match: ", match);
      if (match) {
        vm.$scope.remoteSettings.aws.server_instance_type = match;
      }
    }
    vm.$scope.remoteSettings.aws.worker_instance_type = null;
    if (clusterFile.worker_instance_type) {
      const match = _.find(vm.$scope.serverInstanceTypes, {name: clusterFile.worker_instance_type});
      vm.$log.debug('Worker match: ', match);
      if (match) {
        vm.$scope.remoteSettings.aws.worker_instance_type = match;
      }
    }
    vm.$scope.remoteSettings.aws.user_id = clusterFile.user_id ? clusterFile.user_id : null;
    vm.$scope.remoteSettings.aws.worker_node_number = clusterFile.worker_node_number ? clusterFile.worker_node_number: null;
    vm.$scope.remoteSettings.aws.aws_tags = []; // leave empty for now
    vm.$scope.remoteSettings.aws.openstudio_server_version = clusterFile.openstudio_server_version ? clusterFile.openstudio_server_version: null;

    vm.$scope.clusterData = vm.Project.readClusterFile(vm.$scope.remoteSettings.aws.cluster_name);

    vm.$log.debug('remote settings.aws reset: ', vm.$scope.remoteSettings.aws);
  }

  saveClusterToFile() {
    const vm = this;
    vm.Project.saveClusterToFile();
    vm.toastr.success('Cluster saved!');
  }

  connectAws(type) {
    // type = 'connect' or 'start' depending on whether cluster is already running or not
    const vm = this;
    if (type == 'connect') {
      // toastr
      vm.toastr.info('Connecting to the Cloud...this may take a few minutes.');
    } else {
      // toastr
      vm.toastr.info('Starting Cloud cluster...this may take up to 10 minutes', {closeButton: true, timeOut: 60000});
    }
    vm.OsServer.startServer().then( response => {
      vm.$log.debug('**connectAWS--cluster_status should be running and server status should be started: ', vm.$scope.remoteSettings.aws.cluster_status, vm.$scope.serverStatuses[vm.$scope.selectedRunType]);
      vm.toastr.clear();
      if (type == 'connect'){
        vm.toastr.success('Connected to AWS!');
        vm.$scope.clusterData = vm.Project.readClusterFile(vm.$scope.remoteSettings.aws.cluster_name);
        vm.$log.debug('clusterData: ', vm.$scope.clusterData);
      }
      else{
        vm.toastr.success('AWS server started!');
        vm.$scope.clusterData = vm.Project.readClusterFile(vm.$scope.remoteSettings.aws.cluster_name);
      }
    }, error => {
      // error toastr
      let msg = '';
      if (error == 'No Credentials') {
        msg = ': No AWS Credentials Selected';
      }
      vm.toastr.clear();
      if (type == 'connect')
        vm.toastr.error('Error connecting to AWS' + msg);
      else
        vm.toastr.error('Error starting AWS server' + msg);
    });
  }

  viewReportModal(datapoint, report) {
    const vm = this;
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

    // disconnect if connected to remote existing server
    if (vm.$scope.remoteSettings.remoteType == 'Existing Remote Server' && vm.$scope.selectedRunType.name == 'remote' && vm.$scope.serverStatuses[vm.$scope.selectedRunType.name]){
      vm.OsServer.stopServer().then(response => {
        vm.OsServer.resetSelectedServerURL();
      }, error => {
        vm.$log.debug('Couldn\'t disconnect from server: ', error);
        // reset anyway
        vm.OsServer.resetSelectedServerURL();
      });
    } else {
      // reset anyway
      vm.OsServer.resetSelectedServerURL();
    }
  }

  stopServer(force = false) {
    const vm = this;
    const deferred = vm.$q.defer();

    if(vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Amazon Cloud')
    {
      vm.toastr.info('Terminating Cloud Clusters...', {closeButton: true, timeOut: 30000});
    }

    vm.OsServer.stopServer(force).then(response => {
      vm.$log.debug('Run::stopServer response: ', response);
      vm.$log.debug('***** ', vm.$scope.selectedRunType.name, ' Server Stopped *****');
      vm.OsServer.setProgress(0, '');
      vm.toastr.clear();
      if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Existing Remote Server') {
        vm.toastr.success('PAT successfully disconnected from remote server');
      } else if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Amazon Cloud') {
        vm.toastr.success('PAT successfully terminated AWS cluster.  You should double check that the servers were terminated in the AWS Console.');
        // debug
        vm.$log.debug('***Cloud Cluster status: ', vm.$scope.remoteSettings.aws.cluster_status);
        vm.$log.debug('***remoteSettings.Aws: ', vm.$scope.remoteSettings.aws);
      } else {
        vm.toastr.success('Server stopped successfully');
      }
      deferred.resolve();
    }, response => {
      vm.OsServer.setProgress(0, 'Error Stopping Server');
      vm.$log.debug('ERROR STOPPING SERVER, ERROR: ', response);
      if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Existing Remote Server') {
        vm.toastr.error('PAT could not disconnect from remote server');
      } else if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Amazon Cloud') {
        vm.toastr.error('PAT could not terminate AWS cluster.  Check the AWS console.');
      } else {
        vm.toastr.error('Error: server could not be stopped');
      }
      deferred.reject();
    });

    return deferred.promise;
  }

  warnCloudRunning(type=null, oldValue=null) {
    const vm = this;
    const deferred = vm.$q.defer();

    // type = runtype, remotetype, or null (when called from PAT exit)

    vm.$log.debug('**** In RunController::WarnCloudRunning ****');
    // if connected to cloud
    if (((type == 'runtype' && oldValue.includes('"remote"')) || (type == 'remotetype' && oldValue.includes('Amazon Cloud')) || (type == null && oldValue == null)) && vm.$scope.remoteSettings.aws && vm.$scope.remoteSettings.aws.connected){
      // local results exist
      const modalInstance = vm.$uibModal.open({
        backdrop: 'static',
        controller: 'ModalCloudRunningController',
        controllerAs: 'modal',
        templateUrl: 'app/run/cloudRunning.html'
      });

      modalInstance.result.then(() => {
        // stop server before switching run type
        vm.stopServer().then(() => {
          deferred.resolve();
          if (type == 'runtype'){
            vm.warnBeforeDelete('runtype');
          }
          else if (type == 'remotetype'){
            vm.remoteTypeChange();
          }
        }, () => {
          deferred.reject();
          if (type == 'runtype'){
            vm.warnBeforeDelete('runtype');
          }
          else if (type == 'remotetype'){
            vm.remoteTypeChange();
          }
        });
      }, () => {
        // Modal canceled
        deferred.reject();
        if (type == 'runtype'){
          vm.warnBeforeDelete('runtype');
        }
        else if (type == 'remotetype'){
          vm.remoteTypeChange();
        }
      });
    } else {
      // no local results
      deferred.resolve();
      if (type == 'runtype'){
        vm.warnBeforeDelete('runtype');
      }
      else if (type == 'remotetype'){
        vm.remoteTypeChange();
      }
    }
    return deferred.promise;
  }

  warnBeforeDelete(type) {
    // type could be 'run' (warning before running a new analysis), or 'runtype' (warning before setting new run type)
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

    // set this to lock down runType
    vm.OsServer.setAnalysisStatus('starting');
    vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();

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
      else {
        vm.$log.debug('Sampling Method: ', vm.$scope.selectedSamplingMethod.id);
        analysis_param = vm.$scope.selectedSamplingMethod.id;
      }
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
            vm.$log.debug('**DATAPOINTS Status: ', vm.$scope.datapointsStatus);

            // download/replace out.osw (local only)
            if(vm.$scope.selectedRunType.name == 'local') {
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
              }, response2 => {
                // error in updateDatapoints
                vm.$log.debug('update datapoints error: ', response2);
              });
            } else {
              // set datapointsStatus as datapoints
              vm.$scope.datapoints = vm.$scope.datapointsStatus;
            }
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
