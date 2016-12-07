import jetpack from 'fs-jetpack';
import {remote} from 'electron';
import fs from 'fs';
import path from 'path';

const {dialog} = remote;

export class SetProject {
  constructor($q, $log, $state, $uibModal, Project, OsServer, BCL) {
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
  }

  saveProject() {
    const vm = this;
    vm.$log.debug('saveProject');
    if (vm.Project.projectDir != undefined) {
      vm.Project.exportPAT();
    } else {
      vm.$log.debug('saveProject: vm.Project.projectDir is undefined');
    }
  }

  saveAsProject() {
    const vm = this;
    vm.$log.debug('saveAsProject');
    const deferred = vm.$q.defer();

    const oldProjectName = vm.Project.projectName;

    // pop modal to get new project name
    vm.openModal().then(response => {
      vm.$log.debug('response:', response);

      // pop modal to allow user to navigate to project parent folder
      const result = vm.dialog.showOpenDialog({
        title: 'Choose New ParametricAnalysisTool Project Folder',
        properties: ['openDirectory']
      });

      if (!_.isEmpty(result)) {
        let projectDir = jetpack.cwd(result[0]);
        // Check that path is not in a PAT project subdirectory
        let count = 0;
        let maxDirectoriesToCheck = 5;
        let fileExists = false;
        let atRoot = false;
        let currentDir = projectDir;
        while (!fileExists && !atRoot && count < maxDirectoriesToCheck) {
          const fullFilename = currentDir.path('pat.json');
          vm.$log.debug('checking for ', fullFilename);
          const file = vm.jetpack.read(fullFilename);
          if (typeof file !== 'undefined') {
            fileExists = true;
            vm.nestedProjectModal().then(response => {
            });
            vm.$log.error('Found what appears to be a PAT project at ', currentDir.path());
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
          vm.Project.setProjectName(vm.newProjectName);
          projectDir = jetpack.cwd(path.resolve(projectDir.path() + '/' + vm.Project.projectName));

          if (projectDir.path().indexOf(' ') >= 0) {
            // tell user to expect trouble
            vm.whitespaceModal().then(response => {
            });
          }

          vm.OsServer.stopServer().then(response => {
            vm.$log.debug('SetProjectService::stop server: server stopped');
            vm.$log.debug('response: ', response);

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

            vm.$state.transitionTo('analysis', {}, {reload: true});

            // resolve promise
            deferred.resolve('resolve');
            // start server at new location
            vm.OsServer.startServer().then(response => {
              vm.$log.debug('setProjectService::start server: server started');
              vm.$log.debug('response: ', response);
              vm.$log.debug('OsServer serverStatus: ', vm.OsServer.getServerStatus());
            });

          }, (error) => {
            vm.$log.debug('stop server errored, but setting project anyway');

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

            vm.$state.transitionTo('analysis', {}, {reload: true});

            deferred.reject('rejected');
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
    vm.$log.debug('newProject');
    const deferred = vm.$q.defer();

    // pop modal to get new project name
    vm.openModal().then(response => {
      vm.$log.debug('newProject response:', response);

      // pop modal to allow user to navigate to project parent folder
      const result = vm.dialog.showOpenDialog({
        title: 'Choose New ParametricAnalysisTool Project Folder',
        properties: ['openDirectory']
      });

      if (!_.isEmpty(result)) {
        let projectDir = jetpack.cwd(result[0]);
        // Check that path is not in a PAT project subdirectory
        let count = 0;
        let maxDirectoriesToCheck = 5;
        let fileExists = false;
        let atRoot = false;
        let currentDir = projectDir;
        while (!fileExists && !atRoot && count < maxDirectoriesToCheck) {
          const fullFilename = currentDir.path('pat.json');
          vm.$log.debug('checking for ', fullFilename);
          const file = vm.jetpack.read(fullFilename);
          if (typeof file !== 'undefined') {
            fileExists = true;
            vm.nestedProjectModal().then(response => {
            });
            vm.$log.error('Found what appears to be a PAT project at ', currentDir.path());
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
          vm.Project.setProjectName(vm.newProjectName);
          projectDir = jetpack.dir(path.resolve(projectDir.path() + '/' + vm.Project.projectName));

          if (projectDir.path().indexOf(' ') >= 0) {
            // tell user to expect trouble
            vm.whitespaceModal().then(response => {
            });
          }

          // force stop local server
          vm.OsServer.stopServer('local').then(response => {
            vm.$log.debug('SetProjectService::stop server: local server stopped');
            vm.$log.debug('response: ', response);

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
            vm.OsServer.startServer().then(response => {
              vm.$log.debug('setProjectService::start server: server started');
              vm.$log.debug('response: ', response);
              vm.$log.debug('OsServer serverStatus: ', vm.OsServer.getServerStatus());
            });

          }, (error) => {
            vm.$log.debug('stop server errored, but setting project anyway');
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
    vm.$log.debug('openProject');
    const deferred = vm.$q.defer();

    const result = vm.dialog.showOpenDialog({
      title: 'Open ParametricAnalysisTool Project',
      properties: ['openDirectory']
    });

    if (!_.isEmpty(result)) {
      const projectDir = jetpack.cwd(result[0]);
      vm.$log.debug('PAT Project dir path:', projectDir.path());

      if (projectDir.path().indexOf(' ') >= 0) {
        // tell user to expect trouble
        vm.whitespaceModal().then(response => {
        });
      }

      const fullFilename = projectDir.path('pat.json');

      // projectDir must contain "pat.json"
      let fileExists = false;
      vm.$log.debug('checking for ', fullFilename);
      const file = vm.jetpack.read(fullFilename);
      //vm.$log.debug('file: ', file);
      if (typeof file !== 'undefined') {
        vm.$log.debug(fullFilename, ' found');
        fileExists = true;
      } else {
        vm.$log.debug(fullFilename, ' not found');
        const allOSPs = vm.jetpack.find(projectDir.path(), {matching: '*.osp', recursive: false});
        if (allOSPs.length > 0) {
          vm.$log.debug('found osp in openProject');
          vm.$log.debug('path: ', projectDir.path());
          vm.dialog.showMessageBox({
            type: 'info',
            buttons: ['OK'],
            title: 'Open ParametricAnalysisTool Project',
            message: 'It appears you are trying to open a first-generation ParametricAnalysisTool project, and we are unable to translate it automatically to the new format for you.'
          });
        } else {
          vm.$log.debug('could not find pat.json in openProject');
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
        vm.$log.debug('fileExists!');
        vm.OsServer.stopServer('local').then(response => {
          vm.$log.debug('SetProjectService::stop server: server stopped');
          vm.$log.debug('response: ', response);

          // set project Variables
          vm.setProjectVariables(projectDir);

          vm.$state.transitionTo('analysis', {}, {reload: true});

          // resolve promise
          deferred.resolve('resolve');

          // Only start server if local server is selected?
          // For now: selected local run type and start local server
          vm.Project.setRunType(vm.Project.getRunTypes()[0]);
          // start local server at new location
          vm.OsServer.startServer().then(response => {
            vm.$log.debug('setProjectService::start server: server started');
            vm.$log.debug('response: ', response);
            vm.$log.debug('OsServer serverStatus: ', vm.OsServer.getServerStatus());
          });

        }, (error) => {
          vm.$log.debug('stop server errored, but setting project anyway');
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
    vm.$log.debug('setProject::openModal');

    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalProjectNameController',
      controllerAs: 'modal',
      templateUrl: 'app/project/project_name.html'
    });

    modalInstance.result.then(() => {
      vm.$log.debug('Resolving openModal()');
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
    vm.$log.debug('setProject::nestedProjectModal');

    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalNestedProjectWarningController',
      controllerAs: 'modal',
      templateUrl: 'app/project/nested_project_warning.html'
    });

    modalInstance.result.then(() => {
      vm.$log.debug('Resolving whitespaceModal()');
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
    vm.$log.debug('setProject::whitespaceModal');

    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalWhitespaceWarningController',
      controllerAs: 'modal',
      templateUrl: 'app/project/whitespace_warning.html'
    });

    modalInstance.result.then(() => {
      vm.$log.debug('Resolving whitespaceModal()');
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
