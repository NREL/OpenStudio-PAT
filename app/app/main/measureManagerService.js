/***********************************************************************************************************************
 *  OpenStudio(R), Copyright (c) 2008-2020, Alliance for Sustainable Energy, LLC. All rights reserved.
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
import portfinder from 'portfinder';

export class MeasureManager {
  constructor($log, $http, $q, DependencyManager, Message) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.$http = $http;
    vm.$q = $q;
    vm.Message = Message;

    let exeExt = '';
    if (process.platform == 'win32') {
      exeExt = '.exe';
    }

    // to run cli
    vm.spawn = require('child_process').spawn;
    vm.cliPath = DependencyManager.getPath('PAT_OS_CLI_PATH');

    vm.url = 'http://localhost';
    vm.port = 1234;

    // measure Manager ready promise
    vm.mmReadyDeferred = vm.$q.defer();

  }

  isReady() {
    const vm = this;
    return vm.mmReadyDeferred.promise;
  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  startMeasureManager() {
    const vm = this;
    let str = '';
    // find an open port
    portfinder.getPortPromise({
      port: 3100,
      stopPort: 3499
    }).then(port => {
      vm.port = port;
      vm.$log.info('Measure Manager port: ', vm.port);

      vm.$log.info('Start Measure Manager Server: ', vm.cliPath, 'labs measure -s ', vm.port);
      let the_cmd = vm.cliPath + ' labs';
      vm.cli = vm.spawn(vm.cliPath, ['labs', 'measure', '-s', vm.port], { cwd: '.', stdio : 'pipe' });
      vm.cli.stdout.on('data', (data) => {
        // record errors
        if (data.indexOf('<0>') !== -1) {
          vm.$log.warn(`MeasureManager WARNING: ${data}`);
          vm.Message.appendMeasureManagerError({type: 'warning', data: data.toString()});
        } else if (data.indexOf('<1>') !== -1) {
          // ERROR
          vm.$log.error(`MeasureManager ERROR: ${data}`);
          vm.Message.appendMeasureManagerError({type: 'error', data: data.toString()});
        } else if(data.indexOf('<2>') !== -1) {
          // ERROR
          vm.$log.error(`MeasureManager ERROR: ${data}`);
          vm.Message.appendMeasureManagerError({type: 'fatal', data: data.toString()});
        }
        else {
         if (vm.Message.showDebug()) vm.$log.debug(`MeasureManager: ${data}`);
        }
        
        // check that the mm was started correctly: resolve readyDeferred
        str = data.toString();
        if (str.indexOf('WEBrick::HTTPServer#start: pid=') !== -1) {
          vm.$log.info('Found WEBrick Start, MeasureManager is running');
          vm.mmReadyDeferred.resolve();
        }
        // TODO: THIS IS TEMPORARY (windows):
        else if (str.indexOf('Only one usage of each socket address') !== -1) {
          vm.$log.info('WEBrick already running...assuming MeasureManager is already up');
          vm.mmReadyDeferred.resolve();
        }
        // TODO: THIS IS TEMPORARY (mac):
        else if (str.indexOf('Error: Address already in use') !== -1) {
          vm.$log.info('WEBrick already running...assuming MeasureManager is already running');
          vm.mmReadyDeferred.resolve();
        }
        else if (str.indexOf('MeasureManager Ready') !== -1) {
          // New labs command MeasureManager
          vm.$log.info("LABS command 'MeasureManagerReady' detected. MeasureManager is running!");
          vm.mmReadyDeferred.resolve();
        }
      });
      vm.cli.stderr.on('data', (data) => {
        vm.$log.info(`MeasureManager: ${data}`);
        // check that the mm was started correctly: resolve readyDeferred
        str = data.toString();
        if (str.indexOf('WEBrick::HTTPServer#start: pid=') !== -1) {
          if (vm.Message.showDebug()) vm.$log.debug('Found WEBrick Start!, resolve promise');
          vm.mmReadyDeferred.resolve();
        }
        // TODO: THIS IS TEMPORARY (windows):
        else if (str.indexOf('Only one usage of each socket address') !== -1) {
          if (vm.Message.showDebug()) vm.$log.debug('WEBrick already running...using tempMeasureManager');
          vm.mmReadyDeferred.resolve();
        }
        // TODO: THIS IS TEMPORARY (mac):
        else if (str.indexOf('Error: Address already in use') !== -1) {
          if (vm.Message.showDebug()) vm.$log.debug('WEBrick already running...using tempMeasureManager');
          vm.mmReadyDeferred.resolve();
        }
      });
      vm.cli.on('error', (err) => {
        console.log('Failed to start measure manager');
      }); 
      vm.cli.on('message', (msg) => {
        console.log(`child message due to receipt of signal ${msg}`);
      });

      vm.cli.on('close', (code) => {
        vm.$log.info(`Measure Manager exited with code ${code}`);
      });
      vm.cli.on('exit', (code) => {
        if (code !== 0) {
          const msg = `Failed with code = ${code}`;
        }
      });

    }).catch((err) => {
      vm.$log.error('Error locating an open port for measure manager.')
    });
  }

  stopMeasureManager() {
    const vm = this;

    vm.$log.info('Stop Measure Manager Server');
    vm.cli.kill('SIGINT');
  }

  // This function creates a new measure on the file system in folder 'LocalBCL'
  // params {
  //   measure_dir:
  //   display_name:
  //   class_name:
  //   taxonomy_tag:
  //   measure_type:
  //   description:
  //   modeler_description:

  // }
  createNewMeasure(params) {
    const vm = this;

    // reset MeasureManagerErrors when a new action
    vm.Message.resetMeasureManagerErrors();

    if (vm.Message.showDebug()) vm.$log.debug('MeasureManager::createNewMeasure');

    if (vm.Message.showDebug()) vm.$log.debug('MeasureManager::createNewMeasure params: ', params);
    return vm.$http.post(`${vm.url}:${vm.port}/create_measure`, params)
      .then(res => {
        vm.$log.info('MeasureManager::createNewMeasure reply: ', res.data);
        return res.data;
      })
      .catch(res => {
        vm.$log.error('MeasureManager::createNewMeasure error: ', res.data);
        return Promise.reject();
      });
  }

  // This function make a copy of a measure on the file system.
  // Copy should be in 'my measures' (actual folder name: 'Measures')
  // params should look like this
  // params {
  //   old_measure_dir:
  //   measure_dir:
  //   display_name:
  //   class_name:
  //   taxonomy_tag:
  //   measure_type:
  //   description:
  //   modeler_description:
  //   force_reload:
  // }
  duplicateMeasure(params) {
    const vm = this;

    // reset MeasureManagerErrors when a new action
    vm.Message.resetMeasureManagerErrors();

    if (vm.Message.showDebug()) vm.$log.debug('params one more time: ', params);
    return vm.$http.post(`${vm.url}:${vm.port}/duplicate_measure`, params)
      .then(res => {
        vm.$log.info('Measure Manager reply: ', res.data);
        return res.data;
      })
      .catch(res => {
        vm.$log.error('Measure Manager DuplicateMeasure error: ', res.data);
        return Promise.reject();
      });
  }

  // Update Measures
  // This function updates measures at specified path
  // Expects a measurePath
  updateMeasures(measurePath) {

    const vm = this;

    // fix path for windows
    const newMeasurePath = measurePath.replace(/\\/g, '/'); // Evan: how to normalize the path
    const params = {measures_dir: newMeasurePath};
    if (vm.Message.showDebug()) vm.$log.debug('PARAMS: ', params);

    return vm.$http.post(`${vm.url}:${vm.port}/update_measures`, params)
      .then(res => {
        vm.$log.info('updateMeasures Success!');
        // if (vm.Message.showDebug()) vm.$log.debug('Measure Manager reply: ', res.data);
        return res.data;
      })
      .catch(res => {
        vm.$log.error('Measure Manager UpdateMeasures error: ', res.data);
        return Promise.reject([]);
      });
  }

  // Returns the path to the myMeasures directory
  getMyMeasuresDir() {
    const vm = this;
    return vm.$http.get(`${vm.url}:${vm.port}`, {
      params: {}
    })
      .then(res => {
        vm.$log.info('Measure Manager getMyMeasuresDir Success!, status: ', res.status);
        return res.data;
      })
      .catch(res => {
        vm.$log.error('Measure Manager getMyMeasuresDir Error: ', res.data);
        return Promise.reject([]);
      });
  }

  setMyMeasuresDir(path) {
    const vm = this;
    const params = {my_measures_dir: path};

    // reset MeasureManagerErrors when a new action
    vm.Message.resetMeasureManagerErrors();
    return vm.$http.post(`${vm.url}:${vm.port}/set`, params)
      .then(res => {
        vm.$log.info('Measure Manager setMyMeasuresDir Success!, status: ', res.status);
        return res.data;
      })
      .catch(res => {
        vm.$log.error('Measure Manager SetMyMeasuresDir Error: ', res.data);
        return Promise.reject([]);
      });
  }

  // Retrieve Local BCL measures
  getLocalBCLMeasures() {
    const vm = this;
    const params = {};

    return vm.$http.post(`${vm.url}:${vm.port}/bcl_measures`, params)
      .then(res => {
        vm.$log.info('Measure Manager bcl_measures Success!, status: ', res.status);
        return res.data;
      })
      .catch(res => {
        vm.$log.error('Measure Manager bcl_measures Error: ', res.data);
        return Promise.reject([]);
      });
  }

  // Download a measure from online BCL
  downloadBCLMeasure(uid) {
    const vm = this;
    const params = {uid: uid};

    // reset MeasureManagerErrors when a new action
    vm.Message.resetMeasureManagerErrors();

    return vm.$http.post(`${vm.url}:${vm.port}/download_bcl_measure`, params)
      .then(res => {
        vm.$log.info('Measure Manager download_bcl_measure Success!, status: ', res.status);
        vm.$log.info('Data: ', res.data);
        // KAF: format of res.data has changed with labs MM
        //return res.data[0];
        return res.data
      })
      .catch(res => {
        vm.$log.error('Measure Manager download_bcl_measure Error: ', res.data);
        return Promise.reject([]);
      });
  }


  // Compute Arguments
  // This function computes arguments and returns all metadata for a single measure
  // Expects a measurePath.  and osmPath if evaluating against a specific model
  computeArguments(measurePath, osmPath = null) {
    const vm = this;

    // reset MeasureManagerErrors when a new action
    vm.Message.resetMeasureManagerErrors();

    // TODO: is there a situation where we want to use an empty model even though we have a seed model defined?
    if (!osmPath) {
      osmPath = (vm.defaultSeed == null) ? null : vm.seedDir.path(vm.defaultSeed);
    }
    const params = {measure_dir: measurePath, osm_path: osmPath};
    if (vm.Message.showDebug()) vm.$log.debug('computeArguments params', params);

    return vm.$http.post(`${vm.url}:${vm.port}/compute_arguments`, params)
      .then(res => {
        vm.$log.info('computeArguments Success!, status: ', res.status);
        // if (vm.Message.showDebug()) vm.$log.debug('Measure Manager reply: ', res.data);
        return res.data;
      })
      .catch(res => {
        vm.$log.error('Measure Manager ComputeArguments error: ', res.data);
        return Promise.reject([]);
      });
  }
}

