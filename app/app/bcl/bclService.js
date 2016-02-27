import * as jetpack from 'fs-jetpack';
import * as path from 'path';
import * as os from 'os';
import { parseString } from 'xml2js';
import * as admzip from 'adm-zip';

export class BCL {
  constructor($q, $http, $uibModal, $log) {
    'ngInject';

    const vm = this;
    vm.service = {};
    vm.$http = $http;
    vm.$uibModal = $uibModal;
    vm.$q = $q;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.admzip = admzip;
    vm.bcl_measures = [];
    vm.bcl_url = 'https://bcl.nrel.gov/api/';

    // TODO: fix dirs (get from Electron settings)
    vm.my_measures_dir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));
    vm.local_dir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/LocalBCL'));
    vm.project_dir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/PAT/the_project'));

    // TODO: get project measures from a service
    // load project_measures before other measures
    vm.project_measures = vm.getMeasuresByType(vm.project_dir, 'project');
    vm.$log.debug('PROJECT measures: ', vm._project_measures);

    // assign measures by type
    vm.lib_measures = {'my': [], 'local': [], 'bcl': [], 'project': []};

  }

  // DOWNLOAD COMPONENT BY UID
  download(uids) {
    const vm = this;
    return vm.$http.get(vm.bcl_url + 'component/download/', {
      params: {uids: uids},
      responseType: 'arraybuffer'
    });
  }

  // GET ALL MEASURE CATEGORIES
  // TODO: SHOULD PROBABLY MOVE THAT TO MAIN ROUTING WITH PROMISES (LIKE CONSTRUCTIONS IN CBECC-COM)
  getCategories() {
    const vm = this;
    //return vm.$http.get('http://bcl7.development.nrel.gov/api/taxonomy/measure.json');
    return vm.$http.get(vm.bcl_url + 'taxonomy/measure.json');
  }

  // returns lib_measures variable
  getMeasures() {
    const vm = this;
    return vm.lib_measures;
  }

  // get local measures
  getLocalMeasures() {
    const vm = this;

    // assign measures by type
    vm.lib_measures.my = vm.getMeasuresByType(vm.my_measures_dir, 'my');
    vm.lib_measures.local = vm.getMeasuresByType(vm.local_dir, 'local');
    vm.lib_measures.project = vm.getMeasuresByType(vm.project_dir, 'project');

  }

  // retrieve measures by type
  getMeasuresByType(path, type) {
    const vm = this;
    let measurePaths = [];
    const measures = [];
    if (vm.jetpack.exists(path.cwd())) measurePaths = path.find('.', {matching: '*/measure.xml'}, 'relativePath');
    else vm.$log.debug.error('The (%s) Measures directory (%s) does not exist', type, path.cwd());

    _.each(measurePaths, measurePath => {

      const xml = path.read(measurePath);
      let measure = vm.parseMeasure(xml);
      measure = vm.prepareMeasure(measure, type);
      measures.push(measure);

    });

    return measures;
  }

  // retrieve online BCL measures (or what's already been retrieved)
  getBCLMeasures(force = false) {
    const vm = this;
    const deferred = vm.$q.defer();

    if (force || _.isEmpty(vm.lib_measures.bcl)) {
      vm.lib_measures.bcl = [];
      vm.loadOnlineBCLMeasures().then(function(measures) {
        deferred.resolve(measures);
      }, function (response) {
        vm.$log.debug('ERROR retrieving BCL online measures');
        deferred.reject(response);
      });
    } else {
      // bcl_measures array is already loaded
      deferred.resolve(vm.lib_measures.bcl);
    }
    return deferred.promise;

  }

  // "private" function.
  loadOnlineBCLMeasures() {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.bcl_measures = [];
    const num_results = 100;
    const promises = [];
    const num_pages = 2; // TODO: use metadata URL to find out how many pages to retrieve
    const base_url = vm.bcl_url + 'search/?fq[]=bundle:nrel_measure&api_version=2&show_rows=' + num_results;
    let url = '';

    for (let page = 0; page < num_pages; page++) {
      url = base_url + '&page=' + page;
      const promise = vm.$http.get(url).then(function (response) {
        const measures = [];
        //vm.$log.debug('RESPONSE: ', response);
        // parse response
        _.each(response.data.result, function(input) {
          let measure = vm.parseMeasure(input);
          measure = vm.prepareMeasure(measure, 'bcl');
          measures.push(measure);
        });
       return measures;

      }, function (error) {
        vm.$log.debug('ERROR:');
        vm.$log.debug(error);
      });
      promises.push(promise);
    }
     vm.$q.all(promises).then(function(measures_arrays) {
        _.each(measures_arrays, function(measures) {
          vm.bcl_measures = _.concat(vm.bcl_measures, measures);

        });
       deferred.resolve(vm.bcl_measures);

     }, function(response) {
       vm.$log.debug('ERROR retrieving BCL online measures');
       deferred.reject(response);
     });
    return deferred.promise;

  }

  parseMeasure(input) {
    const vm = this;

    let measure = {};

    // only parse if input is a string. input may already be parsed (BCL API response)
    if (_.isString(input)) {
      parseString(input, {explicitArray : false}, (err, result) => {
        if (!_.isNull(err)) {
          vm.$log.error('Error parsing XML: ', err);
        }
        input = result;
      });
    }

    //vm.$log.debug('parsed XML: ', input);
    const measureArguments = _.result(input, 'measure.arguments.argument', []);
    _.each(measureArguments, (argument, i) => {

      const choices = _.result(argument, 'choices.choice', []);
      _.each(choices, (choice, i) => {
        choices[i] = {
          value: _.result(choice, 'value'),
          displayName: _.result(choice, 'display_name')
        };
      });

      measureArguments[i] = {
        name: argument.name,
        displayName: argument.display_name ? argument.display_name : argument.name,
        shortName: _.result(argument, 'short_name'),
        description: _.result(argument, 'description'),
        type: argument.type,
        required: argument.required,
        modelDependent: _.result(argument, 'model_dependent', 'false'),
        defaultValue: _.result(argument, 'default_value'),
        choices: choices,
        minValue: _.result(argument, 'min_value'),
        maxValue: _.result(argument, 'max_value')
      };
    });

    // TODO: add outputs (right after arguments)

    const provenances = _.result(input, 'measures.provenances', []);
    _.each(provenances, (prov, i) => {
      provenances[i] = {
        author: prov.author,
        datetime: prov.datetime,
        comment: prov.comment
      };
    });

    const attributes = _.result(input, 'measure.attributes.attribute', []);
    _.each(attributes, (attribute, i) => {
      attributes[i] = {
        name: attribute.name,
        value: attribute.value,
        datatype: attribute.datatype
      };
    });

    const files = _.result(input, 'measure.files.file', []);
    _.each(files, (file, i) => {

      const version = {
        softwareProgram: _.result(file, 'version.software_program', null),
        identifier: _.result(file, 'version.identifier', null),
        minCompatible: _.result(file, 'version.min_compatible', null),
        maxCompatible: _.result(file, 'version.max_compatible', null)
      };

      files[i] = {
        filename: file.filename,
        filetype: file.filetype,
        usageType: _.result(file, 'usage_type', null),
        checksum: file.checksum,
        version: version
      };
    });
    measure = {
      schemaVersion: _.result(input, 'measure.schema_version'),
      name: _.result(input, 'measure.name'),
      uid: input.measure.uid ? _.result(input, 'measure.uid') : _.result(input, 'measure.uuid'),
      versionId: input.measure.version_id ? _.result(input, 'measure.version_id') : _.result(input, 'measure.vuuid'),
      versionModified: _.result(input, 'measure.version_modified'),
      xmlChecksum: _.result(input, 'measure.xml_checksum'),
      className: _.result(input, 'measure.class_name'),
      displayName: _.result(input, 'measure.display_name'),
      shortName: _.result(input, 'measure.short_name'),
      description: _.result(input, 'measure.description'),
      modelerDescription: _.result(input, 'measure.modeler_description'),
      arguments: measureArguments,
      provenances: provenances,
      tags: _.result(input, 'measure.tags.tag', ''),
      attributes: attributes,
      files: files
    };

    // for old measures
    if (measure.displayName == undefined) measure.displayName = measure.name;

    // fix tags
    measure.tags = _.join(_.split(measure.tags, '.'), ' -> ');

    return measure;
  }

  // add additional fields for display
  prepareMeasure(measure, type) {
    const vm = this;
    // add fields for display
    measure.status = '';
    // TODO: if type shows up as 'Project', means there's an error? (measure is missing from local or my measures dirs)
    measure.location = (type == 'project') ?vm.findMeasureOrigin(measure.uid) : type;
    measure.add = '';

    // is measure added to project?
    measure.addedToProject = (type == 'project' || _.find(vm.project_measures, {uid: measure.uid}));

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

  // find where project measure came from
  findMeasureOrigin(id) {
    const vm = this;
    if(vm.lib_measures && _.find(vm.lib_measures.my, {uid: id})) {
      return 'my';
    } else if (vm.lib_measures && _.find(vm.lib_measures.local, {uid: id})) {
      return 'local';
    } else {
      return 'project';
    }
  }

  // download measure
  downloadMeasure(measure) {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.measure = measure;

    const url = vm.bcl_url + 'component/download?uids=' + vm.measure.uid;

    vm.$http.get(url, {responseType: 'arraybuffer'}).then(function (response) {
      //extract dir and save to disk in local measures directory
      // convert arraybuffer to node buffer
      let buf = new Buffer( new Uint8Array(response.data) );
      let zip = new vm.admzip(buf);
      // extract to location (and overwrite)
      zip.extractAllTo(vm.local_dir.path() + '/', true);

      const new_path = vm.local_dir.path() + '/' + vm.measure.name + '/measure.xml';
      vm.$log.debug(new_path);

      // parse new measure and add to local measures
      let new_measure = {};
      if (vm.jetpack.exists(new_path)) {
        const xml = vm.jetpack.read(new_path);
        new_measure = vm.parseMeasure(xml);
        new_measure = vm.prepareMeasure(new_measure, 'local');
        vm.lib_measures.local.push(new_measure);
        deferred.resolve(new_measure);
      }
      else {
        vm.$log.debug.error('The Measure directory (%s) does not exist', new_path);
        deferred.reject();
      }
    }, function (response) {
      vm.$log.debug('ERROR downloading BCL measure');
      deferred.reject(response);
    });

    return deferred.promise;
  }

  // OPEN BCL LIBRARY MODAL
  openBCLModal() {
    const vm = this;
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalBclController',
      controllerAs: 'modal',
      templateUrl: 'app/bcl/bcl.html',
      windowClass: 'wide-modal'
    });

    return modalInstance.result;
  }

}
