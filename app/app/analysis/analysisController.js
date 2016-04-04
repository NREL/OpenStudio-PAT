import * as jetpack from 'fs-jetpack';
import * as os from 'os';
import * as path from 'path';
import { parseString } from 'xml2js';

export class AnalysisController {

  constructor($log, BCL, $scope) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.jetpack = jetpack;

    vm.$scope = $scope;

    vm.test = 'Analysis Controller';

    vm.BCL = BCL;

    vm.srcDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));
    vm.$scope.measures = vm.BCL.getProjectMeasures();

    vm.$log.debug('PROJECT MEASURES RETRIEVED: ', vm.measures);

    vm.analysisTypes = ['Manual', 'Auto'];

    vm.gridOptions = {
      data: vm.$scope.measures[0].arguments,
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
        name: 'option1',
        displayName: 'Option 1',
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

  }

}
