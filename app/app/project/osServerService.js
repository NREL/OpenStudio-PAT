import jetpack from 'fs-jetpack';
import {remote} from 'electron';
const {app} = remote;
import path from 'path';

export class OsServer {
  constructor($q, $http, $log, Project) {
    'ngInject';
    const vm = this;
    vm.Project = Project;
    vm.$log = $log;
    vm.$q = $q;
    vm.$http = $http;
    vm.jetpack = jetpack;

    // to run meta_cli
    vm.exec = require('child_process').exec;

    vm.serverStatus = 'stopped';  // started, stopped, error?
    vm.analysisStatus = '';
    vm.progressAmount = 0;
    vm.progressMessage = '';
    vm.isDone = true;
    vm.datapoints = [];
    vm.disabledButtons = false;

    vm.localServerURL = 'http://localhost:8080';
    vm.cloudServerURL = 'http://bball-130553.nrel.gov:8080'; // TODO: using Brian's machine
    vm.serverURL = vm.localServerURL;
    const src = jetpack.cwd(app.getPath('userData'));
    vm.$log.debug('src.path(): ', src.path());
    vm.CLIpath = jetpack.cwd(path.resolve(src.path() + '/openstudioCLI/bin'));
    vm.OsMetaPath = jetpack.cwd(path.resolve(src.path() + '/openstudioServer/bin/openstudio_meta'));
    vm.rubyBinDir = jetpack.cwd(path.resolve(src.path() + '/ruby/bin/ruby.exe'));
    vm.mongoBinDir = jetpack.cwd(path.resolve(src.path() + '/mongo/bin'));
    vm.openstudioDir = jetpack.cwd(path.resolve(src.path() + '/openstudio/'));
    vm.projectDir = vm.Project.getProjectDir();
    vm.analysisID = null;
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

  getAnalysisStat() {
    const vm = this;
    return vm.analysisStatus;
  }

  setAnalysisStat(analysisStatus) {
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

  getDatapoints() {
    const vm = this;
    return vm.datapoints;
  }

  setDatapoints(datapoints) {
    const vm = this;
    vm.datapoints = datapoints;
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

    // TODO: maybe ping server to make sure it is really started?
    if (vm.serverStatus != 'started'){
      if (serverType.name == 'local') {
        vm.localServer().then(response => {
          vm.serverStatus = 'started';
          deferred.resolve(response);
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
    vm.jetpack.remove(vm.projectDir.path('local_configuration.receipt'));

    // run META CLI will return status code: 0 = success, 1 = failure
    // TODO: add a timeout here in case this takes too long
    const command = '\"' + vm.rubyBinDir.path() + '\" \"' + vm.OsMetaPath.path() + '\"' + ' start_local --debug ' + '\"' + vm.projectDir.path() + '\" \"' + vm.mongoBinDir.path() + '\" \"' + vm.rubyBinDir.path() + '\" --verbose';
    vm.$log.debug('Start Local command: ', command);
    const child = vm.exec(command,
      (error, stdout, stderr) => {
        vm.$log.debug('THE PROCESS TERMINATED!');
        vm.$log.debug('EXIT CODE: ', child.exitCode);
        vm.$log.debug('child: ', child);
        vm.$log.debug('stdout: ', stdout);
        vm.$log.debug('stderr: ', stderr);

        if (child.exitCode == 0) {
          // SUCCESS
          // get url from local_configuration.json
          const obj = jetpack.read(vm.projectDir.path('local_configuration.json'), 'json');
          vm.setServerURL(obj.server_url);
          vm.$log.debug('SERVER URL: ', vm.serverURL);
          deferred.resolve(child);

        } else {
          // TODO: cleanup?
          if (error !== null) {
            console.log('exec error:', error);
          }
          deferred.reject(error);
        }
      });

    return deferred.promise;
  }

  runAnalysis() {
    const vm = this;
    vm.$log.debug('***** In osServerService::runAnalysis() *****');
    const deferred = vm.$q.defer();

    // run META CLI will return status code: 0 = success, 1 = failure
    // TODO: catch what analysis type it is
    const command = `"${vm.rubyBinDir.path()}" "${vm.OsMetaPath.path()}" run_analysis "${vm.projectDir.path()}\\${vm.Project.getProjectName()}.json" "${vm.serverURL}" -a batch_datapoints`;
    //const command = '\"' + vm.rubyBinDir.path() + '\" \"' + vm.OsMetaPath.path() + '\"' + ' run_analysis ' + '\"' + vm.projectDir.path() + '\\' + vm.Project.getProjectName() + '.json\" ' + vm.serverURL  + ' -a batch_datapoints';
    vm.$log.debug('Run command: ', command);
    const child = vm.exec(command,
      (error, stdout, stderr) => {
        console.log('THE PROCESS TERMINATED!');
        console.log('EXIT CODE: ', child.exitCode);
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

    return deferred.promise;

  }

  stopServer() {
    const vm = this;
    const deferred = vm.$q.defer();
    const serverType = vm.Project.getRunType();

    if (vm.serverStatus != 'stopped'){

      if (serverType.name == 'local') {

        const command = 'cd ' + vm.CLIpath + ' && ruby openstudio_meta stop_local ' + vm.projectDir.path();
        vm.$log.debug('Stop Local command: ', command);
        const child = vm.exec(command,
          (error, stdout, stderr) => {
            console.log('THE PROCESS TERMINATED');
            console.log('EXIT CODE: ', child.exitCode);
            console.log('child: ', child);
            console.log('stdout: ', stdout);
            console.log('stderr: ', stderr);

            if (child.exitCode == 0) {
              // SUCCESS
              vm.$log.debug('Server Stopped');
              deferred.resolve(child);

            } else {
              // TODO: cleanup?
              if (error !== null) {
                console.log('exec error: ', error);
              }
              deferred.reject(error);
            }
          });
        } else {
        // TODO: stop remote server here
      }
    } else {
      // Server already stopped
      deferred.resolve();
    }

    return deferred.promise;

  }

  getAnalysisStatus() {

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


}
