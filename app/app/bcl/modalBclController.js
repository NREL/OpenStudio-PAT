import jetpack from 'fs-jetpack';
//const {shell} = require('electron');
import {remote} from 'electron';
const {shell} = remote;

export class ModalBclController {

  constructor($log, $q, $uibModalInstance, $timeout, $uibModal, uiGridConstants, $scope, toastr, BCL, params, Project, MeasureManager) {
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
    vm.MeasureManager = MeasureManager;

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
    vm.$log.debug('Project Measures(): ', vm.projectMeasures);

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
      vm.$log.debug('***LibMeasures retrieved from BCL.getMeasures(): ', vm.libMeasures);
      // reload BCL measures
      vm.getBCLMeasures();

      // _.forEach(vm.libMeasures.my, (m) => {
      //   vm.$log.debug('Added to project: ', m.addedToProject, 'measure: ', m.name);
      // });

      // apply filters
      vm.resetFilters();

      vm.$log.debug('DISPLAY MEASURES', vm.$scope.displayMeasures);

    });

    // Library grid
    vm.libraryGridOptions = {
      columnDefs: [{
        name: 'display_name',
        displayName: 'bcl.columns.name',
        enableCellEdit: false,
        headerCellFilter: 'translate',
        width: '35%',
        cellTooltip: function(row) {
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
      enableVerticalScrollbar:uiGridConstants.scrollbars.ALWAYS,
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
    vm.$log.debug('in setDisplayMeasures');
    vm.$log.debug('FILTERS: ', vm.filters);
    const measures = [];

    // special case: show only project measures
    if (vm.filters.project) {
      // go through my and local and add only 'addedToProject'
      _.forEach(vm.libMeasures.my, m => {
        if (m.addedToProject) {
          // add if not found
          if (!(_.find(measures, {uid: m.uid}))) measures.push(m);
        }
      });
      _.forEach(vm.libMeasures.local, m => {
        if (m.addedToProject) {
          // add if not found
          if (!(_.find(measures, {uid: m.uid}))) measures.push(m);
        }
      });
    }
    // add other checked
    _.forEach(vm.filters, (val, key) => {
      if (val) {
        vm.$log.debug('key: ', key);
        vm.$log.debug('measures: ', vm.libMeasures[key]);
        _.forEach(vm.libMeasures[key], m => {
          // add if not found
          if (!(_.find(measures, {uid: m.uid}))) measures.push(m);
        });
      }
    });

    vm.$scope.displayMeasures = measures;
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

    vm.$log.debug('level: ', level, ' namesArr: ', namesArr);

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
    const measure = _.find(vm.$scope.displayMeasures, {uid: rowEntity.uid});

    vm.addToProject(measure);
    vm.setMeasureInExistingDAs(measure);
    vm.$log.debug('Adding the following measure to project: ', measure);
    vm.$log.debug('New project measures array: ', vm.projectMeasures);
  }

  addToProject(measure) {
    const vm = this;
    vm.$log.debug('ModalBCL::addToProject');

    // prevent user from closing modal until measure is done getting added
    vm.$scope.addInProgress = true;

    // copy on disk
    const dirNames = _.split(measure.measure_dir, '/');
    const dirName = _.last(dirNames);
    //overwrite if measure is already in project folder
    vm.jetpack.copy(measure.measure_dir, vm.projectDir.path(dirName), {overwrite: true});

    // add to project measures
    measure.addedToProject = true;
    // set default seed (and use to compute arguments
    measure.seed = vm.Project.getDefaultSeed();
    vm.Project.computeMeasureArguments(measure).then(response => {
      measure = response;
      vm.$log.debug('New Measure with computed args: ', measure);
      const project_measure = angular.copy(measure);
      project_measure.measure_dir = vm.projectDir.path(dirName);
      vm.insertIntoProjectMeasuresArray(project_measure);
      vm.toastr.success('Measure Added to Project!');
      vm.$scope.addInProgress = false;
    }, error => {
      vm.$log.debug('Error in MM compute args.  Will add measure as is: ', error);
      const project_measure = angular.copy(measure);
      project_measure.measure_dir = vm.projectDir.path(dirName);
      vm.insertIntoProjectMeasuresArray(project_measure);
      vm.toastr.error('Measure added to project without computing arguments');
      vm.$scope.addInProgress = false;
    });

  }

  setMeasureInExistingDAs(measure){
    const vm = this;

    _.forEach(vm.designAlternatives, (alt) => {
      alt[measure.name] = 'None';
    });

  }

  insertIntoProjectMeasuresArray(project_measure) {
    const vm = this;
    vm.$log.debug('ModalBCL::insertIntoProjectMeasuresArray');
    // order = model, energyplus, reporting
    // check type
    if (_.findIndex(vm.projectMeasures, {type: project_measure.type}) != -1) {
      // figure out where to put new measure in array
      const index = _.findLastIndex(vm.projectMeasures, {type: project_measure.type });
      // add to array at the end of the correct measure type section
      vm.projectMeasures.splice(index + 1, 0, project_measure);
    } else {
      // first measure of this type
      if (project_measure.type == 'ModelMeasure') {
        // append to front
        vm.projectMeasures.splice(0,0, project_measure);
      }  else if (project_measure.type == 'EnergyPlusMeasure') {
        const index2 = _.findLastIndex(vm.projectMeasures, {type: 'ModelMeasure' });
        if (index2 != -1) {
          // add after model measures
          vm.projectMeasures.splice(index2 + 1, 0, project_measure);
        } else {
          // no model measures, append to front
          vm.projectMeasures.splice(0,0, project_measure);
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
    vm.toastr.info('Downloading measure from the BCL...');
    vm.BCL.downloadBCLMeasure(measure).then(newMeasure => {
      vm.$log.debug('In modal download()');
      vm.$log.debug('Local Measures: ', vm.libMeasures.local);
      vm.$log.debug('new measure: ', newMeasure);
      vm.resetFilters();
      // select newly added row
      vm.selectARow(measure.uid);
      vm.$scope.downloadInProgress = false;
      vm.toastr.success('Measure Downloaded!');
      deferred.resolve();

    }, () => {
      vm.$scope.downloadInProgress = false;
      vm.toastr.error('Measure Download Error');
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
    vm.$timeout(function() {
      vm.gridApi.cellNav.scrollToFocus(vm.$scope.displayMeasures[index], vm.libraryGridOptions.columnDefs[0]);
    });
  }

  // edit My measure
  editMeasure(measure) {
    const vm = this;
    vm.$log.debug('in EDIT MEASURE function');
    console.log(measure.measure_dir + '/measure.rb');
    // show toastr for 2 seconds then open file
    const msg = 'Measure \'' + measure.name + '\' will open in a text editor for editing.';
    vm.toastr.info(msg, {
      timeOut: 3000, onHidden: function () {
        //vm.$log.debug('Opening measure file');
        vm.shell.openItem(measure.measure_dir + '/measure.rb');
      }
    });
  }

  // update LocalBCL measure from Online BCL
  updateLocalBCLMeasure(measure, updateProject = false) {
    const vm = this;
    const deferred = vm.$q.defer();
    const originalStatus = angular.copy(measure.status);
    vm.$log.debug('in UPDATE LOCAL BCL MEASURE function');

    // delete from disk first
    vm.jetpack.remove(measure.measure_dir);

    // download from BCL & prepare (overwrite files on disk)
    vm.download(measure).then(() => {

      // unset 'bcl update' status on original measure
      measure.bcl_update = false;
      const msg = 'Measure \'' + measure.display_name + '\' was successfully updated in your local BCL.';
      vm.toastr.success(msg);

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
    vm.$log.debug('in UPDATE PROJECT MEASURE function');

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
      // vm.$log.debug('New computed measure: ', newMeasure);
      // merge project measure in array to preserve prepareMeasure arguments and already-set arguments
      const project_measure = _.find(vm.projectMeasures, {instanceId: measure.instanceId});
      // remove arguments that no longer exist (by name) (in reverse) (except for special display args)
      // TODO project_measure can now be more than just 1 and must be iterated over (Evan)
      _.forEachRight(project_measure.arguments, (arg, index) => {
        if (_.isUndefined(arg.specialRowId)) {
          const match = _.find(measure.arguments, {name: arg.name});
          if (_.isUndefined(match)) {
            project_measure.arguments.splice(index, 1);
            // vm.$log.debug('removing argument: ', arg.name);
          }
        }
      });
      // then add/merge (at argument level)
      _.forEach(newMeasure.arguments, (arg) => {
        const match = _.find(project_measure.arguments, {name: arg.name});
        if (_.isUndefined(match)) {
          // vm.$log.debug('adding argument: ', arg.name);
          project_measure.arguments.push(arg);
        } else {
          // vm.$log.debug('merging argument: ', arg.name);
          _.merge(match, arg);
          // vm.$log.debug('merged match: ', match);
        }
      });

      // unset 'update' status on original measure
      measure.status = '';

      // remove arguments and merge rest with project_measure
      let measure_copy = angular.copy(measure);
      delete measure_copy.arguments;
      delete measure_copy.open;
      _.assignIn(project_measure, measure_copy);

      const msg = 'Measure \'' + project_measure.display_name + '\' was successfully updated in your project.';
      vm.$log.debug('updated project measure: ', project_measure);
      vm.toastr.success(msg);
      deferred.resolve();

    }, () => {
      // failure
      //vm.$log.debug('Measure Manager computeArguments failed');
      deferred.reject();
    });

    return deferred.promise;
  }

  // update button
  updateAMeasure(measure) {
    const vm = this;
    vm.$log.debug('in Update A Measure function');
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
        vm.$log.debug('Invalid action in modal');
      }

    });

  }

  // copy from local and edit (2X)
  copyAndEditMeasure(measure) {
    const vm = this;
    vm.$log.debug('in COPY AND EDIT function');
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
        vm.$log.debug('Measure Manager duplicateMeasure succeeded');
        // add and prepare new measure
        newMeasure = vm.BCL.prepareMeasure(newMeasure, 'my');
        vm.libMeasures.my.push(newMeasure);
        vm.resetFilters();
        // select newly added row
        vm.selectARow(newMeasure.uid);
        deferred.resolve();
      }, () => {
        // failure
        vm.$log.debug('Measure Manager duplicateMeasure failed');
        deferred.reject();
      });
    }, () => {
      // Modal canceled
      vm.$log.debug('DuplicateMeasure Modal was canceled');
      deferred.reject();
    });

    return deferred.promise;
  }

  ok() {
    const vm = this;
    // save pretty options in case changes were made to project measures
    vm.Project.savePrettyOptions();
    vm.$log.debug('Project Measures: ', vm.projectMeasures);
    vm.$uibModalInstance.close();
  }

  search() {
    // TODO
  }

}
