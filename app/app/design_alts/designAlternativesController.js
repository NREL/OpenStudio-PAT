export class DesignAlternativesController {

  constructor($log, BCL, $scope) {
    'ngInject';

    const vm = this;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.BCL = BCL;

    vm.measures = vm.BCL.getProjectMeasures();

    // TDOD: temporary until options come in from analysis controller
    vm.generateFakeOptions();

    vm.$scope.alternatives = [];
    vm.$scope.gridOptions = [];
    vm.setGridOptions();

  }

  generateFakeOptions() {
    const vm = this;

    const $option1 = {
      name: 'Option1',
      arguments: [
        {
          name: 'space_name',
          value: 'Space1'
        }, {
          name: 'v1',
          value: '1'
        }, {
          name: 'v2',
          value: '2'
        }, {
          name: 'v3',
          value: '3'
        }, {
          name: 'v4',
          value: '4'
        }, {
          name: 'v5',
          value: '5'
        }
      ]
    };

    const $option2 = {
      name: 'Option2',
      arguments: [
        {
          name: 'space_name',
          value: 'Space2'
        }, {
          name: 'v1',
          value: '10'
        }, {
          name: 'v2',
          value: '20'
        }, {
          name: 'v3',
          value: '30'
        }, {
          name: 'v4',
          value: '40'
        }, {
          name: 'v5',
          value: '50'
        }
      ]
    };

    const $option3 = {
      name: 'Option3',
      arguments: [
        {
          name: 'space_name',
          value: 'Space3'
        }, {
          name: 'v1',
          value: '100'
        }, {
          name: 'v2',
          value: '200'
        }, {
          name: 'v3',
          value: '300'
        }, {
          name: 'v4',
          value: '400'
        }, {
          name: 'v5',
          value: '500'
        }
      ]
    };

    _.forEach(vm.measures, (measure) => {

      if (measure.name == 'EPMeasure' || measure.name == 'OpenStudioMeasure') {
        measure.options = [$option1, $option2, $option3];
      }

    });

    vm.$log.debug('DA measures: ', vm.measures);

  }

  setGridOptions() {
    const vm = this;

    vm.$scope.gridOptions = {
      data: 'alternatives',
      autoResize: true,
      enableSorting: false,
      enableCellEditOnFocus: true,
      enableHiding: false,
      enableColumnMenus: false,
      columnDefs: [{
        name: 'delete',
        displayName:'',
        enableCellEdit: false,
        cellClass: 'icon-cell',
        cellTemplate: '../app/design_alts/deleteButtonTemplate.html',
        width:'5%'
      }, {
        name: 'name',
        displayName: 'Name'
      }, {
        name: 'seed_model',
        displayName: 'Seed Model'
      }, {
        name: 'weather_file',
        displayName: 'Location or Weather File'
      }, {
        name: 'description',
        displayName: 'Description'
      }, {
        name: 'weather_file',
        displayName: 'Location or Weather File'
      }],
      onRegisterApi: function (gridApi) {
        vm.gridApi = gridApi;

      }
    };

    // add measure columns
    _.forEach(vm.measures, (measure) => {
      let options = _.map(measure.options, 'name');
      let optionsArr = [{id:'none', name: 'None'}];
      _.forEach(options, (option) => {
        optionsArr.push({id: option, name: option});
      });
      vm.$log.debug(optionsArr);
      vm.$scope.gridOptions.columnDefs.push({name: measure.name, display_name: measure.display_name, editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownIdLabel: 'name', editDropdownValueLabel: 'name',
        editDropdownOptionsArray: optionsArr});
    });

  }

  addAlternative() {

    const vm = this;
    let new_alt = {};
    _.forEach(vm.measures, (measure) => {
      new_alt[measure.name] = 'None';
    });
    vm.$scope.alternatives.push(new_alt);
    vm.$log.debug('ALTS: ', vm.$scope.alternatives);
  }

  deleteAlternative(alternative) {

    const vm = this;
    const index = vm.$scope.alternatives.indexOf(alternative);
    vm.$scope.alternatives.splice(index, 1);

  }


}
