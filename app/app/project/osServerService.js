import jetpack from 'fs-jetpack';
import {remote} from 'electron';
const {app} = remote;
import path from 'path';
import os from 'os';
import AdmZip from 'adm-zip';
import YAML from 'yamljs';

export class OsServer {
  constructor($q, $http, $log, $uibModal, Project, DependencyManager) {
    'ngInject';

    const vm = this;
    vm.Project = Project;
    vm.$log = $log;
    vm.$uibModal = $uibModal;
    vm.$q = $q;
    vm.$http = $http;
    vm.jetpack = jetpack;
    vm.AdmZip = AdmZip;
    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebug = false;

    // set number of workers
    vm.numCores = os.cpus().length;
    vm.numWorkers = 1;
    if (vm.numCores) {
      vm.numWorkers = vm.numCores == 1 ? 1 : (vm.numCores - 1);
    }
    vm.$log.info('Number of cores: ', vm.numCores);
    vm.$log.info('Number of workers set to: ', vm.numWorkers);

    // to run meta_cli
    vm.exec = require('child_process').exec;

    vm.serverStatuses = {local: 'stopped', remote: 'stopped'};  // started, stopped, error?
    vm.analysisStatus = '';  // '', started, in progress, completed, error
    vm.analysisRunningFlag = false;
    vm.progress = {amount: 0, message: ''};
    vm.isDone = true;
    vm.analysisChangedFlag = false;

    // store these in Project service so they can be exported
    // vm.analysisID = null;
    // vm.datapoints = [];
    vm.datapointsStatus = [];

    vm.disabledButtons = false;  // display run or cancel button

    vm.localServerURL = 'http://localhost:8080';  // default URL.  will be reset when starting server
    vm.selectedServerURL = vm.resetSelectedServerURL();

    const src = jetpack.cwd(app.getPath('userData'));
    if (vm.showDebug) vm.$log.debug('src.path(): ', src.path());

    vm.cliPath = DependencyManager.getPath("PAT_OS_CLI_PATH");
    vm.metaCLIPath = DependencyManager.getPath("PAT_OS_META_CLI_PATH");
    vm.mongoPath = DependencyManager.getPath("PAT_MONGO_PATH");
    vm.mongoDirPath = path.dirname(vm.mongoPath);
    vm.openstudioBindingsPath = DependencyManager.getPath("PAT_OS_BINDING_PATH");
    vm.openstudioBindingsDirPath = path.dirname(vm.openstudioBindingsPath);
    vm.rubyPath = DependencyManager.getPath("PAT_RUBY_PATH");
    vm.energyplusEXEPath = DependencyManager.getPath("ENERGYPLUS_EXE_PATH");

    // server start in progress?
    // local
    vm.serverStartInProgress = false;
    vm.serverStartDeferred = vm.$q.defer();
    // local stop
    vm.serverStopInProgress = false;
    // remote
    vm.remoteStartInProgress = false;
    vm.remoteStartDeferred = vm.$q.defer();
    // remote stop
    vm.remoteStopInProgress = false;


  }

  isServerReady() {
    const vm = this;
    return vm.serverStartDeferred.promise;
  }

  serverProgressStart() {
    const vm = this;
    vm.serverStartInProgress = true;
    vm.serverStartDeferred = vm.$q.defer();
  }

  serverProgressStop(type, message) {
    const vm = this;
    vm.serverStartInProgress = false;
    if (type == 'resolve') {
      vm.serverStartDeferred.resolve(message);
    } else {
      //reject
      vm.serverStartDeferred.reject(message);
    }
  }

  getServerStartInProgressFlag() {
    const vm = this;
    return vm.serverStartInProgress;
  }

  remoteProgressStart() {
    const vm = this;
    vm.remoteStartInProgress = true;
    vm.remoteStartDeferred = vm.$q.defer();
  }

  remoteProgressStop(type, message) {
    const vm = this;
    vm.remoteStartInProgress = false;
    if (type == 'resolve') {
      vm.remoteStartDeferred.resolve(message);
    } else {
      //reject
      vm.remoteStartDeferred.reject(message);
    }
  }

  isRemoteReady() {
    const vm = this;
    return vm.remoteStartDeferred.promise;
  }

  getRemoteStartInProgress() {
    const vm = this;
    return vm.remoteStartInProgress;
  }

  getRemoteStopInProgress() {
    const vm = this;
    return vm.remoteStopInProgress;
  }

  setRemoteStopInProgress(value) {
    const vm = this;
    vm.remoteStopInProgress = value;
  }

  openServerToolsModal() {
    const vm = this;
    const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalServerToolsController',
      controllerAs: 'modal',
      templateUrl: 'app/project/serverTools.html'

    });

    modalInstance.result.then(() => {
      deferred.resolve();
    }, () => {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;

  }

  resetAnalysis(selectedOnly = false) {
    const vm = this;
    vm.setAnalysisChangedFlag(false);
    // reset analysis ID
    vm.Project.setAnalysisID(null);

    if (vm.Project.getAnalysisType() == 'Manual') {
      // reset certain fields on datapoint
      const datapoints = vm.Project.getDatapoints();
      _.forEach(datapoints, (dp, index) => {
        if (!selectedOnly || dp.selected) {
          const newDP = {name: dp.name, run: false, modified: false, selected: dp.selected};
          datapoints[index] = newDP;
        }
      });
      vm.Project.setDatapoints(datapoints);
    } else {
      vm.Project.setDatapoints([]);
    }
    vm.setDatapointsStatus([]);

    vm.Project.setModified(true);

  }

  getNumWorkers() {
    const vm = this;
    return vm.numWorkers;
  }

  getSelectedServerURL() {
    const vm = this;
    return vm.selectedServerURL;
  }

  setSelectedServerURL(url) {
    const vm = this;
    vm.selectedServerURL = url;
  }

  resetSelectedServerURL() {
    const vm = this;
    if (vm.Project.getRunType().name == 'local') {
      vm.selectedServerURL = vm.localServerURL;
    } else {
      // set to URL in remoteSettings (external or cloud)
      const rs = vm.Project.getRemoteSettings();
      vm.$log.info('REMOTE SETTINGS: ', rs);
      if (rs.remoteType == 'Existing Remote Server') {
        vm.selectedServerURL = rs.remoteServerURL;
      } else {
        vm.selectedServerURL = null;
      }

    }
    vm.$log.info('Selected Server URL set to: ', vm.selectedServerURL);
  }

  getServerStatus(env) {
    const vm = this;
    return vm.serverStatuses[env];
  }

  setServerStatus(env, status) {
    const vm = this;
    vm.serverStatuses[env] = status;
  }

  getServerStatuses() {
    const vm = this;
    return vm.serverStatuses;
  }

  getAnalysisStatus() {
    const vm = this;
    return vm.analysisStatus;
  }

  setAnalysisStatus(analysisStatus) {
    const vm = this;
    vm.analysisStatus = analysisStatus;
  }

  getProgress() {
    const vm = this;
    return vm.progress;
  }

  setProgress(amount, message) {
    const vm = this;
    vm.progress.amount = amount;
    vm.progress.message = message;
  }

  getIsDone() {
    const vm = this;
    return vm.isDone;
  }

  setIsDone(isDone) {
    const vm = this;
    vm.isDone = isDone;
  }

  getAnalysisChangedFlag() {
    const vm = this;
    return vm.analysisChangedFlag;
  }

  setAnalysisChangedFlag(flag) {
    const vm = this;
    vm.analysisChangedFlag = flag;
  }

  setAnalysisRunningFlag(flag) {
    const vm = this;
    vm.analysisRunningFlag = flag;
  }

  getAnalysisRunningFlag() {
    const vm = this;
    return vm.analysisRunningFlag;
  }

  // short analysis status
  getDatapointsStatus() {
    const vm = this;
    return vm.datapointsStatus;
  }

  setDatapointsStatus(datapoints) {
    const vm = this;
    vm.datapointsStatus = datapoints;
    vm.Project.setModified(true);
  }

  getDisabledButtons() {
    const vm = this;
    return vm.disabledButtons;
  }

  setDisabledButtons(isDisabled) {
    const vm = this;
    vm.disabledButtons = isDisabled;
  }

  getServerType() {
    const vm = this;
    return vm.serverType;
  }

  setServerType(type) {
    const vm = this;
    vm.serverType = type;
  }

  // ping server
  pingServer() {
    const vm = this;
    const serverType = vm.Project.getRunType().name;

    if (serverType == 'local') {
      // in case server didn't shut down correctly before
      vm.getLocalServerUrlFromFile();
    }

    vm.$log.info('Pinging ', serverType, ' server to see if it is alive: ', vm.selectedServerURL);
    const deferred = vm.$q.defer();
    const url = vm.selectedServerURL + '/status.json';
    vm.$log.info('Ping Server URL: ', url);
    vm.$http.get(url).then(response => {
      // send json to run controller
      if (vm.showDebug) vm.$log.debug('PING: Server is started');
      if (vm.showDebug) vm.$log.debug('status JSON response: ', response);
      vm.setServerStatus(serverType, 'started');
      deferred.resolve(response);

    }, response => {
      vm.$log.error('PING:  Server is not started');
      vm.setServerStatus(serverType, 'stopped');
      deferred.reject(response);
    });

    return deferred.promise;
  }

  // start server (remote or local) if force != null, start the specified server (local only, remote can't be force-started unless 'Run on Cloud' is selected)
  startServer(force = null) {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('***** In osServerService::startServer() *****');
    const deferred = vm.$q.defer();

    const serverType = vm.Project.getRunType().name;
    vm.$log.info('START SERVER...SERVER TYPE: ', serverType);
    vm.$log.info('SERVER STATUS: ', vm.getServerStatus(serverType));

    if ((vm.getServerStatus(serverType) != 'started') || force) {
      if (force == 'local' || serverType == 'local') {
        // local server
        // check if server is currently starting
        if (vm.serverStartInProgress) {
          if (vm.showDebug) vm.$log.debug('***Server is already in the process of starting...waiting on serverStartDeferred to resolve');
          vm.isServerReady().then((response) => {
            if (vm.showDebug) vm.$log.debug('Server is started!');
            deferred.resolve(response);
          }, (error) => {
            vm.$log.error('ERROR in start local server: ', error);
            deferred.reject(error);
          });
        } else {

          // **always attempt to stop the server first in case local_config file or server.pid already exists**
          // stopServer always resolves
          if (vm.showDebug) vm.$log.debug('force stopping server just in case...');
          vm.stopServer('local').then(() => {
            // start server (reset promise)
            if (vm.showDebug) vm.$log.debug('***Server start not already in progress...start server');
            vm.serverProgressStart();
            vm.localServer().then(response => {
              if (vm.showDebug) vm.$log.debug('localServer promise resolved.  Server should have started');
              vm.setServerStatus(serverType, 'started');
              // server start no longer in progress
              vm.serverProgressStop('resolve', response);
              deferred.resolve(response);
            }, error => {
              vm.$log.error('ERROR in start local server: ', error);
              vm.serverProgressStop('reject', error);
              deferred.reject(error);
            });
          });
        }
      }
      else {
        // remote server
        vm.$log.info('Starting Remote Server');
        if (vm.remoteStartInProgress) {
          if (vm.showDebug) vm.$log.debug('***Remote Server is already in the process of starting...waiting on serverStartDeferred to resolve');
          vm.isRemoteReady().then((response) => {
            if (vm.showDebug) vm.$log.debug('Server is started!');
            deferred.resolve(response);
          }, (error) => {
            vm.$log.error('ERROR in start local server: ', error);
            deferred.reject(error);
          });
        } else {
          vm.remoteProgressStart();
          vm.remoteServer().then(response => {
            if (vm.showDebug) vm.$log.debug('OsServerService::StartServer: setting server to started');
            vm.setServerStatus(serverType, 'started');
            vm.remoteProgressStop('resolve', response);
            deferred.resolve(response);
          }, error => {
            vm.$log.error('ERROR in start remote server: ', error);
            vm.remoteProgressStop('reject', error);
            deferred.reject(error);
          });
        }
      }
    } else {
      // server already started
      if (vm.showDebug) vm.$log.debug('Server already started!');
      deferred.resolve('Server Already Started');
    }

    return deferred.promise;
  }

  remoteServer() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('***** In osServerService::remoteServer() *****');
    const deferred = vm.$q.defer();
    const serverType = vm.Project.getRunType().name;

    // check remote type
    if (vm.Project.getRemoteSettings().remoteType == 'Existing Remote Server') {
      // Existing Remote Server
      // ping URL to see if started
      vm.pingServer().then(response => {
        if (vm.showDebug) vm.$log.debug('Existing Remote Server Connected');
        deferred.resolve(response);
      }, error => {
        vm.$log.error('Cannot connect to Existing Remote Server at specified URL: ', error);
        deferred.reject(error);
      });
    } else {
      // amazon cloud
      vm.remoteSettings = vm.Project.getRemoteSettings();
      vm.$log.info('Starting Amazon Cloud');
      vm.$log.info('in OSServerService::remoteServer, remoteSettings: ', vm.remoteSettings);

      if (!vm.remoteSettings.credentials || !vm.remoteSettings.credentials.yamlFilename) {
        // must select credentials
        deferred.reject('No Credentials');
      } else {
        // initialize potentially missing variables
        vm.remoteSettings.aws.server = vm.remoteSettings.aws.server ? vm.remoteSettings.aws.server : {};
        vm.remoteSettings.aws.server.dns = vm.remoteSettings.aws.server.dns ? vm.remoteSettings.aws.server.dns : null;

        // see if cluster is running
        vm.Project.pingCluster(vm.remoteSettings.aws.cluster_name).then((dns) => {
          // cluster running, connect with DNS
          vm.remoteSettings.aws.cluster_status = 'running';  // cluster is running
          vm.$log.info('Connecting to existing cluster running at: ', dns);
          vm.startServerCommand = '\"' + vm.rubyPath + '\" \"' + vm.metaCLIPath + '\"' + ' start_remote  --debug -p \"' + vm.Project.projectDir.path() + '\" ' + vm.Project.fixURL(dns);
          vm.$log.info('Start Server Command: ', vm.startServerCommand);

          const child = vm.exec(vm.startServerCommand,
            (error, stdout, stderr) => {
              if (vm.showDebug) vm.$log.debug('exit code: ', child.exitCode);
              if (vm.showDebug) vm.$log.debug('child: ', child);
              if (vm.showDebug) vm.$log.debug('stdout: ', stdout);
              if (vm.showDebug) vm.$log.debug('stderr: ', stderr);

              if (child.exitCode == 0) {
                // SUCCESS
                if (vm.showDebug) vm.$log.debug('CLOUD SERVER CONNECTION SUCCESS');

                // set vm.selectedServerURL
                // check what serverType is before setting selectedServerURL
                vm.$log.info('Current run type set to: ', vm.Project.getRunType().name);
                if (vm.Project.getRunType().name == 'remote') {
                  vm.$log.info('Setting selectedServerURl to: ', vm.Project.fixURL(dns));
                  vm.setSelectedServerURL(vm.Project.fixURL(dns));
                }

                vm.remoteSettings.aws.connected = true; // PAT is connected to the cluster
                deferred.resolve(child);

              } else {
                vm.$log.error('CLOUD SERVER CONNECTION ERROR');
                if (error !== null) {
                  console.log('exec error:', error);
                }
                // delete cluster file
                vm.jetpack.remove(vm.Project.getProjectClustersDir().path(vm.remoteSettings.aws.cluster_name));
                deferred.reject(error);
              }
            });

          console.log(`Child pid: ${child.pid}`);

          child.on('close', (code, signal) => {
            console.log(`child closed due to receipt of signal ${signal} (exit code ${code})`);
          });

          child.on('disconnect', (code, signal) => {
            console.log(`child disconnect due to receipt of signal ${signal} (exit code ${code})`);
          });

          child.on('exit', (code, signal) => {
            console.log(`child exited due to receipt of signal ${signal} (exit code ${code})`);
            if (code == 0) {
              vm.$log.info('Server connected');
              if (vm.Project.getRunType().name == 'remote') {
                vm.$log.info('Setting selectedServerURL to: ', vm.Project.fixURL(dns));
                vm.setSelectedServerURL(vm.Project.fixURL(dns));
              }
              vm.remoteSettings.aws.connected = true; // PAT is connected to the cluster
              deferred.resolve('success');
            } else {
              vm.$log.error('Server failed to connect');
              deferred.reject('error');
            }
            return deferred.promise;
          });

          child.on('error', (code, signal) => {
            console.log(`child error due to receipt of signal ${signal} (exit code ${code})`);
          });

          child.on('message', (code, signal) => {
            console.log(`child message due to receipt of signal ${signal} (exit code ${code})`);
          });

        }, () => {
          // cluster terminated or new, connect with file

          // make sure file is saved
          vm.Project.saveClusterToFile();
          if (vm.showDebug) vm.$log.debug('Connecting to terminated/new cluster');
          vm.startServerCommand = '\"' + vm.rubyPath + '\" \"' + vm.metaCLIPath + '\"' + ' start_remote  --debug -p \"' + vm.Project.projectDir.path() + '\" -s \"' + vm.Project.projectDir.path(vm.remoteSettings.aws.cluster_name + '_cluster.json') + '\" aws';
          vm.$log.info('Start Server Command: ', vm.startServerCommand);

          const envCopy = vm.setAwsEnvVars();

          const child = vm.exec(vm.startServerCommand, {env: envCopy},
            (error, stdout, stderr) => {
              if (vm.showDebug) vm.$log.debug('exit code: ', child.exitCode);
              if (vm.showDebug) vm.$log.debug('child: ', child);
              if (vm.showDebug) vm.$log.debug('stdout: ', stdout);
              if (vm.showDebug) vm.$log.debug('stderr: ', stderr);

              if (child.exitCode == 0) {
                // SUCCESS
                if (vm.showDebug) vm.$log.debug('CLOUD SERVER START SUCCESS');

                // get DNS and set server
                const newDNS = vm.Project.getDNSFromFile(vm.remoteSettings.aws.cluster_name);
                vm.connectCluster();
                if (vm.Project.getRunType().name == 'remote') {
                  if (vm.showDebug) vm.$log.debug('Setting selectedServerURL to : ', vm.Project.fixURL(newDNS));
                  vm.setSelectedServerURL(vm.Project.fixURL(newDNS));
                }
                deferred.resolve(child);

              } else {
                vm.$log.error('CLOUD SERVER START ERROR');
                if (error !== null) {
                  console.log('exec error:', error);
                }
                vm.jetpack.remove(vm.Project.getProjectClustersDir().path(vm.remoteSettings.aws.cluster_name));
                deferred.reject(error);
              }
            });

          console.log(`Child pid: ${child.pid}`);

          child.on('close', (code, signal) => {
            console.log(`child closed due to receipt of signal ${signal} (exit code ${code})`);
          });

          child.on('disconnect', (code, signal) => {
            console.log(`child disconnect due to receipt of signal ${signal} (exit code ${code})`);
          });

          child.on('exit', (code, signal) => {
            console.log(`child exited due to receipt of signal ${signal} (exit code ${code})`);
            if (code == 0) {
              if (vm.showDebug) vm.$log.debug('Server started');
              // get DNS and set server
              const newDNS = vm.Project.getDNSFromFile(vm.remoteSettings.aws.cluster_name);
              if (vm.Project.getRunType().name == 'remote') {
                vm.$log.info('Setting selectedServerURL to :', vm.Project.fixURL(newDNS));
                vm.setSelectedServerURL(vm.Project.fixURL(newDNS));
              }
              vm.connectCluster();
              deferred.resolve('success');
            } else {
              vm.$log.error('Server failed to start');
              deferred.reject('error');
            }
            return deferred.promise;
          });

          child.on('error', (code, signal) => {
            console.log(`child error due to receipt of signal ${signal} (exit code ${code})`);
          });

          child.on('message', (code, signal) => {
            console.log(`child message due to receipt of signal ${signal} (exit code ${code})`);
          });
        });
      }
    }

    return deferred.promise;
  }

  setAwsEnvVars() {
    const vm = this;
    vm.remoteSettings = vm.Project.getRemoteSettings();
    // need aws credentials as ENV vars
    if (vm.showDebug) vm.$log.debug('PROCESS.ENV: ', process.env);
    // need to set all other vars from process.env
    const envCopy = angular.copy(process.env);

    // open file, set truncatedAccessKey
    const yamlStr = vm.jetpack.read(vm.Project.getAwsDir().path(vm.remoteSettings.credentials.yamlFilename + '.yml'));
    let yamlData = YAML.parse(yamlStr);

    envCopy['AWS_ACCESS_KEY'] = yamlData.accessKey;
    envCopy['AWS_SECRET_KEY'] = yamlData.secretKey;
    envCopy['AWS_DEFAULT_REGION'] = vm.remoteSettings.credentials.region;

    yamlData = null;

    return envCopy;
  }


  localServer() {

    const vm = this;
    if (vm.showDebug) vm.$log.debug('***** In osServerService::localServer() *****');
    // See "https://github.com/NREL/OpenStudio-server/tree/dockerize-osw/server/spec/files/batch_datapoints" for test files
    const deferred = vm.$q.defer();

    // run META CLI will return status code: 0 = success, 1 = failure

    if (vm.platform == 'win32')
      vm.startServerCommand = '\"' + vm.rubyPath + '\" \"' + vm.metaCLIPath + '\"' + ' start_local --worker-number=' + vm.numWorkers + ' --energyplus-exe-path=' + '\"' + vm.energyplusEXEPath + '\"' + ' --ruby-lib-path=' + '\"' + vm.openstudioBindingsDirPath + '\"' + ' --mongo-dir=' + '\"' + vm.mongoDirPath + '\" --debug \"' + vm.Project.projectDir.path() + '\"';
    else
      vm.startServerCommand = '\"' + vm.rubyPath + '\" \"' + vm.metaCLIPath + '\"' + ' start_local --worker-number=' + vm.numWorkers + ' --energyplus-exe-path=' + '\"' + vm.energyplusEXEPath + '\"' + ' --ruby-lib-path=' + '\"' + vm.openstudioBindingsDirPath + '\"' + ' --mongo-dir=' + '\"' + vm.mongoDirPath + '\" --debug \"' + vm.Project.projectDir.path() + '\"';
    vm.$log.info('start server command: ', vm.startServerCommand);

    const child = vm.exec(vm.startServerCommand,
      (error, stdout, stderr) => {
        if (vm.showDebug) vm.$log.debug('exit code: ', child.exitCode);
        if (vm.showDebug) vm.$log.debug('child: ', child);
        if (vm.showDebug) vm.$log.debug('stdout: ', stdout);
        if (vm.showDebug) vm.$log.debug('stderr: ', stderr);

        if (child.exitCode == 0) {
          // SUCCESS
          if (vm.showDebug) vm.$log.debug('SERVER SUCCESS');
          // get url from local_configuration.json
          vm.getLocalServerUrlFromFile();
          vm.$log.info('SERVER URL: ', vm.selectedServerURL);
          deferred.resolve(child);
        } else {
          vm.$log.error('SERVER ERROR');
          if (error !== null) {
            console.log('exec error:', error);
          }
          deferred.reject(error);
        }
      });

    console.log(`Child pid: ${child.pid}`);

    child.on('close', (code, signal) => {
      console.log(`child closed due to receipt of signal ${signal} (exit code ${code})`);
    });

    child.on('disconnect', (code, signal) => {
      console.log(`child disconnect due to receipt of signal ${signal} (exit code ${code})`);
    });

    child.on('exit', (code, signal) => {
      console.log(`child exited due to receipt of signal ${signal} (exit code ${code})`);
      if (code == 0) {
        if (vm.showDebug) vm.$log.debug('Server started');
        vm.getLocalServerUrlFromFile();
        vm.$log.info('SERVER URL: ', vm.selectedServerURL);
        deferred.resolve();
      } else {
        vm.$log.error('Server failed to start');
        deferred.reject();
      }
      return deferred.promise;
    });

    child.on('error', (code, signal) => {
      console.log(`child error due to receipt of signal ${signal} (exit code ${code})`);
    });

    child.on('message', (code, signal) => {
      console.log(`child message due to receipt of signal ${signal} (exit code ${code})`);
    });

    return deferred.promise;
  }

  getLocalServerUrlFromFile() {
    const vm = this;
    // get url from local_configuration.json
    const serverType = vm.Project.getRunType().name;
    const obj = jetpack.read(vm.Project.projectDir.path() + '/local_configuration.json', 'json');
    if (obj) {
      vm.localServerURL = obj.server_url;
      if (serverType == 'local') {
        // if selected Server if local, set URL
        vm.setSelectedServerURL(obj.server_url);
      }
    } else {
      vm.$log.error('local_configuration.json obj undefined');
    }
  }

  getLocalServerUrl() {
    const vm = this;
    return vm.localServerURL;
  }

  runAnalysis(analysis_param) {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('***** In osServerService::runAnalysis() *****');
    const deferred = vm.$q.defer();

    // run META CLI will return status code: 0 = success, 1 = failure
    // TODO: catch what analysis type it is

    if (vm.platform == 'win32')
      vm.runAnalysisCommand = `"${vm.rubyPath}" "${vm.metaCLIPath}" run_analysis --debug --verbose --ruby-lib-path="${vm.openstudioBindingsDirPath}" "${vm.Project.projectDir.path()}/${vm.Project.getProjectName()}.json" "${vm.selectedServerURL}"`;
    else
      vm.runAnalysisCommand = `"${vm.rubyPath}" "${vm.metaCLIPath}" run_analysis --debug --verbose --ruby-lib-path="${vm.openstudioBindingsDirPath}" "${vm.Project.projectDir.path()}/${vm.Project.getProjectName()}.json" "${vm.selectedServerURL}"`;
    vm.$log.info('run analysis command: ', vm.runAnalysisCommand);

    const full_command = vm.runAnalysisCommand + ' -a ' + analysis_param.toLowerCase();
    if (vm.showDebug) vm.$log.debug('FULL run_analysis command: ', full_command);
    const child = vm.exec(full_command,
      (error, stdout, stderr) => {
        if (vm.showDebug) vm.$log.debug('exit code: ', child.exitCode);
        if (vm.showDebug) vm.$log.debug('child: ', child);
        if (vm.showDebug) vm.$log.debug('stdout: ', stdout);
        if (vm.showDebug) vm.$log.debug('stderr: ', stderr);

        if (child.exitCode == 0) {
          // SUCCESS
          vm.$log.info('Analysis Started');
          const analysis_arr = stdout.toString().split('request to run analysis ');
          const analysis_id = _.trim(_.last(analysis_arr), '\n');
          if (vm.showDebug) vm.$log.debug('ANALYSIS ID: ', analysis_id);
          deferred.resolve(analysis_id);
          vm.Project.setAnalysisID(analysis_id);
          vm.Project.setModified(true);

        } else {
          // TODO: cleanup?
          if (error !== null) {
            console.log('exec error: ', error);
          }
          deferred.reject(error);
        }
      });

    console.log(`Child pid: ${child.pid}`);

    child.on('close', (code, signal) => {
      console.log(`child closed due to receipt of signal ${signal} (exit code ${code})`);
    });

    child.on('disconnect', (code, signal) => {
      console.log(`child disconnect due to receipt of signal ${signal} (exit code ${code})`);
    });

    child.on('exit', (code, signal) => {
      console.log(`child exited due to receipt of signal ${signal} (exit code ${code})`);
      if (code == 0) {
        vm.$log.info('Analysis running');
        deferred.resolve();
      } else {
        vm.$log.error('Analysis failed to run');
        deferred.reject();
      }
      return deferred.promise;
    });

    child.on('error', (code, signal) => {
      console.log(`child error due to receipt of signal ${signal} (exit code ${code})`);
    });

    child.on('message', (code, signal) => {
      console.log(`child message due to receipt of signal ${signal} (exit code ${code})`);
    });

    return deferred.promise;
  }

  // stop server (local or remote), if force != null, force close the specified server (local/remote)
  // this ALWAYS resolves
  stopServer(force = null) {
    const vm = this;
    const deferred = vm.$q.defer();
    const serverType = vm.Project.getRunType().name;

    // can't stop anything if a project isn't selected
    if ((force || vm.getServerStatus(serverType) == 'started') && vm.Project.projectDir != null) {

      if (force == 'local' || serverType == 'local') {
        if (vm.showDebug) vm.$log.debug('vm.Project:', vm.Project);
        if (vm.showDebug) vm.$log.debug('vm.Project.projectDir:', vm.Project.projectDir.path());

        vm.stopServerCommand = '\"' + vm.rubyPath + '\" \"' + vm.metaCLIPath + '\"' + ' stop_local ' + '\"' + vm.Project.projectDir.path() + '\"';
        vm.$log.info('stop server command: ', vm.stopServerCommand);

        const child = vm.exec(vm.stopServerCommand,
          (error, stdout, stderr) => {
            console.log('THE PROCESS TERMINATED');
            if (vm.showDebug) vm.$log.debug('exit code: ', child.exitCode);
            if (vm.showDebug) vm.$log.debug('child: ', child);
            if (vm.showDebug) vm.$log.debug('stdout: ', stdout);
            if (vm.showDebug) vm.$log.debug('stderr: ', stderr);

            if (child.exitCode == 0) {
              // SUCCESS
              if (vm.showDebug) vm.$log.debug('Server Stopped');
              vm.setServerStatus(serverType, 'stopped');
              vm.localServerCleanup();
              deferred.resolve(child);

            } else {
              if (error !== null) {
                console.log('exec error: ', error);
              }
              // Note: even if there is an error stopping the server in one location,
              // return resolved so promise can be used to start new server
              vm.localServerCleanup();
              deferred.resolve(error);
            }
          });
      } else {
        if (vm.Project.getRemoteSettings().remoteType == 'Existing Remote Server') {
          // remote server
          vm.$log.info('Stopping Existing Remote Server');
          vm.setServerStatus(serverType, 'stopped');
          vm.setSelectedServerURL(null);
          deferred.resolve('Server Disconnected');

        } else {
          // cloud: terminate server
          vm.setRemoteStopInProgress(true);
          vm.$log.info('Terminating AWS cluster');
          // use cluster.json file in clusters/ folder to terminate
          vm.stopServerCommand = '\"' + vm.rubyPath + '\" \"' + vm.metaCLIPath + '\"' + ' stop_remote ' + '\"' + vm.Project.getProjectClustersDir().path(vm.Project.getRemoteSettings().aws.cluster_name, vm.Project.getRemoteSettings().aws.cluster_name + '.json') + '\"';
          vm.$log.info('stop server command: ', vm.stopServerCommand);
          const envCopy = vm.setAwsEnvVars();
          const child = vm.exec(vm.stopServerCommand, {env: envCopy},
            (error, stdout, stderr) => {
              console.log('THE PROCESS TERMINATED');
              if (vm.showDebug) vm.$log.debug('exit code: ', child.exitCode);
              if (vm.showDebug) vm.$log.debug('child: ', child);
              if (vm.showDebug) vm.$log.debug('stdout: ', stdout);
              if (vm.showDebug) vm.$log.debug('stderr: ', stderr);

              if (child.exitCode == 0) {
                // SUCCESS
                vm.$log.info('Cloud Server Terminated');
                vm.setServerStatus(serverType, 'stopped');
                vm.disconnectCluster();
                vm.setRemoteStopInProgress(false);
                deferred.resolve(child);

              } else {
                if (error !== null) {
                  console.log('exec error: ', error);
                }
                vm.setRemoteStopInProgress(false);
                vm.jetpack.remove(vm.Project.getProjectClustersDir().path(vm.remoteSettings.aws.cluster_name));
                deferred.reject(error);
              }
            });

          //deferred.resolve();
        }
      }
    } else {
      // Server already stopped
      deferred.resolve('Server already stopped');
    }

    return deferred.promise;
  }

  disconnectCluster() {
    const vm = this;
    vm.remoteSettings = vm.Project.getRemoteSettings();
    vm.remoteSettings.aws.cluster_status = 'terminated';
    vm.remoteSettings.aws.connected = false;
    // delete cluster directory completely
    vm.jetpack.remove(vm.Project.getProjectClustersDir().path(vm.remoteSettings.aws.cluster_name));
    vm.$log.info('Cluster Terminated and Disconnected');
  }

  connectCluster() {
    const vm = this;
    vm.remoteSettings = vm.Project.getRemoteSettings();
    vm.remoteSettings.aws.cluster_status = 'running';
    vm.remoteSettings.aws.connected = true;
    vm.$log.info('Cluster Started and Connected');
  }

  localServerCleanup() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('LOCAL SERVER CLEANUP');
    // delete local_configuration.json and .receipt
    vm.jetpack.remove(vm.Project.getProjectDir().path('local_configuration.json'));
    vm.jetpack.remove(vm.Project.getProjectDir().path('local_configuration.receipt'));
    // delete server.pid
    vm.jetpack.remove(vm.Project.getProjectDir().path('server.pid'));
    // delete temp_data folder
    vm.jetpack.remove(vm.Project.getProjectDir().path('temp_data'));
    // delete everything in data/db
    vm.jetpack.remove(vm.Project.getProjectDir().path('data/db/*'));
    // delete .temp
    vm.jetpack.remove(vm.Project.getProjectDir().path('.temp'));
    // delete logs
    vm.jetpack.remove(vm.Project.getProjectDir().path('logs/*'));
    if (vm.showDebug) vm.$log.debug('SERVER CLEANUP COMPLETE');

  }

  retrieveAnalysisStatus() {
    const vm = this;
    const deferred = vm.$q.defer();
    const url = vm.selectedServerURL + '/analyses/' + vm.Project.getAnalysisID() + '/status.json';
    if (vm.showDebug) vm.$log.debug('Analysis Status URL: ', url);
    vm.$http.get(url).then(response => {
      // send json to run controller
      if (vm.showDebug) vm.$log.debug('status JSON response: ', response);
      deferred.resolve(response);

    }, response => {
      if (vm.showDebug) vm.$log.debug('ERROR getting status for analysis ', vm.Project.getAnalysisID());
      deferred.reject(response);
    });

    return deferred.promise;
  }

  updateDatapoints() {

    // get Datapoints out.osw for datapoint IDs
    const vm = this;
    const deferred = vm.$q.defer();
    const promises = [];

    vm.datapoints = vm.Project.getDatapoints();

    _.forEach(vm.datapointsStatus, (dp) => {
      if (vm.showDebug) vm.$log.debug('DATAPOINT STATUS: ', dp);
      const url = vm.selectedServerURL + '/data_points/' + dp.id + '/download_result_file';
      const params = {filename: 'out.osw'};
      const config = {params: params, headers: {Accept: 'application/json'}};
      if (vm.showDebug) vm.$log.debug('****URL: ', url);
      const promise = vm.$http.get(url, config).then(response => {
        // save OSW to file
        if (vm.showDebug) vm.$log.debug('DATAPOINT OUT.OSW response: ', response.data);
        let datapoint = response.data;
        vm.jetpack.write(vm.Project.getProjectLocalResultsDir().path(dp.id, 'out.osw'), datapoint);

        // also load in datapoints array
        datapoint.status = dp.status;
        datapoint.final_message = dp.final_message;
        datapoint.id = dp.id;

        let dp_match = _.findIndex(vm.datapoints, {name: dp.name});
        if (vm.showDebug) vm.$log.debug('DP match results for: ', dp.name, ': ', dp_match);
        if (dp_match != -1) {
          // merge
          _.merge(vm.datapoints[dp_match], datapoint);
          if (vm.showDebug) vm.$log.debug('DATAPOINT MATCH! New dp: ', vm.datapoints[dp_match]);
        } else {
          // append datapoint to array
          vm.datapoints.push(datapoint);
        }
        if (vm.showDebug) vm.$log.debug('PROJECT DATAPOINTS NOW: ', vm.Project.getDatapoints());

      }, error => {
        vm.$log.error('GET DATAPOINT OUT.OSW ERROR (file probably not created yet): ', error);
        // if 422 error, out.osw doesn't exist yet...get datapoint.json instead
        if (error.status == 422 || error.status == 404) {
          vm.$log.error('422/404 Error...GETting datapoint json instead');
          const datapointUrl = vm.selectedServerURL + '/data_points/' + dp.id + '.json';
          if (vm.showDebug) vm.$log.debug('DATAPOINT URL: ', datapointUrl);
          if (vm.showDebug) vm.$log.debug('DP: ', dp);
          const promise2 = vm.$http.get(datapointUrl).then(response2 => {
            // set datapoint array
            if (vm.showDebug) vm.$log.debug('datapoint JSON raw response: ', response2);
            vm.$log.info('datapoint JSON response: ', response2.data.data_point);
            let datapoint = response2.data.data_point;
            datapoint.status = dp.status;
            datapoint.final_message = dp.final_message;
            datapoint.id = dp.id;

            let dp_match = _.findIndex(vm.datapoints, {name: dp.name});
            if (vm.showDebug) vm.$log.debug('DP2 match results for: ', dp.name, ' : ', dp_match);
            if (dp_match != -1) {
              // merge
              _.merge(vm.datapoints[dp_match], datapoint);
              if (vm.showDebug) vm.$log.debug('DATAPOINT MATCH! New dp: ', vm.datapoints[dp_match]);
            } else {
              // also load in datapoints array
              vm.datapoints.push(datapoint);
            }


          }, error2 => {
            vm.$log.error('GET Datapoint.json ERROR: ', error2);
          });
          promises.push(promise2);
        }

      });
      promises.push(promise);
    });

    vm.$q.all(promises).then(response => {
      deferred.resolve(vm.datapoints);
      vm.Project.setModified(true);
    }, error => {
      vm.$log.error('ERROR retrieving datapoints OSWs: ', error);
      deferred.reject(error);
    });
    return deferred.promise;
  }

  downloadReports() {
    const vm = this;
    const deferred = vm.$q.defer();
    const promises = [];

    // download all reports (result files) as soon as a datapoint completes

    vm.datapoints = vm.Project.getDatapoints();

    _.forEach(vm.datapoints, dp => {
      if (dp.status == 'completed' && !dp.downloaded_reports) {
        const url = vm.selectedServerURL + '/data_points/' + dp.id + '.json';
        const promise = vm.$http.get(url).then(response => {
          // get result files from response
          if (vm.showDebug) vm.$log.debug('datapoint.json: ', response);
          const resultFiles = response.data.data_point.result_files;
          dp.result_files = dp.result_files ? _.merge(dp.result_files, resultFiles) : resultFiles;
          const reportPromises = [];
          _.forEach(dp.result_files, file => {
            if (file.type == 'Report' && !file.downloaded) {
              // download file
              const reportUrl = vm.selectedServerURL + '/data_points/' + dp.id + '/download_result_file';
              const params = {filename: file.attachment_file_name};
              const config = {params: params, headers: {Accept: 'application/json'}};
              if (vm.showDebug) vm.$log.debug('****URL: ', reportUrl);
              const reportPromise = vm.$http.get(reportUrl, config).then(response => {
                // write file and set downloaded flag
                vm.jetpack.write(vm.Project.getProjectLocalResultsDir().path(dp.id, file.attachment_file_name), response.data);
                file.downloaded = true;

              }, reportError => {
                vm.$log.error('GET report error: ', reportError);
              });
              reportPromises.push(reportPromise);  // this to set flag
              promises.push(reportPromise);  // this one to resolve overall function
            }
          });
          // when all reports are downloaded for a single datapoint
          vm.$q.all(reportPromises).then(response => {
            // set downloaded_reports flag
            dp.downloaded_reports = true;
            vm.Project.setModified(true);

            // if running locally, also download osm and results
            if (vm.Project.getRunType().name == 'local') {
              if (vm.showDebug) vm.$log.debug('Run Type is set to Local');
              const osm_promise = vm.downloadOSM(dp).then(response => {
                vm.$log.info('osm downloaded for ', dp.name);
              }, error => {
                vm.$log.error('OSM download failed for ', dp.name);
              });
              //promises.push(osm_promise);
              const result_promise = vm.downloadResults(dp).then(response => {
                vm.$log.info('results downloaded for ', dp.name);
              }, error => {
                vm.$log.error('RESULTS download failed for ', dp.name);
              });
              //promises.push(result_promise);
            }

          }, error => {
            vm.$log.error('Error downloading all reports for datapoint: ', dp.id, 'error: ', error);
          });

        }, error => {
          vm.$log.error('GET datapoint.json error: ', error);
        });
        promises.push(promise);

      }
    });

    vm.$q.all(promises).then(response => {
      vm.$log.info('Updated Datapoints with Reports: ', vm.datapoints);
      deferred.resolve(vm.datapoints);
      vm.Project.setModified(true);
    }, error => {
      vm.$log.error('ERROR retrieving datapoints JSONs: ', error);
      deferred.reject(error);
    });
    return deferred.promise;
  }

  // download data_point.zip for all datapoints
  downloadAllResults() {
    const vm = this;
    const deferred = vm.$q.defer();
    const promises = [];

    vm.datapoints = vm.Project.getDatapoints();

    _.forEach(vm.datapoints, dp => {
      const promise = vm.downloadResults(dp);
      promises.push(promise);
    });

    vm.$q.all(promises).then(response => {
      vm.$log.info('All Datapoint results zip files downloaded');
      deferred.resolve();
    }, error => {
      vm.$log.error('ERROR downloading all datapoint results zip files', error);
      deferred.reject(error);
    });
    return deferred.promise;

  }

  // download data_point.zip
  downloadResults(datapoint) {
    const vm = this;
    const deferred = vm.$q.defer();

    // check for file in result_files to get correct name (in case it changes)
    const file = _.find(datapoint.result_files, {type: 'Data Point'});

    if (file) {
      const reportUrl = vm.selectedServerURL + '/data_points/' + datapoint.id + '/download_result_file';
      const params = {filename: file.attachment_file_name};
      const config = {params: params, headers: {Accept: 'application/json'}, responseType: 'arraybuffer'};
      vm.$log.info('Download Results URL: ', reportUrl);
      if (vm.showDebug) vm.$log.debug('params: ', params);
      vm.$http.get(reportUrl, config).then(response => {
        // write file and set downloaded flag
        if (vm.showDebug) vm.$log.debug('RESPONSE!! ', response);

        // extract dir and save to disk in local measures directory
        // convert arraybuffer to node buffer
        const buf = new Buffer(new Uint8Array(response.data));
        if (vm.showDebug) vm.$log.debug('buffer');
        const zip = new vm.AdmZip(buf);
        if (vm.showDebug) vm.$log.debug('zip');
        // save
        zip.writeZip(vm.Project.getProjectLocalResultsDir().path(datapoint.id, file.attachment_file_name));

        file.downloaded = true;
        datapoint.downloaded_results = true;
        vm.Project.setModified(true);
        deferred.resolve();
      }, error => {
        vm.$log.error('GET results zip error: ', error);
        deferred.reject();
      });


    } else {
      vm.$log.error('No zip file listed in the result_files for this datapoint');
      deferred.reject();
    }
    return deferred.promise;
  }

  // download OSM for all datapoints
  downloadAllOSMs() {
    const vm = this;
    const deferred = vm.$q.defer();
    const promises = [];

    vm.datapoints = vm.Project.getDatapoints();

    _.forEach(vm.datapoints, dp => {
      const promise = vm.downloadOSM(dp);
      promises.push(promise);
    });

    vm.$q.all(promises).then(response => {
      vm.$log.info('All OSMs downloaded');
      deferred.resolve();
    }, error => {
      vm.$log.error('ERROR downloading all OSMs', error);
      deferred.reject(error);
    });
    return deferred.promise;

  }

  // download data_point.zip
  downloadOSM(datapoint) {
    const vm = this;
    const deferred = vm.$q.defer();

    const file = _.find(datapoint.result_files, {type: 'OpenStudio Model'});

    if (file) {
      const reportUrl = vm.selectedServerURL + '/data_points/' + datapoint.id + '/download_result_file';
      const params = {filename: file.attachment_file_name};
      const config = {params: params, headers: {Accept: 'application/json'}};
      vm.$log.info('Download OSM URL: ', reportUrl);
      vm.$http.get(reportUrl, config).then(response => {
        // write file and set downloaded flag
        vm.jetpack.write(vm.Project.getProjectLocalResultsDir().path(datapoint.id, file.attachment_file_name), response.data);
        file.downloaded = true;
        datapoint.downloaded_osm = true;
        vm.Project.setModified(true);
        deferred.resolve();
      }, error => {
        vm.$log.error('GET OSM error: ', error);
        deferred.reject();
      });
    } else {
      vm.$log.error('No OpenStudio model file found');
      deferred.reject();
    }

    return deferred.promise;
  }

  stopAnalysis() {
    const vm = this;
    const deferred = vm.$q.defer();
    const url = vm.selectedServerURL + '/analyses/' + vm.Project.getAnalysisID() + '/action.json';
    const params = {analysis_action: 'stop'};

    if (vm.analysisStatus == 'completed') {
      if (vm.showDebug) vm.$log.debug('Analysis is already completed');
      deferred.resolve();
    } else {
      vm.$http.post(url, params)
        .success((data, status, headers, config) => {
          vm.$log.info('stop analysis Success!, status: ', status);
          vm.setAnalysisStatus('canceled');
          deferred.resolve(data);
        })
        .error((data, status, headers, config) => {
          vm.$log.error('stop analysis error: ', data);
          deferred.reject([]);
        });
    }
    return deferred.promise;
  }

  // analysis running dialog
  showAnalysisRunningDialog() {
    const vm = this;
    if (vm.showDebug) vm.$log.debug('In showAnalysisRunningDialog function');
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalAnalysisRunningController',
      controllerAs: 'modal',
      templateUrl: 'app/run/analysisRunning.html',
      windowClass: 'modal'
    });
  }

  cloudRunningModal() {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.remoteSettings = vm.Project.getRemoteSettings();
    vm.runType = vm.Project.getRunType();
    // if connected to cloud
    if (vm.remoteSettings.aws && vm.remoteSettings.aws.connected && vm.runType.name == 'remote') {
      // local results exist
      const modalInstance = vm.$uibModal.open({
        backdrop: 'static',
        controller: 'ModalCloudRunningController',
        controllerAs: 'modal',
        templateUrl: 'app/run/cloudRunning.html'
      });

      modalInstance.result.then(() => {
        // stop server
        vm.stopServer().then(() => {
          deferred.resolve('resolve');
        }, () => {
          deferred.reject('rejected');
        });
      }, () => {
        // Modal canceled
        deferred.reject('rejected');
      });
    } else {
      // cloud not running
      deferred.resolve('resolved');
    }
    return deferred.promise;
  }

}
