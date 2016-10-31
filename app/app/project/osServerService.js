import jetpack from 'fs-jetpack';
import {remote} from 'electron';
const {app} = remote;
import path from 'path';
import os from 'os';

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

    // to run meta_cli
    vm.exec = require('child_process').exec;

    vm.serverStatus = 'stopped';  // started, stopped, error?
    vm.analysisStatus = '';  // '', started, in progress, completed, error
    vm.progressAmount = 0;
    vm.progressMessage = '';
    vm.isDone = true;
    vm.datapoints = [];
    vm.datapointsStatus = [];
    vm.analysisChangedFlag = false;

    vm.disabledButtons = false;  // display run or cancel button

    vm.localServerURL = 'http://localhost:8080';
    vm.cloudServerURL = 'http://bball-130553.nrel.gov:8080'; // TODO: using Brian's machine
    vm.serverURL = vm.localServerURL;
    const src = jetpack.cwd(app.getPath('userData'));
    vm.$log.debug('src.path(): ', src.path());

    vm.cliPath = DependencyManager.getPath("PAT_OS_CLI_PATH");
    vm.metaCLIPath = DependencyManager.getPath("PAT_OS_META_CLI_PATH");
    vm.mongoPath = DependencyManager.getPath("PAT_MONGO_PATH");
    vm.mongoDirPath = path.dirname(vm.mongoPath);
    vm.openstudioBindingsPath = DependencyManager.getPath("PAT_OS_BINDING_PATH");
    vm.openstudioBindingsDirPath = path.dirname(vm.openstudioBindingsPath);
    vm.rubyPath = DependencyManager.getPath("PAT_RUBY_PATH");

    vm.projectDir = vm.Project.getProjectDir();

    vm.analysisID = null;

    if (vm.platform == 'win32')
      vm.startServerCommand = '\"' + vm.rubyPath + '\" \"' + vm.metaCLIPath + '\"' + ' start_local --ruby-lib-path=' + '\"' + vm.openstudioBindingsDirPath + '\"' + ' --mongo-dir=' + '\"' + vm.mongoDirPath + '\" --debug \"' + vm.projectDir.path() + '\"';
    else
      vm.startServerCommand = '\"' + vm.rubyPath + '\" \"' + vm.metaCLIPath + '\"' + ' start_local --ruby-lib-path=' + '\"' + vm.openstudioBindingsDirPath + '\"' + ' --mongo-dir=' + '\"' + vm.mongoDirPath + '\" --debug \"' + vm.projectDir.path() + '\"';
    vm.$log.info('start server command: ', vm.startServerCommand);

    if (vm.platform == 'win32')
      vm.runAnalysisCommand = `"${vm.rubyPath}" "${vm.metaCLIPath}" run_analysis --debug --verbose --ruby-lib-path="${vm.openstudioBindingsDirPath}" "${vm.projectDir.path()}/${vm.Project.getProjectName()}.json" "${vm.serverURL}"`;
    else
      vm.runAnalysisCommand = `"${vm.rubyPath}" "${vm.metaCLIPath}" run_analysis --debug --verbose --ruby-lib-path="${vm.openstudioBindingsDirPath}" "${vm.projectDir.path()}/${vm.Project.getProjectName()}.json" "${vm.serverURL}"`;
    vm.$log.info('run analysis command: ', vm.runAnalysisCommand);

    vm.stopServerCommand = '\"' + vm.rubyPath + '\" \"' + vm.metaCLIPath + '\"' + ' stop_local ' + '\"' + vm.projectDir.path() + '\"';
    vm.$log.info('stop server command: ', vm.stopServerCommand);
  }

  resetAnalysis() {
    const vm = this;
    vm.setAnalysisChangedFlag(false);
    // reset analysis ID
    vm.setAnalysisID('');
    vm.setDatapoints([]);
    vm.setDatapointsStatus([]);

    // TODO: clear data from disk (?)
  }

  getServerURL() {
    const vm = this;
    return vm.serverURL;
  }

  setServerURL(url) {
    const vm = this;
    vm.serverURL = url;
  }

  getServerStatus() {
    const vm = this;
    return vm.serverStatus;
  }

  setServerStatus(status) {
    const vm = this;
    vm.serverStatus = status;
  }

  getAnalysisStatus() {
    const vm = this;
    return vm.analysisStatus;
  }

  setAnalysisStatus(analysisStatus) {
    const vm = this;
    vm.analysisStatus = analysisStatus;
  }

  getProgressAmount() {
    const vm = this;
    return vm.progressAmount;
  }

  setProgressAmount(progressAmount) {
    const vm = this;
    vm.progressAmount = progressAmount;
  }

  getProgressMessage() {
    const vm = this;
    return vm.progressMessage;
  }

  setProgressMessage(progressMessage) {
    const vm = this;
    vm.progressMessage = progressMessage;
  }

  getIsDone() {
    const vm = this;
    return vm.isDone;
  }

  setIsDone(isDone) {
    const vm = this;
    vm.isDone = isDone;
  }

  getAnalysisChangedFlag(){
    const vm = this;
    return vm.analysisChangedFlag;
  }

  setAnalysisChangedFlag(flag){
    const vm = this;
    vm.analysisChangedFlag = flag;
  }

  // full datapoints (out.osw)
  getDatapoints() {
    const vm = this;
    return vm.datapoints;
  }

  setDatapoints(datapoints) {
    const vm = this;
    vm.datapoints = datapoints;
  }

  // short analysis status
  getDatapointsStatus() {
    const vm = this;
    return vm.datapointsStatus;
  }

  setDatapointsStatus(datapoints) {
    const vm = this;
    vm.datapointsStatus = datapoints;
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

  setAnalysisID(id) {
    const vm = this;
    vm.analysisID = id;
  }

  getAnalysisID() {
    const vm = this;
    return vm.analysisID;
  }

  // start server (remote or local)
  startServer() {
    const vm = this;
    vm.$log.debug('***** In osServerService::startServer() *****');
    const deferred = vm.$q.defer();

    const serverType = vm.Project.getRunType();
    vm.$log.debug('SERVER TYPE: ', serverType);
    vm.$log.debug('SERVER STATUS: ', vm.serverStatus);

    if (serverType.name == 'local') {
      vm.setServerURL(vm.localServerURL);
    } else {
      vm.setServerURL(vm.cloudServerURL);
    }

    function sleep(milliseconds) {
      // TODO: Deprecate this method? (Evan)
      const start = new Date().getTime();
      for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
          break;
        }
      }
    }

    // TODO: maybe ping server to make sure it is really started?
    if (vm.serverStatus != 'started') {
      if (serverType.name == 'local') {
        vm.localServer().then(response => {
          vm.$log.debug('localServer promise resolved.  Server should have started');
          vm.serverStatus = 'started';

          // do this just in case?
          vm.$log.debug('try to read file ' + vm.Project.projectDir + ' local_configuration.receipt file');
          const file = jetpack.read(vm.Project.projectDir + '/local_configuration.receipt');
          vm.$log.debug('file: ', file);
          if (typeof file !== 'undefined') {
            vm.$log.debug('local_configuration.receipt found');
            deferred.resolve(response);
          } else {
            vm.$log.debug('no local_configuration.receipt found');
            deferred.reject(response);
          }

        }, response => {
          vm.$log.debug('ERROR in start local server');
          deferred.reject(response);
        });
      }
      else {
        vm.remoteServer().then(response => {
          vm.serverStatus = 'started';
          deferred.resolve(response);
        }, response => {
          vm.$log.debug('ERROR in start remote server');
          deferred.reject(response);
        });
      }
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  }

  // only manual runs work now locally.
  // must send '-a batch_datapoints' as the 'analysis_type' to the CLI
  // example .json and .zip in the project dir is a manual analysis.
  // to run: pat_meta_cli run_analysis PATH_TO_PROJECT_JSON SERVER_URL -a ANALYSIS_TYPE_ARRAY

  // example OSA: https://github.com/NREL/OpenStudio-analysis-gem/blob/develop/spec/files/analysis/examples/medium_office_example.json

  remoteServer() {
    // TODO: this doesn't work yet
    const vm = this;
    const deferred = vm.$q.defer();

    deferred.resolve();
    return deferred.promise;
  }

  localServer() {
    // using the dockerize branch of pat_meta_cli repo to start server in a docker at url 192.168.99.100
    // openstudio-server branch: dockerize-multi-queue
    // this is a work-around, works on mac, but will only start 1 server (with mongo /data/db NOT in project dir)
    // will write rails URL to local_configuration.json (check this file to know if started)
    // command: ruby openstudio_meta start_local ~/OpenStudio/PAT/the_project/  ~/repos/OpenStudio-server-PAT/server  --debug

    const vm = this;
    vm.$log.debug('***** In osServerService::localServer() *****');
    // See "https://github.com/NREL/OpenStudio-server/tree/dockerize-osw/server/spec/files/batch_datapoints" for test files
    const deferred = vm.$q.defer();

    // delete local_configuration.receipt
    vm.jetpack.remove(vm.Project.projectDir + '/' + 'local_configuration.receipt'); // TODO deprecate this when possible

    // run META CLI will return status code: 0 = success, 1 = failure

    if (vm.platform == 'win32')
      vm.startServerCommand = '\"' + vm.rubyBinDir.path() + '\" \"' + vm.OsMetaPath.path() + '\"' + ' start_local --ruby-lib-path=' + '\"' + vm.rubyLibPath.path() + '\"' + ' --mongo-dir=' + '\"' + vm.mongoBinDir.path() + '\" --debug \"' + vm.Project.projectDir + '\"';
    else
      vm.startServerCommand = '\"' + vm.rubyBinDir.path() + '\" \"' + vm.OsMetaPath.path() + '\"' + ' start_local --ruby-lib-path=' + '\"' + vm.rubyLibPath.path() + '\"' + ' --mongo-dir=' + '\"' + vm.mongoBinDir.path() + '\" --debug \"' + vm.Project.projectDir + '\"';
    vm.$log.info('start server command: ', vm.startServerCommand);

    const child = vm.exec(vm.startServerCommand,
      (error, stdout, stderr) => {
        vm.$log.debug('exit code: ', child.exitCode);
        vm.$log.debug('child: ', child);
        vm.$log.debug('stdout: ', stdout);
        vm.$log.debug('stderr: ', stderr);

        if (child.exitCode == 0) {
          // SUCCESS
          vm.$log.debug('SERVER SUCCESS');
          // get url from local_configuration.json
          const obj = jetpack.read(vm.Project.projectDir + '/local_configuration.json', 'json');
          if (obj) {
            vm.setServerURL(obj.server_url);
          } else {
            vm.$log.debug('local_configuration.json obj undefined');
          }
          vm.$log.debug('SERVER URL: ', vm.serverURL);
          deferred.resolve(child);
        } else {
          vm.$log.debug('SERVER ERROR');
          // TODO: cleanup?
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
        vm.$log.debug('Server started');
        deferred.resolve();
      } else {
        vm.$log.debug('Server failed to start');
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

  runAnalysis(analysis_param) {
    const vm = this;
    vm.$log.debug('***** In osServerService::runAnalysis() *****');
    const deferred = vm.$q.defer();

    // create folder
    vm.resultsDir = vm.jetpack.dir(vm.projectDir.path('localResults'));

    // run META CLI will return status code: 0 = success, 1 = failure
    // TODO: catch what analysis type it is

    if (vm.platform == 'win32')
      vm.runAnalysisCommand = `"${vm.rubyBinDir.path()}" "${vm.OsMetaPath.path()}" run_analysis --debug --verbose --ruby-lib-path="${vm.rubyLibPath.path()}" "${vm.project.projectDir}/${vm.project.getProjectName()}.json" "${vm.serverURL}"`;
    else
      vm.runAnalysisCommand = `"${vm.rubyBinDir.path()}" "${vm.OsMetaPath.path()}" run_analysis --debug --verbose --ruby-lib-path="${vm.rubyLibPath.path()}" "${vm.project.projectDir}/${vm.project.getProjectName()}.json" "${vm.serverURL}"`;
    vm.$log.info('run analysis command: ', vm.runAnalysisCommand);

    const full_command = vm.runAnalysisCommand + ' -a ' + analysis_param;
    vm.$log.debug('FULL run_analysis command: ', full_command);
    const child = vm.exec(full_command,
      (error, stdout, stderr) => {
        console.log('exit code: ', child.exitCode);
        console.log('child: ', child);
        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);

        if (child.exitCode == 0) {
          // SUCCESS
          vm.$log.debug('Analysis Started');
          const analysis_arr = stdout.toString().split('request to run analysis ');
          const analysis_id = _.last(analysis_arr);
          vm.$log.debug('ANALYSIS ID: ', analysis_id);
          deferred.resolve(analysis_id);
          vm.setAnalysisID(analysis_id);

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
        vm.$log.debug('Analysis running');
        deferred.resolve();
      } else {
        vm.$log.debug('Analysis failed to run');
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

  stopServer() {
    const vm = this;
    const deferred = vm.$q.defer();
    const serverType = vm.Project.getRunType();

    // Note: stopServer may be called when vm.project.projectDir is undefined
    //if (vm.serverStatus == 'started' && vm.Project.projectDir != undefined) {
    if (vm.serverStatus == vm.serverStatus  && vm.Project.projectDir != undefined) { // TODO This should be removed when the line above is fixed -- serverStatus needs to correctly update

      if (serverType.name == 'local') {
        vm.$log.debug('vm.Project:', vm.Project);
        vm.$log.debug('vm.Project.projectDir:', vm.Project.projectDir);

        vm.stopServerCommand = '\"' + vm.rubyBinDir.path() + '\" \"' + vm.OsMetaPath.path() + '\"' + ' stop_local ' + '\"' + vm.Project.projectDir + '\"';
        vm.$log.info('stop server command: ', vm.stopServerCommand);

         const child = vm.exec(vm.stopServerCommand,
          (error, stdout, stderr) => {
            console.log('THE PROCESS TERMINATED');
            console.log('EXIT CODE: ', child.exitCode);
            console.log('child: ', child);
            console.log('stdout: ', stdout);
            console.log('stderr: ', stderr);

            if (child.exitCode == 0) {
              // SUCCESS
              vm.$log.debug('Server Stopped');
              vm.setServerStatus('stopped');
              deferred.resolve(child);

            } else {
              // TODO: cleanup?
              if (error !== null) {
                console.log('exec error: ', error);
              }
              // Note: even if there is an error stopping the server in one location,
              //       return resolved so promise can be used to start new server
              deferred.resolve(error);
            }
          });
      } else {
        // TODO: stop remote server here
      }
    } else {
      // Server already stopped
      deferred.resolve('Server already stopped');
    }

    return deferred.promise;
  }

  retrieveAnalysisStatus() {
    const vm = this;
    const deferred = vm.$q.defer();

    const url = vm.serverURL + '/analyses/' + vm.analysisID + '/status.json';
    vm.$log.debug('Analysis Status URL: ', url);
    vm.$http.get(url).then(response => {
      // send json to run controller
      vm.$log.debug('status JSON response: ', response);
      deferred.resolve(response);

    }, response => {
      vm.$log.debug('ERROR getting status for analysis ', vm.analysisID);
      deferred.reject(response);
    });

    return deferred.promise;
  }

  updateDatapoints() {

    // get Datapoints out.osw for datapoint IDs
    const vm = this;
    const deferred = vm.$q.defer();
    const promises = [];

    _.forEach(vm.datapointsStatus, (dp) => {
      const url = vm.serverURL + '/data_points/' + dp.id + '/download_result_file?filename=out.osw';
      const promise = vm.$http.get(url).then( response => {
        // save OSW to file
       let datapoint = response.data;
        vm.jetpack.write(vm.resultsDir.path(dp.id, 'out.osw'), datapoint);

        // also load in datapoints array
        datapoint.status = dp.status;
        datapoint.final_message = dp.final_message;
        datapoint.id = dp.id;

        let dp_match = _.find(vm.datapoints, {id: dp.id});
        if (angular.isDefined(dp_match)) {
          // overwrite
          dp_match = datapoint;
        } else {
          // append datapoint to array
          vm.datapoints.push(datapoint);
        }

      }, error => {
        vm.$log.debug('GET DATAPOINT OUT.OSW ERROR:');
        vm.$log.debug(error);
      });
      promises.push(promise);
    });

    vm.$q.all(promises).then(response => {
      deferred.resolve(vm.datapoints);
    }, error => {
      vm.$log.debug('ERROR retrieving datapoints OSWs');
      deferred.reject(error);
    });
    return deferred.promise;
  }

  stopAnalysis() {
    const vm = this;
    const deferred = vm.$q.defer();
    const url = vm.serverURL + '/analyses/' + vm.analysisID + '/action.json';
    const params = {analysis_action: 'stop'};

    if (vm.analysisStatus == 'completed') {
      vm.$log.debug('Analysis is already completed');
      deferred.resolve();
    } else {
      vm.$http.post(url, params)
        .success((data, status, headers, config) => {
          vm.$log.debug('stop analysis Success!, status: ', status);
          vm.setAnalysisStatus('canceled');
          deferred.resolve(data);
        })
        .error((data, status, headers, config) => {
          vm.$log.debug('stop analysis error: ', data);
          deferred.reject([]);
        });
    }
    return deferred.promise;
  }

  // analysis running dialog
  showAnalysisRunningDialog() {
    const vm = this;
    vm.$log.debug('In showAnalysisRunningDialog function');
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalAnalysisRunningController',
      controllerAs: 'modal',
      templateUrl: 'app/run/analysisRunning.html',
      windowClass: 'modal'
    });
  }

}
