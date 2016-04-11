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

    vm.$scope.measures = vm.BCL.getProjectMeasures();

    vm.$scope.osMeasures = [];
    vm.$scope.epMeasures = [];
    vm.$scope.repMeasures = [];

    vm.$scope.selectedAll = false;

    vm.setMeasureTypes();

    vm.$scope.gridOptions = [];
    vm.$log.debug('PROJECT MEASURES RETRIEVED: ', vm.$scope.measures);

    vm.initMeasureOptions();
    vm.setGridOptions();
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
          vm.gridApi = gridApi;
          const cellTemplate = 'ui-grid/selectionRowHeader';   // you could use your own template here
          vm.gridApi.core.addRowHeaderColumn({
            name: 'rowHeaderCol',
            displayName: '',
            width: 50,
            cellTemplate: cellTemplate
          });
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
    vm.BCL.openBCLModal(types, [], false).then( () => {
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

    const measurePanel = angular.element(vm.$document[0].querySelector('div[id="'+measure.uid+'"]'));
    measurePanel.remove();

    vm.setMeasureTypes();
    vm.setGridOptions();

  }

  addMeasureOption(measure) {
    const vm = this;
    vm.$log.debug('In addMeasureOption in analysis');

    const temp = angular.copy(vm.$scope.gridOptions[measure.uid].columnDefs[3]);
    temp.name = 'option' + vm.$scope.gridOptions[measure.uid].columnDefs.length;
    temp.displayName = 'option' + vm.$scope.gridOptions[measure.uid].columnDefs.length;
    temp.field = 'option' + vm.$scope.gridOptions[measure.uid].columnDefs.length;

    vm.$scope.gridOptions[measure.uid].columnDefs.push(temp);
  }

  duplicateOption(measure) {
    const vm = this;
    vm.$log.debug('In duplicateOption in analysis');

    vm.addMeasureOption(measure);

    const name = 'option' + (vm.$scope.gridOptions[measure.uid].columnDefs.length - 1);
    _.forEach(vm.$scope.gridOptions[measure.uid].data, (row) => {
      row[name] = row.option;
    });
  }

  duplicateMeasureAndOption(measure) {
    const vm = this;
    vm.$log.debug('In duplicateMeasureAndOption in analysis');
  }

  saveMeasureOption(measure) {
    const vm = this;
    vm.$log.debug('In saveMeasureOption in analysis');

    const firstOptionColumnIndex = 3;
    const numColumns = vm.$scope.gridOptions[measure.uid].columnDefs.length;

    vm.$log.debug('numColumns: ', numColumns);

    for(let i=0; i<numColumns-firstOptionColumnIndex; i++)
    {
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

  checkAll(measure) {
    const vm = this;
    vm.$log.debug('In checkAll in analysis');

    if (vm.$scope.selectedAll === false) {
      vm.$scope.selectedAll = true;
    } else {
      vm.$scope.selectedAll = false;
    }

    _.forEach(vm.$scope.gridOptions[measure.uid].data, (row) => {
      row.variable = vm.$scope.selectedAll ? true :false;
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

}
