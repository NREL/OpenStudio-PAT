import jetpack from 'fs-jetpack';
import {remote} from 'electron';
const {app} = remote;
import path from 'path';
import os from 'os';

export class OsServer {
  constructor($q, $http, $log, $uibModal, Project) {
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
    vm.analysisID = null;

    vm.disabledButtons = false;  // display run or cancel button

    vm.localServerURL = 'http://localhost:8080';
    //vm.cloudServerURL = 'http://bball-130553.nrel.gov:8080'; // TODO: using Brian's machine
    vm.cloudServerURL = '';
    vm.serverURL = vm.localServerURL;
    const src = jetpack.cwd(app.getPath('userData'));
    vm.$log.debug('src.path(): ', src.path());
    vm.CLIpath = jetpack.cwd(path.resolve(src.path() + '/openstudioCLI/bin'));
    vm.rubyLibPath = jetpack.cwd(path.resolve(src.path() + '/openstudioCLI/Ruby'));
    vm.OsMetaPath = jetpack.cwd(path.resolve(src.path() + '/openstudioServer/bin/openstudio_meta'));
    vm.mongoBinDir = jetpack.cwd(path.resolve(src.path() + '/mongo/bin'));
    vm.openstudioDir = jetpack.cwd(path.resolve(src.path() + '/openstudio/'));
    vm.resultsDir = '';

    // Depends on system type (windows vs mac)
    vm.platform = os.platform();
    if (vm.platform == 'win32')
      vm.rubyBinDir = jetpack.cwd(path.resolve(src.path() + '/ruby/bin/ruby.exe'));
    else {
      vm.rubyBinDir = jetpack.cwd(path.resolve(src.path() + '/ruby/bin/ruby'));
      // TODO: temporary (for mac: assume that ruby is in user's home folder at following path)
      vm.rubyBinDir = jetpack.cwd(app.getPath('home') + '/tempPAT/ruby/bin/ruby');
      // TODO: temporary (for mac: openstudio server)
      vm.OsMetaPath = jetpack.cwd(app.getPath('home') + '/tempPAT/openstudioServer/bin/openstudio_meta');
    }

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

  // ping server
  pingServer() {
    const vm = this;
    vm.$log.debug('Pinging Server to see if it is alive');
    const deferred = vm.$q.defer();
    const url = vm.serverURL + '/status.json';
    vm.$log.debug('Ping Server URL: ', url);
    vm.$http.get(url).then(response => {
      // send json to run controller
      vm.$log.debug('PING: Server is started');
      vm.$log.debug('status JSON response: ', response);
      vm.serverStatus = 'started';
      deferred.resolve(response);

    }, response => {
      vm.$log.debug('PING:  Server is not started');
      vm.serverStatus = 'stopped';
      deferred.reject(response);
    });


    return deferred.promise;

  }

  // start server (remote or local)
  startServer(force = false) {
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
    // TODO: also if start fails, ping server...it might be started already
    if ((vm.serverStatus != 'started') || force) {
      if (serverType.name == 'local') {
        vm.localServer().then(response => {
          vm.$log.debug('localServer promise resolved.  Server should have started');
          vm.setServerStatus('started');

          // do this just in case?
          vm.$log.debug('try to read file ' + vm.Project.projectDir.path() + ' local_configuration.receipt file');
          const file = jetpack.read(vm.Project.projectDir.path() + '/local_configuration.receipt');
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
          vm.seServerStatus('started');
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
    vm.jetpack.remove(vm.Project.projectDir.path() + '/' + 'local_configuration.receipt'); // TODO deprecate this when possible

    // run META CLI will return status code: 0 = success, 1 = failure

    if (vm.platform == 'win32')
      vm.startServerCommand = '\"' + vm.rubyBinDir.path() + '\" \"' + vm.OsMetaPath.path() + '\"' + ' start_local --ruby-lib-path=' + '\"' + vm.rubyLibPath.path() + '\"' + ' --mongo-dir=' + '\"' + vm.mongoBinDir.path() + '\" --debug \"' + vm.Project.projectDir.path() + '\"';
    else
      vm.startServerCommand = '\"' + vm.rubyBinDir.path() + '\" \"' + vm.OsMetaPath.path() + '\"' + ' start_local --ruby-lib-path=' + '\"' + vm.rubyLibPath.path() + '\"' + ' --mongo-dir=' + '\"' + vm.mongoBinDir.path() + '\" --debug \"' + vm.Project.projectDir.path() + '\"';
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
          const obj = jetpack.read(vm.Project.projectDir.path() + '/local_configuration.json', 'json');
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
    vm.resultsDir = vm.jetpack.dir(vm.Project.projectDir.path('localResults'));

    // run META CLI will return status code: 0 = success, 1 = failure
    // TODO: catch what analysis type it is

    if (vm.platform == 'win32')
      vm.runAnalysisCommand = `"${vm.rubyBinDir.path()}" "${vm.OsMetaPath.path()}" run_analysis --debug --verbose --ruby-lib-path="${vm.rubyLibPath.path()}" "${vm.Project.projectDir.path()}/${vm.Project.getProjectName()}.json" "${vm.serverURL}"`;
    else
      vm.runAnalysisCommand = `"${vm.rubyBinDir.path()}" "${vm.OsMetaPath.path()}" run_analysis --debug --verbose --ruby-lib-path="${vm.rubyLibPath.path()}" "${vm.Project.projectDir.path()}/${vm.Project.getProjectName()}.json" "${vm.serverURL}"`;
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

  stopServer(force = false) {
    const vm = this;
    const deferred = vm.$q.defer();
    const serverType = vm.Project.getRunType();

     //if (vm.serverStatus == 'started' && vm.Project.projectDir != undefined) {
    if ((vm.serverStatus == vm.serverStatus  && vm.Project.projectDir != null) || force) { // TODO This should be removed when the line above is fixed -- serverStatus needs to correctly update

      if (serverType.name == 'local') {
        vm.$log.debug('vm.Project:', vm.Project);
        vm.$log.debug('vm.Project.projectDir:', vm.Project.projectDir.path());

        vm.stopServerCommand = '\"' + vm.rubyBinDir.path() + '\" \"' + vm.OsMetaPath.path() + '\"' + ' stop_local ' + '\"' + vm.Project.projectDir.path() + '\"';
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
      vm.$log.debug("DATAPOINT STATUS: ", dp);
      const url = vm.serverURL + '/data_points/' + dp.id + '/download_result_file';
      const params = {filename: 'out.osw'};
      const config = { params: params, headers : {Accept: 'application/json'} };
      vm.$log.debug('****URL: ', url);
      const promise = vm.$http.get(url, config).then( response => {
        // save OSW to file
        vm.$log.debug('DATAPOINT OUT.OSW response: ', response.data);
       let datapoint = response.data;
        vm.jetpack.write(vm.resultsDir.path(dp.id, 'out.osw'), datapoint);

        // also load in datapoints array
        datapoint.status = dp.status;
        datapoint.final_message = dp.final_message;
        datapoint.id = dp.id;

        let dp_match = _.findIndex(vm.datapoints, {id: dp.id});
        if (dp_match != -1) {
          // merge
          _.merge(vm.datapoints[dp_match], datapoint);
          vm.$log.debug('DATAPOINT MATCH! New dp: ', vm.datapoints[dp_match]);
        } else {
          // append datapoint to array
          vm.datapoints.push(datapoint);
        }
        vm.$log.debug('DATAPOINTS NOW: ', vm.datapoints);

      }, error => {
        vm.$log.debug('GET DATAPOINT OUT.OSW ERROR (file probably not created yet): ', error);
        // if 422 error, out.osw doesn't exist yet...get datapoint.json instead
        if (error.status == 422) {
          vm.$log.debug('422 Error...GETting datapoint json instead');
          const datapointUrl = vm.serverURL + '/data_points/' + dp.id + '.json';
          const promise2 = vm.$http.get(datapointUrl).then( response2 => {
            // set datapoint array
            vm.$log.debug('datapoint JSON response: ', response2.data.data_point);
            let datapoint = response2.data.data_point;
            datapoint.status = dp.status;
            datapoint.final_message = dp.final_message;
            datapoint.id = dp.id;

            let dp_match = _.findIndex(vm.datapoints, {id: dp.id});
            if (dp_match != -1) {
              // merge
              _.merge(vm.datapoints[dp_match], datapoint);
            } else {
              // also load in datapoints array
              vm.datapoints.push(datapoint);
            }

          }, error2 => {
            vm.$log.debug('GET Datapoint.json ERROR: ', error2);
          });
          promises.push(promise2);
        }

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
