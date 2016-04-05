import * as jetpack from 'fs-jetpack';
import * as path from 'path';
import * as os from 'os';

export class ModalBclController {

  constructor($log, $uibModalInstance, $scope, BCL, params) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.BCL = BCL;
    vm.jetpack = jetpack;
    vm.params = params;

    vm.checkForUpdates = vm.params.update;
    // TODO: do the check for updates

    vm.filters = {
      my: true,
      local: true,
      bcl: false,
      project: true
    };

    vm.types = {
      ModelMeasure: true,
      EnergyPlusMeasure: true,
      ReportingMeasure: true
    };

    // set filters and types with incoming params
    vm.setTypes();
    vm.setFilters();

    vm.selected = null;
    vm.keyword = '';

    // TODO: fix dirs (get from Electron settings)
    vm.myMeasuresDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));
    vm.localDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/LocalBCL'));
    vm.projectDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/PAT/the_project'));

    vm.categories = [];
    vm.getBCLCategories();

    // get measures array for Library display
    vm.$scope.displayMeasures = [];

    // get all measures
    vm.libMeasures = vm.BCL.getMeasures();


    // load measures and apply filters
    vm.getLocalMeasures();
    vm.getBCLMeasures();
    vm.resetFilters();

    // temporary workaround until project measures service / JSON is implemented
    // adds additional info
    //vm.projectMeasures = vm.libMeasures.project;

    vm.$log.debug('DISPLAY MEASURES', vm.$scope.displayMeasures);

    // Library grid
    vm.libraryGridOptions = {
      columnDefs: [{
        name: 'displayName',
        displayName: 'Name',
        enableCellEdit: false,
        width: '35%'
      }, {
        name: 'location',
        displayName: '',
        enableCellEdit: false,
        cellClass: 'location-cell',
        cellTemplate: '../app/bcl/locationTemplate.html',
        width: '11%'
      }, {
        name: 'type',
        enableSorting: false,
        enableCellEdit: false,
        cellClass: 'icon-cell',
        width: '15%',
        cellTemplate: '<img ng-src="assets/images/{{grid.getCellValue(row, col)}}_icon.png" alt="{{grid.getCellValue(row, col)}}" />'
      }, {
        name: 'author',
        enableCellEdit: false,
        visible: false
      }, {
        name: 'date',
        enableCellEdit: false,
        type: 'date',
        cellFilter: 'date:"dd/MM/yyyy"',
        width: '15%'
      }, {
        name: 'status',
        enableCellEdit: false,
        cellClass: 'dropdown-button',
        cellTemplate: '../app/bcl/tempEditButtonTemplate.html',
        width: '15%'
      }, {
        name: 'add',
        enableCellEdit: false,
        cellClass: 'icon-cell',
        cellTemplate: '../app/bcl/addButtonTemplate.html',
        width: '10%'
      }],
      data: 'displayMeasures',
      rowHeight: 45,
      /*enableCellEditOnFocus: true,*/
      enableHiding: false,
      enableColumnMenus: false,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        vm.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged(null, row => {
          if (row.isSelected) {
            vm.selected = row.entity;
          } else {
            // No rows selected
            vm.selected = null;
          }
        });
        gridApi.cellNav.on.navigate(null, (newRowCol) => {
          vm.gridApi.selection.selectRow(newRowCol.row.entity);
        });
      }
    };
  }

  // set filters from parameters (if array isn't empty)
  setFilters() {
    const vm = this;
    if (!vm.params.filters.length == 0) {
      _.forEach(vm.filters, (val, key) => {
        vm.filters[key] = !!_.includes(vm.params.filters, key);
      });
    }

  }

  // set types from parameters (if array isn't empty)
  setTypes() {
    const vm = this;
    if (!vm.params.types.length <= 0) {
      _.forEach(vm.types, (val, key) => {
        vm.types[key] = !!_.includes(vm.params.types, key);
      });
    }
  }

  getLocalMeasures() {
    const vm = this;
    const measures = vm.BCL.getLocalMeasures();

    // set all measure keys
    _.forEach(measures, (val, key) => {
      vm.libMeasures[key] = val;
    });
  }

  getBCLMeasures() {
    const vm = this;
    vm.BCL.getBCLMeasures().then(response => {
      vm.libMeasures.bcl = response;
      vm.$log.debug('ALL MEASURES: ', vm.libMeasures);
    });
  }

  // get measures for display based on filter values
  setDisplayMeasures() {
    const vm = this;
    const measures = [];
    vm.$log.debug('libMeasures: ', vm.libMeasures);
    // add checked
    _.forEach(vm.filters, (val, key) => {
      if (val) {
        _.forEach(vm.libMeasures[key], m => {
          // add if not found
          if (!(_.find(measures, {uid: m.uid}))) measures.push(m);
        });
      }
    });

    // TODO: then check for updates on local measures

    vm.$scope.displayMeasures = measures;
    return measures;
  }

  // TODO: move most of this processing to BCL service
  getBCLCategories() {
    const vm = this;

    vm.BCL.getCategories().then(response => {

      if (response.data.term) {
        const categories = [];
        // 3 possible levels of nesting
        _.forEach(response.data.term, term => {
          const cat1 = _.pick(term, ['name', 'tid']);
          const cat1Terms = [];
          _.forEach(term.term, term2 => {
            const cat2 = _.pick(term2, ['name', 'tid']);
            const cat2Terms = [];
            _.forEach(term2.term, term3 => {
              const cat3 = _.pick(term3, ['name', 'tid']);
              cat2Terms.push(cat3);
            });
            cat2.children = cat2Terms;
            cat1Terms.push(cat2);
          });
          cat1.children = cat1Terms;
          categories.push(cat1);
        });

        //vm.$log.debug('Categories: ', categories);
        vm.categories = categories;

      }
    });
  }

  // process measures filter changes
  resetFilters() {
    const vm = this;
    vm.$scope.displayMeasures = vm.setDisplayMeasures();
    vm.resetTypeFilters();
  }

  // process measure type filter changes
  resetTypeFilters() {
    const vm = this;
    const typesArr = [];
    _.forEach(vm.types, (val, key) => {

      if (val) {
        typesArr.push(key);
      }
    });
    const newMeasures = [];
    _.forEach(vm.$scope.displayMeasures, (m) => {
      vm.$log.debug(_.includes(typesArr, m.type));
      if (_.includes(typesArr, m.type)) newMeasures.push(m);
    });

    vm.$scope.displayMeasures = _.filter(vm.$scope.displayMeasures, m => {
      return _.includes(typesArr, m.type);
    });
  }


  // add measure to project
  addMeasure(rowEntity) {

    const vm = this;
    const measure = _.find(vm.$scope.displayMeasures, {uid: rowEntity.uid});

    vm.$log.debug(measure);
    measure.addedToProject = true;

    // TODO: Call service to add to project?
    vm.addToProject(measure);

  }

  // TODO: this will be in a service?
  addToProject(measure) {
    const vm = this;

    // add to array(s)
    //vm.projectMeasures.push(measure);
    vm.libMeasures.project.push(measure);
    // I think this is unnecessary (adds it twice?)
    //vm.BCL.addProjectMeasure(measure);
    vm.$log.debug('Project MEASURES IN bclService: ', vm.BCL.getProjectMeasures());

    // copy on disk
    const src = (measure.location == 'my') ? vm.myMeasuresDir : vm.localDir;
    src.copy(measure.name, vm.projectDir.path(measure.name));

  }

  // download from BCL (via service)
  download(measure) {
    const vm = this;
    vm.BCL.downloadMeasure(measure).then(newMeasure => {

      // TODO: possible refactor.  add to measures and recalculate display, or pull from service first?
      vm.libMeasures.local.push(newMeasure);
      vm.$scope.displayMeasures = vm.setDisplayMeasures();
      // select newly added row
      vm.selectARow(measure.uid);

    });
  }

  // select row in table based on UID
  selectARow(uid) {
    const vm = this;
    const index = _.findIndex(vm.$scope.displayMeasures, {uid: uid});
    vm.gridApi.grid.modifyRows(vm.$scope.displayMeasures);
    vm.gridApi.selection.selectRow(vm.$scope.displayMeasures[index]);
  }

  // edit My measure
  editMeasure() {
    const vm = this;
    vm.$log.debug('in EDIT MEASURE function');
  }

  // copy from local and edit
  copyAndEditMeasure() {
    const vm = this;
    vm.$log.debug('in COPY AND EDIT function');
  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }

  cancel() {
    const vm = this;

    vm.$uibModalInstance.dismiss('cancel');
  }

  search() {
    // first just search by keyword and display results
  }

}
