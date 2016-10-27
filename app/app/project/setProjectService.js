import jetpack from 'fs-jetpack';
import {remote} from 'electron';
import fs from 'fs';

const {dialog} = remote;

export class SetProject {
  constructor($q, $log, $uibModal, Project, OsServer) {
    'ngInject';
    const vm = this;
    vm.$q = $q;
    vm.$log = $log;
    vm.$uibModal = $uibModal;
    vm.fs = fs;
    vm.jetpack = jetpack;
    vm.dialog = dialog;
    vm.osServer = OsServer;
    vm.project = Project;
  }

  saveProject() {
    const vm = this;
    vm.$log.debug('saveProject');
    vm.project.exportPAT();
  }

  saveAsProject() {
    const vm = this;
    vm.$log.debug('saveAsProject');

    // pop modal to get new project name
    vm.openModal().then(response => {
      vm.$log.debug('response:', response);

      // pop modal to allow user to navigate to project parent folder
      const result = vm.dialog.showOpenDialog({
        title: 'Choose New ParametricAnalysisTool Project Folder',
        properties: ['openDirectory']
      });

      if (!_.isEmpty(result)) {
        const path = result[0];
        vm.$log.debug('PAT Project path:', path);

        let newProjectDir = path;
        newProjectDir += '\\';
        newProjectDir += vm.project.getProjectName();

        const oldProjectDir = vm.project.projectDir.path();
        vm.$log.debug('oldProjectDir:', oldProjectDir);
        vm.$log.debug('newProjectDir:', newProjectDir);

        // set new project directory
        vm.project.projectDir = newProjectDir;

        // stop server
        // TODO!

        // for saveAs: copy old project's folder structure to new location (from, to)
        vm.jetpack.copy(oldProjectDir, newProjectDir);

        // start server at new location
        // TODO!
        //vm.osServer.startServer().then(response => {
        //  vm.$log.debug('setProjectService::saveAsProject() server started');
        //  vm.$log.debug('response: ', response);
        //});
      }
    });
  }

  newProject() {
    const vm = this;
    vm.$log.debug('newProject');

    // pop modal to get new project name
    vm.openModal().then(response => {
      vm.$log.debug('response:', response);

      // pop modal to allow user to navigate to project parent folder
      const result = vm.dialog.showOpenDialog({
        title: 'Choose New ParametricAnalysisTool Project Folder',
        properties: ['openDirectory']
      });

      if (!_.isEmpty(result)) {
        const path = result[0];
        vm.$log.debug('PAT Project path:', path);

        let newProjectDir = path;
        newProjectDir += '\\';
        newProjectDir += vm.project.getProjectName();

        const oldProjectDir = vm.project.projectDir.path();
        vm.$log.debug('oldProjectDir:', oldProjectDir);
        vm.$log.debug('newProjectDir:', newProjectDir);

        // set new project directory
        vm.project.projectDir = newProjectDir;

        // stop server
        // TODO!

        // for new: use PAT to create required subfolder and necessary files
        vm.project.initializeProject();

        // start server at new location
        // TODO!
        //vm.osServer.startServer().then(response => {
        //  vm.$log.debug('setProjectService::saveAsProject() server started');
        //  vm.$log.debug('response: ', response);
        //});
      }
    });
  }

  openProject() {
    const vm = this;
    vm.$log.debug('openProject');

    const result = vm.dialog.showOpenDialog({
      title: 'Open ParametricAnalysisTool Project',
      properties: ['openDirectory']
    });

    if (!_.isEmpty(result)) {
      const path = result[0];
      vm.$log.debug('PAT Project path:', path);
      const foldername = path.replace(/^.*[\\\/]/, '');
      vm.$log.debug('PAT Project folder name:', foldername);

      let fullFilename = path;
      fullFilename += '\\pat.json';

      // foldername must contain "pat.json"
      let fileExists = false;
      vm.$log.debug('checking for ', fullFilename);
      const file = vm.jetpack.read(fullFilename);
      vm.$log.debug('file: ', file);
      if (typeof file !== 'undefined') {
        vm.$log.debug(fullFilename, ' found');
        fileExists = true;
      } else {
        vm.$log.debug(fullFilename, ' not found');
        const allOSPs = vm.jetpack.find(path, {matching: '*.osp', recursive: false});
        if (allOSPs.length > 0) {
          vm.$log.debug('found osp in openProject');
          vm.$log.debug('path: ', path);
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
        vm.project.setProject(foldername, path);
        vm.project.initializeProject();
        vm.relaunchUpdatedServer(path);
      }
    }
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
      deferred.resolve('resolved');
    }, () => {
      // Modal canceled
      deferred.reject('rejected');
    });
    return deferred.promise;
  }

  relaunchUpdatedServer(projectDir) {
    const vm = this;

    // Stop server before changing projectDir
    vm.osServer.stopServer().then(response => {

      vm.$log.debug('setProjectService::relaunchUpdatedServer() server stopped');
      vm.$log.debug('response: ', response);

      // update osServer's project location
      vm.project.setProjectPath = (projectDir);

      // start server at new location
      vm.osServer.startServer().then(response => {
        vm.$log.debug('setProjectService::relaunchUpdatedServer() server started');
        vm.$log.debug('response: ', response);
      });
    });
  }
}
