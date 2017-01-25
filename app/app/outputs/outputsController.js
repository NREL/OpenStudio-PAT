export class OutputsController {

  constructor($log, Project, $scope, $uibModal, $q) {
    'ngInject';

    const vm = this;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;
    vm.$uibModal = $uibModal;
    vm.$q = $q;

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();

    // all measures
    vm.$scope.measures = vm.Project.getMeasuresAndOptions();

    // (current) output measures
    vm.setOutputMeasures();

    // initialize grid dropdowns
    vm.booleanDropdownArr = [{id: 'true', name: 'true'}, {id: 'false', name: 'false'}];
    vm.objFunctionGroupDropdownArr = vm.setObjFunctionGroupDropdown();

    vm.gridApis = [];
    vm.$scope.gridOptions = [];
    vm.initializeGrids();

    // size grids according to data
    vm.$scope.getTableHeight = function (uid) {
      var rowHeight = 30; // row height
      var headerHeight = 55; // header height
      const m = _.find(vm.$scope.measures, {uid: uid});
      const length = _.filter(m.outputs, {checked: true}).length;
      vm.$log.debug('data length: ', length);
      return {
        height: (length * rowHeight + headerHeight + 10) + "px"
      };
    };

  }

  setObjFunctionGroupDropdown() {
    const vm = this;
    const arr = [];
    _.forEach([1,2,3,4,5,6,7,8,9,10], (num) => {
      arr.push({id: num, name: num});
    });
    vm.$log.debug('ObjFunctionGroupDropdownArr: ', arr);
    return arr;
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

  getBooleanDropdownArr() {
    const vm = this;
    return vm.booleanDropdownArr;
  }

  setGridOptions() {
    const vm = this;
    _.forEach(vm.$scope.outputMeasures, (measure) => {

      if (measure.analysisOutputs == undefined) measure.analysisOutputs = [];
      vm.$log.debug('measure: ', measure);

      vm.$scope.gridOptions[measure.uid] = {
        data: 'measure.analysisOutputs',
        enableSorting: false,
        autoResize: true,
        enableRowSelection: false,
        enableSelectAll: false,
        enableColumnMenus: false,
        enableRowHeaderSelection: false,
        headerRowHeight: 50,
        enableCellEditOnFocus: true,
        enableHiding: false,
        columnDefs: [{
          name: 'display_name',
          displayName: 'outputs.columns.displayName',
          headerCellFilter: 'translate',
          pinnedLeft: true,
          width: 250,
          minWidth: 70,
          cellTooltip: function (row) {
            return row.entity.display_name;
          }
        }, {
          name: 'short_name',
          displayName: 'outputs.columns.shortName',
          headerCellFilter: 'translate',
          width: 150,
          minWidth: 80
        }, {
          name: 'visualize',
          displayName: 'outputs.columns.visualize',
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownIdLabel: 'name',
          editDropdownValueLabel: 'name',
          editDropdownOptionsArray: vm.booleanDropdownArr,
          headerCellFilter: 'translate',
          width:100,
          minWidth: 70
        }, {
          name: 'objective_function',
          displayName: 'outputs.columns.objectiveFunction',
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownIdLabel: 'id',
          editDropdownOptionsArray: vm.booleanDropdownArr,
          editDropdownValueLabel: 'name',
          headerCellFilter: 'translate',
          width: 100,
          minWidth: 40
        }, {
          name: 'target_value',
          displayName: 'outputs.columns.targetValue',
          headerCellFilter: 'translate',
          width: 100,
          minWidth: 50
        }, {
          name: 'units',
          displayName: 'outputs.columns.units',
          headerCellFilter: 'translate',
          width:70,
          minWidth: 40
        }, {
          name: 'weighting_factor',
          displayName: 'outputs.columns.weightingFactor',
          headerCellFilter: 'translate',
          type: 'number',
          width: 100,
          minWidth: 50
        }, {
          name: 'obj_function_group',
          displayName: 'outputs.columns.objectiveFunctionGroup',
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownIdLabel: 'name',
          type: 'number',
          editDropdownOptionsArray: vm.objFunctionGroupDropdownArr,
          editDropdownValueLabel: 'name',
          headerCellFilter: 'translate',
          width: 100,
          minWidth: 40
        }],
        onRegisterApi: function (gridApi) {
          vm.gridApis[measure.uid] = gridApi;
          gridApi.edit.on.afterCellEdit(vm.$scope, function (rowEntity, colDef, newValue, oldValue) {
            // set modified
            vm.setIsModified();
          });
        }
      };
    });

  }

  // only display outputs with checked = true in grid
  filterOutputs(measure) {
    return _.filter(measure.outputs, {checked: true});
  }

  addOutputs(measure) {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.$log.debug('Output::addOutputs');

    // open modal for user to select outputs. Already selected outputs are shown as checked ?
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalSelectOutputsController',
      controllerAs: 'modal',
      templateUrl: 'app/outputs/selectOutputs.html',
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
      vm.$log.debug('NEW Analysis OUTPUTS: ', measure.analysisOutputs);
      vm.setIsModified();
      deferred.resolve();

    }, () => {
      // Modal canceled
      deferred.reject();
    });

    return deferred.promise;
  }

  removeMeasure(measure) {
    const vm = this;
    measure.outputMeasure = false;
    // todo: remote anything else from data structure? For now: keep just in case
  }

  setIsModified() {
    const vm = this;
    vm.Project.setModified(true);
  }

  exportOSA() {
    const vm = this;
    vm.Project.exportOSA();
  }

}
