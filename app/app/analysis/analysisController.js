var jetpack = require('fs-jetpack');
var parseString = require('xml2js').parseString;

export class AnalysisController {

  constructor(_, $log) {
    'ngInject';

    this.srcDir = jetpack.cwd('C:/Users/eweaver/OpenStudio/Measures');

    this._ = _;
    this.$log = $log;

    this.oneAtATime = true;

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

    this.$log.debug(parseString);
  }

  getMeasures() {
    this.$log.debug('INSIDE getMeasures');
    var self = this;
    this.$log.debug(this.srcDir.cwd());
    this.$log.debug(this.srcDir.find('.', {matching: '*/measure.xml'}, 'relativePath'));
// use this.srcDir.read, or jetpack.read to get the file contents, then
// use parseString to output JSON
// put the resultant JSON into an accordian
// move to the next file, make another accordian, and populate it

    this.srcDir
      .findAsync('.', {matching: '*/measure.xml'})
      .then(function (measures) {
        this.$log.debug('Async result', measures);
        this._.each(measures, function (measure) {
          console.log('hello');
          self.$log.debug(measure);
        });
      }, function (msg) {
        this.$log.debug('FAILED', msg);
      });
  }
}
