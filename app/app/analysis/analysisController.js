import * as jetpack from 'fs-jetpack';
import * as os from 'os';
import * as path from 'path';
import { dialog } from 'remote';

export class AnalysisController {

  constructor($log, BCL, Project, $scope, $document) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.$scope = $scope;
    vm.$document = $document;
    vm.BCL = BCL;
    vm.Project = Project;
    vm.dialog = dialog;

    vm.projectDir = vm.Project.getProjectDir();

    vm.analysisTypes = vm.Project.getAnalysisTypes();
    vm.$scope.seeds = vm.Project.getSeeds();
    vm.$scope.weatherFiles = vm.Project.getWeatherFiles();

    vm.$scope.defaultSeed = vm.Project.getDefaultSeed();
    vm.$scope.defaultWeatherFile = vm.Project.getDefaultWeatherFile();
    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();

    vm.$scope.measures = vm.Project.getMeasuresAndOptions();
    vm.$log.debug('PROJECT MEASURES RETRIEVED: ', vm.$scope.measures);

    vm.$scope.osMeasures = [];
    vm.$scope.epMeasures = [];
    vm.$scope.repMeasures = [];

    // SAVE
    vm.$scope.$on('$destroy', () => {
      console.log('SAVING measures to ProjectService');
      vm.Project.setMeasuresAndOptions(vm.$scope.measures);
      // save measure options in nicer structure for json export
      // TODO: this isn't saving quite correctly (options don't load back?)
      vm.Project.savePrettyOptions();
      vm.Project.exportPAT();
    });

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
      displayName: 'Option 1',
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
          name: 'displayName',
          displayName: 'analysis.columns.argumentName',
          enableCellEdit: false,
          headerCellFilter: 'translate',
          width: 200,
          minWidth: 100
        }, {
          name: 'shortName',
          displayName: 'analysis.columns.shortName',
          cellEditableCondition: $scope => {
            return angular.isDefined($scope.row.entity.displayName);
          },
          headerCellFilter: 'translate',
          width: 200,
          minWidth: 100
        }, {
          name: 'variable',
          displayName: 'analysis.columns.variable',
          cellTemplate: '<input ng-if="row.entity.displayName.length" type="checkbox" ng-class="\'colt\' + col.uid" ui-grid-checkbox ng-model="MODEL_COL_FIELD">',
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
          name: 'displayName',
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
    const types = [type];
    vm.BCL.openBCLModal(types, [], false).then(() => {
      // reset data
      vm.$scope.measures = vm.BCL.getProjectMeasures();
      vm.initializeGrids();
      vm.$log.debug('measures: ', vm.$scope.measures);
    });
  }

  removeMeasure(measure) {
    const vm = this;
    // line below also removes it from bclService 'getProjectMeasures', but not from disk
    // TODO: fix so BCL modal doesn't restore deleted panels
    _.remove(vm.$scope.measures, {uid: measure.uid});
    vm.Project.setMeasuresAndOptions(vm.$scope.measures);

    const measurePanel = angular.element(vm.$document[0].querySelector('div[id="' + measure.uid + '"]'));
    measurePanel.remove();

    vm.initializeGrids();
  }

  addMeasureOption(measure) {
    const vm = this;
    vm.$log.debug('In addMeasureOption in analysis');

    measure.numberOfOptions++;

    // start from first option
    const opt = vm.getDefaultOptionColDef();
    opt.displayName = 'Option ' + measure.numberOfOptions;
    //opt.field = 'option_' + measure.numberOfOptions + '_' + measure.uid; // TODO fix this
    opt.field = 'option_' + measure.numberOfOptions;

    // add default arguments to opt
    vm.addDefaultArguments(measure, opt);

    _.forEach(measure.arguments, argument => {
      if (argument.specialRowId === 'optionName') {
        argument[opt.field] = opt.displayName + ' Name';
      }
      else if (argument.specialRowId === 'optionDescription') {
        argument[opt.field] = opt.displayName + ' Description';
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

    if (measure.numberOfOptions > 0) {
      measure.numberOfOptions -= 1;
      vm.$scope.gridOptions[measure.uid].columnDefs.splice(vm.$scope.gridOptions[measure.uid].columnDefs.length - 1, 1);
    }
  }


  deleteOption(col) {
    const vm = this;

    const optionCount = Number(col.field.split('_')[1]);
    const columnIdxToDelete = optionCount + 2; // 3 columns are present before any option columns
    const measureUID = col.field.split('_')[2];

    vm.$scope.gridOptions[measureUID].columnDefs.splice(columnIdxToDelete, 1);
  }

  addDefaultArguments(measure, option) {
    _.forEach(measure.arguments, (argument) => {
      if ((argument.type == 'Double' || argument.type == 'Int') && (Number(argument.defaultValue))) {
        argument[option.field] = Number(argument.defaultValue);
      }
      else {
        argument[option.field] = argument.defaultValue;
      }
    });
  }

  duplicateOption(measure) {
    const vm = this;
    vm.$log.debug('In duplicateOption in analysis');

    // TODO: For now, we are grabbing whatever's in the first option column
    // TODO  Eventually we will need to use the user-selected option column.
    const opt = vm.addMeasureOption(measure);

    // copy from 1st option
    _.forEach(measure.arguments, (arg) => {
      arg[opt.field] = arg.option_1;
    });
  }

  duplicateMeasureAndOption(measure) {
    const vm = this;
    vm.$log.debug('In duplicateMeasureAndOption in analysis');
    // TODO: implement this
  }

  loadMeasureOptions() {
    const vm = this;
    vm.$log.debug('In loadMeasureOptions in analysis');
    _.forEach(vm.$scope.measures, (measure) => {

      _.forEach(measure.options, (option) => {
        vm.loadOption(measure, option);
      });
    });
  }

  loadOption(measure, option) {
    const vm = this;
    const re = /^option_(\d+)$/;
    if (re.test(option.id)) {
      const opt = vm.getDefaultOptionColDef();
      opt.displayName = _.startCase(option.id);
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
    vm.Project.setDefaultSeed(vm.$scope.defaultSeed);
  }

  setWeatherFile() {
    const vm = this;
    vm.Project.setDefaultWeatherFile(vm.$scope.defaultWeatherFile);
  }

  setType() {
    const vm = this;
    vm.$log.debug('In setType in analysis');
    vm.Project.setAnalysisType(vm.$scope.selectedAnalysisType);
    vm.initializeGrids();
  }

  setSamplingMethod() {
    const vm = this;
    vm.$log.debug('In setSamplingMethod in analysis');
    vm.Project.setSamplingMethod(vm.$scope.selectedSamplingMethod);
    vm.Project.setAlgorithmSettings(vm.$scope.selectedSamplingMethod);
    vm.$scope.algorithmSettings = vm.Project.getAlgorithmSettingsForMethod(vm.$scope.selectedSamplingMethod);

  }

  selectSeedModel() {
    const vm = this;

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
      vm.jetpack.copy(seedModelPath, vm.projectDir.path('seeds/' + seedModelFilename));
      vm.$log.debug('Seed Model name: ', seedModelFilename);
      // update seeds
      vm.Project.setSeeds();
      vm.$scope.seeds = vm.Project.getSeeds();
      vm.$scope.defaultSeed = seedModelFilename;

    }
  }

  selectWeatherFile() {
    const vm = this;

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
      vm.jetpack.copy(weatherFilePath, vm.projectDir.path('weather/' + weatherFilename));
      vm.$log.debug('Weather file name: ', weatherFilename);
      // update seeds
      vm.Project.setWeatherFiles();
      vm.$scope.weatherFiles = vm.Project.getWeatherFiles();
      vm.$scope.defaultWeatherFile = weatherFilename;


    }

  }

}

