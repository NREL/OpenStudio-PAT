/***********************************************************************************************************************
 *  OpenStudio(R), Copyright (c) 2008-2018, Alliance for Sustainable Energy, LLC. All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 *  following conditions are met:
 *
 *  (1) Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 *  disclaimer.
 *
 *  (2) Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 *  following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 *  (3) Neither the name of the copyright holder nor the names of any contributors may be used to endorse or promote
 *  products derived from this software without specific prior written permission from the respective party.
 *
 *  (4) Other than as required in clauses (1) and (2), distributions in any form of modifications or other derivative
 *  works may not use the "OpenStudio" trademark, "OS", "os", or any other confusingly similar designation without
 *  specific prior written permission from Alliance for Sustainable Energy, LLC.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 *  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER, THE UNITED STATES GOVERNMENT, OR ANY CONTRIBUTORS BE LIABLE FOR
 *  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 *  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 *  AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **********************************************************************************************************************/
import {shell} from 'electron';
import jetpack from 'fs-jetpack';
import YAML from 'yamljs';
import VersionCompare from 'version_compare';

export class RunController {

  constructor($log, Project, OsServer, $scope, $interval, $timeout, $uibModal, $q, $translate, toastr, $sce, Message) {

    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$interval = $interval;
    vm.$timeout = $timeout;
    vm.$uibModal = $uibModal;
    vm.$scope = $scope;
    vm.$q = $q;
    vm.Project = Project;
    vm.OsServer = OsServer;
    vm.toastr = toastr;
    vm.$translate = $translate;
    vm.shell = shell;
    vm.jetpack = jetpack;
    vm.VersionCompare = VersionCompare;
    vm.$sce = $sce;
    vm.Message = Message;

    vm.$scope.numberDPsToDisplay = vm.Project.getNumberDPsToDisplay();
    vm.$scope.analysisName = vm.Project.getAnalysisName();

    vm.runTypes = vm.Project.getRunTypes();
    vm.$scope.selectedRunType = vm.Project.getRunType();
    vm.$scope.analysisID = vm.Project.getAnalysisID();
    vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
    vm.$scope.serverStatuses = vm.OsServer.getServerStatuses();

    // remote settings
    vm.$scope.remoteSettings = vm.Project.getRemoteSettings();

    if (vm.Message.showDebug()) vm.$log.debug('REMOTE SETTINGS: ', vm.$scope.remoteSettings);

    vm.$scope.clusterData = {};
    vm.$scope.clusters = [];
    if (vm.$scope.selectedRunType.name == 'remote'){
      vm.$scope.clusters = vm.Project.getClusters();
    }

    // if remote and amazon is selected, ping cluster
    if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Amazon Cloud') {
      vm.checkIfClusterIsRunning();
      vm.$scope.clusterData = vm.Project.readClusterFile(vm.$scope.remoteSettings.aws.cluster_name);
    }

    // get OpenStudio Version (for defaulting AMIs) - strip out sha
    vm.package_openstudio_version = vm.OsServer.getOpenStudioVersion();
    if (vm.Message.showDebug()) vm.$log.debug('OpenStudio Version: ', vm.package_openstudio_version);
    let package_os = vm.package_openstudio_version.substring(0, vm.package_openstudio_version.lastIndexOf('.'));
    if (vm.Message.showDebug()) vm.$log.debug('PACKAGE OS VERSION: ', package_os);

    vm.$scope.osServerVersions = vm.Project.getOsServerVersions();
    if (vm.Message.showDebug()) vm.$log.debug('OpenStudio Server Versions: ', vm.$scope.osServerVersions);

    // get default AMI for this openstudio version
    vm.$scope.defaultAMI = _.find(vm.$scope.osServerVersions, {name: package_os});
    if (vm.Message.showDebug()) vm.$log.debug('DEFAULT AMI: ', vm.$scope.defaultAMI);

    // modify osServerVersions to include disable tag
    const amiMinVersion = _.head(vm.$scope.defaultAMI.name.split('-'));
    _.forEach(vm.$scope.osServerVersions, (v) => {
      v.recommend = (vm.VersionCompare.gt(_.head(v.name.split('-')), amiMinVersion)) ? ' -- Not Recommended' : '';
    });

    if (vm.Message.showDebug()) vm.$log.debug('OpenStudio Server Versions: ', vm.$scope.osServerVersions);

    vm.$scope.remoteTypes = vm.Project.getRemoteTypes();
    if (vm.Message.showDebug()) vm.$log.debug('Selected Remote Type: ', vm.$scope.remoteSettings.remoteType);

    vm.$scope.serverInstanceTypes = vm.Project.getServerInstanceTypes();
    vm.$scope.workerInstanceTypes = vm.Project.getWorkerInstanceTypes();
    // only valid region is us-east-1 for now
    vm.$scope.awsRegions = vm.Project.getAwsRegions()[0];
    vm.$scope.awsYamlFiles = vm.Project.getAwsYamlFiles();

    // clear out aws settings if can't find file
    vm.resetAwsCredentials();
    // set region if missing
    if (vm.$scope.remoteSettings.credentials) {
      vm.$scope.remoteSettings.credentials.region = vm.$scope.awsRegions;
    }

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();
    vm.$scope.selectedSamplingMethod = vm.Project.getSamplingMethod();
    vm.$scope.disabledButtons = vm.OsServer.getDisabledButtons();
    if (vm.Message.showDebug()) vm.$log.debug('DISABLED BUTTONS? ', vm.$scope.disabledButtons);
    vm.$scope.progress = vm.OsServer.getProgress();

    // DEBUG
    if (vm.Message.showDebug()) vm.$log.debug('Run Type: ', vm.$scope.selectedRunType);
    if (vm.Message.showDebug()) vm.$log.debug('Analysis Type: ', vm.$scope.selectedAnalysisType);
    if (vm.Message.showDebug()) vm.$log.debug('Sampling Method: ', vm.$scope.selectedSamplingMethod);

    vm.$scope.datapoints = vm.Project.getDatapoints();
    if (vm.Message.showDebug()) vm.$log.debug('Datapoints: ', vm.$scope.datapoints);
    vm.setUpDatapoints();
    vm.$scope.datapointsStatus = vm.OsServer.getDatapointsStatus();
    if (vm.Message.showDebug()) vm.$log.debug('SERVER STATUS for ', vm.$scope.selectedRunType.name, ': ', vm.$scope.serverStatuses[vm.$scope.selectedRunType.name]);

    // disabled button class
    vm.$scope.disabledButtonClass = function () {
      const disable = vm.OsServer.getRemoteStartInProgress() ? 'disabled' : '';
      return disable;
    };

    // disabled stop button class
    vm.$scope.disabledStopButtonClass = function () {
      const disable = vm.OsServer.getRemoteStopInProgress() ? 'disabled' : '';
      return disable;
    };

    // disabled fields
    vm.$scope.disabledFields = function () {
      return vm.OsServer.getRemoteStartInProgress() || vm.$scope.remoteSettings.aws.cluster_status == 'running';
    };

    vm.$scope.atLeastOneSelected = function () {
      return _.filter(vm.$scope.datapoints, {selected: true}).length > 0;
    };

    vm.$scope.allSelected = function () {
      return _.filter(vm.$scope.datapoints, {selected: true}).length == vm.$scope.datapoints.length;
    };

    vm.$scope.atLeastOneModified = function () {
      return _.filter(vm.$scope.datapoints, {modified: true}).length > 0;
    };

    vm.$scope.numDatapointsByType = function(type) {
      return _.filter(vm.$scope.datapoints, {status: type}).length;
    };

    vm.$scope.numDatapointsStatusByType = function(type) {
      return _.filter(vm.$scope.datapointsStatus, {status: type}).length;
    };

    vm.$scope.resultsExist = function () {
      if (vm.Message.showDebug()) vm.$log.debug('RESULTS EXIST? ', vm.Project.algorithmResultsDownloaded());
      return vm.Project.algorithmResultsDownloaded();
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
      const skipArg = '__SKIP__';
      if (item.arguments) {
        if (_.find(_.keys(item.arguments), skipArg)) {
          // found a skip..is it TRUE?
          if (item.arguments.__SKIP__ == true) {
            //if (vm.Message.showDebug()) vm.$log.debug('Found SKIP=true in item: ', item);
            isSkipped = true;
          }
        }
      }
      return !isSkipped;
    };

  }

  setAnalysisName() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug(`Setting analysis name to: ${vm.$scope.analysisName}`);
    vm.Project.setAnalysisName(vm.$scope.analysisName);
    vm.$scope.analysisName = vm.Project.getAnalysisName();
  }

  formatEplusErr(errorText) {
    const vm = this;
    let errorArr = [];
    if (errorText){
      errorArr = errorText.split('\n');
    }

    let htmlText = '';
    _.forEach(errorArr, (elem) => {
      elem = _.replace(elem, '** Warning **', '<span class="orange-button">** Warning **</span>');
      elem = _.replace(elem, '** Severe  **', '<span class="red-button">** Severe  **</span>');
      elem = _.replace(elem, '**  Fatal  **', '<span class="red-button">**  Fatal  **</span>');
      if (_.startsWith(elem, '  **   ~~~   **')){
        elem = '<span class="pad-left-5">' + elem + '</span>';
      }
      htmlText = htmlText + elem + '<br/>';
    });

    return vm.$sce.trustAsHtml(htmlText);
  }

  setUpDatapoints() {
    const vm = this;
    const alternatives = vm.Project.getDesignAlternatives();


    if (vm.$scope.selectedAnalysisType == 'Manual') {

      // if you find duplicates by name, clear everything
      let uniqDBs = _.uniqBy(vm.$scope.datapoints, 'name');
      // if (vm.Message.showDebug()) vm.$log.debug('UNIQUE DBS: ', uniqDBs);
      if (uniqDBs.length !== vm.$scope.datapoints.length) {
        if (vm.Message.showDebug()) vm.$log.debug('Datapoint duplicates found! This is caused by an older/corrupted PAT project.  To fix this issue, datapoints will be cleared.  Datapoints: ', vm.$scope.datapoints);
        vm.Project.setDatapoints([]);
        vm.$scope.datapoints = vm.Project.getDatapoints();
      }

      // ensure that current datapoints have an ID (backward compatible)
      _.forEach(vm.$scope.datapoints, (dp) => {
        if (_.isNil(dp.id)) {
          dp.id = dp.name;
        }
      });

      // ensure there is one datapoint per DA, delete datapoints not matching a DA, and reorder to match DA order
      vm.tempDPs = [];
      _.forEach(alternatives, (alt) => {
        const match = _.find(vm.$scope.datapoints, {name: alt.name});
        if (_.isUndefined(match)) {
          // add empty datapoint to array
          vm.tempDPs.push({name: alt.name, id: alt.name, run: false, modified: false});
        } else {
          // add back to array
          vm.tempDPs.push(match);
        }
      });
      // resave to datapoints
      vm.Project.setDatapoints(vm.tempDPs);
      vm.$scope.datapoints = vm.Project.getDatapoints();

      // // remove algorithmic points if there are some
      // _.forEachRight(vm.$scope.datapoints, (dp, key) => {
      //   const index = _.findIndex(alternatives, {name: dp.name});
      //   if (index == -1) {
      //     // remove
      //     vm.$scope.datapoints.splice(key, 1);
      //   }
      // });

    } else {
      // algorithmic: remove manual points if there are some
      _.forEachRight(alternatives, (alt) => {
        const index = _.findIndex(vm.$scope.datapoints, {name: alt.name});
        if (index > -1) {
          // remove
          vm.$scope.datapoints.splice(index, 1);
        }
      });
    }

    if (vm.Message.showDebug()) vm.$log.debug('Datapoints after SetUp: ', vm.$scope.datapoints);
  }

  remoteTypeChange() {
    const vm = this;
    // reset connection setting for remote type
    vm.$scope.serverStatuses.remote = 'stopped';
    vm.OsServer.resetSelectedServerURL();
    // if switching to remote and amazon is selected, ping cluster
    if (vm.$scope.remoteSettings.remoteType == 'Amazon Cloud') {
      vm.$scope.clusters = vm.Project.getClusters();
      vm.resetClusterSettings();
      vm.checkIfClusterIsRunning();
    }
  }

  setRunType() {
    const vm = this;
    vm.deleteResults();
    if (vm.Message.showDebug()) vm.$log.debug('old run type: ', vm.Project.getRunType());
    if (vm.Message.showDebug()) vm.$log.debug('new run type: ', vm.$scope.selectedRunType);
    vm.Project.setRunType(vm.$scope.selectedRunType);
    vm.OsServer.resetSelectedServerURL();
    vm.OsServer.setProgress(0, '');

    // if switching to local, reset connection setting for remote type
    vm.$scope.serverStatuses.remote = 'stopped';

    // if switching to remote and amazon is selected, ping cluster
    if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Amazon Cloud') {
      vm.$scope.clusters = vm.Project.getClusters();
      vm.resetClusterSettings();
      vm.checkIfClusterIsRunning();
    }
  }

  viewServer() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in Run::viewServer');
    if (vm.Message.showDebug()) vm.$log.debug('selected Server URL: ', vm.OsServer.getSelectedServerURL());
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
    vm.$scope.remoteSettings.credentials.accessKey = yamlData.accessKey.substr(0, 4) + '****';
    vm.$scope.remoteSettings.credentials.region = vm.$scope.awsRegions;
    yamlData = null;
  }

  resetAwsCredentials() {
    const vm = this;
    if (vm.$scope.remoteSettings && vm.$scope.remoteSettings.credentials && vm.$scope.remoteSettings.yamlFilename) {
      if (_.find(vm.$scope.awsYamlFiles, vm.$scope.remoteSettings.credentials.yamlFilename) == undefined) {
        vm.$scope.remoteSettings.credentials.accessKey = null;
        vm.$scope.remoteSettings.credentials.awsYamlFile = null;
        vm.$scope.remoteSettings.credentials.region = vm.$scope.awsRegions;
      }
    }
  }

  newAwsCredentialsModal() {
    const vm = this;
    const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalNewAwsCredentialsController',
      controllerAs: 'modal',
      templateUrl: 'app/run/newAwsCredentials.html'
    });

    modalInstance.result.then((data) => {
      if (vm.Message.showDebug()) vm.$log.debug('In modal new credentials result function, name: ', data[0], ' key: ', data[1]);
      vm.$scope.awsYamlFiles = vm.Project.getAwsYamlFiles();
      // set selected file to new file
      vm.$scope.remoteSettings.credentials.yamlFilename = data[0];
      vm.$scope.remoteSettings.credentials.accessKey = data[1];
      vm.$scope.remoteSettings.credentials.region = vm.awsRegions;
      deferred.resolve();
    }, () => {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;
  }

  newClusterModal() {
    const vm = this;
    const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalNewClusterController',
      controllerAs: 'modal',
      templateUrl: 'app/run/newCluster.html'
    });

    modalInstance.result.then((name) => {
      if (vm.Message.showDebug()) vm.$log.debug('In modal new cluster result function, name: ', name);
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

  osaErrorsModal(errors) {
    const vm = this;
    // const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalOsaErrorsController',
      controllerAs: 'modal',
      templateUrl: 'app/run/osaErrors.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            errors: errors
          };
        }
      }
    });

    // modalInstance.result.then(() => {
    //   deferred.resolve('resolved');
    // });
    // return deferred.promise;
  }

  // types:  'osm, results'
  largeDownloadModal(type) {
    const vm = this;
    const deferred = vm.$q.defer();

    if (vm.Message.showDebug()) vm.$log.debug('in Large Download Modal');
    if (vm.Message.showDebug()) vm.$log.debug(vm.$scope.datapoints.length, vm.$scope.numberDPsToDisplay);

    if (vm.$scope.datapoints.length > vm.$scope.numberDPsToDisplay){
      // large download
      const modalInstance = vm.$uibModal.open({
        backdrop: 'static',
        controller: 'ModalLargeDownloadController',
        controllerAs: 'modal',
        templateUrl: 'app/run/largeDownload.html'
      });

      modalInstance.result.then(() => {
        deferred.resolve('resolve');
        // download
        if (type === 'osm'){
          // osm only
          vm.downloadAllOSMs();
        } else {
          // all results
          vm.downloadAllResults();
        }
      }, () => {
        // Modal canceled
        deferred.reject('rejected');
      });
    } else {
      // not too large download
      if (type === 'osm'){
        // osm only
        vm.downloadAllOSMs();
      } else {
        // all results
        vm.downloadAllResults();
      }
    }

    return deferred.promise;
  }

  checkIfClusterIsRunning() {
    const vm = this;
    // reset to terminated (while cluster is checked)
    vm.$scope.remoteSettings.aws.cluster_status = '';
    // see if cluster is running; if so, set status
    if (vm.$scope.remoteSettings.aws && vm.$scope.remoteSettings.aws.cluster_name) {
      vm.Project.pingCluster(vm.$scope.remoteSettings.aws.cluster_name).then(() => {
        // running
        vm.$scope.remoteSettings.aws.cluster_status = 'running';
        if (vm.Message.showDebug()) vm.$log.debug('Run::checkIfClusterIsRunning Current Cluster RUNNING!');
      }, () => {
        // terminated
        vm.$scope.remoteSettings.aws.cluster_status = 'terminated';
        vm.$scope.remoteSettings.aws.connected = false;
        vm.$scope.serverStatuses[vm.$scope.selectedRunType.name] == 'stopped';
        vm.$log.info('Run::checkIfClusterIsRunning Current cluster TERMINATED');

      });
    } else {
      vm.$scope.remoteSettings.aws = {};
      vm.$scope.remoteSettings.aws.cluster_status;
    }
  }

  resetClusterSettings() {
    const vm = this;

    // read in json file
    if (vm.jetpack.exists(vm.Project.getProjectDir().path(vm.$scope.remoteSettings.aws.cluster_name + '_cluster.json'), 'json')) {
      const clusterFile = vm.jetpack.read(vm.Project.getProjectDir().path(vm.$scope.remoteSettings.aws.cluster_name + '_cluster.json'), 'json');
      if (vm.Message.showDebug()) vm.$log.debug('clusterFile data: ', clusterFile);
      vm.$scope.remoteSettings.aws.connected = false;

      // see if cluster is running; if so, set status
      vm.Project.pingCluster(vm.$scope.remoteSettings.aws.cluster_name).then(() => {
        // running
        vm.$scope.remoteSettings.aws.cluster_status = 'running';
      }, () => {
        // terminated
        vm.$scope.remoteSettings.aws.cluster_status = 'terminated';
      });

      if (vm.$scope.remoteSettings.aws.cluster_name) {
        vm.$scope.clusterData = vm.Project.readClusterFile(vm.$scope.remoteSettings.aws.cluster_name);
      } else {
        vm.$scope.clusterData = {};
      }

      // set variables
      vm.$scope.remoteSettings.aws.server_instance_type = '';
      if (vm.Message.showDebug()) vm.$log.debug('serverinstancetypes: ', vm.$scope.serverInstanceTypes);
      if (clusterFile.server_instance_type) {
        const match = _.find(vm.$scope.serverInstanceTypes, {name: clusterFile.server_instance_type});
        if (vm.Message.showDebug()) vm.$log.debug('Server match: ', match);
        if (match) {
          vm.$scope.remoteSettings.aws.server_instance_type = match;
        }
      }
      vm.$scope.remoteSettings.aws.worker_instance_type = '';
      if (vm.Message.showDebug()) vm.$log.debug('workerinstancetypes: ', vm.$scope.workerInstanceTypes);
      if (clusterFile.worker_instance_type) {
        const match = _.find(vm.$scope.workerInstanceTypes, {name: clusterFile.worker_instance_type});
        if (vm.Message.showDebug()) vm.$log.debug('Worker match: ', match);
        if (match) {
          vm.$scope.remoteSettings.aws.worker_instance_type = match;
        }
      }
      vm.$scope.remoteSettings.aws.user_id = clusterFile.user_id ? clusterFile.user_id : '';
      vm.$scope.remoteSettings.aws.worker_node_number = clusterFile.worker_node_number ? clusterFile.worker_node_number : 0;
      vm.$scope.remoteSettings.aws.aws_tags = []; // leave empty for now
      if (vm.Message.showDebug()) vm.$log.debug('server versions: ', vm.$scope.osServerVersions);

      vm.$scope.remoteSettings.aws.openstudio_server_version = vm.$scope.defaultAMI;  // default AMI selection based on openstudio version
      if (clusterFile.openstudio_server_version) {
        const match = _.find(vm.$scope.osServerVersions, {name: clusterFile.openstudio_server_version});
        if (vm.Message.showDebug()) vm.$log.debug('AMI match: ', match);
        if (match) {
          vm.$scope.remoteSettings.aws.openstudio_server_version = match;
        }
      }
    }
    else {
      // clear out
      if (vm.Message.showDebug()) vm.$log.debug('clearing out remote settings');
      vm.$scope.remoteSettings.aws = {
        connected: false,
        cluster_name: '',
        server_instance_type:'',
        worker_instance_type: '',
        user_id: '',
        worker_node_number: 0,
        aws_tags: []
      };
      vm.$scope.remoteSettings.aws.openstudio_server_version = vm.$scope.defaultAMI;

    }

    if (vm.Message.showDebug()) vm.$log.debug('remote settings.aws reset: ', vm.$scope.remoteSettings.aws);
  }

  saveClusterToFile() {
    const vm = this;
    vm.Project.saveClusterToFile();
    vm.$translate('toastr.clusterSaved').then(translation => {
      vm.toastr.success(translation);
    });
  }

  connectAws(type) {
    // type = 'connect' or 'start' depending on whether cluster is already running or not
    const vm = this;
    // always save cluster to file before connecting
    vm.saveClusterToFile();
    if (vm.checkConnectionParams()){
      if (type == 'connect') {
        // toastr
        vm.$translate('toastr.connectingCloud').then(translation => {
          vm.toastr.info(translation);
        });
      } else {
        // toastr
        vm.$translate('toastr.startingCloud').then(translation => {
          vm.toastr.info(translation, {closeButton: true, timeOut: 600000});
        });
      }
      vm.OsServer.startServer().then(() => {
        vm.$log.info('**connectAWS--cluster_status should be running and server status should be started: ', vm.$scope.remoteSettings.aws.cluster_status, vm.$scope.serverStatuses[vm.$scope.selectedRunType.name]);
        if (vm.Message.showDebug()) vm.$log.debug('REMOTE SETTINGS: ', vm.$scope.remoteSettings);
        vm.toastr.clear();
        if (type == 'connect') {
          vm.$translate('toastr.connectedCloud').then(translation => {
            vm.toastr.success(translation);
          });
          vm.$scope.clusterData = vm.Project.readClusterFile(vm.$scope.remoteSettings.aws.cluster_name);
          if (vm.Message.showDebug()) vm.$log.debug('clusterData: ', vm.$scope.clusterData);
        }
        else {
          vm.$translate('toastr.startedCloud').then(translation => {
            vm.toastr.success(translation);
          });
          vm.$scope.clusterData = vm.Project.readClusterFile(vm.$scope.remoteSettings.aws.cluster_name);
        }
      }, error => {
        // error toastrs
        vm.toastr.clear();
        if (error == 'No Credentials') {
          if (type == 'connect'){
            vm.$translate('toastr.connectCredentialsError').then(translation => {
              vm.toastr.error(translation);
            });
          } else {
            vm.$translate('toastr.startCredentialsError').then(translation => {
              vm.toastr.error(translation);
            });
          }
        }
        else {
          if (type == 'connect')
            vm.$translate('toastr.connectedCloudError').then(translation => {
              vm.toastr.error(translation);
            });
          else {
            vm.$translate('toastr.startedCloudError').then(translation => {
              vm.toastr.error(translation);
            });
          }
        }

      });
    }
  }

  checkConnectionParams() {
    const vm = this;
    let proceed = true;
    // check for yml file
    if (_.isNil(vm.$scope.remoteSettings.credentials.yamlFilename) || vm.$scope.remoteSettings.credentials.yamlFilename == '') {
      proceed = false;
      vm.$translate('toastr.noYaml').then(translation => {
        vm.toastr.error(translation);
      });
    }
    // check for cluster selection
    if (_.isNil(vm.$scope.remoteSettings.aws.cluster_name) || vm.$scope.remoteSettings.aws.cluster_name == ''){
      proceed = false;
      vm.$translate('toastr.noCluster').then(translation => {
        vm.toastr.error(translation);
      });
    }

    return proceed;
  }

  connectRemoteServer(){
    const vm = this;

    vm.OsServer.startServer().then(response => {
      if (vm.Message.showDebug()) vm.$log.debug('Run::connectRemoteServer response: ', response);
      vm.OsServer.setProgress(0, '');
      vm.toastr.clear();
      if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Existing Remote Server') {
        vm.$translate('toastr.connectedRemote').then(translation => {
          vm.toastr.success(translation);
        });
      }
    }, error => {
      vm.toastr.clear();
      vm.$translate('toastr.connectedRemoteError').then(translation => {
        vm.toastr.error(translation);
      });
      if (vm.Message.showDebug()) vm.$log.debug('Connection error: ', error);
    });
  }


  viewReportModal(datapoint, report) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In viewReport- ', report);
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

      let delta = Math.abs(end - start) / 1000;

      // calculate (and subtract) whole hours
      let hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;
      hours = (hours < 10) ? '0' + hours : hours;

      // calculate (and subtract) whole minutes
      let minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;
      minutes = (minutes < 10) ? '0' + minutes : minutes;

      // what's left is seconds
      let seconds = delta % 60;  // in theory the modulus is not required
      seconds = (seconds < 10) ? '0' + seconds : seconds;

      result = hours + ':' + minutes + ':' + seconds;

    }
    return result;
  }

  calculateWarnings(dp) {
    let warn = undefined;
    if (_.get(dp, 'steps')) {
      warn = 0;
      _.forEach(dp.steps, step => {
        if (_.get(step, 'result.step_warnings'))
          warn = warn + step.result.step_warnings.length;
      });
    }
    return warn;
  }

  calculateErrors(dp) {
    let err = undefined;
    if (_.get(dp, 'steps')) {
      err = 0;
      _.forEach(dp.steps, step => {
        if (_.get(step, 'result.step_errors'))
          err = err + step.result.step_errors.length;
      });
    }
    return err;
  }

  calculateNAs(dp) {
    let nas = undefined;
    if (_.get(dp, 'steps')) {
      nas = 0;
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
    if (vm.$scope.remoteSettings.remoteType == 'Existing Remote Server' && vm.$scope.selectedRunType.name == 'remote' && vm.$scope.serverStatuses[vm.$scope.selectedRunType.name]) {
      vm.OsServer.stopServer().then(() => {
        vm.OsServer.resetSelectedServerURL();
      }, error => {
        if (vm.Message.showDebug()) vm.$log.debug('Couldn\'t disconnect from server: ', error);
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

    if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Amazon Cloud') {
      vm.$translate('toastr.terminatingCluster').then(translation => {
        vm.toastr.info(translation, {closeButton: true, timeOut: 30000});
      });
    }

    vm.OsServer.stopServer(force).then(response => {
      if (vm.Message.showDebug()) vm.$log.debug('Run::stopServer response: ', response);
      if (vm.Message.showDebug()) vm.$log.debug('***** ', vm.$scope.selectedRunType.name, ' Server Stopped *****');
      vm.OsServer.setProgress(0, '');
      vm.toastr.clear();
      if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Existing Remote Server') {
        vm.$translate('toastr.disconnectedRemote').then(translation => {
          vm.toastr.success(translation);
        });
      } else if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Amazon Cloud') {
        vm.$translate('toastr.terminatedCluster').then(translation => {
          vm.toastr.success(translation);
        });
        // debug
        vm.$log.info('***Cloud Cluster status: ', vm.$scope.remoteSettings.aws.cluster_status);
        vm.$log.info('***remoteSettings.Aws: ', vm.$scope.remoteSettings.aws);
      } else {
        vm.$translate('toastr.stoppedServer').then(translation => {
          vm.toastr.success(translation);
        });
      }
      deferred.resolve();
    }, response => {
      vm.OsServer.setProgress(0, 'Error Stopping Server');
      vm.$log.error('ERROR STOPPING SERVER, ERROR: ', response);
      if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Existing Remote Server') {
        vm.$translate('toastr.disconnectedRemoteError').then(translation => {
          vm.toastr.error(translation);
        });
      } else if (vm.$scope.selectedRunType.name == 'remote' && vm.$scope.remoteSettings.remoteType == 'Amazon Cloud') {
        vm.$translate('toastr.terminatedClusterError').then(translation => {
          vm.toastr.error(translation);
        });
      } else {
        vm.$translate('toastr.stoppedServerError').then(translation => {
          vm.toastr.error(translation);
        });
      }
      deferred.reject();
    });

    return deferred.promise;
  }

  // display warning message when Starting a Cloud connection
  warnAws() {
    const vm = this;
    const deferred = vm.$q.defer();

    if (vm.Message.showDebug()) vm.$log.debug('**** In RunController::WarnAws ****');

    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalAwsWarningController',
      controllerAs: 'modal',
      templateUrl: 'app/run/awsWarning.html'
    });

    modalInstance.result.then(() => {
      vm.connectAws('start');
      deferred.resolve();
    }, () => {

      deferred.reject();

    });

    return deferred.promise;
  }

  warnCloudRunning(type = null, oldValue = null) {
    const vm = this;
    const deferred = vm.$q.defer();

    // type = runtype, remotetype, or null (when called from PAT exit)

    if (vm.Message.showDebug()) vm.$log.debug('**** In RunController::WarnCloudRunning ****');
    // if connected to cloud
    if (((type == 'runtype' && oldValue.includes('"remote"')) || (type == 'remotetype' && oldValue.includes('Amazon Cloud')) || (type == null && oldValue == null)) && vm.$scope.remoteSettings.aws && vm.$scope.remoteSettings.aws.connected) {
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
          if (type == 'runtype') {
            vm.warnBeforeDelete('runtype');
          }
          else if (type == 'remotetype') {
            vm.remoteTypeChange();
          }
        }, () => {
          deferred.reject();
          if (type == 'runtype') {
            vm.warnBeforeDelete('runtype');
          }
          else if (type == 'remotetype') {
            vm.remoteTypeChange();
          }
        });
      }, () => {
        // Modal canceled
        deferred.reject();
        if (type == 'runtype') {
          vm.warnBeforeDelete('runtype');
        }
        else if (type == 'remotetype') {
          vm.remoteTypeChange();
        }
      });
    } else {
      // no local results
      deferred.resolve();
      if (type == 'runtype') {
        vm.warnBeforeDelete('runtype');
      }
      else if (type == 'remotetype') {
        vm.remoteTypeChange();
      }
    }

    return deferred.promise;
  }

  warnBeforeDelete(type) {
    // type could be 'run' (warning before running a new analysis), or 'runtype' (warning before setting new run type)
    // warn if datapoints have run (updated_at)
    const vm = this;
    const deferred = vm.$q.defer();

    if (vm.Message.showDebug()) vm.$log.debug('**** In RunController::WarnBeforeDeleting ****, type: ', type);

    let warn = false;

    // any datapoints have already run?
    _.forEach(vm.$scope.datapoints, (dp) => {
      if ((type == 'selected' && dp.selected && dp.updated_at) || (type != 'selected' && dp.updated_at)){
        warn = true;
      }
    });

    if (warn) {
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
          vm.runWorkflow();
        } else if (type == 'runtype') {
          vm.setRunType();
        } else if (type == 'selected') {
          vm.runWorkflow(true);
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
        vm.runWorkflow();
      } else if (type == 'runtype') {
        vm.setRunType();
      } else if (type == 'selected') {
        if (vm.Message.showDebug()) vm.$log.debug('type == selected');
        vm.runWorkflow(true);
      }

    }
    return deferred.promise;
  }

  deleteResults(selectedOnly = false) {
    const vm = this;

    if (selectedOnly) {
      _.forEach(vm.$scope.datapoints, (dp) => {
        if (dp.selected && dp.id) {
          vm.jetpack.remove(vm.Project.getProjectLocalResultsDir().path(dp.id));
        }
      });
    } else {
      // remove localResults contents
      vm.jetpack.dir(vm.Project.getProjectLocalResultsDir().path(), {empty: true});
    }

    // reset analysis
    vm.OsServer.resetAnalysis(selectedOnly);
    vm.$scope.analysisID = vm.Project.getAnalysisID();
    vm.$scope.datapoints = vm.Project.getDatapoints();
    if (vm.Message.showDebug()) vm.$log.debug('DATAPOINTS AFTER DELETE: ', vm.$scope.datapoints);
    vm.$scope.datapointsStatus = vm.OsServer.getDatapointsStatus();
  }

  runWorkflow(selectedOnly = false) {
    const vm = this;

    vm.OsServer.setProgress(0, '');

    // set this to lock down runType
    vm.OsServer.setAnalysisStatus('starting');
    vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();

    if (vm.Message.showDebug()) vm.$log.debug('***** In runController::runWorkflow() *****');
    if (vm.Message.showDebug()) vm.$log.debug('selectedOnly? ', selectedOnly);
    vm.toggleButtons();

    // 1: delete old results (this sets modified flag)
    vm.deleteResults(selectedOnly);

    vm.OsServer.setProgress(20, 'Creating Analysis Zip');
    // 2: make OSA and zip file
    vm.Project.exportOSA(selectedOnly).then(() => {

      // 3: hit PAT CLI to start server (local or remote)
      vm.OsServer.setProgress(30, 'Starting server');

      if (vm.Message.showDebug()) vm.$log.debug('***** In runController::runWorkflow() ready to start server *****');

      vm.OsServer.startServer().then(response => {

        vm.OsServer.setAnalysisRunningFlag(true);
        if (vm.Message.showDebug()) vm.$log.debug('***** In runController::runWorkflow() server started *****');
        vm.$log.info('Start Server response: ', response);

        vm.OsServer.setProgress(40, 'Server started');

        // 4: hit PAT CLI to start run
        vm.OsServer.setProgress(50, 'Starting analysis run');

        if (vm.Message.showDebug()) vm.$log.debug('***** In runController::runWorkflow() ready to run analysis *****');

        // set analysis type (sampling method).  batch_datapoints is for manual only
        let analysis_param = '';
        if (vm.$scope.selectedAnalysisType == 'Manual')
          analysis_param = 'batch_datapoints';
        else {
          if (vm.Message.showDebug()) vm.$log.debug('Sampling Method: ', vm.$scope.selectedSamplingMethod.id);
          analysis_param = vm.$scope.selectedSamplingMethod.id;
        }
        vm.OsServer.setAnalysisStatus('starting');
        vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();

        vm.OsServer.runAnalysis(analysis_param).then(response => {
          if (vm.Message.showDebug()) vm.$log.debug('***** In runController::runWorkflow() analysis running *****');
          vm.$log.info('Run Analysis response: ', response);
          vm.OsServer.setAnalysisStatus('in progress');
          vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
          vm.OsServer.setProgress(45, 'Analysis started');

          vm.$scope.analysisID = vm.Project.getAnalysisID();

          // 5: until complete, hit serverAPI for updates (errors, warnings, status)
          vm.getStatus = true;
          const runLoop = () => {
            vm.analysisLoop().finally(() => {
              if (vm.getStatus) {
                vm.$timeout(runLoop, 20000);
              }
            });
          };
          // initial call to runLoop
          runLoop();

        }, response => {
          // analysis not started
          vm.OsServer.setProgress(45, 'Analysis Error');

          vm.$log.error('ANALYSIS NOT STARTED, ERROR: ', response);
          vm.OsServer.setAnalysisStatus('error');
          vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
          vm.OsServer.setAnalysisRunningFlag(false);
          vm.toggleButtons();

        });

      }, response => {
        vm.OsServer.setProgress(25, 'Server Error');
        vm.$log.error('SERVER NOT STARTED, ERROR: ', response);
        vm.OsServer.setAnalysisStatus('');
        vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
        vm.OsServer.setAnalysisRunningFlag(false);
        vm.toggleButtons();

      });
    }, (errors) => {
      // error exporting OSA
      vm.OsServer.setProgress(25, 'OSA export error');
      vm.$log.error('Error(s) exporting OSA');
      vm.OsServer.setAnalysisStatus('');
      vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
      vm.toggleButtons();

      // display errors in modal
      vm.osaErrorsModal(errors);

    });
  }



  analysisLoop() {
    const vm = this;
    const deferred = vm.$q.defer();
    if (vm.Message.showDebug()) vm.$log.debug('***** In runController::analysisLoop() *****');
    vm.OsServer.retrieveAnalysisStatus().then(response => {
      if (vm.Message.showDebug()) vm.$log.debug('GET ANALYSIS STATUS RESPONSE: ', response);
      vm.OsServer.setAnalysisStatus(response.data.analysis.status);
      vm.$scope.analysisStatus = response.data.analysis.status;
      if (vm.Message.showDebug()) vm.$log.debug('analysis status: ', vm.$scope.analysisStatus);
      vm.OsServer.setDatapointsStatus(response.data.analysis.data_points);
      vm.$scope.datapointsStatus = vm.OsServer.getDatapointsStatus();
      if (vm.Message.showDebug()) vm.$log.debug('**DATAPOINTS Status: ', vm.$scope.datapointsStatus);

      vm.OsServer.updateDatapoints().then(response2 => {
        vm.$log.info('update datapoints succeeded: ', response2);
        // refresh datapoints
        vm.$scope.datapoints = vm.Project.getDatapoints();
        vm.$scope.datapointsStatus = vm.OsServer.getDatapointsStatus();
        // download reports
        vm.OsServer.downloadReports().then(() => {
          if (vm.Message.showDebug()) vm.$log.debug('downloaded all available reports');
          // refresh datapoints again
          vm.$scope.datapoints = vm.Project.getDatapoints();
          vm.$log.info('datapoints after download: ', vm.$scope.datapoints);
        }, response3 => {
          // error in downloadReports
          vm.$log.error('download reports error: ', response3);
          deferred.reject(response3);
        });

      }, response2 => {
        // error in updateDatapoints
        vm.$log.error('update datapoints error: ', response2);
        deferred.reject(response2);
      });

      if (response.data.analysis.status == 'completed') {
        // cancel loop
        vm.stopAnalysisStatus('completed');

        // download result csvs if algorithmic
        if (vm.$scope.selectedAnalysisType == 'Algorithmic') vm.OsServer.downloadAlgorithmResults();
      }

      // resolve
      deferred.resolve();

    }, response => {
      vm.$log.error('analysis status retrieval error: ', response);
      deferred.reject();
    });

    return deferred.promise;
  }

  stopAnalysisStatus(status = 'completed') {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('***** In runController::stopAnalysisStatus() *****');
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

  downloadAlgorithmResults() {
    const vm = this;
    vm.OsServer.downloadAlgorithmResults().then( () => {
      vm.$translate('toastr.downloadedResults').then(translation => {
        vm.toastr.success(translation);
      });
    }, () => {
      vm.$translate('toastr.downloadedResultsError').then(translation => {
        vm.toastr.error(translation);
      });
    });
  }

  viewAlgorithmResults() {
    const vm = this;
    vm.shell.openItem(vm.Project.getAlgorithmResultsPath());
  }

  downloadResults(datapoint) {
    const vm = this;

    vm.OsServer.downloadResults(datapoint).then(() => {
      vm.$translate('toastr.downloadedResults').then(translation => {
        vm.toastr.success(translation);
      });
    }, () => {
      vm.$translate('toastr.downloadedResultsError').then(translation => {
        vm.toastr.error(translation);
      });
    });
  }

  downloadAllResults() {
    const vm = this;

    vm.$translate('toastr.downloadingResultsWarning').then(translation => {
      vm.toastr.info(translation, {timeOut: 120000});
    });

    vm.OsServer.downloadAllResults().then(() => {
      vm.toastr.clear();
      vm.$translate('toastr.downloadedAllResults').then(translation => {
        vm.toastr.success(translation);
      });
    }, () => {
      vm.toastr.clear();
      vm.$translate('toastr.downloadedAllResultsError').then(translation => {
        vm.toastr.error(translation);
      });
    });
  }

  downloadOSM(datapoint) {
    const vm = this;
    vm.OsServer.downloadOSM(datapoint).then(() => {
      vm.$translate('toastr.downloadedOsm').then(translation => {
        vm.toastr.success(translation);
      });
    }, () => {
      vm.$translate('toastr.downloadedOsmError').then(translation => {
        vm.toastr.error(translation);
      });
    });
  }

  downloadAllOSMs() {
    const vm = this;
    vm.$translate('toastr.downloadingOSMsWarning').then(translation => {
      vm.toastr.info(translation, {timeOut: 120000});
    });

    vm.OsServer.downloadAllOSMs().then(() => {
      vm.toastr.clear();
      vm.$translate('toastr.downloadedAllOsm').then(translation => {
        vm.toastr.success(translation);
      });
    }, () => {
      vm.toastr.clear();
      vm.$translate('toastr.downloadedAllOsmError').then(translation => {
        vm.toastr.error(translation);
      });
    });
  }

  clearDatapoint(datapoint) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In clear datapoint');
    // clear from disk
    vm.jetpack.remove(vm.Project.getProjectLocalResultsDir().path(datapoint.id));
    // clear from PAT
    const index = _.findIndex(vm.$scope.datapoints, {id: datapoint.id});
    if (index != -1) {
      // datapoint found, delete
      vm.$scope.datapoints.splice(index, 1);
      vm.Project.setModified(true);
    } else {
      vm.$log.error('Datapoint ID not found in array');
    }
  }

  clearAllDatapoints() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In clear ALL Datapoints');
    // force delete everything in localResults folder in case there is leftover junk not associated with current datapoints
    vm.jetpack.dir(vm.Project.getProjectLocalResultsDir().path(), {empty: true});

    // this will take care of correctly resetting datapoints (manual vs algorithmic)
    vm.deleteResults();
  }

  exportPAT() {
    // this saves PAT
    // TODO: deprecate.
    const vm = this;
    vm.Project.exportPAT();
  }

  toggleButtons() {
    const vm = this;
    vm.OsServer.setDisabledButtons(!vm.$scope.disabledButtons);
    vm.$scope.disabledButtons = vm.OsServer.getDisabledButtons();
  }

  selectAll(toggle = true) {
    // toggle is value to set 'selected' key
    const vm = this;
    _.forEach(vm.$scope.datapoints, (dp) => {
      dp.selected = toggle;
    });
  }

  cancelRun() {
    const vm = this;
    vm.OsServer.stopAnalysis().then(() => {
      //vm.$scope.analysisStatus = vm.OsServer.getAnalysisStatus();
      vm.toggleButtons();
      vm.OsServer.setProgress(0, '');

      vm.stopAnalysisStatus('canceled');
    }, () => {
      vm.$log.error('ERROR attempting to stop analysis / cancel run');
      vm.$log.info('Resetting buttons anyway');
      // reset anyway
      vm.toggleButtons();
      vm.OsServer.setProgress(0, '');

    });
  }

}
