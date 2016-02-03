const jetpack = require('fs-jetpack');
const os = require('os');
const path = require('path');
const parseString = require('xml2js').parseString;

export class AnalysisController {

  constructor(_, $log, BCL) {
    'ngInject';

    this.test = 'Analysis Controller';

    this._ = _;
    this.$log = $log;
    this.BCL = BCL;

    this.srcDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));

    this.measures = [];

    this.analysisTypes = ['Manual', 'Auto'];

    this.getMeasures();
  }

  getMeasures() {
    const self = this;
    //this.$log.debug(this.srcDir.cwd());
    //this.$log.debug(this.srcDir.find('.', {matching: '*/measure.xml'}, 'relativePath'));
    const measurePaths = this.srcDir.find('.', {matching: '*/measure.xml'}, 'relativePath');
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
