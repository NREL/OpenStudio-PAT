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
import {remote} from 'electron';
import openport from 'openport';
const {app} = remote;

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

  startMeasureManager() {
    const vm = this;

    // find an open port
    openport.find(
      {
        startingPort: 3100,
        endingPort: 3500,
        avoid: [3500]
      },
      function(err, port) {
        if(err) { vm.$log.error('Error locating an open port for measure manager.'); return; }
        vm.port = port;
        vm.$log.info('Measure Manager port: ', vm.port);

        vm.$log.info('Start Measure Manager Server: ', vm.cliPath, ' measure -s ', vm.port);
        vm.cli = vm.spawn(vm.cliPath, ['measure', '-s', vm.port]);
        vm.cli.stdout.on('data', (data) => {
          // record errors
          if (data.indexOf('<0>') !== -1) {
            // WARNING
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
          const str = data.toString();
          if (str.indexOf('WEBrick::HTTPServer#start: pid=') !== -1) {
            if (vm.Message.showDebug()) vm.$log.debug('Found WEBrick Start!, resolve promise');
            vm.mmReadyDeferred.resolve();
          }
          // TODO: THIS IS TEMPORARY (windows):
          else if (str.indexOf('Only one usage of each socket address') !== -1) {
            if (vm.Message.showDebug()) vm.$log.debug('WEBrick already running...assuming MeasureManager is already up');
            vm.mmReadyDeferred.resolve();
          }
          // TODO: THIS IS TEMPORARY (mac):
          else if (str.indexOf('Error: Address already in use') !== -1) {
            if (vm.Message.showDebug()) vm.$log.debug('WEBrick already running...assuming MeasureManager is already up');
            vm.mmReadyDeferred.resolve();
          }

        });
        vm.cli.stderr.on('data', (data) => {
          vm.$log.info(`MeasureManager: ${data}`);
          // check that the mm was started correctly: resolve readyDeferred
          const str = data.toString();
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
        vm.cli.on('close', (code) => {
          vm.$log.info(`Measure Manager exited with code ${code}`);
        });
      }
    );
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
    const deferred = vm.$q.defer();

    // reset MeasureManagerErrors when a new action
    vm.Message.resetMeasureManagerErrors();

    if (vm.Message.showDebug()) vm.$log.debug('MeasureManager::createNewMeasure');

    if (vm.Message.showDebug()) vm.$log.debug('MeasureManager::createNewMeasure params: ', params);
    vm.$http.post(`${vm.url}:${vm.port}/create_measure`, params)
      .success((data, status, headers, config) => {
        vm.$log.info('MeasureManager::createNewMeasure reply: ', data);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.error('MeasureManager::createNewMeasure error: ', data);
        deferred.reject();
      });

    return deferred.promise;
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
    const deferred = vm.$q.defer();

    // reset MeasureManagerErrors when a new action
    vm.Message.resetMeasureManagerErrors();

    if (vm.Message.showDebug()) vm.$log.debug('params one more time: ', params);
    vm.$http.post(`${vm.url}:${vm.port}/duplicate_measure`, params)
      .success((data, status, headers, config) => {
        vm.$log.info('Measure Manager reply: ', data);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.error('Measure Manager DuplicateMeasure error: ', data);
        deferred.reject();
      });

    return deferred.promise;
  }

  // Update Measures
  // This function updates measures at specified path
  // Expects a measurePath
  updateMeasures(measurePath) {

    const vm = this;
    const deferred = vm.$q.defer();

    // fix path for windows
    const newMeasurePath = measurePath.replace(/\\/g, '/'); // Evan: how to normalize the path
    const params = {measures_dir: newMeasurePath};
    if (vm.Message.showDebug()) vm.$log.debug('PARAMS: ', params);

    vm.$http.post(`${vm.url}:${vm.port}/update_measures`, params)
      .success((data, status, headers, config) => {
        vm.$log.info('updateMeasures Success!');
        // if (vm.Message.showDebug()) vm.$log.debug('Measure Manager reply: ', data);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.error('Measure Manager UpdateMeasures error: ', data);
        deferred.reject([]);
      });

    return deferred.promise;
  }

  // Returns the path to the myMeasures directory
  getMyMeasuresDir() {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.$http.get(`${vm.url}:${vm.port}`, {
      params: {}
    })
      .success((data, status, headers, config) => {
        vm.$log.info('Measure Manager getMyMeasuresDir Success!, status: ', status);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.error('Measure Manager getMyMeasuresDir Error: ', data);
        deferred.reject([]);
      });
    return deferred.promise;
  }

  setMyMeasuresDir(path) {
    const vm = this;
    const deferred = vm.$q.defer();
    const params = {my_measures_dir: path};

    // reset MeasureManagerErrors when a new action
    vm.Message.resetMeasureManagerErrors();

    vm.$http.post(`${vm.url}:${vm.port}/set`, params)
      .success((data, status, headers, config) => {
        vm.$log.info('Measure Manager setMyMeasuresDir Success!, status: ', status);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.error('Measure Manager SetMyMeasuresDir Error: ', data);
        deferred.reject([]);
      });
    return deferred.promise;
  }

  // Retrieve Local BCL measures
  getLocalBCLMeasures() {
    const vm = this;
    const deferred = vm.$q.defer();
    const params = {};

    vm.$http.post(`${vm.url}:${vm.port}/bcl_measures`, params)
      .success((data, status, headers, config) => {
        vm.$log.info('Measure Manager bcl_measures Success!, status: ', status);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.error('Measure Manager bcl_measures Error: ', data);
        deferred.reject([]);
      });
    return deferred.promise;
  }

  // Download a measure from online BCL
  downloadBCLMeasure(uid) {
    const vm = this;
    const deferred = vm.$q.defer();
    const params = {uid: uid};

    // reset MeasureManagerErrors when a new action
    vm.Message.resetMeasureManagerErrors();

    vm.$http.post(`${vm.url}:${vm.port}/download_bcl_measure`, params)
      .success((data, status, headers, config) => {
        vm.$log.info('Measure Manager download_bcl_measure Success!, status: ', status);
        vm.$log.info('Data: ', data);
        deferred.resolve(data[0]);
      })
      .error((data, status, headers, config) => {
        vm.$log.error('Measure Manager download_bcl_measure Error: ', data);
        deferred.reject([]);
      });

    return deferred.promise;
  }


  // Compute Arguments
  // This function computes arguments and returns all metadata for a single measure
  // Expects a measurePath.  and osmPath if evaluating against a specific model
  computeArguments(measurePath, osmPath = null) {
    const vm = this;
    const deferred = vm.$q.defer();

    // reset MeasureManagerErrors when a new action
    vm.Message.resetMeasureManagerErrors();

    // TODO: is there a situation where we want to use an empty model even though we have a seed model defined?
    if (!osmPath) {
      osmPath = (vm.defaultSeed == null) ? null : vm.seedDir.path(vm.defaultSeed);
    }
    const params = {measure_dir: measurePath, osm_path: osmPath};
    if (vm.Message.showDebug()) vm.$log.debug('computeArguments params', params);

    vm.$http.post(`${vm.url}:${vm.port}/compute_arguments`, params)
      .success((data, status, headers, config) => {
        vm.$log.info('computeArguments Success!, status: ', status);
        // if (vm.Message.showDebug()) vm.$log.debug('Measure Manager reply: ', data);
        deferred.resolve(data);
      })
      .error((data, status, headers, config) => {
        vm.$log.error('Measure Manager ComputeArguments error: ', data);
        deferred.reject([]);
      });

    return deferred.promise;
  }
}

