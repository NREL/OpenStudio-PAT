import * as jetpack from 'fs-jetpack';
import * as os from 'os';
import * as path from 'path';
import { parseString } from 'xml2js';

export class AnalysisController {

  constructor($log, BCL) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.jetpack = jetpack;

    vm.test = 'Analysis Controller';
    vm.BCL = BCL;

    vm.srcDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));

    vm.measures = [];

    vm.analysisTypes = ['Manual', 'Auto'];

    vm.getMeasures();

    vm.gridOptions = {
      data: this.measures[0].arguments,
      enableSorting: true,
      autoResize: true,
      enableCellEditOnFocus: true,
      columnDefs: [{
        name: 'displayName',
        displayName: 'Name of Option',
        enableHiding: false
      }, {
        name: 'name',
        displayName: 'Short Name',
        enableHiding: false
      }, {
        name: 'variable',
        displayName: 'Variable',
        enableHiding: false,
        type: 'boolean'
      }, {
        name: 'type',
        displayName: 'Type',
        enableHiding: false
      }, {
        name: 'option1',
        displayName: 'Option 1',
        editDropdownOptionsFunction: function(rowEntity) {
          if (rowEntity.type === 'Choice') {
            self.choices = [];
            self._.each(rowEntity.choices, (choice) => {
              self.choices.push({
                value: choice.value
              });
            });
            return self.choices;
          }
        },
        editableCellTemplate: '<div><form name=\"inputForm\">' +
          '<input ng-if=\"row.entity.type==\'Boolean\'\" type=\"INPUT_TYPE\" ng-class=\"\'colt\' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" />' +
          '<input ng-if=\"row.entity.type==\'Int\'\" type=\"INPUT_TYPE\" ng-class=\"\'colt\' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" />' +
          '<input ng-if=\"row.entity.type==\'Double\'\" type=\"INPUT_TYPE\" ng-class=\"\'colt\' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" />' +
          '<input ng-if=\"row.entity.type==\'String\'\" type=\"INPUT_TYPE\" ng-class=\"\'colt\' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" />' +
          '<select ng-if=\"row.entity.type==\'Choice\'\" ng-class=\"\'colt\' + col.uid\" ui-grid-edit-dropdown ng-model=\"MODEL_COL_FIELD\" ng-options=\"field[editDropdownIdLabel] as field[editDropdownValueLabel] CUSTOM_FILTERS for field in editDropdownOptionsArray\"></select>' +
        ' </form></div>',
        enableHiding: false,
        enableCellEdit: true
      }],

      onRegisterApi: function( gridApi ) {
        this.gridApi = gridApi;
        const cellTemplate = 'ui-grid/selectionRowHeader';   // you could use your own template here
        this.gridApi.core.addRowHeaderColumn( { name: 'rowHeaderCol', displayName: '', width: 50, cellTemplate: cellTemplate} );
      }
    };

  }

  getMeasures() {
    const vm = this;

    let measurePaths = [];
    if (vm.jetpack.exists(vm.srcDir.cwd())) measurePaths = vm.srcDir.find('.', {matching: '*/measure.xml'}, 'relativePath');
    else console.error('My Measures directory (%s) does not exist', vm.srcDir.cwd());

    _.each(measurePaths, measurePath => {
      //vm.$log.debug(measurePath);
      const xml = vm.srcDir.read(measurePath);
      parseString(xml, (err, result) => {

        const measureArguments = self._.result(result, 'measure.arguments[0].argument', []);
        self._.each(measureArguments, (argument, i) => {

          const choices = self._.result(argument, 'choices[0].choice', []);
          self._.each(choices, (choice, i) => {
            choices[i] = {
              value: self._.result(choice, 'value[0]'),
              displayName: self._.result(choice, 'display_name[0]')
            };
          });

          measureArguments[i] = {
            name: argument.name[0],
            displayName: argument.display_name[0],
            description: argument.description[0],
            type: argument.type[0],
            required: argument.required[0],
            modelDependent: argument.model_dependent[0],
            defaultValue: argument.default_value[0],
            choices: choices,
            variable: false
          };
        });

        const attributes = _.result(result, 'measure.attributes[0].attribute', []);
        _.each(attributes, (attribute, i) => {
          attributes[i] = {
            name: attribute.name[0],
            value: attribute.value[0],
            datatype: attribute.datatype[0]
          };
        });

        const files = self._.result(result, 'measure.files[0].file', []);
        self._.each(files, (file, i) => {

          const version = {
            softwareProgram: self._.result(file, 'version[0].software_program[0]'),
            identifier: self._.result(file, 'version[0].identifier[0]'),
            minCompatible: self._.result(file, 'version[0].min_compatible[0]')
          };

          files[i] = {
            filename: file.filename[0],
            filetype: file.filetype[0],
            usageType: file.usage_type[0],
            checksum: file.checksum[0],
            version: version
          };
        });
        const measure = {
          schemaVersion: _.result(result, 'measure.schema_version[0]'),
          name: _.result(result, 'measure.name[0]'),
          uid: _.result(result, 'measure.uid[0]'),
          versionId: _.result(result, 'measure.version_id[0]'),
          xmlChecksum: _.result(result, 'measure.xml_checksum[0]'),
          className: _.result(result, 'measure.class_name[0]'),
          displayName: _.result(result, 'measure.display_name[0]'),
          description: _.result(result, 'measure.description[0]'),
          modelerDescription: _.result(result, 'measure.modeler_description[0]'),
          arguments: measureArguments,
          tags: _.result(result, 'measure.tags[0].tag', []),
          attributes: attributes,
          files: files
        };
        vm.measures.push(measure);
        //console.log(measure);
      });
    });
  }
}
