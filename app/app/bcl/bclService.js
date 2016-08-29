import jetpack from 'fs-jetpack';
import { parseString } from 'xml2js';
import AdmZip from 'adm-zip';

export class BCL {
  constructor($q, $http, $uibModal, $log, Project) {
    'ngInject';

    const vm = this;
    vm.$http = $http;
    vm.$uibModal = $uibModal;
    vm.$q = $q;
    vm.$log = $log;
    vm.Project = Project;
    vm.jetpack = jetpack;
    vm.AdmZip = AdmZip;
    vm.bclMeasures = [];
    vm.bclUrl = 'https://bcl.nrel.gov/api/';

    vm.myMeasuresDir = vm.Project.getMeasureDir();
    vm.localDir = vm.Project.getLocalBCLDir();
    vm.projectDir = vm.Project.getProjectMeasuresDir();

    // assign measures by type
    vm.libMeasures = {
      my: [],
      local: [],
      bcl: [],
      project: []
    };

    // initialize measures
    vm.getLocalMeasures();
    // initialize Project measures (with arguments and options) from Project service
    vm.libMeasures.project = vm.Project.getMeasuresAndOptions();
    vm.$log.debug('BCL SERVICE MEASURES RETRIEVED: ', vm.libMeasures.project);
    vm.getBCLMeasures();
  }

  // TODO: is this one needed?  Shouldn't we go through the Project service instead?
  //setProjectMeasures(measures) {
  //  const vm = this;
  //  vm.libMeasures.project = measures;
  //}

  // TODO: is this needed?
  getProjectMeasures() {
    const vm = this;
    return vm.libMeasures.project;
  }

  addProjectMeasure(measure) {
    const vm = this;
    vm.libMeasures.project.push(measure);
  }

  // returns libMeasures variable
  getMeasures() {
    const vm = this;
    return vm.libMeasures;
  }

  // get local measures
  getLocalMeasures() {
    const vm = this;

    // assign measures by type
    vm.libMeasures.my = vm.getMeasuresByType(vm.myMeasuresDir, 'my');
    vm.libMeasures.local = vm.getMeasuresByType(vm.localDir, 'local');
  }

  // retrieve measures by type (local, my)
  getMeasuresByType(path, type) {
    const vm = this;
    let measurePaths = [];
    const measures = [];
    if (vm.jetpack.exists(path.cwd())) measurePaths = path.find('.', {matching: '*/measure.xml'}, 'relativePath');
    else vm.$log.error('The (%s) Measures directory (%s) does not exist', type, path.cwd());

    _.forEach(measurePaths, measurePath => {

      const xml = path.read(measurePath);
      let measure = vm.parseMeasure(xml);
      measure.measureDir = path.path(measurePath,'..');
      //measure.measureDir = path.path(measurePath.path('..'));
      //vm.$log.debug(`measure.measureDir: ${measure.measureDir}`);
      measure = vm.prepareMeasure(measure, type);
      measures.push(measure);

    });

    return measures;
  }

  // retrieve online BCL measures (or what's already been retrieved)
  getBCLMeasures(force = false) {
    const vm = this;
    const deferred = vm.$q.defer();

    if (force || _.isEmpty(vm.libMeasures.bcl)) {
      vm.libMeasures.bcl = [];
      vm.loadOnlineBCLMeasures().then(measures => {
        vm.libMeasures.bcl = measures;
        deferred.resolve(measures);
      }, response => {
        vm.$log.debug('ERROR retrieving BCL online measures');
        deferred.reject(response);
      });
    } else {
      // bclMeasures array is already loaded
      deferred.resolve(vm.libMeasures.bcl);
    }
    return deferred.promise;

  }

  // "private" function.
  loadOnlineBCLMeasures() {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.bclMeasures = [];
    const numResults = 100;
    const promises = [];
    const numPages = 2; // TODO: use metadata URL to find out how many pages to retrieve
    const baseUrl = vm.bclUrl + 'search/?fq[]=bundle:nrel_measure&api_version=2&show_rows=' + numResults;
    let url = '';

    for (let page = 0; page < numPages; page++) {
      url = baseUrl + '&page=' + page;
      const promise = vm.$http.get(url).then(response => {
        const measures = [];
        //vm.$log.debug('RESPONSE: ', response);
        // parse response
        _.forEach(response.data.result, input => {
          let measure = vm.parseMeasure(input);
          measure = vm.prepareMeasure(measure, 'bcl');
          measures.push(measure);
        });
        return measures;

      }, error => {
        vm.$log.debug('ERROR:');
        vm.$log.debug(error);
      });
      promises.push(promise);
    }
    vm.$q.all(promises).then(measuresArrays => {
      _.forEach(measuresArrays, measures => {
        vm.bclMeasures = _.concat(vm.bclMeasures, measures);
      });
      deferred.resolve(vm.bclMeasures);

    }, response => {
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
      parseString(input, {explicitArray: false}, (err, result) => {
        if (!_.isNull(err)) {
          vm.$log.error('Error parsing XML: ', err);
        }
        input = result;
      });
    }

    //vm.$log.debug('parsed XML: ', input);
    const measureArguments = _.result(input, 'measure.arguments.argument', []);
    _.forEach(measureArguments, (argument, i) => {

      const choices = _.result(argument, 'choices.choice', []);
      _.forEach(choices, (choice, i) => {
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
    _.forEach(provenances, (prov, i) => {
      provenances[i] = {
        author: prov.author,
        datetime: prov.datetime,
        comment: prov.comment
      };
    });

    const attributes = _.result(input, 'measure.attributes.attribute', []);
    _.forEach(attributes, (attribute, i) => {
      attributes[i] = {
        name: attribute.name,
        value: attribute.value,
        datatype: attribute.datatype
      };
    });

    const files = _.result(input, 'measure.files.file', []);
    _.forEach(files, (file, i) => {

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
      displayName: (input.measure.display_name && input.measure.display_name != '') ? input.measure.display_name : input.measure.name,
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
    measure.location = (type == 'project') ? vm.findMeasureOrigin(measure.uid) : type;
    measure.add = '';

    // measure accordion
    measure.open = false;
    // is measure added to project?
    measure.addedToProject = (type == 'project' || _.find(vm.libMeasures.project, {uid: measure.uid}));

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

    _.forEach(measure.attributes, attr => {
      if (attr.name == 'Measure Type') {
        measure.type = attr.value;
      }
    });
    return measure;
  }

  // find where project measure came from
  findMeasureOrigin(id) {
    const vm = this;
    if (vm.libMeasures && _.find(vm.libMeasures.my, {uid: id})) {
      return 'my';
    } else if (vm.libMeasures && _.find(vm.libMeasures.local, {uid: id})) {
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

    const url = vm.bclUrl + 'component/download?uids=' + vm.measure.uid;

    vm.$http.get(url, {responseType: 'arraybuffer'}).then(response => {
      //extract dir and save to disk in local measures directory
      // convert arraybuffer to node buffer
      const buf = new Buffer(new Uint8Array(response.data));
      const zip = new vm.AdmZip(buf);
      // extract to location (and overwrite)
      zip.extractAllTo(vm.localDir.path() + '/', true);

      const newPath = vm.localDir.path() + '/' + vm.measure.name + '/measure.xml';
      vm.$log.debug(newPath);

      // parse new measure and add to local measures
      let newMeasure = {};
      if (vm.jetpack.exists(newPath)) {
        const xml = vm.jetpack.read(newPath);
        newMeasure = vm.parseMeasure(xml);
        newMeasure = vm.prepareMeasure(newMeasure, 'local');
        vm.libMeasures.local.push(newMeasure);
        deferred.resolve(newMeasure);
      }
      else {
        vm.$log.debug.error('The Measure directory (%s) does not exist', newPath);
        deferred.reject();
      }
    }, response => {
      vm.$log.debug('ERROR downloading BCL measure');
      deferred.reject(response);
    });

    return deferred.promise;
  }

  // DOWNLOAD COMPONENT BY UID
  download(uids) {
    const vm = this;
    return vm.$http.get(vm.bclUrl + 'component/download/', {
      params: {uids: uids},
      responseType: 'arraybuffer'
    });
  }

  // GET ALL MEASURE CATEGORIES
  // TODO: SHOULD PROBABLY MOVE THAT TO MAIN ROUTING WITH PROMISES (LIKE CONSTRUCTIONS IN CBECC-COM)
  getCategories() {
    const vm = this;
    //return vm.$http.get('http://bcl7.development.nrel.gov/api/taxonomy/measure.json');
    return vm.$http.get(vm.bclUrl + 'taxonomy/measure.json');
  }

  // OPEN BCL LIBRARY MODAL
  openBCLModal(types = [], filters = [], update = false) {
    const vm = this;
    const deferred = vm.$q.defer();
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalBclController',
      controllerAs: 'modal',
      templateUrl: 'app/bcl/bcl.html',
      windowClass: 'wide-modal',
      resolve: {
        params: function () {
          return {
            update: update,
            filters: filters,
            types: types
          };
        }
      }
    });

    modalInstance.result.then(() => {
      deferred.resolve();
    }, () => {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;

  }
}
