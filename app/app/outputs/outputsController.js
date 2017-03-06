export class OutputsController {

  constructor($log, Project, $scope, $uibModal, $q, $window, Message) {
    'ngInject';

    const vm = this;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;
    vm.$uibModal = $uibModal;
    vm.$q = $q;
    vm.$window = $window;
    vm.Message = Message;

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();
    vm.$scope.selectedSamplingMethod = vm.Project.getSamplingMethod();

    // all measures
    vm.$scope.measures = vm.Project.getMeasuresAndOptions();
    vm.$scope.addMeasure = {};
    vm.$scope.addMeasure.measure = null;

    // (current) output measures
    vm.setOutputMeasures();

    // initialize grid dropdowns
    vm.booleanDropdownArr = [{id: 'true', name: 'true'}, {id: 'false', name: 'false'}];
    vm.variableTypeDropdownArr = [{id: 'Double'}, {id: 'Integer'}, {id: 'Bool'}, {id: 'String'}];

    vm.gridApis = [];
    vm.$scope.gridOptions = [];
    vm.initializeGrids();

    // size grids according to data
    vm.$scope.getTableHeight = function (name) {
      let rowHeight = 30; // row height
      let headerHeight = 55; // header height
      const m = _.find(vm.$scope.measures, {name: name});
      const length = _.filter(m.analysisOutputs).length;
      if (vm.Message.showDebug()) vm.$log.debug('data length: ', length);
      return {
        height: (length * rowHeight + headerHeight + 15) + 'px'
      };
    };

  }

  setOutputMeasures() {
    const vm = this;
    if (!vm.$scope.outputMeasures) {
      vm.$scope.outputMeasures = [];
    }

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
    const others = _.filter(vm.$scope.measures, {outputMeasure: true});
    if (vm.Message.showDebug()) vm.$log.debug('All Output Measures: ', others);
    vm.$scope.outputMeasures = _.union(vm.$scope.outputMeasures, others);

    // ensure there's a key for user-defined outputs
    _.forEach(vm.$scope.outputMeasures, (measure) => {
      if (!measure.userDefinedOutputs) {
        measure.userDefinedOutputs = [];
      }
    });

    // make sure all measures have a outputMeasure key
    _.forEach(vm.$scope.measures, (measure) => {
      if (!measure.outputMeasure) {
        measure.outputMeasure = false;
      }
    });

    if (vm.Message.showDebug()) vm.$log.debug('Output Measures: ', vm.$scope.outputMeasures);

  }

  initializeGrids() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('Output::initializeGrids');
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
      if (vm.Message.showDebug()) vm.$log.debug('measure: ', measure);

      vm.$scope.gridOptions[measure.instanceId] = {
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
        headerTemplate: 'app/outputs/headerTemplate.html',
        treeRowHeaderAlwaysVisible: true,
        category: [{name: 'Output Selection', visible: true}, {name: 'Objective Function Settings', visible: true}],
        columnDefs: [{
          name: 'display_name',
          displayName: 'outputs.columns.displayName',
          headerCellFilter: 'translate',
          category: 'Output Selection',
          /*pinnedLeft: true,*/
          width: 250,
          minWidth: 70,
          cellTooltip: function (row) {
            return row.entity.display_name;
          }
        }, {
          name: 'short_name',
          displayName: 'outputs.columns.shortName',
          headerCellFilter: 'translate',
          category: 'Output Selection',
          width: 150,
          minWidth: 80
        }, {
          name: 'type',
          displayName: 'outputs.columns.variableType',
          headerCellFilter: 'translate',
          editDropdownOptionsArray: vm.variableTypeDropdownArr,
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownIdLabel: 'id',
          editDropdownValueLabel: 'id',
          category: 'Output Selection',
          width: 100,
          minWidth: 70
        }, {
          name: 'visualize',
          displayName: 'outputs.columns.visualize',
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownIdLabel: 'name',
          editDropdownValueLabel: 'name',
          editDropdownOptionsArray: vm.booleanDropdownArr,
          headerCellFilter: 'translate',
          category: 'Output Selection',
          width: 100,
          minWidth: 70
        }, {
          name: 'objective_function',
          displayName: 'outputs.columns.objectiveFunction',
          editableCellTemplate: 'ui-grid/dropdownEditor',
          editDropdownIdLabel: 'id',
          editDropdownOptionsArray: vm.booleanDropdownArr,
          editDropdownValueLabel: 'name',
          headerCellFilter: 'translate',
          category: 'Output Selection',
          width: 100,
          minWidth: 40
        }, {
          name: 'target_value',
          displayName: 'outputs.columns.targetValue',
          headerCellFilter: 'translate',
          category: 'Objective Function Settings',
          width: 100,
          minWidth: 50
        }, {
          name: 'units',
          displayName: 'outputs.columns.units',
          headerCellFilter: 'translate',
          category: 'Objective Function Settings',
          width: 70,
          minWidth: 40
        }, {
          name: 'weighting_factor',
          displayName: 'outputs.columns.weightingFactor',
          headerCellFilter: 'translate',
          category: 'Objective Function Settings',
          type: 'number',
          width: 100,
          minWidth: 50
        }],
        onRegisterApi: function (gridApi) {
          vm.gridApis[measure.instanceId] = gridApi;
          gridApi.edit.on.afterCellEdit(vm.$scope, function (rowEntity, colDef, newValue, oldValue) {
            // set modified
            vm.setIsModified();
            // check if obj function is selected on an invalid variable type (only when editing objective_function or type
            if ((['objective_function', 'type'].indexOf(colDef.name) != -1) && oldValue != newValue && rowEntity.objective_function == 'true' && ['Double', 'Integer', 'Bool'].indexOf(rowEntity.type) == -1) {
              // invalid choice for objective function
              vm.$window.alert('Objective Functions can only be used with outputs of type Double, Integer, or Bool.');
            }
          });
        }
      };

      // add objective function groups for SPEA, NSGA, and Morris only
      if (vm.Message.showDebug()) vm.$log.debug('sampling method: ', vm.$scope.selectedSamplingMethod);

      if (['NSGA2', 'SPEA2', 'Morris'].indexOf(vm.$scope.selectedSamplingMethod.id) != -1) {
        if (vm.Message.showDebug()) vm.$log.debug('adding objective function group column');
        const ofg = {
          name: 'obj_function_group',
          displayName: 'outputs.columns.objectiveFunctionGroup',
          category: 'Objective Function Settings',
          editDropdownIdLabel: 'name',
          type: 'number',
          headerCellFilter: 'translate',
          width: 100,
          minWidth: 40
        };
        vm.$scope.gridOptions[measure.instanceId].columnDefs.push(ofg);
      }

    });

  }

  // only display outputs with checked = true in grid
  filterOutputs(measure) {
    return _.filter(measure.outputs, {checked: true});
  }

  addOutputs(measure) {
    const vm = this;
    const deferred = vm.$q.defer();
    if (vm.Message.showDebug()) vm.$log.debug('Output::addOutputs');

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
      if (vm.Message.showDebug()) vm.$log.debug('NEW Analysis OUTPUTS: ', measure.analysisOutputs);
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
    _.remove(vm.$scope.outputMeasures, {instanceId: measure.instanceId});
  }

  addMeasure() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in Outputs::addMeasure');
    if (vm.Message.showDebug()) vm.$log.debug('measure to add: ', vm.$scope.addMeasure.measure);
    if (vm.$scope.addMeasure.measure) {
      if (vm.Message.showDebug()) vm.$log.debug('Adding this measure: ', vm.$scope.addMeasure.measure);
      const measure = _.find(vm.$scope.measures, {name: vm.$scope.addMeasure.measure.name});
      if (measure) {
        measure.outputMeasure = true;
        vm.setOutputMeasures();
        vm.initializeGrids();
      }
      vm.$scope.addMeasure.measure = null;
    } else {
      if (vm.Message.showDebug()) vm.$log.debug('No Measure Selected');
    }
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
