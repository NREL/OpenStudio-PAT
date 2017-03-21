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
//const {shell} = require('electron');
import {remote} from 'electron';
const {shell} = remote;

export class ModalBclController {

  constructor($log, $q, $uibModalInstance, $timeout, $uibModal, uiGridConstants, $scope, $translate, toastr, BCL, params, Project, MeasureManager, Message) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.uiGridConstants = uiGridConstants;
    vm.$log = $log;
    vm.$q = $q;
    vm.$uibModal = $uibModal;
    vm.$timeout = $timeout;
    vm.$scope = $scope;
    vm.BCL = BCL;
    vm.Project = Project;
    vm.toastr = toastr;
    vm.jetpack = jetpack;
    vm.shell = shell;
    vm.params = params;
    vm.$translate = $translate;
    vm.MeasureManager = MeasureManager;
    vm.Message = Message;

    vm.selected = null;
    vm.keyword = '';

    vm.$scope.addingInProgress = false;
    vm.$scope.downloadInProgress = false;

    vm.projectDir = vm.Project.getProjectMeasuresDir();

    vm.filters = {
      my: true,
      local: true,
      bcl: false,
      project: true
    };

    vm.types = {
      ModelMeasure: true,
      EnergyPlusMeasure: true,
      ReportingMeasure: true
    };

    // get BCL categories
    vm.$scope.categories = vm.BCL.getBCLCategories();

    // set filters and types with incoming params
    vm.setTypes();
    vm.setFilters();

    // get project measures
    vm.projectMeasures = vm.Project.getMeasuresAndOptions();
    vm.designAlternatives = vm.Project.getDesignAlternatives();
    if (vm.Message.showDebug()) vm.$log.debug('Project Measures(): ', vm.projectMeasures);

    // get measures array for Library display
    vm.$scope.displayMeasures = [];

    // initialize structure of libMeasures
    vm.libMeasures = {
      my: [],
      local: [],
      bcl: []
    };

    // get all measures (this also checks for updates)
    vm.BCL.getMeasures().then((measures) => {
      vm.libMeasures = measures;
      if (vm.Message.showDebug()) vm.$log.debug('***LibMeasures retrieved from BCL.getMeasures(): ', vm.libMeasures);
      // reload BCL measures
      vm.getBCLMeasures();

      // apply filters
      vm.resetFilters();

      if (vm.Message.showDebug()) vm.$log.debug('DISPLAY MEASURES', vm.$scope.displayMeasures);

    });

    // Library grid
    vm.libraryGridOptions = {
      columnDefs: [{
        name: 'display_name',
        displayName: 'bcl.columns.name',
        enableCellEdit: false,
        headerCellFilter: 'translate',
        width: '35%',
        cellTooltip: function (row) {
          return row.entity.display_name;
        }
      }, {
        name: 'location',
        displayName: '',
        enableCellEdit: false,
        cellClass: 'location-cell',
        cellTemplate: '<span>{{row.entity.location == "my" ? "My" : "BCL"}}</span>',
        width: '9%'
      }, {
        name: 'type',
        displayName: 'bcl.columns.type',
        cellTemplate: '<img ng-src="assets/images/{{grid.getCellValue(row, col)}}_icon.png" alt="{{grid.getCellValue(row, col)}}">',
        enableCellEdit: false,
        enableSorting: false,
        cellClass: 'icon-cell',
        headerCellFilter: 'translate',
        width: '14%'
      }, /*{
       name: 'author',
       displayName: 'bcl.columns.author',
       enableCellEdit: false,
       headerCellFilter: 'translate',
       visible: false
       }, */
        {
          name: 'date',
          displayName: 'bcl.columns.date',
          cellFilter: 'date:"dd/MM/yyyy"',
          enableCellEdit: false,
          headerCellFilter: 'translate',
          type: 'date',
          width: '10%'
        }, {
          name: 'edit',
          displayName: 'bcl.columns.edit',
          cellClass: 'dropdown-button',
          cellTemplate: 'app/bcl/editButtonTemplate.html',
          enableCellEdit: false,
          headerCellFilter: 'translate',
          width: '13%'
        }, {
          name: 'status',
          displayName: 'bcl.columns.status',
          cellClass: 'icon-cell',
          cellTemplate: 'app/bcl/updateButtonTemplate.html',
          enableCellEdit: false,
          headerCellFilter: 'translate',
          width: '10%'
        }, {
          name: 'add',
          displayName: 'bcl.columns.add',
          cellClass: 'icon-cell',
          cellTemplate: 'app/bcl/addButtonTemplate.html',
          enableCellEdit: false,
          headerCellFilter: 'translate',
          width: '9%'
        }],
      data: 'displayMeasures',
      rowHeight: 45,
      /*enableCellEditOnFocus: true,*/
      enableHiding: false,
      enableColumnMenus: false,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        vm.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged(null, row => {
          if (row.isSelected) {
            vm.selected = row.entity;
          } else {
            // No rows selected
            vm.selected = null;
          }
        });
        gridApi.cellNav.on.navigate(null, newRowCol => {
          vm.gridApi.selection.selectRow(newRowCol.row.entity);
        });
      }
    };
  }

  // set filters from parameters (if array isn't empty)
  setFilters() {
    const vm = this;
    if (!vm.params.filters.length == 0) {
      _.forEach(vm.filters, (val, key) => {
        vm.filters[key] = !!_.includes(vm.params.filters, key);
      });
    }
  }

  // set types from parameters (if array isn't empty)
  setTypes() {
    const vm = this;
    if (!vm.params.types.length <= 0) {
      _.forEach(vm.types, (val, key) => {
        vm.types[key] = !!_.includes(vm.params.types, key);
      });
    }
  }

  getBCLMeasures() {
    const vm = this;
    vm.BCL.getBCLMeasures().then(response => {
      vm.libMeasures.bcl = response;
    });
  }

  // get measures for display based on filter values
  setDisplayMeasures() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in setDisplayMeasures');
    if (vm.Message.showDebug()) vm.$log.debug('FILTERS: ', vm.filters);
    const measures = [];

    // special case: show only project measures
    if (vm.filters.project) {
      // go through my and local and add only 'addedToProject'
      _.forEach(vm.libMeasures.my, m => {
        if (m.addedToProject) {
          // add if not found
          if (!(_.find(measures, {uid: m.uid, location: 'my'}))){
            measures.push(m);
          }
        }
      });
      _.forEach(vm.libMeasures.local, m => {
        if (m.addedToProject) {
          // add if not found
          if (!(_.find(measures, {uid: m.uid, location: 'local'}))){
            measures.push(m);
          }
        }
      });
    }
    // add other checked
    _.forEach(vm.filters, (val, key) => {
      if (val) {
        if (vm.Message.showDebug()) vm.$log.debug('key: ', key);
        if (vm.Message.showDebug()) vm.$log.debug('measures: ', vm.libMeasures[key]);
        _.forEach(vm.libMeasures[key], m => {
          // add if not found (BCL online only)
          if (key == 'bcl') {
            // add if local measure of same UID isn't already added
            if (!(_.find(measures, {uid: m.uid, location: 'local'}))) measures.push(m);
          } else {
            // add if uid and location not found
            if (!(_.find(measures, {uid: m.uid, location: m.location}))) measures.push(m);
          }
        });
      }
    });

    vm.$scope.displayMeasures = measures;
    if (vm.Message.showDebug()) vm.$log.debug('***DisplayMeasures: ', vm.$scope.displayMeasures);
    return measures;
  }

  // process measures filter changes
  resetFilters(level = null, namesArr = []) {
    const vm = this;
    vm.setDisplayMeasures();
    vm.resetTypeFilters();
    vm.resetCategoryFilters(level, namesArr);
  }

  // process measure type filter changes
  resetTypeFilters() {
    const vm = this;
    const typesArr = [];
    _.forEach(vm.types, (val, key) => {

      if (val) {
        typesArr.push(key);
      }
    });
    const newMeasures = [];
    _.forEach(vm.$scope.displayMeasures, (m) => {
      if (_.includes(typesArr, m.type)) newMeasures.push(m);
    });

    vm.$scope.displayMeasures = _.filter(vm.$scope.displayMeasures, m => {
      return _.includes(typesArr, m.type);
    });
  }

  // filter measure by BCL categories
  resetCategoryFilters(level = null, namesArr = []) {
    const vm = this;
    const catsArr = [];

    if (vm.Message.showDebug()) vm.$log.debug('level: ', level, ' namesArr: ', namesArr);

    // first check/uncheck sub categories (if a filter change just happened)
    if (level != null) {
      if (level == 1) {
        _.forEach(vm.$scope.categories, (cat1) => {
          if (cat1.name == namesArr[0]) {
            // set/unset to match cat1
            _.forEach(cat1.children, (cat2) => {
              cat2.checked = cat1.checked;
              _.forEach(cat2.children, (cat3) => {
                cat3.checked = cat1.checked;
              });
            });
          }
        });
      } else if (level == 2) {
        _.forEach(vm.$scope.categories, (cat1) => {
          if (cat1.name == namesArr[0]) {
            _.forEach(cat1.children, (cat2) => {
              if (cat2.name == namesArr[1]) {
                _.forEach(cat2.children, (cat3) => {
                  cat3.checked = cat2.checked;
                });
                // if unchecking, must uncheck higher cat
                if (cat2.checked == false) {
                  cat1.checked = cat2.checked;
                }
              }
            });
          }
        });
      } else if (level == 3) {
        _.forEach(vm.$scope.categories, (cat1) => {
          if (cat1.name == namesArr[0]) {
            _.forEach(cat1.children, (cat2) => {
              if (cat2.name == namesArr[1]) {
                _.forEach(cat2.children, (cat3) => {
                  if (cat3.name == namesArr[2]) {
                    if (cat3.checked == false) {
                      cat2.checked = cat3.checked;
                      cat1.checked = cat3.checked;
                    }
                  }
                });
              }
            });
          }
        });
      }
    }

    // now traverse nested structure and find all names with checked == true
    _.forEach(vm.$scope.categories, (cat1) => {

      if (cat1.checked) {
        // add checked to filter list
        catsArr.push(cat1.name);

      } else {
        // look on 2nd level
        _.forEach(cat1.children, (cat2) => {
          if (cat2.checked) {
            catsArr.push(cat2.name);
          } else {
            // look on 3rd level
            _.forEach(cat2.children, (cat3) => {
              if (cat3.checked) {
                catsArr.push(cat3.name);
              }
            });
          }
        });
      }
    });

    // then look at all measure and see if the tags contain any of the items in the array
    if (catsArr.length > 0) {
      vm.$scope.displayMeasures = _.filter(vm.$scope.displayMeasures, m => {
        let found = false;
        _.forEach(catsArr, (cat) => {
          if (m.tags.indexOf(cat) > -1) {
            found = true;
          }
        });
        return found;
      });
    }
  }

  // add measure to project
  addMeasure(rowEntity) {

    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('Adding this row to project: ', rowEntity);
    const measure = _.find(vm.$scope.displayMeasures, {uid: rowEntity.uid, location: rowEntity.location});

    // first check for uniqueness of measure name
    const match = _.find(vm.projectMeasures, {name: measure.name});
    if (vm.Message.showDebug()) vm.$log.debug('measure name match: ', match);
    if (match) {
      // there is already a measure with this name, to ensure uniqueness, can't add this second measure
      vm.$log.error('Can\'t add measure to project: there is already a measure with that name added');
      vm.$translate('toastr.measureNameAlreadyAdded').then( translation => {
        vm.toastr.error(translation);
      });
    } else {
      vm.addToProject(measure);
      vm.setMeasureInExistingDAs(measure);
      if (vm.Message.showDebug()) vm.$log.debug('Adding the following measure to project: ', measure);
      if (vm.Message.showDebug()) vm.$log.debug('New project measures array: ', vm.projectMeasures);
    }
  }

  addToProject(measure) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalBCL::addToProject');

    // prevent user from closing modal until measure is done getting added
    vm.$scope.addInProgress = true;

    // copy on disk
    const dirNames = _.split(measure.measure_dir, '/');
    const dirName = _.last(dirNames);
    // overwrite if measure is already in project folder
    vm.jetpack.copy(measure.measure_dir, vm.projectDir.path(dirName), {overwrite: true});

    // add to project measures
    measure.addedToProject = true;
    // set default seed (and use to compute arguments
    measure.seed = vm.Project.getDefaultSeed();
    vm.Project.computeMeasureArguments(measure).then(response => {
      measure = response;
      if (vm.Message.showDebug()) vm.$log.debug('New Measure with computed args: ', measure);
      const project_measure = angular.copy(measure);
      project_measure.measure_dir = vm.projectDir.path(dirName);
      vm.insertIntoProjectMeasuresArray(project_measure);

      vm.$translate('toastr.measureAdded').then( translation => {
        vm.toastr.success(translation);
      });
      vm.$scope.addInProgress = false;
    }, error => {
      if (vm.Message.showDebug()) vm.$log.debug('Error in MM compute args.  Will add measure as is: ', error);
      const project_measure = angular.copy(measure);
      project_measure.measure_dir = vm.projectDir.path(dirName);
      vm.insertIntoProjectMeasuresArray(project_measure);
      vm.$translate('toastr.measureAddedError').then( translation => {
        vm.toastr.error(translation);
      });
      vm.$scope.addInProgress = false;
    });

  }

  setMeasureInExistingDAs(measure) {
    const vm = this;

    _.forEach(vm.designAlternatives, (alt) => {
      alt[measure.name] = 'None';
    });

  }

  insertIntoProjectMeasuresArray(project_measure) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalBCL::insertIntoProjectMeasuresArray');
    // order = model, energyplus, reporting
    // check type
    if (_.findIndex(vm.projectMeasures, {type: project_measure.type}) != -1) {
      // figure out where to put new measure in array
      const index = _.findLastIndex(vm.projectMeasures, {type: project_measure.type});
      // add to array at the end of the correct measure type section
      vm.projectMeasures.splice(index + 1, 0, project_measure);
    } else {
      // first measure of this type
      if (project_measure.type == 'ModelMeasure') {
        // append to front
        vm.projectMeasures.splice(0, 0, project_measure);
      } else if (project_measure.type == 'EnergyPlusMeasure') {
        const index2 = _.findLastIndex(vm.projectMeasures, {type: 'ModelMeasure'});
        if (index2 != -1) {
          // add after model measures
          vm.projectMeasures.splice(index2 + 1, 0, project_measure);
        } else {
          // no model measures, append to front
          vm.projectMeasures.splice(0, 0, project_measure);
        }
      } else {
        // append to end
        vm.projectMeasures.push(project_measure);
      }
    }
    // recalculate workflow_indexes
    vm.Project.recalculateMeasureWorkflowIndexes();
  }

  // download from BCL (via service)
  download(measure) {
    const vm = this;
    const deferred = vm.$q.defer();
    // prevent user from closing modal
    vm.$scope.downloadInProgress = true;
    vm.$translate('toastr.downloadingMeasure').then(translation => {
      vm.toastr.info(translation);
    });
    vm.BCL.downloadBCLMeasure(measure).then(newMeasure => {
      if (vm.Message.showDebug()) vm.$log.debug('In modal download()');
      if (vm.Message.showDebug()) vm.$log.debug('new measure: ', newMeasure);
      // if (vm.Message.showDebug()) vm.$log.debug('Local Measures, update?: ', vm.libMeasures.local);
      // check for updates in case this measure is somehow already added to project
      vm.BCL.checkForUpdatesLocalBcl().then(() => {
        vm.resetFilters();
        // select newly added row
        vm.selectARow(measure.uid);
        vm.$scope.downloadInProgress = false;
        vm.$translate('toastr.measureDownloaded').then(translation => {
          vm.toastr.success(translation);
        });
        deferred.resolve('success');
      }, () => {
        if (vm.Message.showDebug()) vm.$log.debug('Error checking for local BCL updates...');
        vm.$scope.downloadInProgress = false;
        vm.$translate('toastr.measureDownloaded').then(translation => {
          vm.toastr.success(translation);
        });
        deferred.resolve('measure downloaded successfully but not updated');
      });

    }, () => {
      vm.$scope.downloadInProgress = false;
      vm.$translate('toastr.measureDownloadedError').then(translation => {
        vm.toastr.error(translation);
      });
      deferred.reject();
    });

    return deferred.promise;
  }

  // select row in table based on UID
  selectARow(uid) {
    const vm = this;
    const index = _.findIndex(vm.$scope.displayMeasures, {uid: uid});
    vm.gridApi.grid.modifyRows(vm.$scope.displayMeasures);
    vm.gridApi.selection.selectRow(vm.$scope.displayMeasures[index]);
    // scroll to row
    vm.$timeout(function () {
      vm.gridApi.cellNav.scrollToFocus(vm.$scope.displayMeasures[index], vm.libraryGridOptions.columnDefs[0]);
    });
  }

  // edit My measure
  editMeasure(measure) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in EDIT MEASURE function');
    console.log(measure.measure_dir + '/measure.rb');
    // show toastr for 2 seconds then open file
    vm.$translate('toastr.openMeasure').then( translation => {
      vm.toastr.info(translation, {
        timeOut: 3000, onHidden: function () {
          //if (vm.Message.showDebug()) vm.$log.debug('Opening measure file');
          vm.shell.openItem(measure.measure_dir + '/measure.rb');
        }
      });
    });

  }

  // update LocalBCL measure from Online BCL
  updateLocalBCLMeasure(measure, updateProject = false) {
    const vm = this;
    const deferred = vm.$q.defer();
    const originalStatus = angular.copy(measure.status);
    if (vm.Message.showDebug()) vm.$log.debug('in UPDATE LOCAL BCL MEASURE function');

    // delete from disk first
    vm.jetpack.remove(measure.measure_dir);

    // download from BCL & prepare (overwrite files on disk)
    vm.download(measure).then(() => {

      // unset 'bcl update' status on original measure
      measure.bcl_update = false;
      vm.$translate('toastr.updatedMeasureLocal').then(translation => {
        vm.toastr.success(translation);
      });

      if (updateProject) {
        vm.updateProjectMeasure(measure).then(() => {
          deferred.resolve();
        });
      } else {
        // restore status (in case didn't update measure in project)
        measure.status = originalStatus;
        deferred.resolve();
      }
    });

    return deferred.promise;
  }

  // update Project measure
  updateProjectMeasure(measure) {
    const vm = this;
    const deferred = vm.$q.defer();
    if (vm.Message.showDebug()) vm.$log.debug('in UPDATE PROJECT MEASURE function');

    // delete old directory first (in projectMeasures)
    const dirNames = _.split(measure.measure_dir, '/');
    const dirName = _.last(dirNames);
    vm.jetpack.remove(vm.projectDir.path(dirName));  // it's possible that the name has changed...if so, the old measureDir will remain.

    // copy on disk
    vm.jetpack.copy(measure.measure_dir, vm.projectDir.path(dirName), {overwrite: true});

    // set seed path
    const defaultSeed = vm.Project.getDefaultSeed();
    const seedDir = vm.Project.getSeedDir();
    const osmPath = (defaultSeed == null) ? null : seedDir.path(defaultSeed);

    // retrieve newly copied measure data (with calculated arguments)
    vm.MeasureManager.computeArguments(vm.projectDir.path(dirName), osmPath).then((newMeasure) => {
      // success
      // if (vm.Message.showDebug()) vm.$log.debug('New computed measure: ', newMeasure);
      // merge project measure in array to preserve prepareMeasure arguments and already-set arguments
      // get ALL project_measures that match the UID and the location (my vs local)
      const project_measures = _.filter(vm.projectMeasures, {uid: measure.uid, location: measure.location});
      // remove arguments that no longer exist (by name) (in reverse) (except for special display args)
      if (vm.Message.showDebug()) vm.$log.debug('Project Measures to Update: ', project_measures);
      _.forEach(project_measures, (project_measure) => {
        _.forEachRight(project_measure.arguments, (arg, index) => {
          if (_.isUndefined(arg.specialRowId)) {
            const match = _.find(measure.arguments, {name: arg.name});
            if (_.isUndefined(match)) {
              project_measure.arguments.splice(index, 1);
              // if (vm.Message.showDebug()) vm.$log.debug('removing argument: ', arg.name);
            }
          }
        });
        // then add/merge (at argument level)
        _.forEach(newMeasure.arguments, (arg) => {
          const match = _.find(project_measure.arguments, {name: arg.name});
          if (_.isUndefined(match)) {
            // if (vm.Message.showDebug()) vm.$log.debug('adding argument: ', arg.name);
            project_measure.arguments.push(arg);
          } else {
            // if (vm.Message.showDebug()) vm.$log.debug('merging argument: ', arg.name);
            _.merge(match, arg);
            // if (vm.Message.showDebug()) vm.$log.debug('merged match: ', match);
          }
        });
        // unset 'update' status on original measure
        measure.status = '';
        // remove arguments and merge rest with project_measure
        const measure_copy = angular.copy(measure);
        delete measure_copy.arguments;
        delete measure_copy.open;
        _.assignIn(project_measure, measure_copy);

        if (vm.Message.showDebug()) vm.$log.debug('updated project measure: ', project_measure);
        vm.$translate('toastr.updatedMeasureProject').then(translation => {
          vm.toastr.success(translation);
        });
      });

      deferred.resolve();

    }, () => {
      // failure
      //if (vm.Message.showDebug()) vm.$log.debug('Measure Manager computeArguments failed');
      deferred.reject();
    });

    return deferred.promise;
  }

  // update button
  updateAMeasure(measure) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in Update A Measure function');
    //const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalUpdateMeasureController',
      controllerAs: 'modal',
      templateUrl: 'app/bcl/update_measure.html',
      windowClass: 'modal',
      resolve: {
        measure: function () {
          return measure;
        }
      }
    });

    modalInstance.result.then((action) => {
      if (action == 'updateProject') {
        vm.updateProjectMeasure(measure);

      } else if (action == 'updateLocalLib') {
        vm.updateLocalBCLMeasure(measure);

      } else if (action == 'updateLocalLibAndProject') {
        vm.updateLocalBCLMeasure(measure, true);

      } else {
        if (vm.Message.showDebug()) vm.$log.debug('Invalid action in modal');
      }
    });
  }

  // copy from local and edit (2X)
  copyAndEditMeasure(measure) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in COPY AND EDIT function');
    const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalDuplicateMeasureController',
      controllerAs: 'modal',
      templateUrl: 'app/bcl/duplicate_measure.html',
      windowClass: 'modal',
      resolve: {
        measure: function () {
          return measure;
        }
      }
    });

    modalInstance.result.then((params) => {
      vm.MeasureManager.duplicateMeasure(params).then((newMeasure) => {
        // success
        if (vm.Message.showDebug()) vm.$log.debug('Measure Manager duplicateMeasure succeeded');
        // add and prepare new measure
        newMeasure = vm.BCL.prepareMeasure(newMeasure, 'my');
        vm.libMeasures.my.push(newMeasure);
        vm.resetFilters();
        // select newly added row
        vm.selectARow(newMeasure.uid);
        vm.$translate('toastr.measureDuplicated').then( translation => {
          vm.toastr.success(translation);
        });
        deferred.resolve();
      }, () => {
        // failure
        if (vm.Message.showDebug()) vm.$log.debug('Measure Manager duplicateMeasure failed');
        vm.$translate('toastr.measureDuplicatedError').then( translation => {
          vm.toastr.error(translation);
        });
        deferred.reject();
      });
    }, () => {
      // Modal canceled
      if (vm.Message.showDebug()) vm.$log.debug('DuplicateMeasure Modal was canceled');
      deferred.reject();
    });

    return deferred.promise;
  }

  ok() {
    const vm = this;
    // save pretty options in case changes were made to project measures
    vm.Project.savePrettyOptions();
    if (vm.Message.showDebug()) vm.$log.debug('Project Measures: ', vm.projectMeasures);
    vm.$uibModalInstance.close();
  }

  search() {
    // TODO
  }

  createNewMeasure() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('ModalBCL::createNewMeasure');

    const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalCreateNewMeasureController',
      controllerAs: 'modal',
      templateUrl: 'app/bcl/create_new_measure.html',
      windowClass: 'modal',
      resolve: {
        measure: function () {
          const bclCategories = vm.BCL.getBCLCategories();
          if (vm.Message.showDebug()) vm.$log.debug('bclCategories: ', bclCategories);
        }
      }
    });

    modalInstance.result.then((params) => {
      vm.MeasureManager.createNewMeasure(params).then((newMeasure) => {
        // success
        if (vm.Message.showDebug()) vm.$log.debug('ModalBclController::createNewMeasure succeeded');
        // add and prepare new measure
        newMeasure = vm.BCL.prepareMeasure(newMeasure, 'my');
        vm.libMeasures.my.push(newMeasure);
        vm.resetFilters();
        // select newly added row
        vm.selectARow(newMeasure.uid);
        vm.editMeasure(newMeasure);
        deferred.resolve();
      }, () => {
        // failure
        if (vm.Message.showDebug()) vm.$log.debug('ModalBclController::createNewMeasure failed');
        deferred.reject();
      });
    }, () => {
      // Modal canceled
      if (vm.Message.showDebug()) vm.$log.debug('ModalBclController::createNewMeasure was canceled');
      deferred.reject();
    });

    return deferred.promise;
  }

}
