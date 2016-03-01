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
  }

  getMeasures() {
    const vm = this;

    let measurePaths = [];
    if (vm.jetpack.exists(vm.srcDir.cwd())) measurePaths = vm.srcDir.find('.', {matching: '*/measure.xml'}, 'relativePath');
    else console.error('My Measures directory (%s) does not exist', vm.srcDir.cwd());

    _.forEach(measurePaths, measurePath => {
      //vm.$log.debug(measurePath);
      const xml = vm.srcDir.read(measurePath);
      parseString(xml, (err, result) => {
        const attributes = _.result(result, 'measure.attributes[0].attribute', []);
        _.forEach(attributes, (attribute, i) => {
          attributes[i] = {
            name: attribute.name[0],
            value: attribute.value[0],
            datatype: attribute.datatype[0]
          };
        });
        const measure = {
          name: _.result(result, 'measure.name[0]'),
          uid: _.result(result, 'measure.uid[0]'),
          versionId: _.result(result, 'measure.version_id[0]'),
          description: _.result(result, 'measure.description[0]'),
          modelerDescription: _.result(result, 'measure.modeler_description[0]'),
          tags: _.result(result, 'measure.tags[0].tag', []),
          attributes: attributes
        };
        vm.measures.push(measure);
        //console.log(measure);
      });
    });
  }
}
