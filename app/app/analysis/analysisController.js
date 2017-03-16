import jetpack from 'fs-jetpack';
import {remote} from 'electron';
import {shell} from 'electron';
import path from 'path';
const {dialog} = remote;

export class AnalysisController {

  constructor($log, $q, BCL, Project, $scope, $document, $uibModal, toastr, Message, $translate) {
    'ngInject';

    const vm = this;
    vm.toastr = toastr;
    vm.Project = Project;
    vm.$log = $log;
    vm.$q = $q;
    vm.$uibModal = $uibModal;
    vm.jetpack = jetpack;
    vm.$scope = $scope;
    vm.$document = $document;
    vm.BCL = BCL;
    vm.dialog = dialog;
    vm.shell = shell;
    vm.path = path;
    vm.$translate = $translate;
    vm.Message = Message;

    vm.analysisTypes = vm.Project.getAnalysisTypes();
    vm.$scope.seeds = vm.Project.getSeeds();
    vm.$scope.weatherFiles = vm.Project.getWeatherFiles();

    vm.$scope.defaultSeed = vm.Project.getDefaultSeed();
    vm.$scope.defaultWeatherFile = vm.Project.getDefaultWeatherFile();
    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();
    vm.$scope.filesToInclude = vm.Project.getFilesToInclude();
    vm.$scope.serverScripts = vm.Project.getServerScripts();
    if (vm.Message.showDebug()) vm.$log.debug('ServerScripts: ', vm.$scope.serverScripts);

    vm.$scope.measures = vm.Project.getMeasuresAndOptions();
    _.forEach(vm.$scope.measures, (measure) => {
      if (_.isNil(measure.seed)) measure.seed = vm.$scope.defaultSeed;
    });
    if (vm.Message.showDebug()) if (vm.Message.showDebug()) vm.$log.debug('****ANALYSIS TAB****');
    if (vm.Message.showDebug()) vm.$log.debug('ANALYSIS MEASURES RETRIEVED: ', vm.$scope.measures);

    vm.$scope.osMeasures = [];
    vm.$scope.epMeasures = [];
    vm.$scope.repMeasures = [];

    // Manual Mode
    vm.designAlternatives = vm.Project.getDesignAlternatives();
    vm.datapoints = vm.Project.getDatapoints();
    vm.gridApis = [];
    vm.$scope.gridOptions = [];

    // Algorithmic Mode
    vm.$scope.selectedSamplingMethod = vm.Project.getSamplingMethod();
    vm.samplingMethods = vm.Project.getSamplingMethods();
    vm.$scope.algorithmSettings = vm.Project.setGetAlgorithmSettings(vm.$scope.selectedSamplingMethod);
    vm.$scope.relationships = ['Standard', 'Inverse'];

    // size grids according to data
    vm.$scope.getTableHeight = function (instanceId) {
      const rowHeight = 30; // your row height
      const headerHeight = 40; // your header height
      return {
        height: (vm.$scope.gridOptions[instanceId].data.length * rowHeight + headerHeight + 10) + 'px'
      };
    };

    vm.initializeTab(); // replaces (and calls) initializeGrids
    //vm.initializeValues();

    vm.$scope.getVariableSettings = function (argument) {
      //if (vm.Message.showDebug()) vm.$log.debug('In getVariableSettings');
      let settings = [];
      if (argument.type === 'Double') {
        settings = ['Argument', 'Discrete', 'Continuous', 'Pivot'];
      } else {
        settings = ['Argument', 'Discrete', 'Pivot'];
      }
      return settings;
    };

    vm.$scope.getDistributions = function () {
      //if (vm.Message.showDebug()) vm.$log.debug('In getDistributions');
      let distributions = [];
      switch (vm.$scope.selectedSamplingMethod.id) {
        case 'spea_nrel':
        case 'rgenoud':
        case 'nsga_nrel':
        case 'lhs':
        case 'preflight':
        case 'morris':
        case 'sobol':
        case 'doe':
        case 'single_run':
        case 'repeat_run':
          distributions = ['Uniform', 'Triangle', 'Normal', 'LogNormal'];
          break;
        default:
          distributions = ['Uniform'];
      }
      return distributions;
    };

    vm.$scope.getDiscreteDistributions = function () {
      //if (vm.Message.showDebug()) vm.$log.debug('In get Discrete Distributions');
      let distributions = [];
      switch (vm.$scope.selectedSamplingMethod.id) {
        case 'Diagonal':
          distributions = ['Discrete', 'Integer Sequence'];
          break;
        default:
          distributions = ['Discrete'];
      }
      return distributions;
    };

  }

  initializeTab() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In initializeTab in analysis');
    // group by type
    vm.initializeInstanceID();
    vm.setMeasureTypes();
    // sort measures by workflow_index
    vm.$scope.measures = _.sortBy(vm.$scope.measures, ['workflow_index']);
    if (vm.$scope.selectedAnalysisType == 'Manual') {
      // initialize for Manual Mode
      vm.initializeGrids();
    } else {
      // initialize for Alg Mode
      vm.initializeVariablesAlgMode();
      vm.showDeltaX();
      //vm.showValueAndWeights();
      vm.showMinAndMax();
      vm.showDistributions();
      vm.showDiscreteDistributions();
      vm.showDiscreteVariables();
      vm.showPivotVariables();
      vm.showContinuousVariables();
    }
  }

  initializeInstanceID() {
    const vm = this;
    _.forEach(vm.$scope.measures, (measure) => {
      measure.instanceId = Math.random();
    });
  }

  initializeGrids() {
    const vm = this;
    vm.setGridOptions();
    // load saved measure options
    vm.loadMeasureOptions();
  }

  getDefaultOptionColDef() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('AnalysisController getDefaultOptionColDef');
    return {
      display_name: 'Option 1',
      field: 'option_1',
      editDropdownOptionsFunction: function (rowEntity, colDef) {
        if (rowEntity.type === 'Choice') {
          //if (vm.Message.showDebug()) vm.$log.debug('rowEntity: ', rowEntity);
          //if (vm.Message.showDebug()) vm.$log.debug('colDef: ', colDef);
          vm.choices = [];
          _.forEach(rowEntity.choice_display_names
            , (choice) => {
              if (vm.Message.showDebug()) vm.$log.debug('choice: ', choice);
              vm.choices.push({
                id: choice,
                value: choice
              });
            });
          if (vm.Message.showDebug()) vm.$log.debug('vm.choices: ', vm.choices);
          return vm.choices;
        }
      },
      cellTemplate: 'app/analysis/deleteButtonTemplate.html',
      //cellTemplate: '<input ng-if=\"row.entity.type==\'Boolean\'\" type=\"checkbox\" ng-class=\"\'colt\' + col.uid\" ui-grid-checkbox ng-model=\"MODEL_COL_FIELD\">' +
      //'<div ng-if=\"!row.entity.type==\'Boolean\'\" class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{row.getProperty(col.field)}}</span></div>',
      editableCellTemplate: 'app/analysis/optionInputTemplate.html',
      width: 200,
      minWidth: 100,
      //enableCellEdit: true
      cellEditableCondition: $scope => {
        if (!_.isNil($scope.row.entity.specialRowId)) {
          return true;
        } else if ($scope.col.colDef.name == 'option_1') {
          return true;
        } else {
          return $scope.row.entity.variable;
        }
      }
    };
  }

  setGridOptions() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in setGridOptions');

    _.forEach(vm.$scope.measures, (measure) => {
      if (vm.Message.showDebug()) vm.$log.debug('measure: ', measure);

      // set number of options in measure

      if (!_.has(measure, 'numberOfOptions')) {
        measure.numberOfOptions = 0;
      }

      let addRows = true;
      //if (measure.arguments.length > 0) {
      _.forEach(measure.arguments, (argument) => {
        if (_.has(argument, 'specialRowId')) {
          addRows = false;
        }
      });

      if (addRows) {
        const row0 = {specialRowId: 'optionDelete'};
        const row1 = {specialRowId: 'optionName', type: 'String'};
        const row2 = {specialRowId: 'optionDescription', type: 'String'};
        measure.arguments.splice(0, 0, row0, row1, row2);
      }

      vm.$scope.gridOptions[measure.instanceId] = {
        data: measure.arguments,
        enableSorting: false,
        autoResize: true,
        enableRowSelection: false,
        enableSelectAll: false,
        enableColumnMenus: false,
        enableRowHeaderSelection: false,
        enableCellEditOnFocus: true,
        enableHiding: false,
        columnDefs: [{
          name: 'display_name',
          displayName: 'analysis.columns.argumentName',
          enableCellEdit: false,
          headerCellFilter: 'translate',
          pinnedLeft: true,
          width: 300,
          minWidth: 100,
          cellTooltip: function (row) {
            return row.entity.display_name;
          }
        }, {
          name: 'description',
          displayName: 'description',
          visible: false
        }, {
          name: 'display_name_short',
          displayName: 'analysis.columns.shortName',
          cellEditableCondition: $scope => {
            return angular.isDefined($scope.row.entity.display_name);
          },
          headerCellFilter: 'translate',
          width: 200,
          minWidth: 100
        }, {
          name: 'variable',
          displayName: 'analysis.columns.variable',
          measureUID: measure.uid,
          instanceId: measure.instanceId,
          cellTemplate: 'app/analysis/checkAllTemplate.html',
          headerCellFilter: 'translate',
          minWidth: 30,
          type: 'boolean',
          width: 70
        }],
        onRegisterApi: function (gridApi) {
          vm.gridApis[measure.instanceId] = gridApi;
          gridApi.edit.on.afterCellEdit(vm.$scope, function (rowEntity, colDef, newValue, oldValue) {
            if (vm.Message.showDebug()) vm.$log.debug('HI!');
            if (newValue != oldValue) {
              // if (vm.Message.showDebug()) vm.$log.debug('CELL has changed in: ', measure.instanceId, ' old val: ', oldValue, ' new val: ', newValue);
              if (vm.Message.showDebug()) vm.$log.debug('rowEntity: ', rowEntity);
              vm.updateDASelectedName(measure, oldValue, newValue);

              // TODO: figure out if there are datapoints to mark as modified
              if (vm.Message.showDebug()) vm.$log.debug('colDef: ', colDef);
              vm.updateDatapoints(measure, colDef.name, rowEntity);

            }
          });
        }
      };
    });
  }

  updateDatapoints(measure, colName, rowEntity) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in update datapoints...colname: ', colName, ' measure name: ', measure.name);
    if (colName == 'display_name_short') {
      if (vm.Message.showDebug()) vm.$log.debug('display name short has changed, update all DAs that use this measure');
      _.forEach(vm.designAlternatives, (alt) => {
        if (alt[measure.name] || alt[measure.name] != 'None') {
          // DA has this measure selected, mark datapoint
          const match = _.find(vm.datapoints, {name: alt.name});
          if (match) {
            match.modified = true;
          }
        }
      });
    } else {
      const optionKey = measure.arguments[1][colName];
      if (vm.Message.showDebug()) vm.$log.debug('optionKey: ', optionKey);
      _.forEach(vm.designAlternatives, (alt) => {
        if (vm.Message.showDebug()) vm.$log.debug('alt[measure.name]: ', alt[measure.name]);
        if (alt[measure.name] == optionKey) {
          const match = _.find(vm.datapoints, {name: alt.name});
          if (match) {
            match.modified = true;
          }
        }
      });
    }
  }

  setMeasureTypes() {
    const vm = this;
    vm.$scope.osMeasures = [];
    vm.$scope.epMeasures = [];
    vm.$scope.repMeasures = [];

    _.forEach(vm.$scope.measures, (measure) => {
      if (measure.type == 'ModelMeasure')
        vm.$scope.osMeasures.push(measure);
      else if (measure.type == 'EnergyPlusMeasure')
        vm.$scope.epMeasures.push(measure);
      else
        vm.$scope.repMeasures.push(measure);
    });
  }

  addMeasure(type) {
    const vm = this;
    vm.setIsModified();
    const types = [type];
    // save pretty options (will be needed to load back)
    vm.Project.savePrettyOptions();
    vm.BCL.openBCLModal(types, [], false).then(() => {
      // reset data
      vm.$scope.measures = vm.Project.getMeasuresAndOptions();
      vm.initializeTab();
    });
  }

  checkUpdates() {
    const vm = this;
    const types = ['ModelMeasure', 'EnergyPlusMeasure', 'ReportingMeasure'];
    vm.BCL.openBCLModal(types, [], false).then(() => {
      // reset data
      vm.$scope.measures = vm.Project.getMeasuresAndOptions();
      vm.initializeTab();
    });
  }

  // update the alternatives when a measure is deleted
  updateAlternatives(measureName) {
    const vm = this;
    vm.setIsModified();
    _.forEach(vm.designAlternatives, (alt) => {
      delete alt[measureName];
    });
  }

  // When an option's name changes, update DAs
  // option dropdowns will auto-repopulate when navigating to DA tab
  updateDASelectedName(measure, oldValue, newValue) {
    const vm = this;
    _.forEach(vm.designAlternatives, (alt) => {
      if (alt[measure.name] && alt[measure.name] == oldValue) {
        alt[measure.name] = newValue;
      }
    });
  }

  // When an option is deleted, reset DAs that were using the option
  unsetOptionInDA(instanceId, value) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In Analysis::unsetOptionInDA');
    if (vm.Message.showDebug()) vm.$log.debug('DAs: ', vm.designAlternatives);
    if (vm.Message.showDebug()) vm.$log.debug('instanceId: ', instanceId, ' optionName: ', value);
    const measure = _.find(vm.$scope.measures, {instanceId: instanceId});
    if (vm.Message.showDebug()) vm.$log.debug('measure: ', measure);
    if (measure) {
      _.forEach(vm.designAlternatives, (alt) => {
        if (alt[measure.name] && alt[measure.name] == value) {
          alt[measure.name] = 'None';
        }
      });
    }
  }

  setNewAlternativeDefaults() {
    const vm = this;
    vm.setIsModified();
    const newAlt = {};
    newAlt.name = vm.uniqueName(vm.$scope.alternatives, _.template('Alternative <%= num %>'));
    newAlt.seedModel = vm.defaultSeed;
    newAlt.weatherFile = vm.defaultWeatherFile;
    return newAlt;
  }

  removeMeasure(measure) {
    const vm = this;
    vm.setIsModified();
    vm.updateAlternatives(measure.name);

    if (vm.Message.showDebug()) vm.$log.debug('Deleting measure: ', measure);

    // line below also removes it from bclService 'getProjectMeasures'
    _.remove(vm.$scope.measures, {instanceId: measure.instanceId});
    vm.Project.setMeasuresAndOptions(vm.$scope.measures);

    const measurePanel = angular.element(vm.$document[0].querySelector('div[id="' + measure.instanceId + '"]'));
    measurePanel.remove();

    // Note: jetpack.remove() does not have any return
    // only remove if there are no other measures pointing to this location
    const copies = _.find(vm.$scope.measures, {measure_dir: measure.measure_dir});
    if (!copies) {
      // can delete from disk
      vm.jetpack.remove(measure.measure_dir);
    }

    // recalculate workflow indexes
    vm.Project.recalculateMeasureWorkflowIndexes();

    vm.initializeTab();
  }

  addMeasureOption(measure) {
    const vm = this;
    vm.setIsModified();
    if (vm.Message.showDebug()) vm.$log.debug('In addMeasureOption in analysis');

    if (measure.arguments.length === 0) return; // Nothing to see here

    const keys = Object.keys(measure.arguments[0]);
    if (vm.Message.showDebug()) vm.$log.debug('keys: ', keys);

    measure.numberOfOptions++;

    const optionKeys = _.filter(keys, (k) => {
      return k.indexOf('option_') !== -1;
    });
    //if (vm.Message.showDebug()) vm.$log.debug('option keys: ', optionKeys);

    let max = 0;
    _.forEach(optionKeys, (key) => {
      //if (vm.Message.showDebug()) vm.$log.debug('key: ', key);
      const num = Number(key.split('_')[1]);
      if (num > max) {
        max = num;
      }
    });
    if (vm.Message.showDebug()) vm.$log.debug('max: ', max);

    // start from first option
    const opt = vm.getDefaultOptionColDef();
    opt.display_name = 'Option ' + Number(max + 1);
    opt.field = 'option_' + Number(max + 1);
    opt.instanceId = measure.instanceId;

    // add default arguments to opt
    vm.addDefaultArguments(measure, opt);

    _.forEach(measure.arguments, argument => {
      if (argument.specialRowId === 'optionDelete') {
        argument[opt.field] = opt.field;
      }
      else if (argument.specialRowId === 'optionName') {
        argument[opt.field] = opt.display_name + ' Name';
      }
      else if (argument.specialRowId === 'optionDescription') {
        argument[opt.field] = opt.display_name + ' Description: ' + measure.description;
      }
      else if (!argument.variable) {
        argument.variable = false;
      }
      else if (!argument.variable) {
        argument[opt.field] = argument.option_1;
      }
    });

    vm.$scope.gridOptions[measure.instanceId].columnDefs.push(opt);

    vm.Project.savePrettyOptions();

    return opt;
  }

  deleteSelectedOption(measure) { // TODO is this dead code? Evan
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In deleteSelectedOption in analysis');
    vm.setIsModified();
    if (measure.numberOfOptions > 0) {
      measure.numberOfOptions -= 1;
      vm.$scope.gridOptions[measure.instanceId].columnDefs.splice(vm.$scope.gridOptions[measure.instanceId].columnDefs.length - 1, 1);
    }
  }

  deleteOption(col) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In deleteOption in analysis');
    vm.setIsModified();
    if (vm.Message.showDebug()) vm.$log.debug('col: ', col);

    const optionCount = Number(col.field.split('_')[1]);
    if (vm.Message.showDebug()) vm.$log.debug('optionCount: ', optionCount);
    const instanceId = col.colDef.instanceId;
    if (vm.Message.showDebug()) vm.$log.debug('instanceId: ', instanceId);

    // get option name before deleting it
    if (vm.Message.showDebug()) vm.$log.debug('OPTION NAME? ', col.grid.options.data[1][col.name]);
    const optionName = col.grid.options.data[1][col.name];

    let columnIndex = 0;
    _.forEach((vm.$scope.gridOptions[instanceId]).columnDefs, (columnDef) => {
      if (_.has(columnDef, 'field')) {
        const optionCount2 = Number(columnDef.field.split('_')[1]);
        if (vm.Message.showDebug()) vm.$log.debug('columnDef.field: ', columnDef.field);
        if (optionCount === optionCount2) {
          if (vm.Message.showDebug()) vm.$log.debug('SUCCESS');
          if (vm.Message.showDebug()) vm.$log.debug('columnIndex: ', columnIndex);
          vm.$scope.gridOptions[instanceId].columnDefs.splice(columnIndex, 1);
        }
      }
      columnIndex++;
    });
    _.forEach(vm.$scope.measures, (measure) => {
      if (measure.instanceId == instanceId) {
        _.forEach(measure.arguments, (argument) => {
          delete argument[col.field];
        });
        // decrement options count
        measure.numberOfOptions = measure.numberOfOptions - 1;
      }
    });
    // reset DAs that were using this option
    vm.unsetOptionInDA(instanceId, optionName);
    vm.Project.savePrettyOptions();
  }

  variableCheckboxChanged(row, col) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In variableCheckboxChanged in analysis');
    //if (vm.Message.showDebug()) vm.$log.debug('row', row);
    //if (vm.Message.showDebug()) vm.$log.debug('col', col);
    vm.setIsModified();

    const instanceId = col.colDef.instanceId;
    //if (vm.Message.showDebug()) vm.$log.debug('instanceId: ', instanceId);

    const measure = _.find(vm.$scope.measures, {instanceId: instanceId});
    //if (vm.Message.showDebug()) vm.$log.debug('measure: ', measure);

    const display_name = row.entity.display_name;
    //if (vm.Message.showDebug()) vm.$log.debug('display_name: ', display_name);

    const variable = row.entity.variable;
    //if (vm.Message.showDebug()) vm.$log.debug('variable: ', variable);

    if (!variable) {
      for (let i = 0; i < measure.arguments.length; i++) {
        if (measure.arguments[i].display_name === display_name) {
          const keys = _.keys(measure.arguments[i]);
          const optionKeys = _.filter(keys, (k) => {
            return k.indexOf('option_') !== -1;
          });
          for (let j = 1; j < optionKeys.length; j++) {
            //if (vm.Message.showDebug()) vm.$log.debug('measure.arguments[i][optionKeys[j]]: ', measure.arguments[i][optionKeys[j]]);
            //if (vm.Message.showDebug()) vm.$log.debug('measure.arguments[i][optionKeys[j]]: ', measure.arguments[i][optionKeys[0]]);
            measure.arguments[i][optionKeys[j]] = measure.arguments[i][optionKeys[0]];
          }
          break;
        }
      }
    }
    //vm.$scope.$broadcast('uiGridEventEndCellEdit'); Note: this causes page to jump to bottom, and is visually unacceptable (Evan)
  }

  optionCheckboxChanged() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In optionCheckboxChanged in analysis');
    vm.setIsModified();

    //vm.$scope.$broadcast('uiGridEventEndCellEdit'); Note: this causes page to jump to bottom, and is visually unacceptable (Evan)
  }

  allVariableCheckboxesChanged(row, col) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In allVariableCheckboxesChanged in analysis');
    //if (vm.Message.showDebug()) vm.$log.debug('row', row);
    //if (vm.Message.showDebug()) vm.$log.debug('col', col);
    vm.setIsModified();

    const instanceId = col.colDef.instanceId;
    //if (vm.Message.showDebug()) vm.$log.debug('instanceId: ', instanceId);

    const measure = _.find(vm.$scope.measures, {instanceId: instanceId});
    //if (vm.Message.showDebug()) vm.$log.debug('measure: ', measure);

    const variable = row.entity.variable;
    //if (vm.Message.showDebug()) vm.$log.debug('variable: ', variable);

    if (!variable) {
      // Dont change the first 3 rows regarding naming
      for (let i = 3; i < measure.arguments.length; i++) {
        const keys = _.keys(measure.arguments[i]);
        const optionKeys = _.filter(keys, (k) => {
          return k.indexOf('option_') !== -1;
        });
        for (let j = 1; j < optionKeys.length; j++) {
          //if (vm.Message.showDebug()) vm.$log.debug('measure.arguments[i][optionKeys[j]]: ', measure.arguments[i][optionKeys[j]]);
          //if (vm.Message.showDebug()) vm.$log.debug('measure.arguments[i][optionKeys[j]]: ', measure.arguments[i][optionKeys[0]]);
          measure.arguments[i][optionKeys[j]] = measure.arguments[i][optionKeys[0]];
        }
      }
    }
    //vm.$scope.$broadcast('uiGridEventEndCellEdit'); Note: this causes page to jump to bottom, and is visually unacceptable (Evan)
  }

  // Toggle all variable checkboxes
  checkAllVariables(row, col) {
    const vm = this;
    const instanceId = col.colDef.instanceId;
    // toggle checkbox
    if (row.entity.variable) {
      // set all to true
      _.forEach(vm.$scope.gridOptions[instanceId].data, (row) => {
        row.variable = true;
      });
    } else {
      // set all to false
      _.forEach(vm.$scope.gridOptions[instanceId].data, (row) => {
        row.variable = false;
      });
    }
    vm.allVariableCheckboxesChanged(row, col);
  }

  addDefaultArguments(measure, option) {
    const vm = this;
    vm.setIsModified();
    // TODO: add logic related to whether an arg is variable or not (if not, use option1's value in subsequent options)
    _.forEach(measure.arguments, (argument) => {
      // use default value, otherwise leave blank
      argument[option.field] = argument.default_value ? argument.default_value : '';
    });
  }

  editOptionDescription(col, row) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('Analysis::editOptionDescription');
    //if (vm.Message.showDebug()) vm.$log.debug('col', col);
    //if (vm.Message.showDebug()) vm.$log.debug('row', row);

    const field = col.colDef.field;
    //if (vm.Message.showDebug()) vm.$log.debug('field', field);

    const instanceId = col.colDef.instanceId;
    //if (vm.Message.showDebug()) vm.$log.debug('instanceId: ', instanceId);

    const measure = _.find(vm.$scope.measures, {instanceId: instanceId});
    //if (vm.Message.showDebug()) vm.$log.debug('measure: ', measure);

    let idx = -1;
    for (let i = 0; i < measure.arguments.length; i++) {
      if (!_.isNil(measure.arguments[i].specialRowId) && measure.arguments[i].specialRowId === 'optionDescription') {
        idx = i;
        break;
      }
    }

    const argument = measure.arguments[idx];
    //if (vm.Message.showDebug()) vm.$log.debug('argument: ', argument);

    const optionDescription = argument[field];
    //if (vm.Message.showDebug()) vm.$log.debug('optionDescription: ', optionDescription);

    const deferred = vm.$q.defer();

    // open modal for user to select options.
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalEditOptionDescriptionController',
      controllerAs: 'modal',
      templateUrl: 'app/analysis/edit_option_description.html',
      //windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            optionDescription: optionDescription
          };
        }
      }
    });

    modalInstance.result.then((optionDescription) => {
      //if (vm.Message.showDebug()) vm.$log.debug('optionDescription: ', optionDescription);
      argument[field] = optionDescription;
      deferred.resolve();
    }, () => {
      // Modal canceled
      deferred.reject();
    });

    return deferred.promise;
  }

  duplicateOption(measure) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('Analysis::duplicateOption');

    let newOptions = false;
    vm.addOptions(measure).then(() => {
        _.forEach(measure.options, (option) => {
          if (option.checked) {
            newOptions = true;
            const opt = vm.addMeasureOption(measure);
            if (vm.Message.showDebug()) vm.$log.debug('Duplicate ', option.name);
            let count = 0;
            _.forEach(measure.arguments, (arg) => {
              // Don't change the first 3 rows regarding naming
              if (count++ > 2) arg[opt.field] = arg[option.id];
            });
          }
        });
        if (newOptions) vm.Project.savePrettyOptions();
      }
    );
  }

  duplicateMeasureAndOption(measure) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In duplicateMeasureAndOption in analysis');
    vm.setIsModified();

    const copiedMeasure = angular.copy(measure);
    copiedMeasure.instanceId = Math.random();

    // Make name and display_name unique
    let count = 2;
    let notUnique = false;
    do {
      notUnique = false;
      copiedMeasure.name = measure.name + '_' + count.toString();
      copiedMeasure.display_name = measure.display_name + ' ' + count.toString();
      _.forEach(vm.$scope.measures, (m) => {
        if (copiedMeasure.name == m.name || copiedMeasure.display_name == m.display_name) {
          notUnique = true;
        }
      });
      count++;
    } while (notUnique);

    // Close the original measure's accordion
    measure.open = false;

    vm.$scope.measures.push(copiedMeasure);
    vm.Project.measures.push(copiedMeasure);

    vm.$translate('toastr.measureDuplicated').then(translation => {
      vm.toastr.success(translation);
    });

    vm.initializeTab();
  }

  loadMeasureOptions() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In loadMeasureOptions in analysis');
    _.forEach(vm.$scope.measures, (measure) => {
      if (vm.Message.showDebug()) vm.$log.debug('measure: ', measure);
      // check choice arg selected values in case seed was reset
      // Note from Evan: do not uncomment the line below as it clobbers the selected dropdown values
      //vm.resetChoiceArgumentSelections(measure);
      _.forEach(measure.options, (option) => {
        vm.loadOption(measure, option);
      });
    });
  }

  loadOption(measure, option) {
    const vm = this;
    //if (vm.Message.showDebug()) vm.$log.debug('In loadOption in analysis');
    //if (vm.Message.showDebug()) vm.$log.debug('measure: ', measure);
    //if (vm.Message.showDebug()) vm.$log.debug('option: ', option);
    const re = /^option_(\d+)$/;
    if (re.test(option.id)) {
      const opt = vm.getDefaultOptionColDef();
      opt.display_name = _.startCase(option.id);
      opt.field = option.id;
      opt.instanceId = measure.instanceId;  // explicitly set this just in case
      vm.$scope.gridOptions[measure.instanceId].columnDefs.push(opt);
    } else {
      vm.$log.error('option id does not match expected format (option_<ID>)');
    }
  }

  // reset selections (to default) when choice argument is no longer in list
  resetChoiceArgumentSelections(measure) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in resetChoiceArgumentSelections in analysis');
    _.forEach(measure.arguments, (arg) => {
      if (arg.type == 'Choice') {
        if (vm.Message.showDebug()) vm.$log.debug('Choice Arg: ', arg.name);
        const keys = _.keys(arg);
        const optionKeys = _.filter(keys, (k) => {
          return k.indexOf('option_') !== -1;
        });
        _.forEach(optionKeys, (key) => {
          if (_.isUndefined(_.find(arg.choice_display_names, arg[key]))) {
            if (vm.Message.showDebug()) vm.$log.debug('Argument value ', arg[key], ' was not found in choice list...resetting to default_value');
            arg[key] = arg.default_value ? arg.default_value : '';
          }
        });
      }
    });
  }

  resetAllChoiceArgumentSelections() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in resetAllChoiceArgumentSelections in analysis');
    _.forEach(vm.$scope.measures, (measure) => {
      vm.resetChoiceArgumentSelections(measure);
    });
  }

  setSeed() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In Analysis::setSeed');
    vm.setIsModified();
    vm.Project.setDefaultSeed(vm.$scope.defaultSeed);
    _.forEach(vm.$scope.measures, (measure) => {
      measure.seed = vm.$scope.defaultSeed;
    });
    vm.Project.setMeasuresAndOptions(vm.$scope.measures);
    vm.Project.savePrettyOptions();
    // recompute model-dependent measure arguments & refresh grid
    vm.Project.computeAllMeasureArguments().then(() => {
      if (vm.Message.showDebug()) vm.$log.debug('computeAllMeasureArgs success!');
      vm.$scope.measures = vm.Project.getMeasuresAndOptions();
      vm.resetAllChoiceArgumentSelections();
      vm.initializeTab();
    }, error => {
      if (vm.Message.showDebug()) vm.$log.debug('Error in computeALLMeasureArguments: ', error);
    });
  }

  setWeatherFile() {
    const vm = this;
    vm.setIsModified();
    vm.Project.setDefaultWeatherFile(vm.$scope.defaultWeatherFile);
  }

  setType() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In setType in analysis');
    vm.setIsModified();
    vm.Project.setAnalysisType(vm.$scope.selectedAnalysisType);
    // reset datapoints when switching run type
    vm.Project.setDatapoints([]);

    vm.initializeTab();
  }

  // setDirToInclude() {
  //   const vm = this;
  //   if (vm.Message.showDebug()) vm.$log.debug('In setDirToInclude in analysis');
  //   vm.setIsModified();
  //   vm.Project.setDirToInclude(vm.$scope.dirToInclude);
  // }

  // setDirToUnpackTo() {
  //   const vm = this;
  //   if (vm.Message.showDebug()) vm.$log.debug('In setDirToUnpackTo in analysis');
  //   vm.setIsModified();
  //   vm.Project.setDirToUnpackTo(vm.$scope.dirToUnpackTo);
  // }

  setSamplingMethod() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In setSamplingMethod in analysis');
    vm.setIsModified();
    vm.Project.setSamplingMethod(vm.$scope.selectedSamplingMethod);
    vm.$scope.algorithmSettings = vm.Project.setGetAlgorithmSettings(vm.$scope.selectedSamplingMethod);

    vm.showDeltaX();
    vm.showMinAndMax();
    //vm.showValueAndWeights();
    vm.showDistributions();
    vm.showDiscreteDistributions();
    vm.showDiscreteVariables();
    vm.showPivotVariables();
    vm.showContinuousVariables();
    vm.showWarningIcons();

  }

  viewAlgorithmLink() {
    const vm = this;
    if (vm.$scope.selectedSamplingMethod.link) {
      vm.shell.openExternal(vm.$scope.selectedSamplingMethod.link);
    }
  }

  // compute measure arguments when setting the seed
  computeMeasureArguments(measure) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In computeMeasureArguments in analysis');
    vm.setIsModified();
    vm.Project.computeMeasureArguments(measure).then(response => {
      // get updated measure and set
      if (vm.Message.showDebug()) vm.$log.debug('Success!');
      measure = response;
      if (vm.Message.showDebug()) vm.$log.debug('Analysis Tab, new computed measure: ', angular.copy(measure));
      if (vm.Message.showDebug()) vm.$log.debug('Scope measures: ', vm.$scope.measures);
      vm.initializeTab();
      vm.Project.setMeasuresAndOptions(vm.$scope.measures);
    }, error => {
      vm.$log.error('Error in Project::computeMeasureArguments: ', error);
    });
  }

  selectDirToInclude(file) {
    const vm = this;

    const result = vm.dialog.showOpenDialog({
      title: 'Select Directory To Include',
      properties: ['openDirectory']
    });

    if (!_.isEmpty(result)) {
      if (vm.Message.showDebug()) vm.$log.debug(' result[0]:', result[0]);
      if (vm.Message.showDebug()) vm.$log.debug('path relative to project: ', vm.path.relative(vm.Project.getProjectDir().path(), result[0]));
      file.dirToInclude = vm.path.relative(vm.Project.getProjectDir().path(), result[0]);
      vm.setIsModified();
    }
  }

  addDirToInclude() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In analysis::addDirToInclude');
    vm.$scope.filesToInclude.push({dirToInclude: null, unpackDirName: null});
    if (vm.Message.showDebug()) vm.$log.debug('Files to Include Array: ', vm.$scope.filesToInclude);
  }

  deleteDirToInclude(index) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In analysis::deleteDirToInclude, remove at index: ', index);
    if (!_.isNil(index)) {
      vm.$scope.filesToInclude.splice(index, 1);
    }
    if (vm.Message.showDebug()) vm.$log.debug('Files to Include Array: ', vm.$scope.filesToInclude);
  }

  selectScript(type) {
    const vm = this;
    const result = vm.dialog.showOpenDialog({
      title: 'Select Script',
      properties: ['openFile']
    });

    if (!_.isEmpty(result)) {
      const scriptPath = result[0];
      if (vm.Message.showDebug()) vm.$log.debug('script path:', scriptPath);
      const scriptFilename = scriptPath.replace(/^.*[\\\/]/, '');
      // ensure appropriate folders exist
      vm.jetpack.dir(vm.Project.getProjectDir().path('scripts', type));
      // copy/overwrite
      vm.jetpack.copy(scriptPath, vm.Project.getProjectDir().path('scripts', type, scriptFilename), {overwrite: true});
      if (vm.Message.showDebug()) vm.$log.debug('Script filename: ', scriptFilename);
      // update project
      vm.$scope.serverScripts[type].file = scriptFilename;
      vm.setIsModified();
    }
  }

  deleteScript(type) {
    const vm = this;
    vm.$scope.serverScripts[type].file = null;
  }

  addScriptArgument(type) {
    const vm = this;
    vm.$scope.serverScripts[type].arguments.push(null);
  }

  deleteScriptArgument(type, index) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('deleting at index: ', index);
    if (vm.Message.showDebug()) vm.$log.debug('arguments: ', vm.$scope.serverScripts[type].arguments);
    if (!_.isNil(index)) {
      vm.$scope.serverScripts[type].arguments.splice(index, 1);
    }
    if (vm.Message.showDebug()) vm.$log.debug('New Arguments for type: ', type, ' are: ', vm.$scope.serverScripts[type].arguments);
  }

  selectSeedModel() {
    const vm = this;
    vm.setIsModified();
    // TODO: set defaultPath
    const result = vm.dialog.showOpenDialog({
      title: 'Select Seed Model',
      filters: [
        {name: 'OpenStudio Models', extensions: ['osm']}
      ],
      properties: ['openFile']
    });

    if (!_.isEmpty(result)) {
      // copy and select the file
      const seedModelPath = result[0];
      if (vm.Message.showDebug()) vm.$log.debug('Seed Model:', seedModelPath);
      const seedModelFilename = seedModelPath.replace(/^.*[\\\/]/, '');
      vm.jetpack.copy(seedModelPath, vm.Project.getProjectDir().path('seeds/' + seedModelFilename), {overwrite: true});
      if (vm.Message.showDebug()) vm.$log.debug('Seed Model name: ', seedModelFilename);
      // update seeds
      vm.Project.setSeeds();
      vm.Project.setSeedsDropdownOptions();
      vm.$scope.seeds = vm.Project.getSeeds();
      vm.$scope.defaultSeed = seedModelFilename;
      vm.Project.setDefaultSeed(vm.$scope.defaultSeed);
      _.forEach(vm.$scope.measures, (measure) => {
        measure.seed = vm.$scope.defaultSeed;
      });
      vm.Project.setMeasuresAndOptions(vm.$scope.measures);
      vm.Project.savePrettyOptions();
      // recompute model-dependent measure arguments when resetting seed
      vm.Project.computeAllMeasureArguments().then(() => {
        if (vm.Message.showDebug()) vm.$log.debug('computeAllMeasureArgs success!');
        vm.$scope.measures = vm.Project.getMeasuresAndOptions();
        vm.resetAllChoiceArgumentSelections();
        vm.initializeTab();
      }, error => {
        if (vm.Message.showDebug()) vm.$log.debug('ERROR in computeAllMeasureArguments: ', error);
      });
    }
  }

  selectWeatherFile() {
    const vm = this;
    vm.setIsModified();
    // TODO: set defaultPath
    const result = vm.dialog.showOpenDialog({
      title: 'Select Weather File',
      filters: [
        {name: 'Weather Files', extensions: ['epw']}
      ],
      properties: ['openFile']
    });

    if (!_.isEmpty(result)) {
      // copy and select the file
      const weatherFilePath = result[0];
      if (vm.Message.showDebug()) vm.$log.debug('Weather File:', weatherFilePath);
      const weatherFilename = weatherFilePath.replace(/^.*[\\\/]/, '');
      // TODO: for now this isn't set to overwrite (if file already exists in project, it won't copy the new one
      vm.jetpack.copy(weatherFilePath, vm.Project.getProjectDir().path('weather/' + weatherFilename));
      if (vm.Message.showDebug()) vm.$log.debug('Weather file name: ', weatherFilename);
      // update seeds
      vm.Project.setWeatherFiles();
      vm.Project.setWeatherFilesDropdownOptions();
      vm.$scope.weatherFiles = vm.Project.getWeatherFiles();
      vm.$scope.defaultWeatherFile = weatherFilename;
      vm.Project.setDefaultWeatherFile(vm.$scope.defaultWeatherFile);
    }
  }

  // move measure 'up' or 'down'
  reorderMeasure(measure, direction) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('moving measure: ', direction);
    vm.setIsModified();
    // find current index of measure and new index to move to
    const index = _.findIndex(vm.$scope.measures, {instanceId: measure.instanceId});
    const new_index = (direction == 'up') ? index - 1 : index + 1;
    // find measure to swap with (with same type)
    const swapping_measure = vm.$scope.measures[new_index];
    // only move if you can
    if (swapping_measure) {
      if (vm.Message.showDebug()) vm.$log.debug('moving measure');
      vm.$scope.measures[new_index] = measure;
      vm.$scope.measures[index] = swapping_measure;
      vm.Project.setMeasuresAndOptions(vm.$scope.measures);

      // recalculate workflow indexes
      vm.Project.recalculateMeasureWorkflowIndexes();

      if (vm.Message.showDebug()) vm.$log.debug('measures: ', vm.$scope.measures);

      // initialize grid to resort
      vm.initializeTab();
    }
  }

  setIsModified() {
    const vm = this;
    vm.Project.setModified(true);
  }

  addDiscreteVariable(argument) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In addDiscreteVariable');
    //if (vm.Message.showDebug()) vm.$log.debug('argument: ', argument);
    //vm.$log.error('argument.type: ', argument.type);

    // Add 'Value', add 'Weight'
    const discreteVariable = {
      value: '',
      weight: ''
    };

    if (_.isNil(argument.inputs)) argument.inputs = {};
    if (_.isNil(argument.inputs.discreteVariables)) argument.inputs.discreteVariables = [];

    argument.inputs.discreteVariables.push(discreteVariable);
  }

  showDeltaX() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In showDeltaX');
    if (_.includes(['rgenoud', 'optim'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showDeltaX = true;
    } else {
      vm.$scope.showDeltaX = false;
    }
  }

  showMinAndMax() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In showMinAndMax');
    if (_.includes(['preflight'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showMinAndMax = true;
    } else {
      vm.$scope.showMinAndMax = false;
    }
  }

  showDistributions() {
    const vm = this;
    //if (vm.Message.showDebug()) vm.$log.debug('In showDistributions');
    if (!_.includes(['pso', 'optim'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showDistributions = true;
    } else {
      vm.$scope.showDistributions = false;
    }
  }

  showDiscreteDistributions() {
    const vm = this;
    if (_.includes(['diag'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showDiscreteDistributions = true;
    } else {
      vm.$scope.showDiscreteDistributions = false;
    }
  }

  showDiscreteVariables() {
    const vm = this;
    //if (vm.Message.showDebug()) vm.$log.debug('In showDiscreteVariables');
    if (_.includes(['nsga_nrel', 'lhs', 'preflight', 'morris', 'sobol', 'doe', 'diag', 'baseline_perturbation'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showDiscreteVariables = true;
    } else {
      vm.$scope.showDiscreteVariables = false;
    }
  }

  showPivotVariables() {
    const vm = this;
    //if (vm.Message.showDebug()) vm.$log.debug('In showPivotVariables');
    if (_.includes(['lhs', 'morris', 'sobol', 'doe', 'baseline_perturbation', 'diag', 'preflight'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showPivotVariables = true;
    } else {
      vm.$scope.showPivotVariables = false;
    }
  }

  showContinuousVariables() {
    const vm = this;
    //if (vm.Message.showDebug()) vm.$log.debug('In showContinuousVariables');
    if (_.includes(['diag', 'baseline_perturbation', 'single_run', 'repeat_run'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showContinuousVariables = false;
    } else {
      vm.$scope.showContinuousVariables = true;
    }
  }

  showWarningIcon(argument) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In showWarningIcon');

    // vm.$scope.showPivotVariables vm.$scope.showDiscreteVariables vm.$scope.showDistributions vm.$scope.showMinAndMax vm.$scope.showDeltaX vm.$scope.showValueAndWeights
    if (_.isNil(argument) || _.isNil(argument.inputs) || _.isNil(argument.inputs.variableSetting)) {
      return true;
    }

    if ((vm.$scope.showPivotVariables && (argument.inputs.variableSetting == 'Pivot')) ||
      (vm.$scope.showDiscreteVariables && (argument.inputs.variableSetting == 'Discrete')) ||
      (vm.$scope.showContinuousVariables && argument.inputs.variableSetting == 'Continuous') ||
      (argument.inputs.variableSetting == 'Argument')) {
      argument.inputs.showWarningIcon = false;
    } else {
      argument.inputs.showWarningIcon = true;
    }
  }

  showWarningIcons() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In showWarningIcons');
    _.forEach(vm.$scope.measures, (measure) => {
      _.forEach(measure.arguments, (argument) => {
        vm.showWarningIcon(argument);
      });
      vm.showWarningText(measure);
    });
  }

  showWarningText(measure) {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('In showWarningText');
    measure.showWarningText = false;
    _.forEach(measure.arguments, (argument) => {
      if (_.isNil(argument.inputs) == false && _.isNil(argument.inputs.showWarningIcon) == false) {
        if (argument.inputs.showWarningIcon) {
          measure.showWarningText = true;
        }
      }
    });
  }

  deleteValue(argument, index) {
    const vm = this;
    if (!_.isNil(index) && index > -1) {
      argument.inputs.discreteVariables.splice(index, 1);
      vm.setIsModified();
    }
  }

  initializeVariablesAlgMode() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('Initializing variables for Algorithmic mode');
    _.forEach(vm.$scope.measures, (measure) => {
      // add SKIP
      measure.skip = _.isNil(measure.skip) ? false : measure.skip;
      _.forEach(measure.arguments, (arg) => {
        // short name
        arg.display_name_short = arg.display_name_short ? arg.display_name_short : arg.name;
        if (!arg.inputs) arg.inputs = {};
        // name and displayName should be already defined
        arg.inputs.relationship = _.isNil(arg.inputs.relationship) ? null : arg.inputs.relationship; // TODO: what is this?
        arg.inputs.choiceDisplayNames = _.isNil(arg.choice_display_names) ? [] : arg.choice_display_names;  // TODO: what is this?
        arg.inputs.variableSetting = _.isNil(arg.inputs.variableSetting) ? 'Argument' : arg.inputs.variableSetting;
        if (arg.inputs.variableSetting == 'Discrete' || arg.inputs.variableSetting == 'Pivot') {
          arg.inputs.distribution = _.isNil(arg.inputs.distribution) ? 'Discrete' : arg.inputs.distribution;
        } else {
          arg.inputs.distribution = _.isNil(arg.inputs.distribution) ? 'Uniform' : arg.inputs.distribution;
        }
        arg.inputs.discreteVariables = _.isNil(arg.inputs.discreteVariables) ? [] : arg.inputs.discreteVariables;

        // calculate default value
        let defaultValue = null;
        if (_.isNil(arg.inputs.default_value)) {
          if (_.isNil(arg.default_value)) {
            if (arg.type == 'Integer' || arg.type == 'Double') {
              defaultValue = 0;
            } else if (arg.type == 'Boolean') {
              defaultValue = true;
            } else if (arg.type == 'String') {
              defaultValue = '';
            } else if (arg.type == 'Choice') {
              if (!_.isNil(arg.choice_display_names && arg.choice_display_names.length)) {
                defaultValue = arg.choice_display_names[0];
              } else {
                defaultValue = '';
              }
            }
          } else {
            defaultValue = arg.default_value;
          }
        } else {
          defaultValue = arg.inputs.default_value;
        }

        // set other algorithmic attributes
        arg.inputs.maximum = _.isNil(arg.inputs.maximum) ? defaultValue : arg.inputs.maximum;
        arg.inputs.minimum = _.isNil(arg.inputs.minimum) ? defaultValue : arg.inputs.minimum;
        arg.inputs.mean = _.isNil(arg.inputs.mean) ? defaultValue : arg.inputs.mean;
        arg.inputs.deltaX = _.isNil(arg.inputs.deltaX) ? defaultValue : arg.inputs.deltaX;
        arg.inputs.stdDev = _.isNil(arg.inputs.stdDev) ? defaultValue : arg.inputs.stdDev;
        arg.inputs.default_value = defaultValue;

        // special cases
        if (_.isNil(arg.inputs.deltaX) && arg.type == 'Double') {
          arg.inputs.deltaX = 0.0016;
        }
        if (_.isNil(arg.inputs.stdDev) && arg.type == 'Double') {
          arg.inputs.stdDev = (arg.inputs.maximum - arg.inputs.minimum) / 6;
        }
      });
    });
  }

  addOptions(measure) {
    const vm = this;
    const deferred = vm.$q.defer();
    if (vm.Message.showDebug()) vm.$log.debug('Analysis::addOptions');

    // open modal for user to select options.
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalSelectOptionsController',
      controllerAs: 'modal',
      templateUrl: 'app/analysis/selectOptions.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            measure: measure
          };
        }
      }
    });

    modalInstance.result.then(() => {
      deferred.resolve();
    }, () => {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;
  }
}

