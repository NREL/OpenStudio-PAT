import jetpack from 'fs-jetpack';
import {remote} from 'electron';
const {shell} = remote;

export class ModalDependencyController {

  constructor($log, $q, $uibModalInstance, $uibModal, $scope, toastr, BCL, params, Project, MeasureManager) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.$q = $q;
    vm.$uibModal = $uibModal;
    vm.$scope = $scope;
    vm.BCL = BCL;
    vm.Project = Project;
    vm.toastr = toastr;
    vm.jetpack = jetpack;
    vm.shell = shell;
    vm.params = params;
    vm.MeasureManager = MeasureManager;

    vm.selected = null;
    vm.keyword = '';

    vm.myMeasuresDir = vm.Project.getMeasureDir();
    vm.localDir = vm.Project.getLocalBCLDir();
    vm.projectDir = vm.Project.getProjectMeasuresDir();
  }




  ok() {
    const vm = this;
    // save pretty options in case changes were made to project measures
    vm.Project.savePrettyOptions();
    vm.$log.debug('Project Measures: ', vm.projectMeasures);
    vm.$uibModalInstance.close();
  }



}
