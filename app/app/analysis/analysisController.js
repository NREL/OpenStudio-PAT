import * as jetpack from 'fs-jetpack';
import * as os from 'os';
import * as path from 'path';

export class AnalysisController {

  constructor($log, BCL, $scope) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.$scope = $scope;
    vm.BCL = BCL;

    vm.srcDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));

    vm.$scope.measures = vm.BCL.getProjectMeasures();

    vm.$scope.osMeasures = [];
    vm.$scope.epMeasures = [];
    vm.$scope.repMeasures = [];

    vm.setMeasureTypes();

    vm.$scope.gridOptions = [];
    vm.$log.debug('PROJECT MEASURES RETRIEVED: ', vm.$scope.measures);

    vm.analysisTypes = ['Manual', 'Auto'];

    vm.setGridOptions();

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
          displayName: 'Name of Option',
          enableHiding: false
        }, {
          name: 'name',
          displayName: 'Short Name',
          enableHiding: false
        }, {
          name: 'variable',
          displayName: 'Variable',
          enableHiding: false,
          type: 'boolean'
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
          editableCellTemplate: '<div><form name=\"inputForm\">' +
          '<select ng-if=\"row.entity.type==\'Choice\'\" ng-class=\"\'colt\' + col.uid\" ui-grid-edit-dropdown ng-model=\"MODEL_COL_FIELD\" ng-options=\"field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray\"></select>' +
          '<input ng-if=\"row.entity.type==\'Boolean\'\" type=\"checkbox\" ng-class=\"\'colt\' + col.uid\" ui-grid-checkbox ng-model=\"MODEL_COL_FIELD\" />' +
          '<input ng-if=\"row.entity.type==\'Int\'\" type=\"number\" ng-class=\"\'colt\' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" />' +
          '<input ng-if=\"row.entity.type==\'Double\'\" type=\"number\" ng-class=\"\'colt\' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" />' +
          '<input ng-if=\"row.entity.type==\'String\'\" type=\"text\" ng-class=\"\'colt\' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" />' +
          ' </form></div>',
          enableHiding: false,
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

  addMeasureOption(measure) {
    const vm = this;
    vm.$log.debug('In addMeasureOption in analysis');
    vm.$scope.gridOptions[measure.uid].columnDefs.push({field: 'option'});
  }

  duplicateOption() {
    const vm = this;
    vm.$log.debug('In duplicateOption in analysis');
  }

  duplicateMeasureAndOption() {
    const vm = this;
    vm.$log.debug('In duplicateMeasureAndOption in analysis');
  }
}
