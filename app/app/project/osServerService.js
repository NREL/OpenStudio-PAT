import * as jetpack from 'fs-jetpack';

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

    vm.serverStatus = 'stopped';
    vm.serverType = 'local';
    vm.serverURL = 'http://localhost:8080';
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
  startServer(type = 'local', options = {}) {
    const vm = this;
    if (type == 'local')
      vm.response = vm.remoteServer(options);
    else
      vm.response = vm.localServer(options);

    return vm.response;

  }

  // only manual runs work now locally.
  // must send ['batch_datapoints', 'batch_run_local'] as the 'analysis_type' to the CLI
  // example .json and .zip in the project dir is a manual analysis.
  // to run: pat_meta_cli run_analysis PATH_TO_PROJECT_JSON SERVER_URL -a ANALYSIS_TYPE_ARRAY

  // example OSA: https://github.com/NREL/OpenStudio-analysis-gem/blob/develop/spec/files/analysis/examples/medium_office_example.json

  remoteServer(options = {}) {
    const vm = this;

    // TODO: any other options need to be passed in (aws_config.yml, server options?)
    // ruby openstudio_meta start_remote -t nrel24a spec/schema/aws_yml/ex.yml spec/server_options/ex.json'
    // https://github.com/NREL/OpenStudio-cli/tree/develop/spec/schema/aws_yml
    // get back rails URL (remote)
    // https://github.com/NREL/OpenStudio-analysis-gem/blob/develop/lib/openstudio/analysis/server_api.rb

  }

  localServer(options = {}) {
    // ruby pat_meta_cli start_local PROJECT_DIR, MONGO_DIR, SERVER_DIR
    // returns rails URL (local)
    // assume PAT project folder has a 'logs' and a 'data/db' folder for this to work
    const vm = this;
    vm.setServerStatus('initializing');
    vm.$log.debug('SERVER STATUS: ', vm.serverStatus);
    const projectDir = vm.Project.getProjectDir();

    // delete local_configuration.receipt
    vm.jetpack.remove(projectDir.path('local_configuration.receipt'));

    // run META CLI will return status code: 0 = success, 1 = failure
    const child = vm.exec('cd /Users/kflemin/repos/pat_meta_cli/bin && ruby openstudio_meta start_local /Users/kflemin/OpenStudio/PAT/the_project /Users/kflemin/OpenStudio/PAT/the_project/data/db /Users/kflemin/repos/OpenStudio-server/server',
      (error, stdout, stderr) => {
        console.log('THE PROCESS TERMINATED!');
        console.log('EXIT CODE: ', child.exitCode);
        console.log('child: ', child);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        if (child.exitCode == 0) {
          // SUCCESS
          vm.setServerStatus('started');
          // get url from local_configuration.json
          const obj = jetpack.read(projectDir.path('local_configuration.json'), 'json');
          vm.setServerURL(obj.server_url);
          vm.$log.debug('SERVER URL: ', vm.serverURL);
          return true;

        } else {
          // TODO: cleanup?
          if (error !== null) {
            console.log(`exec error: ${error}`);
          }
          return false;
        }

      });


    //let child = vm.exec('sleep 5 && echo \'hello\'',
    //  (error, stdout, stderr) => {
    //    console.log(`stdout: ${stdout}`);
    //    console.log(`stderr: ${stderr}`);
    //    console.log('child: ', child);
    //    if (error !== null) {
    //      console.log(`exec error: ${error}`);
    //    }
    //  }
    //);

  }

  runAnalysis() {
    const vm = this;

    // run META CLI will return status code: 0 = success, 1 = failure
    // TODO: catch what analysis type it is
    const child = vm.exec('cd /Users/kflemin/repos/pat_meta_cli/bin && ruby openstudio_meta run_analysis /Users/kflemin/OpenStudio/PAT/the_project/the_project.json ' + vm.serverURL + ' -a batch_datapoints',
      (error, stdout, stderr) => {
        console.log('THE PROCESS TERMINATED!');
        console.log('EXIT CODE: ', child.exitCode);
        console.log('child: ', child);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        if (child.exitCode == 0) {
          // SUCCESS
          // TODO: grab analysis_id which should be returned somewhere and store in variable
          //TODO: vm.setAnalysisID(id);

          vm.$log.debug('Analysis Started');
          return true;

        } else {
          // TODO: cleanup?
          if (error !== null) {
            console.log(`exec error: ${error}`);
          }
          return false;
        }
      });

    // TODO: return success/fail

  }

  getAnalysisStatus() {

    const vm = this;
    const deferred = vm.$q.defer();

    const url = vm.serverURL + 'analyses/' + vm.analysisID + '/status.json';
    vm.$http.get(url).then(response => {
      // send json to run controller
      deferred.resolve(response);

    }, response => {
      vm.$log.debug('ERROR getting status for analysis ', vm.analysisID);
      deferred.reject(response);
    });

    return deferred.promise;

  }


}
