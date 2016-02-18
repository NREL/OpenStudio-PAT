import * as jetpack from 'fs-jetpack';
import * as path from 'path';
import * as os from 'os';
import { parseString } from 'xml2js';

export class ModalBclController {

  constructor($log, $uibModalInstance, _, BCL) {
    'ngInject';

    var vm = this;

    this.jetpack = jetpack;
    this.srcDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));

    this.selected = null;
    this.keyword = '';
    this.categories = [];

    this.$uibModalInstance = $uibModalInstance;
    this._ = _;
    this.$log = $log;
    this.BCL = BCL;

    this.filters = {
      all: false,
      local: false,
      bcl: true,
      measure_dir: false
    };

    this.project_measures = [];

    this.bcl_measures = [];
    this.local_measures = [];

    this.getLocalMeasures();
    //this.getBCLMeasures();

    this.display_measures = [];
    this.getMeasuresForDisplay();

    this.libraryGridOptions = {
      columnDefs: [{
        name: 'displayName',
        displayName: 'Name',
        enableCellEdit: false,
        width:'35%'
      }, {
        name: 'location',
        displayName: '',
        enableCellEdit: false,
        width:'5%'
      }, {
        name: 'type',
        enableSorting: false,
        enableCellEdit: false,
        cellClass: 'icon-cell',
        width:'10%',
        cellTemplate:'<img ng-src=\"assets/images/{{grid.getCellValue(row, col)}}_icon.png\" alt=\"{{grid.getCellValue(row, col)}}\" />'
      }, {
        name: 'author',
        enableCellEdit: false,
        width:'20%'
      }, {
        name: 'date',
        enableCellEdit: false,
        type: 'date',
        cellFilter: 'date:"dd/MM/yyyy"',
        width:'12%'
      }, {
        name: 'status',
        enableCellEdit: false,
        cellClass: 'icon-cell',
        width:'10%'
      }, {
        name: 'add',
        enableCellEdit: false,
        cellClass: 'icon-cell',
        width:'10%'
      }],
      data: this.getMeasuresForDisplay(),
      rowHeight: 35,
      enableCellEditOnFocus: true,
      enableHiding: false,
      enableColumnMenus: false,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      onRegisterApi: function (gridApi) {
        vm.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged(null, function (row) {
          if (row.isSelected) {
            vm.selected = row.entity;
          } else {
            // No rows selected
            vm.selected = null;
          }
        });
        gridApi.cellNav.on.navigate(null, function(newRowCol, oldRowCol){
          vm.gridApi.selection.selectRow(newRowCol.row.entity);
        });
      }
    };
  }

  getLocalMeasures(){

    let measurePaths = [];
    if (this.jetpack.exists(this.srcDir.cwd())) measurePaths = this.srcDir.find('.', {matching: '*/measure.xml'}, 'relativePath');
    else console.error('My Measures directory (%s) does not exist', this.srcDir.cwd());

    this._.each(measurePaths, measurePath => {
      const xml = this.srcDir.read(measurePath);
      parseString(xml, (err, result) => {

        const measureArguments = this._.result(result, 'measure.arguments[0].argument', []);
        this._.each(measureArguments, (argument, i) => {

          const choices = this._.result(argument, 'choices[0].choice', []);
          this._.each(choices, (choice, i) => {
            choices[i] = {
              value: this._.result(choice, 'value[0]'),
              displayName: this._.result(choice, 'display_name[0]')
            };
          });

          measureArguments[i] = {
            name: argument.name[0],
            displayName: argument.display_name[0],
            shortName: this._.result(argument, 'short_name[0]'),
            description: this._.result(argument, 'description[0]'),
            type: argument.type[0],
            required: argument.required[0],
            modelDependent:  this._.result(argument, 'model_dependent', 'false'),
            defaultValue:  this._.result(argument, 'default_value[0]'),
            choices: choices,
            minValue: this._.result(argument, 'min_value[0]'),
            maxValue: this._.result(argument, 'max_value[0]')
          };
        });

        // TODO: add outputs
        // TODO: add provenances (first one only)

        const attributes = this._.result(result, 'measure.attributes[0].attribute', []);
        this._.each(attributes, (attribute, i) => {
          attributes[i] = {
            name: attribute.name[0],
            value: attribute.value[0],
            datatype: attribute.datatype[0]
          };
        });

        const files = this._.result(result, 'measure.files[0].file', []);
        this._.each(files, (file, i) => {

          const version = {
            softwareProgram: this._.result(file, 'version[0].software_program[0]', null),
            identifier: this._.result(file, 'version[0].identifier[0]', null),
            minCompatible: this._.result(file, 'version[0].min_compatible[0]', null),
            maxCompatible: this._.result(file, 'version[0].max_compatible[0]', null)
          };

          files[i] = {
            filename: file.filename[0],
            filetype: file.filetype[0],
            usageType: this._.result(file, 'usage_type[0]', null),
            checksum: file.checksum[0],
            version: version
          };
        });
        const measure = {
          schemaVersion: this._.result(result, 'measure.schema_version[0]'),
          name: this._.result(result, 'measure.name[0]'),
          uid: this._.result(result, 'measure.uid[0]'),
          versionId: this._.result(result, 'measure.version_id[0]'),
          versionModified: this._.result(result, 'measure.version_modified[0]'),
          xmlChecksum: this._.result(result, 'measure.xml_checksum[0]'),
          className: this._.result(result, 'measure.class_name[0]'),
          displayName: this._.result(result, 'measure.display_name[0]'),
          shortName: this._.result(result, 'measure.short_name[0]'),
          description: this._.result(result, 'measure.description[0]'),
          modelerDescription: this._.result(result, 'measure.modeler_description[0]'),
          arguments: measureArguments,
          tags: this._.result(result, 'measure.tags[0].tag[0]', ''),
          attributes: attributes,
          files: files
        };

        // fix tags
        measure.tags = this._.join(this._.split(measure.tags, '.'), ' -> ');

        this.local_measures.push(measure);
      });
    });
  }

  getMeasuresForDisplay() {

    this.display_measures = [];

    this._.each(this.local_measures, m => {
      const measure = m;

      // add fields for display
      measure.status = '';
      measure.location = 'My';
      measure.add = '';

      if (m.versionModified) {
        // assuming yyyy-mm-dd
        measure.date = new Date(m.versionModified.substring(0, 4), m.versionModified.substring(5, 7), m.versionModified.substring(8, 10));

      } else {
        measure.date = '';
      }

      if (m.provenances && m.provenances.count > 0) {
        measure.author = m.provenances[0].provenance.author;
      } else {
        measure.author = '';
      }

      this._.each(m.attributes, attr => {
        if (attr.name == 'Measure Type') {
          measure.type = attr.value;
        }
      });
      this.display_measures.push(measure);
    });

    return this.display_measures;

  }

  getBCLMeasures() {
    this.BCL.getCategories().then(response => {

      if (response.data.term) {
        const categories = [];
        // 3 possible levels of nesting
        this._.each(response.data.term, term => {
          const cat1 = this._.pick(term, ['name', 'tid']);
          const cat1_terms = [];
          this._.each(term.term, term2 => {
            const cat2 = this._.pick(term2, ['name', 'tid']);
            const cat2_terms = [];
           this._.each(term2.term, term3 => {
              const cat3 = this._.pick(term3, ['name', 'tid']);
              cat2_terms.push(cat3);
            });
            cat2.children = cat2_terms;
            cat1_terms.push(cat2);
          });
          cat1.children = cat1_terms;
          categories.push(cat1);
        });

        this.$log.debug('Categories: ', categories);
        this.categories = categories;

      }
    });
    // for testing until electron works
    this.categories = [
      {name: 'A', tid: 1},
      {name: 'B', tid: 2},
      {name: 'C', tid: 3}
    ];
  }


  ok() {
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }

  search() {

    // first just search by keyword and display results

  }

}
