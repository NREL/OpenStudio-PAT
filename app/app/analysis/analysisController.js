import * as jetpack from 'fs-jetpack';
import * as os from 'os';
import * as path from 'path';
import { parseString } from 'xml2js';

export class AnalysisController {

  constructor(_, $log, BCL) {
    'ngInject';

    this._ = _;
    this.$log = $log;
    this.jetpack = jetpack;

    this.test = 'Analysis Controller';
    this.BCL = BCL;

    this.srcDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));

    this.measures = [];

    this.analysisTypes = ['Manual', 'Auto'];

    this.getMeasures();
  }

  getMeasures() {
    const self = this;

    let measurePaths = [];
    if (this.jetpack.exists(this.srcDir.cwd())) measurePaths = this.srcDir.find('.', {matching: '*/measure.xml'}, 'relativePath');
    else console.error('My Measures directory (%s) does not exist', this.srcDir.cwd());

    this._.each(measurePaths, measurePath => {
      //this.$log.debug(measurePath);
      const xml = this.srcDir.read(measurePath);
      parseString(xml, (err, result) => {
        const attributes = self._.result(result, 'measure.attributes[0].attribute', []);
        self._.each(attributes, (attribute, i) => {
          attributes[i] = {
            name: attribute.name[0],
            value: attribute.value[0],
            datatype: attribute.datatype[0]
          };
        });
        const measure = {
          name: self._.result(result, 'measure.name[0]'),
          uid: self._.result(result, 'measure.uid[0]'),
          versionId: self._.result(result, 'measure.version_id[0]'),
          description: self._.result(result, 'measure.description[0]'),
          modelerDescription: self._.result(result, 'measure.modeler_description[0]'),
          tags: self._.result(result, 'measure.tags[0].tag', []),
          attributes: attributes
        };
        self.measures.push(measure);
        //console.log(measure);
      });
    });
  }
}
