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
    vm.$scope.filesToInclude = vm.Project.getFilesToInclude();
    vm.$scope.serverScripts = vm.Project.getServerScripts();
    vm.$log.debug('ServerScripts: ', vm.$scope.serverScripts);

    vm.$scope.measures = vm.Project.getMeasuresAndOptions();
    _.forEach(vm.$scope.measures, (measure) => {
      if (_.isNil(measure.seed)) measure.seed = vm.$scope.defaultSeed;
    });
    vm.$log.debug('****ANALYSIS TAB****');
    vm.$log.debug('ANALYSIS MEASURES RETRIEVED: ', vm.$scope.measures);

    vm.$scope.osMeasures = [];
    vm.$scope.epMeasures = [];
    vm.$scope.repMeasures = [];

    vm.$scope.selectedSamplingMethod = vm.Project.getSamplingMethod();
    vm.samplingMethods = vm.Project.getSamplingMethods();
    vm.$scope.algorithmSettings = vm.Project.getAlgorithmSettingsForMethod(vm.$scope.selectedSamplingMethod);

    vm.designAlternatives = vm.Project.getDesignAlternatives();

    vm.gridApis = [];
    vm.$scope.gridOptions = [];
    vm.initializeGrids();

    // size grids according to data
    vm.$scope.getTableHeight = function (uid) {
      var rowHeight = 30; // your row height
      var headerHeight = 40; // your header height
      return {
        height: (vm.$scope.gridOptions[uid].data.length * rowHeight + headerHeight + 10) + "px"
      };
    };

    vm.initializeValues();
    vm.showDeltaX();
    vm.showValueAndWeights();
    vm.showMinAndMax();
    vm.showDistributions();
    vm.showDiscreteVariables();
    vm.showPivotVariables();

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
    vm.$log.debug('AnalysisController getDefaultOptionColDef');
    return {
      display_name: 'Option 1',
      field: 'option_1',
      editDropdownOptionsFunction: function (rowEntity, colDef) {
        if (rowEntity.type === 'Choice') {
          //vm.$log.debug('rowEntity: ', rowEntity);
          //vm.$log.debug('colDef: ', colDef);
          vm.choices = [];
          _.forEach(rowEntity.choice_display_names
            , (choice) => {
              vm.$log.debug('choice: ', choice);
              vm.choices.push({
                id: choice,
                value: choice
              });
            });
          vm.$log.debug('vm.choices: ', vm.choices);
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
        } else {
          return $scope.row.entity.variable;
        }
      }
    };
  }

  setGridOptions() {
    const vm = this;
    vm.$log.debug('in setGridOptions');

    _.forEach(vm.$scope.measures, (measure) => {
      vm.$log.debug('measure: ', measure);

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
          measureUID: measure.uid,
          cellTemplate: 'app/analysis/checkAllTemplate.html',
          headerCellFilter: 'translate',
          minWidth: 30,
          type: 'boolean',
          width: 70
        }],
        onRegisterApi: function (gridApi) {
          vm.gridApis[measure.uid] = gridApi;
          gridApi.edit.on.afterCellEdit(vm.$scope, function (rowEntity, colDef, newValue, oldValue) {
            if (newValue != oldValue) {
              vm.$log.debug('CELL has changed in: ', measure.uid, ' old val: ', oldValue, ' new val: ', newValue);
              vm.$log.debug('rowEntity: ', rowEntity);
              vm.updateDASelectedName(measure, oldValue, newValue);
            }
          });
        }
      };
    });
  }

  setAlgorithmicGridOptions() {
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
  unsetOptionInDA(measureUID, value) {
    const vm = this;
    vm.$log.debug('In Analysis::unsetOptionInDA');
    vm.$log.debug('DAs: ', vm.designAlternatives);
    vm.$log.debug('measureUID: ', measureUID, ' optionName: ', value);
    const measure = _.find(vm.$scope.measures, {uid: measureUID});
    vm.$log.debug('measure: ', measure);
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

    vm.$log.debug('Deleting measure: ', measure);

    // line below also removes it from bclService 'getProjectMeasures', but not from disk
    // TODO: fix so BCL modal doesn't restore deleted panels
    _.remove(vm.$scope.measures, {uid: measure.uid});
    vm.Project.setMeasuresAndOptions(vm.$scope.measures);

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
    vm.$log.debug('In addMeasureOption in analysis');

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
        argument.variable = false;
      }
      else if (!argument.variable) {
        argument[opt.field] = argument.option_1;
      }
    });

    vm.$scope.gridOptions[measure.uid].columnDefs.push(opt);
    return opt;
  }

  deleteSelectedOption(measure) { // TODO is this dead code? Evan
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

    // get option name before deleting it
    vm.$log.debug('OPTION NAME? ', col.grid.options.data[1][col.name]);
    const optionName = col.grid.options.data[1][col.name];

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
    // reset DAs that were using this option
    vm.unsetOptionInDA(measureUID, optionName);
  }

  variableCheckboxChanged(row, col) {
    const vm = this;
    vm.$log.debug('In variableCheckboxChanged in analysis');
    //vm.$log.debug('row', row);
    //vm.$log.debug('col', col);
    vm.setIsModified();

    const measureUID = col.colDef.measureUID;
    //vm.$log.debug('measureUID: ', measureUID);

    const measure = _.find(vm.$scope.measures, {uid: measureUID});
    //vm.$log.debug('measure: ', measure);

    const display_name = row.entity.display_name;
    //vm.$log.debug('display_name: ', display_name);

    const variable = row.entity.variable;
    //vm.$log.debug('variable: ', variable);

    if (!variable) {
      for (let i = 0; i < measure.arguments.length; i++) {
        if (measure.arguments[i].display_name === display_name) {
          const keys = _.keys(measure.arguments[i]);
          const optionKeys = _.filter(keys, function (k) {
            return k.indexOf('option_') !== -1;
          });
          for (let j = 1; j < optionKeys.length; j++) {
            //vm.$log.debug('measure.arguments[i][optionKeys[j]]: ', measure.arguments[i][optionKeys[j]]);
            //vm.$log.debug('measure.arguments[i][optionKeys[j]]: ', measure.arguments[i][optionKeys[0]]);
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
    vm.$log.debug('In optionCheckboxChanged in analysis');
    vm.setIsModified();

    //vm.$scope.$broadcast('uiGridEventEndCellEdit'); Note: this causes page to jump to bottom, and is visually unacceptable (Evan)
  }

  allVariableCheckboxesChanged(row, col) {
    const vm = this;
    vm.$log.debug('In allVariableCheckboxesChanged in analysis');
    //vm.$log.debug('row', row);
    //vm.$log.debug('col', col);
    vm.setIsModified();

    const measureUID = col.colDef.measureUID;
    //vm.$log.debug('measureUID: ', measureUID);

    const measure = _.find(vm.$scope.measures, {uid: measureUID});
    //vm.$log.debug('measure: ', measure);

    const variable = row.entity.variable;
    //vm.$log.debug('variable: ', variable);

    if (!variable) {
      // Dont change the first 3 rows regarding naming
      for (let i = 3; i < measure.arguments.length; i++) {
        const keys = _.keys(measure.arguments[i]);
        const optionKeys = _.filter(keys, function (k) {
          return k.indexOf('option_') !== -1;
        });
        for (let j = 1; j < optionKeys.length; j++) {
          //vm.$log.debug('measure.arguments[i][optionKeys[j]]: ', measure.arguments[i][optionKeys[j]]);
          //vm.$log.debug('measure.arguments[i][optionKeys[j]]: ', measure.arguments[i][optionKeys[0]]);
          measure.arguments[i][optionKeys[j]] = measure.arguments[i][optionKeys[0]];
        }
      }
    }
    //vm.$scope.$broadcast('uiGridEventEndCellEdit'); Note: this causes page to jump to bottom, and is visually unacceptable (Evan)
  }

  // Toggle all variable checkboxes
  checkAllVariables(row, col) {
    const vm = this;
    const measureUID = col.colDef.measureUID;
    // toggle checkbox
    if (row.entity.variable) {
      // set all to true
      _.forEach(vm.$scope.gridOptions[measureUID].data, (row) => {
        row.variable = true;
      });
    } else {
      // set all to false
      _.forEach(vm.$scope.gridOptions[measureUID].data, (row) => {
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

  duplicateOption(measure) {
    const vm = this;
    vm.$log.debug('In duplicateOption in analysis');
    vm.setIsModified();
    // TODO: For now, we are grabbing whatever's in the first option column
    // TODO  Eventually we will need to use the user-selected option column.
    const opt = vm.addMeasureOption(measure);

    // copy from 1st option
    let count = 0;
    _.forEach(measure.arguments, (arg) => {
      // Dont change the first 3 rows regarding naming
      if (count++ > 2) arg[opt.field] = arg.option_1;
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
    //vm.$log.debug('In loadOption in analysis');
    //vm.$log.debug('measure: ', measure);
    //vm.$log.debug('option: ', option);
    const re = /^option_(\d+)$/;
    if (re.test(option.id)) {
      const opt = vm.getDefaultOptionColDef();
      opt.display_name = _.startCase(option.id);
      opt.field = option.id;
      opt.measureUID = measure.uid;  // explicitly set this just in case
      vm.$scope.gridOptions[measure.uid].columnDefs.push(opt);
    } else {
      vm.$log.error('option id does not match expected format (option_<ID>)');
    }
  }

  // reset selections (to default) when choice argument is no longer in list
  resetChoiceArgumentSelections(measure) {
    const vm = this;
    vm.$log.debug('in resetChoiceArgumentSelections in analysis');
    _.forEach(measure.arguments, (arg) => {
      if (arg.type == 'Choice') {
        vm.$log.debug("Choice Arg: ", arg.name);
        const keys = _.keys(arg);
        const optionKeys = _.filter(keys, function (k) {
          return k.indexOf('option_') !== -1;
        });
        _.forEach(optionKeys, (key) => {
          if (_.isUndefined(_.find(arg.choice_display_names, arg[key]))) {
            vm.$log.debug('Argument value ', arg[key], ' was not found in choice list...resetting to default_value');
            arg[key] = arg.default_value ? arg.default_value : '';
          }
        });
      }
    });
  }

  resetAllChoiceArgumentSelections() {
    const vm = this;
    vm.$log.debug('in resetAllChoiceArgumentSelections in anaysis');
    _.forEach(vm.$scope.measures, (measure) => {
      vm.resetChoiceArgumentSelections(measure);
    });
  }

  setSeed() {
    const vm = this;
    vm.$log.debug('In Analysis::setSeed');
    vm.setIsModified();
    vm.Project.setDefaultSeed(vm.$scope.defaultSeed);
    _.forEach(vm.$scope.measures, (measure) => {
      measure.seed = vm.$scope.defaultSeed;
    });
    vm.Project.setMeasuresAndOptions(vm.$scope.measures);
    vm.Project.savePrettyOptions();
    // recompute model-dependent measure arguments & refresh grid
    vm.Project.computeAllMeasureArguments().then(() => {
      vm.$log.debug('computeAllMeasureArgs success!');
      vm.$scope.measures = vm.Project.getMeasuresAndOptions();
      vm.resetAllChoiceArgumentSelections();
      vm.initializeGrids();
    }, error => {
      vm.$log.debug('Error in computeALLMeasureArguments: ', error);
    });
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

  // setDirToInclude() {
  //   const vm = this;
  //   vm.$log.debug('In setDirToInclude in analysis');
  //   vm.setIsModified();
  //   vm.Project.setDirToInclude(vm.$scope.dirToInclude);
  // }

  // setDirToUnpackTo() {
  //   const vm = this;
  //   vm.$log.debug('In setDirToUnpackTo in analysis');
  //   vm.setIsModified();
  //   vm.Project.setDirToUnpackTo(vm.$scope.dirToUnpackTo);
  // }

  setSamplingMethod() {
    const vm = this;
    vm.$log.debug('In setSamplingMethod in analysis');
    vm.setIsModified();
    vm.Project.setSamplingMethod(vm.$scope.selectedSamplingMethod);
    vm.Project.setAlgorithmSettings(vm.$scope.selectedSamplingMethod);
    vm.$scope.algorithmSettings = vm.Project.getAlgorithmSettingsForMethod(vm.$scope.selectedSamplingMethod);
    vm.showDeltaX();
    vm.showValueAndWeights();
    vm.showMinAndMax();
    vm.showDistributions();
    vm.showDiscreteVariables();
    vm.showPivotVariables();
    vm.showWarningIcons();
  }

  // compute measure arguments when setting the seed
  computeMeasureArguments(measure) {
    const vm = this;
    vm.$log.debug('In computeMeasureArguments in analysis');
    vm.setIsModified();
    vm.Project.computeMeasureArguments(measure).then(response => {
      // get updated measure and set
      vm.$log.debug('Success!');
      measure = response;
      vm.$log.debug('Analysis Tab, new computed measure: ', angular.copy(measure));
      vm.$log.debug('Scope measures: ', vm.$scope.measures);
      vm.initializeGrids();
      vm.Project.setMeasuresAndOptions(vm.$scope.measures);
    }, error => {
      vm.$log.debug("Error in Project::computeMeasureArguments: ", error);
    });
  }

  selectDirToInclude(file) {
    const vm = this;

    const result = vm.dialog.showOpenDialog({
      title: 'Select Directory To Include',
      properties: ['openDirectory']
    });

    if (!_.isEmpty(result)) {
      vm.$log.debug(' result[0]:', result[0]);
      file.dirToInclude = result[0];
      vm.setIsModified();
    }
  }

  addDirToInclude() {
    const vm = this;
    vm.$log.debug('In analysis::addDirToInclude');
    vm.$scope.filesToInclude.push({dirToInclude: null, unpackDirName: null});
    vm.$log.debug('Files to Include Array: ', vm.$scope.filesToInclude);
  }

  deleteDirToInclude(index) {
    const vm = this;
    vm.$log.debug('In analysis::deleteDirToInclude, remove at index: ', index);
    if (!_.isNil(index)) {
      vm.$scope.filesToInclude.splice(index, 1);
    }
    vm.$log.debug('Files to Include Array: ', vm.$scope.filesToInclude);
  }

  selectScript(type) {
    const vm = this;
    const result = vm.dialog.showOpenDialog({
      title: 'Select Script',
      properties: ['openFile']
    });

    if (!_.isEmpty(result)) {
      vm.$log.debug(' result[0]:', result[0]);
      vm.$scope.serverScripts[type].file = result[0];
      vm.setIsModified();
    }
  }

  addScriptArgument(type) {
    const vm = this;
    vm.$scope.serverScripts[type].arguments.push(null);
  }

  deleteScriptArgument(type, index) {
    const vm = this;
    vm.$log.debug("deleting at index: ", index);
    vm.$log.debug('arguments: ', vm.$scope.serverScripts[type].arguments);
    if (!_.isNil(index)) {
      vm.$scope.serverScripts[type].arguments.splice(index, 1);
    }
    vm.$log.debug('New Arguments for type: ', type, ' are: ', vm.$scope.serverScripts[type].arguments);
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
        vm.$log.debug('computeAllMeasureArgs success!');
        vm.$scope.measures = vm.Project.getMeasuresAndOptions();
        vm.resetAllChoiceArgumentSelections();
        vm.initializeGrids();
      }, error => {
        vm.$log.debug('ERROR in computeAllMeasureArguments');
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
      vm.$log.debug('Weather File:', weatherFilePath);
      const weatherFilename = weatherFilePath.replace(/^.*[\\\/]/, '');
      // TODO: for now this isn't set to overwrite (if file already exists in project, it won't copy the new one
      vm.jetpack.copy(weatherFilePath, vm.Project.getProjectDir().path('weather/' + weatherFilename));
      vm.$log.debug('Weather file name: ', weatherFilename);
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

  getDistributions(argument) {
    const vm = this;
    vm.$log.debug('In getDistributions');

    if (_.isNil(argument.inputs)) argument.inputs = {};

    switch (vm.$scope.selectedSamplingMethod.id) {
      case 'PSO':
      case 'Optim':
        argument.inputs.distributions = ['Uniform'];
        break;
      case 'SPEA2':
      case 'RGENOUD':
      case 'NSGA2':
      case 'LHS':
      case 'PreFlight':
      case 'Morris':
      case 'DOE':
      case 'SingleRun':
      case 'RepeatRun':
        argument.inputs.distributions = ['Uniform', 'Triangle', 'Normal', 'LogNormal'];
        break;
      default:
        argument.inputs.distributions = ['Unhandled Sampling Method'];
    }
    argument.inputs.distribution = argument.inputs.distributions[0];
  }

  getVariableSettings(argument) {
    const vm = this;
    vm.$log.debug('In getVariableSettings');

    if (_.isNil(argument.inputs)) argument.inputs = {};

    switch (vm.$scope.selectedSamplingMethod.id) {
      case 'SPEA2':
      case 'PSO':
      case 'RGENOUD':
      case 'Optim':
      case 'NSGA2':
      case 'LHS':
      case 'PreFlight':
      case 'Morris':
      case 'DOE':
      case 'SingleRun':
      case 'RepeatRun':
        if (argument.type === 'Double') {
          argument.inputs.variableSettings = ['Argument', 'Discrete', 'Continuous', 'Pivot'];
        } else {
          argument.inputs.variableSettings = ['Argument', 'Discrete', 'Pivot'];
        }
        break;
      default:
        argument.inputs.variableSettings = ['Unhandled Sampling Method'];
    }

    argument.inputs.variableSetting = _.isNil(argument.inputs.variableSetting) ? argument.inputs.variableSettings[0] : argument.inputs.variableSetting;
  }

  checkVariableSettings(argument) {
    const vm = this;
    vm.$log.debug('In checkVariableSettings');

    if (_.isNil(argument.inputs)) argument.inputs = {};

    switch (vm.$scope.selectedSamplingMethod.id) {
      case 'SPEA2':
      case 'PSO':
        if (argument.type === 'Double') {
          argument.inputs.variableSettings = ['Argument', 'Discrete', 'Continuous'];
        } else {
          argument.inputs.variableSettings = ['Argument'];
        }
        break;
      case 'RGENOUD':
      case 'Optim':
        if (argument.type === 'Double') {
          argument.inputs.variableSettings = ['Argument', 'Discrete', 'Continuous'];
        } else {
          argument.inputs.variableSettings = ['Argument'];
        }
        break;
      case 'NSGA2':
      case 'PreFlight':
      case 'SingleRun':
      case 'RepeatRun':
        argument.inputs.variableSettings = ['Argument', 'Discrete', 'Continuous'];
        break;
      case 'LHS':
      case 'DOE':
        argument.inputs.variableSettings = ['Argument', 'Discrete', 'Continuous', 'Pivot'];
        break;
      default:
        argument.inputs.variableSettings = ['Unhandled Sampling Method'];
    }
    argument.inputs.variableSetting = argument.inputs.variableSettings[0];
  }

  addDiscreteVariable(argument) {
    const vm = this;
    vm.$log.debug('In addDiscreteVariable');
    //vm.$log.debug('argument: ', argument);
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

  showValueAndWeights() {
    const vm = this;
    vm.$log.debug('In showValueAndWeights');
    if (_.includes(['NSGA2', 'LHS', 'Preflight', 'Morris', 'DOE', 'BaselinePerturbation'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showValueAndWeights = true;
    } else {
      vm.$scope.showValueAndWeights = false;
    }
  }

  showDeltaX() {
    const vm = this;
    vm.$log.debug('In showDeltaX');
    if (_.includes(['RGENOUD', 'Optim'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showDeltaX = true;
    } else {
      vm.$scope.showDeltaX = false;
    }
  }

  showMinAndMax() {
    const vm = this;
    vm.$log.debug('In showMinAndMax');
    if (_.includes(['PreFlight'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showMinAndMax = true;
    } else {
      vm.$scope.showMinAndMax = false;
    }
  }

  showDistributions() {
    const vm = this;
    vm.$log.debug('In showDistributions');
    if (!_.includes(['PSO', 'Optim'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showDistributions = true;
    } else {
      vm.$scope.showDistributions = false;
    }
  }

  showDiscreteVariables() {
    const vm = this;
    vm.$log.debug('In showDiscreteVariables');
    if (_.includes(['NSGA2', 'LHS', 'Preflight', 'Morris', 'DOE', 'Diagonal', 'BaselinePerturbation'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showDiscreteVariables = true;
    } else {
      vm.$scope.showDiscreteVariables = false;
    }
  }

  showPivotVariables() {
    const vm = this;
    vm.$log.debug('In showPivotVariables');
    if (_.includes(['LHS', 'Morris', 'DOE', 'BaselinePerturbation'], vm.$scope.selectedSamplingMethod.id)) {
      vm.$scope.showPivotVariables = true;
    } else {
      vm.$scope.showPivotVariables = false;
    }
  }

  showWarningIcon(argument) {
    const vm = this;
    vm.$log.debug('In showWarningIcon');

    // vm.$scope.showPivotVariables vm.$scope.showDiscreteVariables vm.$scope.showDistributions vm.$scope.showMinAndMax vm.$scope.showDeltaX vm.$scope.showValueAndWeights
    if (_.isNil(argument) || _.isNil(argument.inputs) || _.isNil(argument.inputs.variableSetting)) {
      return true;
    }

    if ((vm.$scope.showPivotVariables && (argument.inputs.variableSetting == 'Pivot')) ||
      (vm.$scope.showDiscreteVariables && (argument.inputs.variableSetting == 'Discrete')) ||
      (argument.inputs.variableSetting == 'Continuous') ||
      (argument.inputs.variableSetting == 'Argument')) {
      argument.inputs.showWarningIcon = false;
    } else {
      argument.inputs.showWarningIcon = true;
    }
  }

  showWarningIcons() {
    const vm = this;
    vm.$log.debug('In showWarningIcons');
    _.forEach(vm.$scope.measures, (measure) => {
      _.forEach(measure.arguments, (argument) => {
        vm.showWarningIcon(argument);
      });
      vm.showWarningText(measure);
    });
  }

  showWarningText(measure) {
    const vm = this;
    vm.$log.debug('In showWarningText');
    measure.showWarningText = false;
    _.forEach(measure.arguments, (argument) => {
      if (_.isNil(argument.inputs) == false && _.isNil(argument.inputs.showWarningIcon) == false) {
        if (argument.inputs.showWarningIcon) {
          measure.showWarningText = true;
        }
      }
    });
  }

  initializeValues() {
    const vm = this;
    vm.$log.debug('In initializeValues');

    _.forEach(vm.$scope.measures, (measure) => {

      measure.skip = _.isNil(measure.skip) ? false : measure.skip;

      _.forEach(measure.arguments, (arg) => {
        if (_.isNil(arg.inputs)) {
          let relationship = 'Standard';
          let defaultValue = 0;
          let choiceDisplayNames = _.isNil(arg.choice_display_names) ? '' : arg.choice_display_names;
          let name = _.isNil(arg.name) ? [] : arg.name;
          let displayName = _.isNil(arg.display_name) ? '' : arg.display_name;
          if (_.isNil(arg.specialRowId)) {
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

            let deltaX = 0.001;
            let discreteMinimum = defaultValue;
            let discreteMaximum = defaultValue;
            let maximum = defaultValue;
            let mean = defaultValue;
            let minimum = defaultValue;
            let stdDev = defaultValue;
            if (arg.type == 'Double') {
              stdDev = (maximum - minimum) / 6;
            }

            let distribution = 'Uniform';
            let variableSetting = 'Argument';

            let inputs = {
              relationship: relationship,
              choice_display_names: choiceDisplayNames,
              default_value: defaultValue,
              deltaX: deltaX,
              discreteMinimum: discreteMinimum,
              discreteMaximum: discreteMaximum,
              discreteVariables: [
                {
                  value: "",
                  weight: "",
                  $$hashKey: ""
                }
              ],
              display_name: displayName,
              distribution: distribution,
              distributions: [
                "Uniform",
                "Triangle",
                "Normal",
                "LogNormal"
              ],
              maximum: maximum,
              mean: mean,
              minimum: minimum,
              name: name,
              stdDev: stdDev,
              variableSetting: variableSetting,
              variableSettings: [
                "Argument",
                "Discrete",
                "Continuous",
                "Pivot"
              ]
            };
            arg.inputs = inputs;
          }
        }

      });
    });
  }

}

