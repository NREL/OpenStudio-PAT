var jetpack = require('fs-jetpack');
var os = require('os');
var path = require('path');
var parseString = require('xml2js').parseString;

export class AnalysisController {

  constructor(_, $log) {
    'ngInject';

    this.srcDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));

    this._ = _;
    this.$log = $log;

    this.oneAtATime = true;

    this.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: ['Dynamic Group Body - 2']
      }
    ];

    this.measurestuff = [
      {
        measurename: 'my test measure'
      }
    ];

    this.items = ['Item 1', 'Item 2', 'Item 3'];

    this.addItem = function () {
      var newItemNo = this.items.length + 1;
      this.items.push('Item ' + newItemNo);
    };

    this.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

    this.getMeasures();
  }

  getMeasures() {
    //this.$log.debug('INSIDE getMeasures');
    //var self = this;
    this.$log.debug(this.srcDir.cwd());
    this.$log.debug(this.srcDir.find('.', {matching: '*/measure.xml'}, 'relativePath'));
    var measures = this.srcDir.find('.', {matching: '*/measure.xml'}, 'relativePath');
    for (var i = 0; i < measures.length; i++) {
      //this.$log.debug('INSIDE measures for loop');
      this.$log.debug(measures[i]);
      //this.$log.debug(this.srcDir.read(measures[i]));
      var measure = this.srcDir.read(measures[i]);
      parseString(measure, function (err, result) {
        //this.$log.debug(result);
        var tag = result.measure.tags[0].tag[0]; // var tags = _.result(result, 'measure.tags[0].tag', []);
        var attributes = result.measure.attributes[0].attribute;
        console.log(result.measure.name[0]);
        console.log(result.measure.uid[0]);
        console.log(result.measure.version_id[0]);
        console.log(result.measure.description[0]);
        console.log(result.measure.modeler_description[0]);
        console.log(result.measure.provenances[0]);
        console.log(tag);
        //console.log(attributes);
        for (var j = 0; j < attributes.length; j++) {
          console.log(attributes[j].name[0]);
          console.log(attributes[j].value[0]);
          console.log(attributes[j].datatype[0]);
        }
      });
    }

    //this.srcDir
    //  .findAsync('.', {matching: '*/measure.xml'})
    //  .then(function (measures) {
    //    this.$log.debug('Async result', measures);
    //    this._.each(measures, function (measure) {
    //      console.log('hello');
    //      self.$log.debug(measure);
    //    });
    //  }, function (msg) {
    //    this.$log.debug('FAILED', msg);
    //  });
  }
}
