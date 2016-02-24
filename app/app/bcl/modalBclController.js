import * as jetpack from 'fs-jetpack';
import * as path from 'path';
import * as os from 'os';
import { parseString } from 'xml2js';

export class ModalBclController {

  constructor($log, $uibModalInstance, $scope, BCL) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.BCL = BCL;

    vm.jetpack = jetpack;
    vm.my_measures_dir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));
    vm.local_dir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/LocalBCL'));

    vm.selected = null;
    vm.keyword = '';

    vm.filters = {
      all: false,
      local: true,
      bcl: false,
      my: true
    };

    vm.categories = [];
    vm.getBCLCategories();

    // TODO: get project measures from a service
    vm.project_measures = [];

    // assign measures by type
    vm.lib_measures = {};
    vm.lib_measures.local = vm.getMeasures(vm.local_dir, 'local');
    vm.lib_measures.my = vm.getMeasures(vm.my_measures_dir, 'my');

    //vm.measures.bcl = vm.getBCLMeasures();

    // get measures array for Library display
    vm.$scope.display_measures = vm.getDisplayMeasures();

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
        width: '5%'
      }, {
        name: 'type',
        enableSorting: false,
        enableCellEdit: false,
        cellClass: 'icon-cell',
        width: '12%',
        cellTemplate: '<img ng-src="assets/images/{{grid.getCellValue(row, col)}}_icon.png" alt="{{grid.getCellValue(row, col)}}" />'
      }, {
        name: 'author',
        enableCellEdit: false,
        width: '18%'
      }, {
        name: 'date',
        enableCellEdit: false,
        type: 'date',
        cellFilter: 'date:"dd/MM/yyyy"',
        width: '12%'
      }, {
        name: 'status',
        enableCellEdit: false,
        cellClass: 'icon-cell',
        width: '10%'
      }, {
        name: 'add',
        enableCellEdit: false,
        cellClass: 'icon-cell',
        width: '10%'
      }],
      data: 'display_measures',
      rowHeight: 35,
      enableCellEditOnFocus: true,
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
        gridApi.cellNav.on.navigate(null, (newRowCol, oldRowCol) => {
          vm.gridApi.selection.selectRow(newRowCol.row.entity);
        });
      }
    };
  }

  getMeasures(path, type) {
    const vm = this;

    let measurePaths = [];
    const measures = [];
    if (vm.jetpack.exists(path.cwd())) measurePaths = path.find('.', {matching: '*/measure.xml'}, 'relativePath');
    else console.error('The (%s) Measures directory (%s) does not exist', type, path.cwd());

    _.each(measurePaths, measurePath => {

      const xml = path.read(measurePath);
      let measure = vm.parseMeasure(xml);
      measure = vm.prepareMeasure(measure, type);
      measures.push(measure);

    });

    return measures;
  }

  parseMeasure(xml) {
    let measure = {};

    parseString(xml, (err, result) => {
      const measureArguments = _.result(result, 'measure.arguments[0].argument', []);
      _.each(measureArguments, (argument, i) => {

        const choices = _.result(argument, 'choices[0].choice', []);
        _.each(choices, (choice, i) => {
          choices[i] = {
            value: _.result(choice, 'value[0]'),
            displayName: _.result(choice, 'display_name[0]')
          };
        });

        measureArguments[i] = {
          name: argument.name[0],
          displayName: argument.display_name[0],
          shortName: _.result(argument, 'short_name[0]'),
          description: _.result(argument, 'description[0]'),
          type: argument.type[0],
          required: argument.required[0],
          modelDependent: _.result(argument, 'model_dependent', 'false'),
          defaultValue: _.result(argument, 'default_value[0]'),
          choices: choices,
          minValue: _.result(argument, 'min_value[0]'),
          maxValue: _.result(argument, 'max_value[0]')
        };
      });

      // TODO: add outputs
      // TODO: add provenances (first one only)

      const attributes = _.result(result, 'measure.attributes[0].attribute', []);
      _.each(attributes, (attribute, i) => {
        attributes[i] = {
          name: attribute.name[0],
          value: attribute.value[0],
          datatype: attribute.datatype[0]
        };
      });

      const files = _.result(result, 'measure.files[0].file', []);
      _.each(files, (file, i) => {

        const version = {
          softwareProgram: _.result(file, 'version[0].software_program[0]', null),
          identifier: _.result(file, 'version[0].identifier[0]', null),
          minCompatible: _.result(file, 'version[0].min_compatible[0]', null),
          maxCompatible: _.result(file, 'version[0].max_compatible[0]', null)
        };

        files[i] = {
          filename: file.filename[0],
          filetype: file.filetype[0],
          usageType: _.result(file, 'usage_type[0]', null),
          checksum: file.checksum[0],
          version: version
        };
      });
      measure = {
        schemaVersion: _.result(result, 'measure.schema_version[0]'),
        name: _.result(result, 'measure.name[0]'),
        uid: _.result(result, 'measure.uid[0]'),
        versionId: _.result(result, 'measure.version_id[0]'),
        versionModified: _.result(result, 'measure.version_modified[0]'),
        xmlChecksum: _.result(result, 'measure.xml_checksum[0]'),
        className: _.result(result, 'measure.class_name[0]'),
        displayName: _.result(result, 'measure.display_name[0]'),
        shortName: _.result(result, 'measure.short_name[0]'),
        description: _.result(result, 'measure.description[0]'),
        modelerDescription: _.result(result, 'measure.modeler_description[0]'),
        arguments: measureArguments,
        tags: _.result(result, 'measure.tags[0].tag[0]', ''),
        attributes: attributes,
        files: files
      };

      // fix tags
      measure.tags = _.join(_.split(measure.tags, '.'), ' -> ');
    });

    return measure;
  }

  // add additional fields for display
  prepareMeasure(measure, type) {
    // add fields for display
    measure.status = '';
    measure.location = _.capitalize(type);
    measure.add = '';

    if (measure.versionModified) {
      // assuming yyyy-mm-dd
      measure.date = new Date(measure.versionModified.substring(0, 4), measure.versionModified.substring(5, 7), measure.versionModified.substring(8, 10));

    } else {
      measure.date = '';
    }

    if (measure.provenances && measure.provenances.count > 0) {
      measure.author = measure.provenances[0].provenance.author;
    } else {
      measure.author = '';
    }

    _.each(measure.attributes, attr => {
      if (attr.name == 'Measure Type') {
        measure.type = attr.value;
      }
    });

    return measure;

  }

  // return filter types that are set; handle 'all' case
  getMeasureTypes() {
    const vm = this;

    let types = [];

    if (vm.filters.all) {
      types = ['my', 'local', 'bcl'];
    } else {
      types = [];
      if (vm.filters.my) types.push('my');
      if (vm.filters.local) types.push('local');
      if (vm.filters.bcl) types.push('bcl');
      // TODO: others?
    }

    return types;

  }

  // get measures for display
  getDisplayMeasures() {
    const vm = this;

    let measures = [];
    const types = vm.getMeasureTypes();

    _.each(types, type => {
      measures = _.concat(measures, vm.lib_measures[type]);
    });

    return measures;
  }

  getBCLCategories() {
    const vm = this;

    vm.BCL.getCategories().then(response => {

      if (response.data.term) {
        const categories = [];
        // 3 possible levels of nesting
        _.each(response.data.term, term => {
          const cat1 = _.pick(term, ['name', 'tid']);
          const cat1_terms = [];
          _.each(term.term, term2 => {
            const cat2 = _.pick(term2, ['name', 'tid']);
            const cat2_terms = [];
            _.each(term2.term, term3 => {
              const cat3 = _.pick(term3, ['name', 'tid']);
              cat2_terms.push(cat3);
            });
            cat2.children = cat2_terms;
            cat1_terms.push(cat2);
          });
          cat1.children = cat1_terms;
          categories.push(cat1);
        });

        //vm.$log.debug('Categories: ', categories);
        vm.categories = categories;

      }
    });
    // for testing until electron works
    /*
     vm.categories = [
     {name: 'A', tid: 1},
     {name: 'B', tid: 2},
     {name: 'C', tid: 3}
     ];*/
  }

  // process filter changes
  resetFilters() {
    const vm = this;
    vm.$log.debug('filters:', this.filters);
    vm.$scope.display_measures = this.getDisplayMeasures();
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
