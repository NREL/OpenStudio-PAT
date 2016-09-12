import jetpack from 'fs-jetpack';
import { parseString } from 'xml2js';
import AdmZip from 'adm-zip';

export class BCL {
  constructor($q, $http, $uibModal, $log, Project, MeasureManager) {
    'ngInject';

    const vm = this;
    vm.$http = $http;
    vm.$uibModal = $uibModal;
    vm.$q = $q;
    vm.$log = $log;
    vm.Project = Project;
    vm.MeasureManager = MeasureManager;
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
      bcl: []
    };

    // initialize Project measures (with arguments and options) from Project service
    vm.projectMeasures = vm.Project.getMeasuresAndOptions();
    vm.$log.debug('BCL SERVICE Project MEASURES RETRIEVED: ', vm.projectMeasures);

    vm.getBCLMeasures();

    vm.checkForUpdates();
    vm.checkForUpdatesLocalBcl();

    // TODO: CHECK FOR UPDATES ONLINE BCL

  }

  // returns libMeasures variable (and check for Updates too)
  getMeasures() {
    const vm = this;
    // const deferred = vm.$q.defer();
    // vm.checkForUpdates().then(() => {
    //   vm.checkForUpdatesLocalBcl().then(() => {
    //     deferred.resolve(vm.libMeasures);
    //   });
    // });
    // return deferred.promise;

    const promise1 = vm.checkForUpdates();
    const promise2 = vm.checkForUpdatesLocalBcl();

    return vm.$q.all([promise1, promise2]).then(() => {

      vm.$log.debug('HEY!!', vm.libMeasures);
      return vm.libMeasures;
    });
   }

  // returns libMeasures variable without checking updates
  getMeasuresNoUpdates() {
    const vm = this;
    return vm.libMeasures;
  }

  // check for updates in MyMeasures via MeasureManager
  checkForUpdates() {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.$log.debug("in BCLService checkForUpdates method");

    // the path doesn't work if the trailing slash isn't there!
    vm.MeasureManager.updateMeasures(vm.myMeasuresDir.path() + '/').then(updatedMeasures => {
      const newMeasures = [];
      // update MyMeasure Directory and rerun prepare measure
      _.forEach(updatedMeasures, (measure) => {
        measure = vm.prepareMeasure(measure, 'my');

        // is measure added to project?
        const project_match = _.find(vm.projectMeasures, {uid: measure.uid});

        if (angular.isDefined(project_match)) {
          // compare version_id and date:

          // vm.$log.debug('project match: ', project_match);
          // vm.$log.debug('measure: ', measure);
          // vm.$log.debug('version_ids: ', project_match.version_id, measure.version_id);

          // TODO: also compare date (match.version_modified > measure.version_modified)
          if (project_match.version_id != measure.version_id) {
            // set status flag
            measure.status = 'update';
          } else {
            measure.status = '';
          }
        }

        newMeasures.push(measure);

      });
      // overwrite myMeasures (to delete removed measures)
      vm.libMeasures.my = newMeasures;
      deferred.resolve();

      vm.$log.debug('NEW MY MEASURES DIR: ', vm.libMeasures.my);
    });
    return deferred.promise;
  }

  // Load / check for updates in local BCL folder
  checkForUpdatesLocalBcl(){
    const vm = this;
    const deferred = vm.$q.defer();
    // the path doesn't work if the trailing slash isn't there!
    vm.MeasureManager.updateMeasures(vm.localDir.path() + '/').then(updatedMeasures => {
      const newMeasures = [];
      // update LocalBCL Directory and rerun prepare measure
      _.forEach(updatedMeasures, (measure) => {
        measure = vm.prepareMeasure(measure, 'local');

        // is measure added to project?
        const project_match = _.find(vm.projectMeasures, {uid: measure.uid});
        if (angular.isDefined(project_match)) {
         // TODO: do this
        }

       newMeasures.push(measure);

      });
      // overwrite myMeasures (to delete removed measures)
      vm.libMeasures.local = newMeasures;
      deferred.resolve();

      vm.$log.debug('NEW LOCAL BCL MEASURES DIR: ', vm.libMeasures.local);

    });
    return deferred.promise;
  }

  // // get local measures
  // // TODO: deprecate
  // getLocalMeasures() {
  //   const vm = this;
  //
  //   // assign measures by type
  //   vm.libMeasures.my = vm.getMeasuresByType(vm.myMeasuresDir, 'my');
  //   vm.libMeasures.local = vm.getMeasuresByType(vm.localDir, 'local');
  // }

  // retrieve measures by type (local, my)
  // TODO: deprecate this once checkForUpdates works
  // getMeasuresByType(path, type) {
  //   const vm = this;
  //   let measurePaths = [];
  //   const measures = [];
  //   if (vm.jetpack.exists(path.cwd())) measurePaths = path.find('.', {matching: '*/measure.xml'}, 'relativePath');
  //   else vm.$log.error('The (%s) Measures directory (%s) does not exist', type, path.cwd());
  //
  //   _.forEach(measurePaths, measurePath => {
  //
  //     const xml = path.read(measurePath);
  //     let measure = vm.parseMeasure(xml);
  //     measure.measureDir = path.path(measurePath, '..');
  //     //measure.measureDir = path.path(measurePath.path('..'));
  //     //vm.$log.debug(`measure.measureDir: ${measure.measureDir}`);
  //     measure = vm.prepareMeasure(measure, type);
  //     measures.push(measure);
  //
  //   });
  //
  //   return measures;
  // }

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
      vm.$log.debug('BCL measures: ', vm.libMeasures.bcl);
      deferred.resolve(vm.libMeasures.bcl);
    }
    return deferred.promise;
  }

  // get online BCL measures function.
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

  // For online BCL only
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
          display_name: _.result(choice, 'display_name')
        };
      });

      measureArguments[i] = {
        name: argument.name,
        display_name: argument.display_name ? argument.display_name : argument.name,
        short_name: _.result(argument, 'short_name'),
        description: _.result(argument, 'description'),
        type: argument.type,
        required: argument.required,
        model_dependent: _.result(argument, 'model_dependent', 'false'),
        default_value: _.result(argument, 'default_value'),
        choices: choices,
        min_value: _.result(argument, 'min_value'),
        max_value: _.result(argument, 'max_value')
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
        software_program: _.result(file, 'version.software_program', null),
        identifier: _.result(file, 'version.identifier', null),
        min_compatible: _.result(file, 'version.min_compatible', null),
        max_compatible: _.result(file, 'version.max_compatible', null)
      };

      files[i] = {
        filename: file.filename,
        filetype: file.filetype,
        usage_type: _.result(file, 'usage_type', null),
        checksum: file.checksum,
        version: version
      };
    });
    measure = {
      schema_version: _.result(input, 'measure.schema_version'),
      name: _.result(input, 'measure.name'),
      uid: input.measure.uid ? _.result(input, 'measure.uid') : _.result(input, 'measure.uuid'),
      //versiond: input.measure.version_id ? _.result(input, 'measure.version_id') : _.result(input, 'measure.vuuid'),
      version_id: input.measure.version_id ? _.result(input, 'measure.version_id') : _.result(input, 'measure.vuuid'),
      version_modified: _.result(input, 'measure.version_modified'),
      xml_checksum: _.result(input, 'measure.xml_checksum'),
      class_name: _.result(input, 'measure.class_name'),
      //displayName: (input.measure.display_name && input.measure.display_name != '') ? input.measure.display_name : input.measure.name,
      display_name: (input.measure.display_name && input.measure.display_name != '') ? input.measure.display_name : input.measure.name,
      short_name: _.result(input, 'measure.short_name'),
      description: _.result(input, 'measure.description'),
      modeler_description: _.result(input, 'measure.modeler_description'),
      arguments: measureArguments,
      provenances: provenances,
      tags: _.result(input, 'measure.tags.tag', ''),
      attributes: attributes,
      files: files
    };

    // for old measures
    if (measure.display_name == undefined) measure.display_name = measure.name;

    // fix tags
    measure.tags = _.join(_.split(measure.tags, '.'), ' -> ');

    return measure;
  }

  // add additional fields for display
  prepareMeasure(measure, type) {
    const vm = this;
    // add fields for display
    measure.edit = '';
    measure.status = '';
    // TODO: if type shows up as 'Project', means there's an error? (measure is missing from local or my measures dirs)
    measure.location = (type == 'project') ? vm.findMeasureOrigin(measure.uid) : type;
    measure.add = '';

    // measure accordion
    measure.open = false;
    // is measure added to project?
    measure.addedToProject = !!angular.isDefined(_.find(vm.projectMeasures, {uid: measure.uid}));

    // measure.addedToProject = (type == 'project' || !_.isUndefined(_.find(vm.projectMeasures, {uid: measure.uid})));

    if (measure.version_modified) {
      // assuming yyyy-mm-dd
      measure.date = new Date(measure.version_modified.substring(0, 4), measure.version_modified.substring(5, 7), measure.version_modified.substring(8, 10));

    } else {
      measure.date = '';
    }

    if (measure.provenances && measure.provenances.count > 0) {
      measure.author = measure.provenances[0].provenance.author;
    } else {
      measure.author = '';
    }

    // fix tags to be a string (measure manager returns it as an array)
    if (_.isArray(measure.tags))
      measure.tags = measure.tags[0];

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

      // use computeArguments to add to localMeasures array
      vm.MeasureManager.computeArguments(vm.localDir.path(measure.display_name)).then( (newMeasure) => {
         newMeasure = vm.prepareMeasure(newMeasure, 'local');
        vm.libMeasures.local.push(newMeasure);
        deferred.resolve(newMeasure);
      }, () => {
        // failure
        //vm.$log.debug('Measure Manager computeArguments failed');
        deferred.reject();
      });

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
  // TODO: update is not necessary: we always check for updates
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
