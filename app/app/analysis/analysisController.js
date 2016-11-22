import jetpack from 'fs-jetpack';
import {remote} from 'electron';
const {dialog} = remote;

export class AnalysisController {

  constructor($log, $q, BCL, Project, $scope, $document, $uibModal) {
    'ngInject';

    const vm = this;
    vm.Project = Project;
    vm.$log = $log;
    vm.$q = $q;
    vm.$uibModal = $uibModal;
    vm.jetpack = jetpack;
    vm.$scope = $scope;
    vm.$document = $document;
    vm.BCL = BCL;
    vm.dialog = dialog;

    vm.analysisTypes = vm.Project.getAnalysisTypes();
    vm.$scope.seeds = vm.Project.getSeeds();
    vm.$scope.weatherFiles = vm.Project.getWeatherFiles();

    vm.$scope.defaultSeed = vm.Project.getDefaultSeed();
    vm.$scope.defaultWeatherFile = vm.Project.getDefaultWeatherFile();
    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();

    vm.$scope.measures = vm.Project.getMeasuresAndOptions();
    _.forEach(vm.$scope.measures, (measure) => {
      if (_.isNil(measure.seed)) measure.seed = vm.$scope.defaultSeed;
    });
    vm.$log.debug('****ANALYSIS TAB****');
    vm.$log.debug('ANALYSIS MEASURES RETRIEVED: ', vm.$scope.measures);

    vm.$scope.osMeasures = [];
    vm.$scope.epMeasures = [];
    vm.$scope.repMeasures = [];

    vm.$scope.selectedAll = false;

    vm.$scope.selectedSamplingMethod = vm.Project.getSamplingMethod();
    vm.samplingMethods = vm.Project.getSamplingMethods();

    vm.$scope.algorithmSettings = vm.Project.getAlgorithmSettingsForMethod(vm.$scope.selectedSamplingMethod);

    vm.gridApis = [];
    vm.$scope.gridOptions = [];
    vm.initializeGrids();
  }

  initializeGrids() {
    const vm = this;
    vm.$log.debug('In initializeGrids in analysis');
    // sort measures by workflow_index
    vm.$scope.measures = _.sortBy(vm.$scope.measures, ['workflow_index']);
    // group by type
    vm.setMeasureTypes();
    if (vm.$scope.selectedAnalysisType === 'Manual') {
      vm.setGridOptions();
      // load saved measure options
      vm.loadMeasureOptions();
    }
    else {
      vm.setAlgorithmicGridOptions();
    }
  }

  getDefaultOptionColDef() {
    const vm = this;
    return {
      display_name: 'Option 1',
      field: 'option_1',
      editDropdownOptionsFunction: function (rowEntity) {
        if (rowEntity.type === 'Choice') {
          vm.choices = [];
          _.forEach(rowEntity.choices, (choice) => {
            vm.choices.push({
              value: choice.value
            });
          });
          return vm.choices;
        }
      },
      cellTemplate: 'app/analysis/deleteButtonTemplate.html',
      //cellTemplate: '<input ng-if=\"row.entity.type==\'Boolean\'\" type=\"checkbox\" ng-class=\"\'colt\' + col.uid\" ui-grid-checkbox ng-model=\"MODEL_COL_FIELD\">' +
      //'<div ng-if=\"!row.entity.type==\'Boolean\'\" class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{row.getProperty(col.field)}}</span></div>',
      editableCellTemplate: 'app/analysis/optionInputTemplate.html',
      width: 200,
      minWidth: 100,
      enableCellEdit: true
    };
  }

  setGridOptions() {
    const vm = this;

    _.forEach(vm.$scope.measures, (measure) => {
      vm.$log.debug('measure: ', measure);

      // set number of options in measure

      if (!_.has(measure, 'numberOfOptions')) {
        measure.numberOfOptions = 0;
      }

      let addRows = true;
      if (measure.arguments.length > 0) {
        _.forEach(measure.arguments, (argument) => {
          if (_.has(argument, 'specialRowId')) {
            addRows = false;
          }
        });
      }
      else {
        addRows = false;
      }

      if (addRows) {
        const row0 = {specialRowId: 'optionDelete'};
        const row1 = {specialRowId: 'optionName', type: 'String'};
        const row2 = {specialRowId: 'optionDescription', type: 'String'};
        measure.arguments.splice(0, 0, row0, row1, row2);
      }

      vm.$scope.gridOptions[measure.uid] = {
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
          width: 200,
          minWidth: 100
        }, {
          name: 'short_name',
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
          cellTemplate: '<input ng-if="row.entity.name.length" type="checkbox" ui-grid-checkbox ng-model="MODEL_COL_FIELD">',
          headerCellFilter: 'translate',
          minWidth: 100,
          type: 'boolean',
          width: 200
        }],
        onRegisterApi: function (gridApi) {
          vm.gridApis[measure.uid] = gridApi;
        }
      };
    });
  }

  setAlgorithmicGridOptions() {
    const vm = this;

    _.forEach(vm.$scope.measures, (measure) => {

      // set number of options in measure
      if ((!_.has(measure, 'numberOfOptions'))) {
        measure.numberOfOptions = 0;
      }

      vm.$scope.gridOptions[measure.uid] = {
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
          minWidth: 100,
          width: 200
        }, {
          name: 'name',
          displayName: 'analysis.columns.shortName',
          headerCellFilter: 'translate',
          minWidth: 100,
          width: 200
        }, {
          name: 'variableSettings',
          displayName: 'analysis.columns.variableSettings',
          editType: 'dropdown',
          enableCellEdit: true,
          headerCellFilter: 'translate',
          minWidth: 100,
          width: 200,
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownOptionsFunction: function (rowEntity, colDef) {
            if (_.includes(['LHS', 'DOE'], vm.$scope.selectedSamplingMethod.id)) {
              return [{
                ID: 1,
                type: 'Static'
              }, {
                ID: 2,
                type: 'Discrete'
              }, {
                ID: 3,
                type: 'Continuous'
              }, {
                ID: 4,
                type: 'Pivot'
              }];
            } else {
              return [{
                ID: 1,
                type: 'Static'
              }, {
                ID: 2,
                type: 'Discrete'
              }, {
                ID: 3,
                type: 'Continuous'
              }];
            }
          },
          editDropdownIdLabel: 'type',
          editDropdownValueLabel: 'type'
        }],
        onRegisterApi: function (gridApi) {
          vm.gridApis[measure.uid] = gridApi;
        }
      };
    });
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
      vm.initializeGrids();
    });
  }

  checkUpdates() {
    const vm = this;
    const types = ['ModelMeasure', 'EnergyPlusMeasure', 'ReportingMeasure'];
    vm.BCL.openBCLModal(types, [], false).then(() => {
      // reset data
      vm.$scope.measures = vm.Project.getMeasuresAndOptions();
      vm.initializeGrids();
    });
  }

  // update the alternatives
  updateAlternatives(key) {
    // Delete a measure
    const vm = this;
    vm.setIsModified();
    let alternatives = vm.Project.getDesignAlternatives();
    vm.$log.debug('key: ', key);
    vm.$log.debug('alternatives: ', alternatives);
    //_.forEach(alternatives, (alternative) => {
    //  delete alternative[key];
    //});
    //vm.$log.debug('alternatives: ', alternatives);
    ////vm.Project.setDesignAlternatives(alternatives);
    //vm.DesignAlternativesController.setGridOptions();
  }

  // update the alternatives
  updateAlternatives2(key) {
    // Delete an option
    const vm = this;
    vm.setIsModified();
    let alternatives = vm.Project.getDesignAlternatives();
    vm.$log.debug('key: ', key);
    vm.$log.debug('alternatives: ', alternatives);
    _.forEach(alternatives, (alternative) => {
      delete alternative[key];
    });
    vm.$log.debug('alternatives: ', alternatives);
    //vm.Project.setDesignAlternatives(alternatives);
    vm.DesignAlternativesController.setGridOptions();
  }

  // update the alternatives
  updateAlternativesDeletedMeasure() {
    const vm = this;
    vm.setIsModified();
    _.forEach(vm.measures, (measure) => {
      _.forEach(measure.options, (option) => {
        const newAlt = vm.setNewAlternativeDefaults();
        _.forEach(vm.measures, (m) => {
          if (m.name == measure.name) {
            newAlt[m.name] = option.name;
          } else {
            newAlt[m.name] = 'None';
          }
        });
        vm.$scope.alternatives.push(newAlt);
      });
    });
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

    vm.$log.debug('Deleting measure: ', measure);

    // line below also removes it from bclService 'getProjectMeasures', but not from disk
    // TODO: fix so BCL modal doesn't restore deleted panels
    _.remove(vm.$scope.measures, {uid: measure.uid});
    vm.Project.setMeasuresAndOptions(vm.$scope.measures);

    //vm.updateAlternativesDeletedMeasure();

    const measurePanel = angular.element(vm.$document[0].querySelector('div[id="' + measure.uid + '"]'));
    measurePanel.remove();

    // Note: jetpack.remove() does not have any return
    vm.jetpack.remove(measure.measure_dir);

    // recalculate workflow indexes
    vm.Project.recalculateMeasureWorkflowIndexes();

    vm.initializeGrids();
  }

  addMeasureOption(measure) {
    const vm = this;
    vm.setIsModified();
    //vm.$log.debug('In addMeasureOption in analysis');

    if (measure.arguments.length === 0) return; // Nothing to see here

    const keys = Object.keys(measure.arguments[0]);
    vm.$log.debug('keys: ', keys);

    measure.numberOfOptions++;

    const optionKeys = _.filter(keys, function (k) {
      return k.indexOf('option_') !== -1;
    });
    //vm.$log.debug('option keys: ', optionKeys);

    let max = 0;
    _.forEach(optionKeys, (key) => {
      //vm.$log.debug('key: ', key);
      const num = Number(key.split('_')[1]);
      if (num > max) {
        max = num;
      }
    });
    vm.$log.debug('max: ', max);

    // start from first option
    const opt = vm.getDefaultOptionColDef();
    opt.display_name = 'Option ' + Number(max + 1);
    opt.field = 'option_' + Number(max + 1);
    opt.measureUID = measure.uid;

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
        argument[opt.field] = opt.display_name + ' Description';
      }
      else if (!argument.variable) {
        argument[opt.field] = argument.option_1;
      }
    });

    vm.$scope.gridOptions[measure.uid].columnDefs.push(opt);
    return opt;
  }

  deleteSelectedOption(measure) {
    const vm = this;
    vm.$log.debug('In deleteSelectedOption in analysis');
    vm.setIsModified();
    if (measure.numberOfOptions > 0) {
      measure.numberOfOptions -= 1;
      vm.$scope.gridOptions[measure.uid].columnDefs.splice(vm.$scope.gridOptions[measure.uid].columnDefs.length - 1, 1);
    }
  }

  deleteOption(col) {
    const vm = this;
    vm.$log.debug('In deleteOption in analysis');
    vm.setIsModified();
    vm.$log.debug('col: ', col);

    const optionCount = Number(col.field.split('_')[1]);
    vm.$log.debug('optionCount: ', optionCount);
    const measureUID = col.colDef.measureUID;
    vm.$log.debug('measureUID: ', measureUID);

    let columnIndex = 0;
    _.forEach((vm.$scope.gridOptions[measureUID]).columnDefs, (columnDef) => {
      if (_.has(columnDef, 'field')) {
        const optionCount2 = Number(columnDef.field.split('_')[1]);
        vm.$log.debug('columnDef.field: ', columnDef.field);
        if (optionCount === optionCount2) {
          vm.$log.debug('SUCCESS');
          vm.$log.debug('columnIndex: ', columnIndex);
          vm.$scope.gridOptions[measureUID].columnDefs.splice(columnIndex, 1);
        }
      }
      columnIndex++;
    });
    _.forEach(vm.$scope.measures, (measure) => {
      if (measure.uid == measureUID) {
        _.forEach(measure.arguments, (argument) => {
          delete argument[col.field];
        });
        // decrement options count
        measure.numberOfOptions = measure.numberOfOptions - 1;
      }
    });
  }

  addDefaultArguments(measure, option) {
    const vm = this;
    vm.setIsModified();
    _.forEach(measure.arguments, (argument) => {
      if ((argument.type == 'Double' || argument.type == 'Int') && (Number(argument.default_value))) {
        argument[option.field] = Number(argument.default_value);
      }
      else {
        argument[option.field] = argument.default_value;
      }
    });
  }

  duplicateOption(measure) {
    const vm = this;
    vm.$log.debug('In duplicateOption in analysis');
    vm.setIsModified();
    // TODO: For now, we are grabbing whatever's in the first option column
    // TODO  Eventually we will need to use the user-selected option column.
    const opt = vm.addMeasureOption(measure);

    // copy from 1st option
    _.forEach(measure.arguments, (arg) => {
      arg[opt.field] = arg.option_1;
    });
  }

  duplicateMeasureAndOption() {
    const vm = this;
    vm.$log.debug('In duplicateMeasureAndOption in analysis');
    vm.setIsModified();
  }

  loadMeasureOptions() {
    const vm = this;
    vm.$log.debug('In loadMeasureOptions in analysis');
    _.forEach(vm.$scope.measures, (measure) => {
      vm.$log.debug('measure: ', measure);
      _.forEach(measure.options, (option) => {
        vm.loadOption(measure, option);
      });
    });
  }

  loadOption(measure, option) {
    const vm = this;
    //vm.$log.debug('In loadOption in analysis');
    //vm.$log.debug('measure: ', measure);
    //vm.$log.debug('option: ', option);
    const re = /^option_(\d+)$/;
    if (re.test(option.id)) {
      const opt = vm.getDefaultOptionColDef();
      opt.display_name = _.startCase(option.id);
      opt.field = option.id;
      vm.$scope.gridOptions[measure.uid].columnDefs.push(opt);
    } else {
      vm.$log.error('option id does not match expected format (option_<ID>)');
    }
  }

  checkAll(measure) {
    const vm = this;
    vm.$log.debug('In checkAll in analysis');

    vm.$scope.selectedAll = vm.$scope.selectedAll === false;

    _.forEach(vm.$scope.gridOptions[measure.uid].data, row => row.variable = !!vm.$scope.selectedAll);
  }

  setSeed() {
    const vm = this;
    vm.$log.debug('In Analysis::setSeed');
    vm.setIsModified();
    vm.Project.setDefaultSeed(vm.$scope.defaultSeed);
    _.forEach(vm.$scope.measures, (measure) => {
      measure.seed = vm.$scope.defaultSeed;
    });
    // recompute model-dependent measure arguments when resetting seed
    vm.Project.computeAllMeasureArguments();
  }

  setWeatherFile() {
    const vm = this;
    vm.setIsModified();
    vm.Project.setDefaultWeatherFile(vm.$scope.defaultWeatherFile);
  }

  setType() {
    const vm = this;
    vm.$log.debug('In setType in analysis');
    vm.setIsModified();
    vm.Project.setAnalysisType(vm.$scope.selectedAnalysisType);
    vm.initializeGrids();
  }

  setSamplingMethod() {
    const vm = this;
    vm.$log.debug('In setSamplingMethod in analysis');
    vm.setIsModified();
    vm.Project.setSamplingMethod(vm.$scope.selectedSamplingMethod);
    vm.Project.setAlgorithmSettings(vm.$scope.selectedSamplingMethod);
    vm.$scope.algorithmSettings = vm.Project.getAlgorithmSettingsForMethod(vm.$scope.selectedSamplingMethod);
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
      vm.$log.debug('Seed Model:', seedModelPath);
      const seedModelFilename = seedModelPath.replace(/^.*[\\\/]/, '');
      // TODO: for now this isn't set to overwrite (if file already exists in project, it won't copy the new one
      vm.jetpack.copy(seedModelPath, vm.Project.getProjectDir().path('seeds/' + seedModelFilename));
      vm.$log.debug('Seed Model name: ', seedModelFilename);
      // update seeds
      vm.Project.setSeeds();
      vm.$scope.seeds = vm.Project.getSeeds();
      vm.$scope.defaultSeed = seedModelFilename;
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
      vm.$log.debug('Weather File:', weatherFilePath);
      const weatherFilename = weatherFilePath.replace(/^.*[\\\/]/, '');
      // TODO: for now this isn't set to overwrite (if file already exists in project, it won't copy the new one
      vm.jetpack.copy(weatherFilePath, vm.Project.getProjectDir().path('weather/' + weatherFilename));
      vm.$log.debug('Weather file name: ', weatherFilename);
      // update seeds
      vm.Project.setWeatherFiles();
      vm.$scope.weatherFiles = vm.Project.getWeatherFiles();
      vm.$scope.defaultWeatherFile = weatherFilename;
    }
  }

  // move measure 'up' or 'down'
  reorderMeasure(measure, direction) {
    const vm = this;
    vm.$log.debug('moving measure: ', direction);
    vm.setIsModified();
    // find current index of measure and new index to move to
    const index = _.findIndex(vm.$scope.measures, {uid: measure.uid});
    const new_index = (direction == 'up') ? index - 1 : index + 1;
    // find measure to swap with (with same type)
    const swapping_measure = vm.$scope.measures[new_index];
    // only move if you can
    if (swapping_measure) {
      vm.$log.debug('moving measure');
      vm.$scope.measures[new_index] = measure;
      vm.$scope.measures[index] = swapping_measure;
      vm.Project.setMeasuresAndOptions(vm.$scope.measures);

      // recalculate workflow indexes
      vm.Project.recalculateMeasureWorkflowIndexes();

      vm.$log.debug('measures: ', vm.$scope.measures);

      // initialize grid to resort
      vm.initializeGrids();
    }
  }

  setIsModified() {
    const vm = this;
    vm.Project.setModified(true);
  }

}

