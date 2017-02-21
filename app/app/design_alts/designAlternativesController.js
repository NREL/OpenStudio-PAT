export class DesignAlternativesController {

  constructor($log, Project, $scope, toastr) {
    'ngInject';

    const vm = this;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;
    vm.toastr = toastr;

    vm.selected = null;
    vm.measures = vm.Project.getMeasuresAndOptions();
    vm.$log.debug('DA MEASURE RETRIEVED: ', vm.measures);

    // get seed and weather defaults and dropdown options
    vm.seedsDropdownArr = vm.Project.getSeedsDropdownArr();
    vm.weatherFilesDropdownArr = vm.Project.getWeatherFilesDropdownArr();
    vm.defaultSeed = vm.Project.getDefaultSeed();
    vm.defaultWeatherFile = vm.Project.getDefaultWeatherFile();

    vm.$scope.selectedAnalysisType = vm.Project.getAnalysisType();

    vm.$scope.alternatives = vm.Project.getDesignAlternatives();

    vm.$scope.gridOptions = [];
    vm.setGridOptions();

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
        cellClass: 'icon-cell',
        cellTemplate: 'app/design_alts/deleteButtonTemplate.html',
        enableCellEdit: false,
        minWidth: 50,
        width: '3%'
      }, {
        name: 'reorder',
        displayName: '',
        cellClass: 'icon-cell',
        cellTemplate: 'app/design_alts/reorderButtonTemplate.html',
        enableCellEdit: false,
        minWidth: 50,
        width: '3%'
      }, {
        name: 'name',
        displayName: 'designAlts.columns.name',
        headerCellFilter: 'translate',
        minWidth: 150
      }, {
        name: 'seedModel',
        displayName: 'designAlts.columns.seedModel',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownIdLabel: 'name',
        editDropdownOptionsArray: vm.seedsDropdownArr,
        editDropdownValueLabel: 'name',
        headerCellFilter: 'translate',
        minWidth: 100
      }, {
        name: 'weatherFile',
        displayName: 'designAlts.columns.locationOrWeatherFile',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownIdLabel: 'name',
        editDropdownOptionsArray: vm.weatherFilesDropdownArr,
        editDropdownValueLabel: 'name',
        headerCellFilter: 'translate',
        minWidth: 100
      }, {
        name: 'description',
        displayName: 'designAlts.columns.description',
        headerCellFilter: 'translate',
        minWidth: 100
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
        gridApi.edit.on.afterCellEdit(vm.$scope, function (rowEntity, colDef, newValue, oldValue) {
          if (newValue != oldValue && colDef.name == 'name') {
            const rowIndex = _.findIndex(vm.$scope.alternatives, {$$hashKey: rowEntity.$$hashKey});
            const isUnique = vm.checkUnique(vm.$scope.alternatives, newValue, rowIndex);
            if (!isUnique){
              // not unique, restore old value and add toastr
              vm.$log.debug('DA name must be unique');
              rowEntity.name = oldValue;
              vm.toastr.error('Cannot change design alternative name.  Selected name is not unique.');
            }
          }
        });
        gridApi.cellNav.on.navigate(null, (newRowCol) => {
          vm.$scope.gridApi.selection.selectRow(newRowCol.row.entity);
        });
      }
    };

    // add measure columns (in order)
    //vm.$log.info('DesignAlternativesController constructor measures: ', vm.measures);
    _.forEach(vm.measures, (measure) => {
      const optionsArr = vm.setOptionsArray(measure);
      vm.$log.debug(optionsArr);
      vm.$scope.gridOptions.columnDefs.push({
        name: measure.name,
        displayName: measure.displayName,
        minWidth: 100,
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownIdLabel: 'name',
        editDropdownValueLabel: 'name',
        editDropdownOptionsArray: optionsArr
      });

      // also ensure that options have this measure's key in it (to fix blanks on older projects)
      _.forEach(vm.$scope.alternatives, (alt) => {
        if (!alt[measure.name] || alt[measure.name] == ''){
          alt[measure.name] = 'None';
        }
      });
    });
  }

  addAlternative() {
    const vm = this;
    vm.setIsModified();
    const newAlt = vm.setNewAlternativeDefaults();

    _.forEach(vm.measures, (measure) => {
      newAlt[measure.name] = 'None';
    });
    vm.$scope.alternatives.push(newAlt);
  }

  deleteAlternative(alternative) {
    const vm = this;
    vm.setIsModified();
    const index = vm.$scope.alternatives.indexOf(alternative);
    vm.$scope.alternatives.splice(index, 1);
  }

  moveUp(alternative) {
    const vm = this;
    vm.setIsModified();
    const index = vm.$scope.alternatives.indexOf(alternative);
    if (index > 0) {
      const temp = angular.copy(vm.$scope.alternatives[index - 1]);
      vm.$scope.alternatives[index - 1] = alternative;
      vm.$scope.alternatives[index] = temp;
    }
  }

  moveDown(alternative) {
    const vm = this;
    vm.setIsModified();
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
    vm.setIsModified();
    let alternatives = vm.Project.getDesignAlternatives();

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
    vm.$log.debug('In DesignAlternatives::duplicateAlternative');
    if (vm.selected){
      vm.setIsModified();
      const dupAlt = angular.copy(vm.selected);
      delete dupAlt.$$hashKey;
      // find new name
      dupAlt.name = vm.findNextName(dupAlt.name);
      vm.$scope.alternatives.push(dupAlt);
    } else {
      vm.$log.error('No Alternative Selected.  Cannot Duplicate.');
    }

  }

  findNextName(name){
    const vm = this;
    let newName = name + ' Duplicate';
    const matchArr = [];
    _.forEach(vm.$scope.alternatives, (alt) => {
      if (_.includes(alt.name, newName)){
        matchArr.push(alt.name);
      }
    });
    if (matchArr.length > 0) {
      // found at least a match.  find next available number
      const newMatchArr = [];
      _.forEach(matchArr, (match) => {
        let newMatch = _.trim(match.replace(newName, ''));
        //vm.$log.debug('match after: ', newMatch);
        if (_.isNumber(_.toNumber(newMatch))){
          //vm.$log.debug('match is a number');
          newMatchArr.push(_.toNumber(newMatch));
        }
      });
      vm.$log.debug('New matchArr: ', newMatchArr);
      if (newMatchArr.length > 0){
        // find max and add 1
        newName = newName + ' ' + (_.max(newMatchArr) + 1);
      } else {
        newName = newName + ' 1';
      }
    } else {
      newName = newName + ' 1';
    }
    vm.$log.debug("newName: ", newName);
    return newName;
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

  setIsModified() {
    const vm = this;
    vm.Project.setModified(true);
  }

}
