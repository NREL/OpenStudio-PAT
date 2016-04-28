export class DesignAlternativesController {

  constructor($log, Project, $scope) {
    'ngInject';

    const vm = this;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;

    vm.selected = null;
    vm.measures = vm.Project.getMeasuresAndOptions();

    // get seed and weather defaults and dropdown options
    vm.seedsDropdownArr = vm.Project.getSeedsDropdownArr();
    vm.weatherFilesDropdownArr = vm.Project.getWeatherFilesDropdownArr();
    vm.defaultSeed = vm.Project.getDefaultSeed();
    vm.defaultWeatherFile = vm.Project.getDefaultWeatherFile();

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();

    vm.$scope.alternatives = vm.Project.getDesignAlternatives();
    vm.$scope.gridOptions = [];
    vm.setGridOptions();

    // TODO: temporary until options come in from analysis controller
    vm.generateFakeOptions();

    // SAVE
    vm.$scope.$on('$destroy', () => {
      console.log('SAVING design alternatives to ProjectService');
      vm.Project.setDesignAlternatives(vm.$scope.alternatives);
    });

  }

  // TODO: don't do this anymore once analysis controller is saving correctly
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
    const options = _.map(measure.options, 'name');
    const optionsArr = [{id: 'none', name: 'None'}];
    _.forEach(options, (option) => {
      optionsArr.push({id: option, name: option});
    });
    return optionsArr;
  }

  setGridOptions() {
    const vm = this;

    vm.$scope.gridOptions = {
      data: 'alternatives',
      enableHiding: false,
      enableColumnMenus: false,
      enableCellEditOnFocus: true,
      enableRowHeaderSelection: true,
      enableRowSelection: true,
      enableSelectAll: false,
      excessRows: 10,
      multiSelect: false,
      columnDefs: [{
        name: 'delete',
        displayName: '',
        enableCellEdit: false,
        cellClass: 'icon-cell',
        cellTemplate: '../app/design_alts/deleteButtonTemplate.html',
        width: '3%',
        minWidth: '50'
      }, {
        name: 'reorder',
        displayName: '',
        enableCellEdit: false,
        cellClass: 'icon-cell',
        cellTemplate: '../app/design_alts/reorderButtonTemplate.html',
        width: '3%',
        minWidth: '50'
      }, {
        name: 'name',
        displayName: 'Name',
        minWidth: '150'
      }, {
        name: 'seedModel',
        displayName: 'Seed Model',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownIdLabel: 'name',
        editDropdownValueLabel: 'name',
        minWidth: '100',
        editDropdownOptionsArray: vm.seedsDropdownArr
      }, {
        name: 'weatherFile',
        displayName: 'Location or Weather File',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownIdLabel: 'name',
        editDropdownValueLabel: 'name',
        minWidth: '100',
        editDropdownOptionsArray: vm.weatherFilesDropdownArr
      }, {
        name: 'description',
        displayName: 'Description',
        minWidth: '100'
      }],
      onRegisterApi: function (gridApi) {
        vm.$scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged(null, row => {
          if (row.isSelected) {
            vm.selected = row.entity;
          } else {
            // No rows selected
            vm.selected = null;
          }
        });
        gridApi.cellNav.on.navigate(null, (newRowCol) => {
          vm.$scope.gridApi.selection.selectRow(newRowCol.row.entity);
        });
      }
    };

    // add measure columns
    _.forEach(vm.measures, (measure) => {
      const optionsArr = vm.setOptionsArray(measure);
      vm.$log.debug(optionsArr);
      vm.$scope.gridOptions.columnDefs.push({
        name: measure.name,
        displayName: measure.displayName,
        minWidth: '100',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownIdLabel: 'name',
        editDropdownValueLabel: 'name',
        editDropdownOptionsArray: optionsArr
      });
    });
  }

  addAlternative() {

    const vm = this;
    const newAlt = vm.setNewAlternativeDefaults();

    _.forEach(vm.measures, (measure) => {
      newAlt[measure.name] = 'None';
    });
    vm.$scope.alternatives.push(newAlt);
  }

  deleteAlternative(alternative) {

    const vm = this;
    const index = vm.$scope.alternatives.indexOf(alternative);
    vm.$scope.alternatives.splice(index, 1);

  }

  moveUp(alternative) {
    const vm = this;
    const index = vm.$scope.alternatives.indexOf(alternative);
    if (index > 0) {
      const temp = angular.copy(vm.$scope.alternatives[index - 1]);
      vm.$scope.alternatives[index - 1] = alternative;
      vm.$scope.alternatives[index] = temp;
    }
  }

  moveDown(alternative) {
    const vm = this;
    const index = vm.$scope.alternatives.indexOf(alternative);
    if ((index + 1) != vm.$scope.alternatives.length) {
      const temp = angular.copy(vm.$scope.alternatives[index + 1]);
      vm.$scope.alternatives[index + 1] = alternative;
      vm.$scope.alternatives[index] = temp;
    }
  }

  // create an alternative for each measure option
  createAlternatives() {
    const vm = this;
    _.forEach(vm.measures, (measure) => {
      _.forEach(measure.options, (option) => {
        const newAlt = vm.setNewAlternativeDefaults();
        _.forEach(vm.measures, (m) => {
          if (m.name == measure.name) {
            newAlt[m.name] = option.name;
          } else {
            newAlt[m.name] = 'None';
          }
        });
        vm.$scope.alternatives.push(newAlt);
      });
    });
  }

  duplicateAlternative() {

    const vm = this;
    const dupAlt = angular.copy(vm.selected);
    delete dupAlt.$$hashKey;
    dupAlt.name = dupAlt.name + ' Duplicate';
    vm.$scope.alternatives.push(dupAlt);

  }

  setNewAlternativeDefaults() {
    const vm = this;
    const newAlt = {};
    newAlt.name = vm.uniqueName(vm.$scope.alternatives, _.template('Alternative <%= num %>'));
    newAlt.seedModel = vm.defaultSeed;
    newAlt.weatherFile = vm.defaultWeatherFile;

    return newAlt;

  }

  // functions for default alternative names
  checkUnique(data, name, rowIndex) {
    const matches = _.filter(data, (row, index) => {
      return rowIndex != index && row.name == name;
    });
    return _.isEmpty(matches);
  }

  uniqueName(data, template, num) {
    const vm = this;
    if (num === undefined) num = data.length + 1;
    while (!vm.checkUnique(data, template({num: num}))) num++;
    return template({num: num});
  }

  clearAll(gridApi) {
    gridApi.selection.clearSelectedRows();
  }

}
