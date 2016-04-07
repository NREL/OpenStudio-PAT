export class DesignAlternativesController {

  constructor($log, BCL, Project, $scope) {
    'ngInject';

    const vm = this;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.BCL = BCL;
    vm.Project = Project;

    vm.measures = vm.BCL.getProjectMeasures();

    // TODO: temporary until options come in from analysis controller
    vm.generateFakeOptions();

    // get seed and weather defaults and dropdown options
    vm.seedsDropdownArr = vm.Project.getSeedsDropdownArr();
    vm.weatherFilesDropdownArr= vm.Project.getWeatherFilesDropdownArr();
    vm.defaultSeed = vm.Project.getDefaultSeed();
    vm.defaultWeatherFile = vm.Project.getDefaultWeatherFile();

    //vm.$log.debug("SEEDS: ", vm.seedsDropdownArr);
    //vm.$log.debug("WEATHER: ", vm.weatherFilesDropdownArr);

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

  setOptionsArray(measure) {
    let options = _.map(measure.options, 'name');
    let optionsArr = [{id:'none', name: 'None'}];
    _.forEach(options, (option) => {
      optionsArr.push({id: option, name: option});
    });
    return optionsArr;
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
      rowTemplate: '<div grid="grid" class="ui-grid-draggable-row" draggable="true"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'custom\': true }" ui-grid-cell></div></div>',
      useUiGridDraggableRowsHandle: true,
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
        displayName: 'Seed Model',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownIdLabel: 'name',
        editDropdownValueLabel: 'name',
        editDropdownOptionsArray: vm.seedsDropdownArr
      }, {
        name: 'weather_file',
        displayName: 'Location or Weather File',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownIdLabel: 'name',
        editDropdownValueLabel: 'name',
        editDropdownOptionsArray: vm.weatherFilesDropdownArr
      }, {
        name: 'description',
        displayName: 'Description'
      }],
      onRegisterApi: function (gridApi) {
        vm.gridApi = gridApi;

      }
    };

    // add measure columns
    _.forEach(vm.measures, (measure) => {
      const optionsArr = vm.setOptionsArray(measure);
      vm.$log.debug(optionsArr);
      vm.$scope.gridOptions.columnDefs.push({name: measure.name, display_name: measure.display_name, editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownIdLabel: 'name', editDropdownValueLabel: 'name',
        editDropdownOptionsArray: optionsArr});
    });
  }

  addAlternative() {

    const vm = this;
    let new_alt = vm.setNewAlternativeDefaults();

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

  // create an alternative for each measure option
  createAlternatives() {
    const vm = this;
    _.forEach(vm.measures, (measure) => {
      const optionsArr = vm.setOptionsArray(measure);
      _.forEach(measure.options, (option) => {
        let new_alt = vm.setNewAlternativeDefaults();
        _.forEach(vm.measures, (m) => {
          if (m.name == measure.name){
            new_alt[m.name] = option.name;
          } else {
            new_alt[m.name] = 'None';
          }
        });
        vm.$scope.alternatives.push(new_alt);
      });
    });
  }

  setNewAlternativeDefaults() {
    const vm = this;
    let new_alt = {};
    new_alt.name = vm.uniqueName(vm.$scope.alternatives, _.template('Alternative <%= num %>'));
    new_alt.seed_model = vm.defaultSeed;
    new_alt.weather_file = vm.defaultWeatherFile;

    return new_alt;

  }

  // functions for default alternative names
  checkUnique(data, name, rowIndex) {
    const vm = this;
    var unique = _.isEmpty(_.filter(data, function (row, index) {
      return rowIndex != index && row.name == name;
    }));
    //if (!unique && rowIndex != null) toaster.warning('Name must be unique', '"' + name + '" already exists.');
    return unique;
  }

  uniqueName(data, template, num) {
    const vm = this;
    if (num === undefined) num = data.length + 1;
    while (!vm.checkUnique(data, template({num: num}))) num++;
    return template({num: num});
  }


}
