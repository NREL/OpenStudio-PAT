import jetpack from 'fs-jetpack';
import os from 'os';
import path from 'path';
import {remote} from 'electron';
import fs from 'fs';

const {app, dialog} = remote;

export class SetProject {
  constructor($log, $uibModal, Project, OsServer) {
    'ngInject';
    const vm = this;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.fs = fs;
    vm.dialog = dialog;
    vm.osServer = OsServer;
    vm.project = Project;
    vm.$uibModal = $uibModal;
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
    vm.openModal();

    const projectName = 'test';

    // pop modal to allow user to navigate to project parent folder
    const result = vm.dialog.showOpenDialog({
      title: 'Choose New ParametricAnalysisTool Project Folder',
      //buttonLabel: 'Select Folder',
      properties: ['openDirectory']
    });

    if (!_.isEmpty(result)) {
      const path = result[0];
      vm.$log.debug('PAT Project path:', path);
      const foldername = path.replace(/^.*[\\\/]/, '');
      vm.$log.debug('PAT Project folder name:', foldername);

      let fullFilename = path;
      fullFilename += '\\pat.json';

      let newProjectDir = path;
      newProjectDir += '/';
      newProjectDir += projectName;
      vm.$log.debug('newProjectDir:', newProjectDir);

      // create directory
      vm.jetpack.dir(newProjectDir);

      // for saveAs: copy old project's folder structure to new location
      vm.$log.debug('vm.project.getProjectName():', vm.project.getProjectName());
      //jetpack.copy(vm.project.getProjectName(), newProjectDir);

      //vm.relaunchUpdatedServer(newProjectDir);
    }
  }

  newProject() {
    const vm = this;
    vm.$log.debug('newProject');

    // pop modal to get new project name
    // pop modal to allow user to navigate to project parent folder
    // create folder

    // for new: use PAT to create required subfolder and necessary files

    // stop server at old location
    // verify local_configuration.receipt deleted (by the meta CLI?)
    // update osServer's project location
    // start server at new location
    // ... 40 second wait (local_configuration.receipt creation) ...

    const result = vm.dialog.showOpenDialog({
      title: 'New ParametricAnalysisTool Project',
      buttonLabel: 'openDirectory',
      properties: ['openDirectory']
    });

    if (!_.isEmpty(result)) {
      const path = result[0];
      vm.$log.debug('PAT Project path:', path);
      const foldername = path.replace(/^.*[\\\/]/, '');
      vm.$log.debug('PAT Project folder name:', foldername);

      let fullFilename = path;
      fullFilename += '\\pat.json';
    }
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
      const file = jetpack.read(fullFilename);
      vm.$log.debug('file: ', file);
      if (typeof file !== 'undefined') {
        vm.$log.debug(fullFilename, ' found');
        fileExists = true;
      } else {
        vm.$log.debug(fullFilename, ' not found');
        const allOSPs = jetpack.find(path, {matching: '*.osp', recursive: false});
        if (allOSPs.length > 0) {
          vm.$log.debug('found osp in openProject');
          vm.$log.debug('path: ', path);
          const result = vm.dialog.showMessageBox({
            type: 'info',
            buttons: ['OK'],
            title: 'Open ParametricAnalysisTool Project',
            message: 'It appears you are trying to open a first-generation ParametricAnalysisTool project, and we are unable to translate it automatically to the new format for you.'
          });
        } else {
          vm.$log.debug('could not find pat.json in openProject');
          const result = vm.dialog.showMessageBox({
            type: 'info',
            buttons: ['OK'],
            title: 'Open ParametricAnalysisTool Project',
            message: 'This is not a valid ParametricAnalysisTool project, as it has no file named "pat.json".'
          });
        }
      }

      if (fileExists) {
        vm.relaunchUpdatedServer(path);
      }
    }
  }

  openModal() {
    const vm = this;
    vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalProjectNameController',
      controllerAs: 'modal',
      templateUrl: 'app/project/project_name.html'
    });
  }

  relaunchUpdatedServer(projectDir) {
    const vm = this;

    // Stop server before changing projectDir
    vm.osServer.stopServer().then(response => {
      vm.$log.debug('setProjectService::relaunchUpdatedServer() server stopped');

      // update osServer's project location
      vm.project.setProjectDir = jetpack.dir(projectDir);

      // start server at new location
      vm.osServer.startServer().then(response => {
        vm.$log.debug('setProjectService::relaunchUpdatedServer() server started');
      });
    });
  }
}
