/***********************************************************************************************************************
 *  OpenStudio(R), Copyright (c) 2008-2017, Alliance for Sustainable Energy, LLC. All rights reserved.
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
import jetpack from 'fs-jetpack';
import {remote} from 'electron';
import fs from 'fs';
import path from 'path';

const {dialog} = remote;

export class SetProject {
  constructor($q, $log, $state, $uibModal, Project, OsServer, BCL, $translate, toastr, Message) {
    'ngInject';
    const vm = this;
    vm.$q = $q;
    vm.$log = $log;
    vm.$uibModal = $uibModal;
    vm.fs = fs;
    vm.jetpack = jetpack;
    vm.dialog = dialog;
    vm.OsServer = OsServer;
    vm.Project = Project;
    vm.BCL = BCL;
    vm.$state = $state;
    vm.newProjectName = null;
    vm.toastr = toastr;
    vm.$translate = $translate;
    vm.Message = Message;

    // This bool is used to reduce the number of debug messages given the typical, non-developer user
    vm.showDebug = false;
  }

  saveProject() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('saveProject');
    if (vm.Project.projectDir != undefined) {
      vm.Project.exportPAT();
      vm.$translate('toastr.projectSaved').then(translation => {
        vm.toastr.success(translation);
      });
    } else {
      vm.$log.error('saveProject: vm.Project.projectDir is undefined');
    }
  }

  saveAsProject() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('saveAsProject');
    const deferred = vm.$q.defer();

    const oldProjectName = vm.Project.projectName;

    // pop modal to get new project name
    vm.openModal().then(response => {
      if (vm.Message.showDebug()) vm.$log.debug('response:', response);

      // pop modal to allow user to navigate to project parent folder
      const result = vm.dialog.showOpenDialog({
        title: 'Choose New ParametricAnalysisTool Project Folder',
        properties: ['openDirectory']
      });

      if (!_.isEmpty(result)) {
        let projectDir = jetpack.cwd(result[0]);
        // Check that path is not in a PAT project subdirectory
        let count = 0;
        const maxDirectoriesToCheck = 5;
        let fileExists = false;
        let atRoot = false;
        let currentDir = projectDir;
        while (!fileExists && !atRoot && count < maxDirectoriesToCheck) {
          const fullFilename = currentDir.path('pat.json');
          if (vm.Message.showDebug()) vm.$log.debug('checking for ', fullFilename);
          const file = vm.jetpack.read(fullFilename);
          if (typeof file !== 'undefined') {
            fileExists = true;
            vm.nestedProjectModal().then(() => {
            });
            vm.$log.info('Found what appears to be a PAT project at ', currentDir.path());
            deferred.reject('rejected');
          }
          currentDir = jetpack.cwd(currentDir.path('..'));
          const tempDir = jetpack.cwd(currentDir.path('..'));
          if (currentDir.path() === tempDir.path()) {
            atRoot = true;
          }
          count += 1;
        }

        if (!fileExists) {

          // if (projectDir.path().indexOf(' ') >= 0) {
          //   // tell user to expect trouble
          //   vm.whitespaceModal().then(response => {
          //   });
          // }

          vm.OsServer.stopServer('local').then(response => {
            vm.Project.setProjectName(vm.newProjectName);  // this is taken care of my setProjectVariables. remove?
            projectDir = jetpack.cwd(path.resolve(projectDir.path() + '/' + vm.Project.projectName));
            vm.$log.info('SetProjectService::stop server: server stopped');
            vm.$log.info('response: ', response);

            // for saveAs: copy old project's folder structure to new location (from, to)
            vm.jetpack.copy(vm.Project.projectDir.path(), projectDir.path());

            // rename project's json and zip files, if they exist
            const oldZip = projectDir.path(oldProjectName + '.zip');
            const oldJson = projectDir.path(oldProjectName + '.json');
            const newZip = vm.Project.projectName + '.zip';
            const newJson = vm.Project.projectName + '.json';
            // Note "rename" provides no return
            jetpack.rename(oldZip, newZip);
            jetpack.rename(oldJson, newJson);

            // set project Variables
            vm.setProjectVariables(projectDir);
            vm.$translate('toastr.projectSaved').then(translation => {
              vm.toastr.success(translation);
            });
            vm.$state.transitionTo('analysis', {}, {reload: true});

            // resolve promise
            deferred.resolve('resolve');
            // start server at new location
            vm.$translate('toastr.startLocalServer').then(translation => {
              vm.toastr.info(translation);
            });
            vm.OsServer.startServer().then(response => {
              if (vm.Message.showDebug()) vm.$log.debug('setProjectService::start server: server started');
              if (vm.Message.showDebug()) vm.$log.debug('response: ', response);
              if (vm.Message.showDebug()) vm.$log.debug('OsServer serverStatus: ', vm.OsServer.getServerStatus());
            });

          }, () => {

            vm.$log.info('stop server errored, but setting project anyway and starting new local server');

            vm.Project.setProjectName(vm.newProjectName); // this is taken care of my setProjectVariables. remove?
            projectDir = jetpack.cwd(path.resolve(projectDir.path() + '/' + vm.Project.projectName));

            // for saveAs: copy old project's folder structure to new location (from, to)
            vm.jetpack.copy(vm.Project.projectDir.path(), projectDir.path());

            // rename project's json and zip files, if they exist
            const oldZip = projectDir.path(oldProjectName + '.zip');
            const oldJson = projectDir.path(oldProjectName + '.json');
            const newZip = vm.Project.projectName + '.zip';
            const newJson = vm.Project.projectName + '.json';
            // Note "rename" provides no return
            jetpack.rename(oldZip, newZip);
            jetpack.rename(oldJson, newJson);

            // set project Variables
            vm.setProjectVariables(projectDir);
            vm.$translate('toastr.projectSaved').then(translation => {
              vm.toastr.success(translation);
            });
            vm.$state.transitionTo('analysis', {}, {reload: true});

            // start server at new location
            vm.$translate('toastr.startLocalServer').then(translation => {
              vm.toastr.info(translation);
            });
            vm.OsServer.startServer().then(response => {
              if (vm.Message.showDebug()) vm.$log.debug('setProjectService::start server: server started');
              if (vm.Message.showDebug()) vm.$log.debug('response: ', response);
              if (vm.Message.showDebug()) vm.$log.debug('OsServer serverStatus: ', vm.OsServer.getServerStatus());
            });

            deferred.resolve('resolve');
          });
        }
      } else {
        deferred.reject('rejected');
      }
    });
    return deferred.promise;
  }

  newProject() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('newProject');
    const deferred = vm.$q.defer();

    // pop modal to get new project name
    vm.openModal().then(response => {
      if (vm.Message.showDebug()) vm.$log.debug('newProject response:', response);

      // pop modal to allow user to navigate to project parent folder
      const result = vm.dialog.showOpenDialog({
        title: 'Choose New ParametricAnalysisTool Project Folder',
        properties: ['openDirectory']
      });

      if (!_.isEmpty(result)) {
        let projectDir = jetpack.cwd(result[0]);
        // Check that path is not in a PAT project subdirectory
        let count = 0;
        const maxDirectoriesToCheck = 5;
        let fileExists = false;
        let atRoot = false;
        let currentDir = projectDir;
        while (!fileExists && !atRoot && count < maxDirectoriesToCheck) {
          const fullFilename = currentDir.path('pat.json');
          if (vm.Message.showDebug()) vm.$log.debug('checking for ', fullFilename);
          const file = vm.jetpack.read(fullFilename);
          if (typeof file !== 'undefined') {
            fileExists = true;
            vm.nestedProjectModal().then(() => {
            });
            vm.$log.info('Found what appears to be a PAT project at ', currentDir.path());
            deferred.reject('rejected');
          }
          currentDir = jetpack.cwd(currentDir.path('..'));
          const tempDir = jetpack.cwd(currentDir.path('..'));
          if (currentDir.path() === tempDir.path()) {
            atRoot = true;
          }
          count += 1;
        }

        if (!fileExists) {

          // if (projectDir.path().indexOf(' ') >= 0) {
          //   // tell user to expect trouble
          //   vm.whitespaceModal().then(response => {
          //   });
          // }

          // force stop local server
          vm.OsServer.stopServer('local').then(response => {
            vm.$log.info('SetProjectService::stop server: local server stopped');
            vm.$log.info('response: ', response);

            vm.Project.setProjectName(vm.newProjectName); // this is taken care of my setProjectVariables. remove?
            projectDir = jetpack.dir(path.resolve(projectDir.path() + '/' + vm.Project.projectName));

            // set project Variables
            vm.setProjectVariables(projectDir);

            vm.$state.transitionTo('analysis', {}, {reload: true});

            vm.Project.exportPAT(); // Create a pat.json file so project is considered legit

            // resolve promise
            deferred.resolve('resolve');

            // Only start server if local server is selected?
            // For now: selected local run type and start local server
            vm.Project.setRunType(vm.Project.getRunTypes()[0]);
            // start local server at new location
            vm.$translate('toastr.startLocalServer').then(translation => {
              vm.toastr.info(translation);
            });
            vm.OsServer.startServer().then(response => {
              if (vm.Message.showDebug()) vm.$log.debug('setProjectService::start server: server started');
              if (vm.Message.showDebug()) vm.$log.debug('response: ', response);
              if (vm.Message.showDebug()) vm.$log.debug('OsServer serverStatus: ', vm.OsServer.getServerStatus());
            });

          }, () => {
            vm.$log.info('stop server errored, but setting project anyway');
            vm.Project.setProjectName(vm.newProjectName);  // this is taken care of my setProjectVariables. remove?
            projectDir = jetpack.dir(path.resolve(projectDir.path() + '/' + vm.Project.projectName));
            // set project Variables anyway
            vm.setProjectVariables(projectDir);

            vm.$state.transitionTo('analysis', {}, {reload: true});

            vm.Project.exportPAT(); // Create a pat.json file so project is considered legit

            deferred.reject('rejected');
          });
        }
      } else {
        deferred.reject('rejected');
      }
    });
    return deferred.promise;
  }

  openProject() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('openProject');
    const deferred = vm.$q.defer();

    const result = vm.dialog.showOpenDialog({
      title: 'Open ParametricAnalysisTool Project',
      properties: ['openDirectory']
    });

    if (!_.isEmpty(result)) {
      const projectDir = jetpack.cwd(result[0]);
      if (vm.Message.showDebug()) vm.$log.debug('PAT Project dir path:', projectDir.path());

      // if (projectDir.path().indexOf(' ') >= 0) {
      //   // tell user to expect trouble
      //   vm.whitespaceModal().then(response => {
      //   });
      // }

      const fullFilename = projectDir.path('pat.json');

      // projectDir must contain "pat.json"
      let fileExists = false;
      if (vm.Message.showDebug()) vm.$log.debug('checking for ', fullFilename);
      const file = vm.jetpack.read(fullFilename);
      //if (vm.Message.showDebug()) vm.$log.debug('file: ', file);
      if (typeof file !== 'undefined') {
        if (vm.Message.showDebug()) vm.$log.debug(fullFilename, ' found');
        fileExists = true;
      } else {
        if (vm.Message.showDebug()) vm.$log.debug(fullFilename, ' not found');
        const allOSPs = vm.jetpack.find(projectDir.path(), {matching: '*.osp', recursive: false});
        if (allOSPs.length > 0) {
          if (vm.Message.showDebug()) vm.$log.debug('found osp in openProject');
          if (vm.Message.showDebug()) vm.$log.debug('path: ', projectDir.path());
          vm.dialog.showMessageBox({
            type: 'info',
            buttons: ['OK'],
            title: 'Open ParametricAnalysisTool Project',
            message: 'It appears you are trying to open a first-generation ParametricAnalysisTool project, and we are unable to translate it automatically to the new format for you.'
          });
        } else {
          vm.$log.error('could not find pat.json in openProject');
          vm.dialog.showMessageBox({
            type: 'info',
            buttons: ['OK'],
            title: 'Open ParametricAnalysisTool Project',
            message: 'This is not a valid ParametricAnalysisTool project, as it has no file named "pat.json".'
          });
        }
      }

      if (fileExists) {
        // wait until server is stopped and new project set before closing modal
        if (vm.Message.showDebug()) vm.$log.debug('fileExists!');
        vm.OsServer.stopServer('local').then(response => {
          vm.$log.info('SetProjectService::stop server: server stopped');
          vm.$log.info('response: ', response);

          // set project Variables
          vm.setProjectVariables(projectDir);

          vm.$state.transitionTo('analysis', {}, {reload: true});

          // resolve promise
          deferred.resolve('resolve');

          // Only start server if local server is selected?
          // For now: selected local run type and start local server
          vm.Project.setRunType(vm.Project.getRunTypes()[0]);
          // start local server at new location
          vm.$translate('toastr.startLocalServer').then(translation => {
            vm.toastr.info(translation);
          });
          vm.OsServer.startServer().then(response => {
            if (vm.Message.showDebug()) vm.$log.debug('setProjectService::start server: server started');
            if (vm.Message.showDebug()) vm.$log.debug('response: ', response);
            if (vm.Message.showDebug()) vm.$log.debug('OsServer serverStatus: ', vm.OsServer.getServerStatus());
          });

        }, () => {
          vm.$log.info('stop server errored, but setting project anyway');
          // set project Variables anyway
          vm.setProjectVariables(projectDir);

          vm.$state.transitionTo('analysis', {}, {reload: true});

          deferred.reject('rejected');
        });
      } else {
        deferred.reject('rejected');
      }
    }
    return deferred.promise;
  }

  openModal() {
    const vm = this;
    const deferred = vm.$q.defer();
    if (vm.Message.showDebug()) vm.$log.debug('setProject::openModal');

    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalProjectNameController',
      controllerAs: 'modal',
      templateUrl: 'app/project/project_name.html'
    });

    modalInstance.result.then(() => {
      if (vm.Message.showDebug()) vm.$log.debug('Resolving openModal()');
      deferred.resolve('resolved');
    }, () => {
      // Modal canceled
      deferred.reject('rejected');
    });
    return deferred.promise;
  }

  nestedProjectModal() {
    const vm = this;
    const deferred = vm.$q.defer();
    if (vm.Message.showDebug()) vm.$log.debug('setProject::nestedProjectModal');

    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalNestedProjectWarningController',
      controllerAs: 'modal',
      templateUrl: 'app/project/nested_project_warning.html'
    });

    modalInstance.result.then(() => {
      if (vm.Message.showDebug()) vm.$log.debug('Resolving whitespaceModal()');
      deferred.resolve('resolved');
    }, () => {
      // Modal canceled
      deferred.reject('rejected');
    });
    return deferred.promise;
  }

  whitespaceModal() {
    const vm = this;
    const deferred = vm.$q.defer();
    if (vm.Message.showDebug()) vm.$log.debug('setProject::whitespaceModal');

    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalWhitespaceWarningController',
      controllerAs: 'modal',
      templateUrl: 'app/project/whitespace_warning.html'
    });

    modalInstance.result.then(() => {
      if (vm.Message.showDebug()) vm.$log.debug('Resolving whitespaceModal()');
      deferred.resolve('resolved');
    }, () => {
      // Modal canceled
      deferred.reject('rejected');
    });
    return deferred.promise;
  }

  // project initialization
  setProjectVariables(projectDir) {
    const vm = this;

    // update osServer's project location
    vm.Project.setProject(projectDir);

    // BCL service variables
    vm.BCL.resetProjectVariables();
  }

}
