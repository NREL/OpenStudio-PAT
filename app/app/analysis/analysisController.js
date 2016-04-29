import * as jetpack from 'fs-jetpack';
import * as os from 'os';
import * as path from 'path';

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

    vm.srcDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));

    vm.analysisTypes = vm.Project.getAnalysisTypes();
    vm.seeds = vm.Project.getSeeds();
    vm.weatherFiles = vm.Project.getWeatherFiles();

    vm.$scope.defaultSeed = vm.Project.getDefaultSeed();
    vm.$scope.defaultWeatherFile = vm.Project.getDefaultWeatherFile();
    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();

    vm.$scope.measures = vm.Project.getMeasuresAndOptions();
    vm.gridApis = [];

    vm.$scope.osMeasures = [];
    vm.$scope.epMeasures = [];
    vm.$scope.repMeasures = [];

    // SAVE
    vm.$scope.$on('$destroy', () => {
      console.log('SAVING measures to ProjectService');
      // TODO: options from table are not being saved properly
      vm.saveMeasureOptions();
      vm.Project.setMeasuresAndOptions(vm.$scope.measures);
    });

    // TODO EVAN:  clean up optionIDs  (right now it's option, option4, option5, ...)

    vm.$scope.selectedAll = false;

    vm.$scope.selectedSamplingMethod = vm.Project.getSamplingMethod();
    vm.samplingMethods = vm.Project.getSamplingMethods();

    vm.$scope.selectedVariableSetting = vm.Project.getVariableSetting();
    vm.variableSettings = vm.Project.getVariableSettings();

    vm.$scope.selectedArgument = vm.Project.getSelectedArgument();
    vm.selectedArguments = vm.Project.getSelectedArguments();

    vm.$scope.selectedDistribution = vm.Project.getSelectedDistribution();
    vm.selectedDistributions = vm.Project.getSelectedDistributions();

    vm.setMeasureTypes();

    vm.$scope.gridOptions = [];
    vm.$log.debug('PROJECT MEASURES RETRIEVED: ', vm.$scope.measures);

    vm.initMeasureOptions();
    vm.setGridOptions();
    vm.setDefaultArguments();

    _.forEach(vm.$scope.measures, (measure) => {
      vm.loadMeasureOptions(measure);
    });


  }

  initMeasureOptions() {
    const vm = this;

    _.forEach(vm.$scope.measures, (measure) => {
      measure.options = [];
    });
  }

  setGridOptions() {
    const vm = this;

    _.forEach(vm.$scope.measures, (measure) => {

      vm.$scope.gridOptions[measure.uid] = {
        data: measure.arguments,
        enableSorting: true,
        autoResize: true,
        enableCellEditOnFocus: true,
        columnDefs: [{
          name: 'displayName',
          displayName: 'Argument Name',
          enableHiding: false,
          width: 200,
          minWidth: 100
        }, {
          name: 'name',
          displayName: 'Short Name',
          enableHiding: false,
          width: 200,
          minWidth: 100
        }, {
          name: 'variable',
          displayName: 'Variable',
          enableHiding: false,
          width: 200,
          minWidth: 100,
          type: 'boolean',
          cellTemplate: '<input type=\"checkbox\" ng-class=\"\'colt\' + col.uid\" ui-grid-checkbox ng-model=\"MODEL_COL_FIELD\" />'
        }, {
          displayName: 'Option 1',
          field: 'option',
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
          //cellTemplate: '<input ng-if=\"row.entity.type==\'Boolean\'\" type=\"checkbox\" ng-class=\"\'colt\' + col.uid\" ui-grid-checkbox ng-model=\"MODEL_COL_FIELD\" />' +
          //'<div ng-if=\"!row.entity.type==\'Boolean\'\" class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{row.getProperty(col.field)}}</span></div>',
          editableCellTemplate: '<div><form name=\"inputForm\">' +
          '<select ng-if=\"row.entity.type==\'Choice\'\" ng-class=\"\'colt\' + col.uid\" ui-grid-edit-dropdown ng-model=\"MODEL_COL_FIELD\" ng-options=\"field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray\"></select>' +
          '<input ng-if=\"row.entity.type==\'Boolean\'\" type=\"checkbox\" ng-class=\"\'colt\' + col.uid\" ui-grid-checkbox ng-model=\"MODEL_COL_FIELD\" />' +
          '<input ng-if=\"row.entity.type==\'Int\'\" type=\"number\" ng-class=\"\'colt\' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" />' +
          '<input ng-if=\"row.entity.type==\'Double\'\" type=\"number\" ng-class=\"\'colt\' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" />' +
          '<input ng-if=\"row.entity.type==\'String\'\" type=\"text\" ng-class=\"\'colt\' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" />' +
          ' </form></div>',
          enableHiding: false,
          width: 200,
          minWidth: 100,
          enableCellEdit: true
        }],

        onRegisterApi: function (gridApi) {
          vm.gridApis[measure.uid] = gridApi;
          const cellTemplate = 'ui-grid/selectionRowHeader';   // you could use your own template here
          vm.gridApis[measure.uid].core.addRowHeaderColumn({
            name: 'rowHeaderCol',
            displayName: '',
            width: 50,
            cellTemplate: cellTemplate
          });
        }
      };
    });
  }

  setDefaultArguments() {
    const vm = this;
    vm.$log.debug('In setDefaultArguments in analysis');

    _.forEach(vm.$scope.measures, (measure) => {
      _.forEach(measure.arguments, (argument) => {
        if (!('option' in argument)) {
          if ((argument.type == 'Double' || argument.type == 'Int') && (Number(argument.defaultValue))) {
            argument.option = Number(argument.defaultValue);
          }
          else {
            argument.option = argument.defaultValue;
          }
        }
      });
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
      vm.setMeasureTypes();
      vm.setGridOptions();
      vm.$log.debug('measures: ', vm.$scope.measures);
    });
  }

  removeMeasure(measure) {
    const vm = this;
    // line below also removes it from bclService 'getProjectMeasures', but not from disk
    // TODO: fix so BCL modal doesn't restore deleted panels
    _.remove(vm.$scope.measures, {uid: measure.uid});

    const measurePanel = angular.element(vm.$document[0].querySelector('div[id="' + measure.uid + '"]'));
    measurePanel.remove();

    vm.setMeasureTypes();
    vm.setGridOptions();
  }

  addMeasureOption(measure) {
    const vm = this;
    vm.$log.debug('In addMeasureOption in analysis');

    const temp = angular.copy(vm.$scope.gridOptions[measure.uid].columnDefs[3]);

    // Note: Subtract 2 to create the correct auto-generated name
    temp.name = 'Option ' + (vm.$scope.gridOptions[measure.uid].columnDefs.length - 2);
    temp.displayName = 'Option ' + (vm.$scope.gridOptions[measure.uid].columnDefs.length - 2);

    // Note: Use caution if changing the field's name: ensure data copying still works when using addMeasureOption.
    temp.field = 'option' + vm.$scope.gridOptions[measure.uid].columnDefs.length;

    vm.$scope.gridOptions[measure.uid].columnDefs.push(temp);
  }

  duplicateOption(measure) {
    const vm = this;
    vm.$log.debug('In duplicateOption in analysis');

    vm.addMeasureOption(measure);

    // TODO note: For now, we grabbing the original, first option column.
    // TODO       Eventually we will need to use the user-selected option column.
    const name = 'option' + (vm.$scope.gridOptions[measure.uid].columnDefs.length - 1);
    _.forEach(vm.$scope.gridOptions[measure.uid].data, (row) => {
      row[name] = row.option;
    });
  }

  duplicateMeasureAndOption(measure) {
    const vm = this;
    vm.$log.debug('In duplicateMeasureAndOption in analysis');
    // TODO: implement this
  }

  // TODO: should we use the pretty measure.options hash created on save to load measure options?  Or this method?
  loadMeasureOptions(measure) {
    const vm = this;
    vm.$log.debug('In loadMeasureOptions in analysis');

    let maxKeys = 0;
    _.forEach(measure.arguments, (argument) => {
      const numKeys = _.keys(argument).length;
      if (numKeys > maxKeys) {
        maxKeys = numKeys;
      }
    });
    vm.$log.debug('maxKeys: ', maxKeys);
    if (maxKeys > 0) {
      vm.$log.debug('measure.arguments: ', measure.arguments);
    }

    const numUnneededArguments = 10; // TODO this is a complete swag, and only sort of works
    // TODO need to be able to find 'option' in keys like 'option4', etc

    for (let i = 0; i < maxKeys - numUnneededArguments; i++) {
      const temp = angular.copy(vm.$scope.gridOptions[measure.uid].columnDefs[3]);

      // Note: Subtract 2 to create the correct auto-generated name
      temp.name = 'Option ' + (vm.$scope.gridOptions[measure.uid].columnDefs.length - 2);
      temp.displayName = 'Option ' + (vm.$scope.gridOptions[measure.uid].columnDefs.length - 2);

      // Note: Use caution if changing the field's name: ensure data copying still works when using addMeasureOption.
      temp.field = 'option' + vm.$scope.gridOptions[measure.uid].columnDefs.length;

      vm.$scope.gridOptions[measure.uid].columnDefs.push(temp);
    }

  }

  // TODO: remove this!
  saveMeasureOption(measure) {
    const vm = this;
    vm.$log.debug('In saveMeasureOption in analysis');

    const firstOptionColumnIndex = 3;
    const numColumns = vm.$scope.gridOptions[measure.uid].columnDefs.length;

    vm.$log.debug('numColumns: ', numColumns);

    for (let i = 0; i < numColumns - firstOptionColumnIndex; i++) {
      vm.$log.debug('inside loop');

      //const name = 'option' + (i);
      const name = 'option';

      const columnOptions = [];

      _.forEach(vm.$scope.gridOptions[measure.uid].data, (row) => {
        vm.$log.debug('row: ', row);
        vm.$log.debug('row[name]: ', row[name]);
        vm.$log.debug('row.option: ', row.option);
        columnOptions.push(row[name]);
      });

      measure.options.push(columnOptions);
    }
    vm.$log.debug('measure.options: ', measure.options);
  }

  // saves measure options in nicer structure for json export
  saveMeasureOptions() {
    const vm = this;
    vm.$log.debug('Saving all measure option hashes');

    _.forEach(vm.$scope.measures, (measure) => {

      // first option is at col id = 4 when using gridApi to access.  (col id = 3 when going through gridOptions)
      const firstOptionColumnIndex = 4;
      const numColumns = vm.gridApis[measure.uid].grid.columns.length;

      const options = [];

      for (let i = firstOptionColumnIndex; i < numColumns; i++) {
        const theOption = {};
        // option name and ID
        theOption.id = vm.gridApis[measure.uid].grid.columns[i].field;
        // TODO: the name will eventually be from the first row, for now set same as ID
        theOption.name = vm.gridApis[measure.uid].grid.columns[i].name;

        // set argument values
        theOption.arguments = [];
        _.forEach(vm.gridApis[measure.uid].grid.rows, (row) => {
          // TODO: when rows for name and descriptions are added, refactor this a bit

          // get the row's value for key corresponding to the col's name
          // add to arguments array
          const arg = {};
          if (theOption.id in row.entity){
            arg.name = row.entity.name;
            arg.value = row.entity[theOption.id];
            theOption.arguments.push(arg);
          } else {
            // check if argument is required
            //vm.$log.debug(theOption.id, ' is not a key in row: ', row.entity);
            const argumentDef = _.find(measure.arguments, {name: row.entity.name});
            if (argumentDef.required) {
              // TODO: throw an error here: need a value for this argument in this option
              vm.$log.debug('ARG: ', row.entity.name, ' value left blank in option: ', theOption.name);
            }
          }

        });
        options.push(theOption);
      }
      // save to measure
      measure.options = options;

    });
  }

  checkAll(measure) {
    const vm = this;
    vm.$log.debug('In checkAll in analysis');

    if (vm.$scope.selectedAll === false) {
      vm.$scope.selectedAll = true;
    } else {
      vm.$scope.selectedAll = false;
    }

    _.forEach(vm.$scope.gridOptions[measure.uid].data, (row) => {
      row.variable = vm.$scope.selectedAll ? true : false;
    });
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
    vm.Project.setAnalysisType(vm.$scope.selectedAnalysisType);
  }

  setSamplingMethod() {
    const vm = this;
    vm.Project.setSamplingMethod(vm.$scope.selectedSamplingMethod);

    vm.$log.debug('In setSamplingMethod in analysis');
    vm.setVariableSetting();
    vm.setSelectedArgument();
    vm.setSelectedDistribution();
  }

  setVariableSetting() {
    const vm = this;
    vm.$log.debug('In setVariableSettings in analysis');
    vm.Project.setVariableSetting(vm.$scope.selectedVariableSetting);
  }

  setSelectedArgument() {
    const vm = this;
    vm.$log.debug('In setArguments in analysis');
    vm.Project.setSelectedArgument(vm.$scope.selectedArgument);
  }

  setSelectedDistribution() {
    const vm = this;
    vm.$log.debug('In setDistribution in analysis');
   vm.Project.setSelectedDistribution(vm.$scope.selectedDistribution);
  }

}

