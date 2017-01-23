export class OutputsController {

  constructor($log, Project, $scope) {
    'ngInject';

    const vm = this;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();

    // all measures
    vm.$scope.measures = vm.Project.getMeasuresAndOptions();

    // (current) output measures
    vm.setOutputMeasures();

    vm.gridApis = [];
    vm.$scope.gridOptions = [];
    vm.initializeGrids();

    // initialize grip dropdowns
    vm.booleanDropdownArr = [{id: 'true', value: true}, {id: 'false', value: false}];
    vm.setObjFunctionGroupDropdown();

    // size grids according to data
    vm.$scope.getTableHeight = function (uid) {
      var rowHeight = 30; // your row height
      var headerHeight = 30; // your header height
      return {
        height: (vm.$scope.gridOptions[uid].data.length * rowHeight + headerHeight + 10) + "px"
      };
    };

  }

  setObjFunctionGroupDropdown() {
    const vm = this;
    vm.objFunctionGroupDropdownArr = [];
    _.forEach([1,2,3,4,5,6,7,8,9,10], (num) => {
      vm.objFunctionGroupDropdownArr.push({id: num, value: num});
    });
  }

  setOutputMeasures() {
    const vm = this;
    vm.$scope.outputMeasures = [];

    // always add openstudio result measure first, followed by calibration measure (if they exist)
    // retrieve by name or uid?
    const orm = _.find(vm.$scope.measures, {uid: 'a25386cd-60e4-46bc-8b11-c755f379d916'}); //name: openstudio_results
    const cm = _.find(vm.$scope.measures, {uid: 'e6642d40-7366-4647-8724-53a37991d579'});    //name: Calibration Reports

    if (orm) {
      orm.outputMeasure = true;
      orm.open = true;
      vm.$scope.outputMeasures.push(orm);
    }
    if (cm) {
      cm.outputMeasure = true;
      vm.$scope.outputMeasures.push(cm);
    }

    // user-added measures
    const others = _.filter(vm.$scope.measures, {outputMeasure: true} );
    vm.$scope.outputMeasures = _.union(vm.$scope.outputMeasures, others);

    vm.$log.debug('Output Measures: ', vm.$scope.outputMeasures);

  }

  initializeGrids() {
    const vm = this;
    vm.$log.debug('Output::initializeGrids');
    vm.$scope.measures = _.sortBy(vm.$scope.measures, ['workflow_index']);
    vm.setGridOptions();

  }

  setGridOptions() {
    const vm = this;

    _.forEach(vm.$scope.outputMeasures, (measure) => {
      vm.$log.debug('measure: ', measure);

      vm.$scope.gridOptions[measure.uid] = {
        data: measure.analysisOutputs,
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
          displayName: 'outputs.columns.displayName',
          enableCellEdit: false,
          headerCellFilter: 'translate',
          pinnedLeft: true,
          width: 300,
          minWidth: 100,
          cellTooltip: function (row) {
            return row.entity.display_name;
          }
        }, {
          name: 'short_name',
          displayName: 'outputs.columns.shortName',
          headerCellFilter: 'translate',
          width: 200,
          minWidth: 100
        }, {
          name: 'visualize',
          displayName: 'outputs.columns.visualize',
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownIdLabel: 'id',
          editDropdownOptionsArray: vm.booleanDropdownArr,
          editDropdownValueLabel: 'value',
          headerCellFilter: 'translate',
          minWidth: 50
        }, {
          name: 'objective_function',
          displayName: 'outputs.columns.objectiveFunction',
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownIdLabel: 'id',
          editDropdownOptionsArray: vm.booleanDropdownArr,
          editDropdownValueLabel: 'value',
          headerCellFilter: 'translate',
          minWidth: 50
        }, {
          name: 'target_value',
          displayName: 'outputs.columns.targetValue',
          headerCellFilter: 'translate',
          minWidth: 50
        }, {
          name: 'units',
          displayName: 'outputs.columns.units',
          headerCellFilter: 'translate',
          minWidth: 50
        }, {
          name: 'weighting_factor',
          displayName: 'outputs.columns.weightingFactor',
          headerCellFilter: 'translate',
          minWidth: 50
        }, {
          name: 'obj_function_group',
          displayName: 'outputs.columns.objectiveFunctionGroup',
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownIdLabel: 'id',
          editDropdownOptionsArray: vm.objFunctionGroupDropdownArr,
          editDropdownValueLabel: 'value',
          headerCellFilter: 'translate',
          minWidth: 50
        }],
        onRegisterApi: function (gridApi) {
          vm.gridApis[measure.uid] = gridApi;
          // gridApi.edit.on.afterCellEdit(vm.$scope, function (rowEntity, colDef, newValue, oldValue) {
          //   if (newValue != oldValue) {
          //     vm.$log.debug('CELL has changed in: ', measure.uid, ' old val: ', oldValue, ' new val: ', newValue);
          //     vm.$log.debug('rowEntity: ', rowEntity);
          //   }
          // });
        }
      };
    });

  }

  addOutputs() {
    const vm = this;
    vm.$log.debug('Output::addOutputs');

    // open modal for user to select outputs. Already selected outputs are shown as checked ?
    
  }

  removeMeasure(measure) {
    const vm = this;
    // todo:
    // set outputMeasure: false;
    // remote other obj function settings?
  }

}
