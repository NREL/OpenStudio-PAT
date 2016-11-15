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

    // assign measures by type
    vm.libMeasures = {
      my: [],
      local: [],
      bcl: []
    };

    vm.BCLCategories = [];
    vm.getCategories().then((categories) => {
      vm.BCLCategories = categories;
    });

    // retrieve BCL measures once per app session
    vm.onlineBCLcheck = false;

    // set project
    if (vm.Project.getProjectName() != null){
      vm.resetProjectVariables();
    }

  }

  // reset variables when a different project is set
  resetProjectVariables() {
    const vm = this;
    // initialize Project measures (with arguments and options) from Project service
    vm.projectMeasures = vm.Project.getMeasuresAndOptions();
    vm.$log.debug('BCL SERVICE Project MEASURES RETRIEVED: ', vm.projectMeasures);

    vm.getBCLMeasures().then( () => {
      vm.checkForUpdatesLocalBcl();
      vm.$log.debug('BCL SERVICE CONSTRUCTOR.  LIBMEASURES: ', vm.libMeasures);
    });
  }

  // returns libMeasures variable (and check for Updates too)
  getMeasures() {
    const vm = this;

    const promise1 = vm.checkForUpdates();
    const promise2 = vm.checkForUpdatesLocalBcl();

    return vm.$q.all([promise1, promise2]).then(() => {

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
    vm.$log.debug('in BCLService checkForUpdates method');

    vm.MeasureManager.isReady().then( () => {
      vm.$log.debug('MEASURE MANAGER IS READY! Checking for Updates...');
      // the path doesn't work if the trailing slash isn't there!
      vm.MeasureManager.updateMeasures(vm.Project.getMeasureDir().path() + '/').then(updatedMeasures => {
        const newMeasures = [];
        // update MyMeasure Directory and rerun prepare measure
        _.forEach(updatedMeasures, (measure) => {
          measure = vm.prepareMeasure(measure, 'my');

          // is measure added to project?
          const projectMatch = _.find(vm.projectMeasures, {uid: measure.uid});

          if (angular.isDefined(projectMatch)) {
            // compare version_id and date:

            // vm.$log.debug('project match: ', project_match);
            // vm.$log.debug('measure: ', measure);
            // vm.$log.debug('version_ids: ', project_match.version_id, measure.version_id);

            // TODO: also compare date (match.version_modified > measure.version_modified)
            if (projectMatch.version_id != measure.version_id) {
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
    });
    return deferred.promise;

  }

  // Load / check for updates in local BCL folder
  checkForUpdatesLocalBcl() {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.$log.debug('in BCLService checkForUpdatesLocalBcl method');
    vm.MeasureManager.isReady().then( () => {
      vm.$log.debug('MEASURE MANAGER IS READY! Checking for Updates LocalBCL...');
      // the path doesn't work if the trailing slash isn't there!
      vm.MeasureManager.updateMeasures(vm.Project.getLocalBCLDir().path() + '/').then(updatedMeasures => {
        const newMeasures = [];
        vm.$log.debug('measureManager updates done');
        // update LocalBCL Directory and rerun prepare measure
        vm.$log.debug('CHECKING FOR UPDATES from ONLINE BCL...');
        _.forEach(updatedMeasures, (measure) => {
          measure = vm.prepareMeasure(measure, 'local');

          // measure update from BCL?
          const bclMatch = _.find(vm.libMeasures.bcl, {uid: measure.uid});
          vm.$log.debug('BCL MATCH: ', bclMatch);

          measure.bcl_update = false;
          let bclChangedDate = null;
          let localVersionModified = null;
          if (angular.isDefined(bclMatch)) {
            // for now compare the 'changed' date from the BCL search API to the version_modified from measureManager updateMeasure
            bclChangedDate = new Date(bclMatch.changed);
            localVersionModified = new Date(measure.version_modified + ' UTC');  // returned in UTC from measureManager
            if (bclChangedDate > localVersionModified) {
              // bcl update
              measure.bcl_update = true;
            }
          }

          // is measure added to project?
          const projectMatch = _.find(vm.projectMeasures, {uid: measure.uid});
          measure.status = '';
          // update from local to project or from bcl to local to project
          if (angular.isDefined(projectMatch)) {
            if (measure.bcl_update) {
              // update options:  online BCL to local BCL only, or to local BCL and project
              measure.status = 'update';
            } else if (projectMatch.version_id != measure.version_id){
              // update options: local BCL to project (no online BCL updates)
              measure.status = 'update';
            }
          }

          vm.$log.debug(`BCL update flag for measure: ${measure.name}: ${measure.bcl_update}`);
          if (angular.isDefined(bclMatch)) {
            vm.$log.debug(`BCL_changed: ${bclMatch.changed}, date: ${bclChangedDate}, local Version Modified: ${measure.version_modified}, date: ${localVersionModified}, version ID: ${measure.version_id}, bcl version ID: ${bclMatch.version_id}`);
          }
          vm.$log.debug(`regular update flag: ${measure.status}, local version_id: ${measure.version_id}`);
          if (angular.isDefined(projectMatch)) {
            vm.$log.debug(`project version_id: ${projectMatch.version_id}`);
          }

          // TEMPORARY:  measure manager may change name and display_name. Restore BCL names
          // const localMatch = _.find(vm.libMeasures.local, {uid: measure.uid});
          // if (angular.isDefined(localMatch)){
          //   measure.name = localMatch.name;
          //   measure.display_name = localMatch.display_name;
          // }

          newMeasures.push(measure);

        });

        vm.libMeasures.local = newMeasures;
        deferred.resolve();
        vm.$log.debug('NEW LOCAL BCL MEASURES DIR: ', vm.libMeasures.local);

      });

    });
    return deferred.promise;
  }

  // retrieve online BCL measures (or what's already been retrieved)
  getBCLMeasures(force = false) {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.$log.debug('in BCLService geBCLMeasures function');

    if (force || vm.onlineBCLcheck === false) {
      vm.$log.debug('RETRIEVING online BCL measures');
      vm.libMeasures.bcl = [];
      vm.loadOnlineBCLMeasures().then(measures => {
        vm.$log.debug('loaded online BCL measures');
        vm.libMeasures.bcl = measures;
        //vm.$log.debug('BCL measures: ', vm.libMeasures.bcl);
        vm.onlineBCLcheck = true;
        deferred.resolve(measures);
      }, response => {
        vm.$log.debug('ERROR retrieving BCL online measures');
        deferred.reject(response);
      });
    } else {
      // bclMeasures array is already loaded
      //vm.$log.debug('BCL measures: ', vm.libMeasures.bcl);
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
      changed: _.result(input, 'measure.changed'),
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
    measure.bcl_update = false;
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
    const url = vm.bclUrl + 'component/download?uids=' + measure.uid;

    vm.$http.get(url, {responseType: 'arraybuffer'}).then(response => {
      //extract dir and save to disk in local measures directory
      // convert arraybuffer to node buffer
      const buf = new Buffer(new Uint8Array(response.data));
      const zip = new vm.AdmZip(buf);
      // extract to location (and overwrite)
      // TODO: verify that this does in fact overwrite and not error out
      zip.extractAllTo(vm.Project.getLocalBCLDir().path() + '/', true);

      vm.$log.debug('DOWNLOADED measure name: ', measure.name);
      vm.$log.debug('DOWNLOADED measure display_name: ', measure.display_name);
      vm.$log.debug('DOWNLOADED measure path: ', vm.Project.getLocalBCLDir().path(measure.display_name));

      // use computeArguments to add to localMeasures array
      // vm.$log.debug('new measure before compute args: ', measure);

      // get path of newly downloaded measure from online BCL name (measureManager may change the name and the path will not be found)
      let originalName = measure.name;
      const bclMatch = _.find(vm.libMeasures.bcl, {uid: measure.uid});
      if (bclMatch) {
        originalName = bclMatch.name;
      }

      vm.MeasureManager.computeArguments(vm.Project.getLocalBCLDir().path(originalName)).then( (newMeasure) => {
        vm.$log.debug('new measure after compute args', newMeasure);
        newMeasure = vm.prepareMeasure(newMeasure, 'local');

        // measureManager recomputes name and display name, restore BCL original names:
        // newMeasure.name = measure.name;
        // newMeasure.display_name = measure.display_name;

        vm.$log.debug('new measure after prepare and restore names: ', newMeasure);

        // add or merge
        const libMatch = _.find(vm.libMeasures.local, {uid: newMeasure.uid});
        if (libMatch) {
          // TODO: verify this
          _.merge(libMatch, newMeasure);
          libMatch.bcl_update = false;
        } else {
          vm.libMeasures.local.push(newMeasure);
        }

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
  getCategories() {
    const vm = this;
    const deferred = vm.$q.defer();
    const categories = [];
    vm.$http.get(vm.bclUrl + 'taxonomy/measure.json').then(response => {
      if (response.data.term) {
        // 3 possible levels of nesting
        _.forEach(response.data.term, term => {
          const cat1 = _.pick(term, ['name', 'tid']);
          cat1.checked = false;
          const cat1Terms = [];
          _.forEach(term.term, term2 => {
            const cat2 = _.pick(term2, ['name', 'tid']);
            cat2.checked = false;
            const cat2Terms = [];
            _.forEach(term2.term, term3 => {
              const cat3 = _.pick(term3, ['name', 'tid']);
              cat3.checked = false;
              cat2Terms.push(cat3);
            });
            cat2.children = cat2Terms;
            cat1Terms.push(cat2);
          });
          cat1.children = cat1Terms;
          categories.push(cat1);
        });

        vm.$log.debug('Categories: ', categories);

      }

      deferred.resolve(categories);

    }, response => {
      vm.$log.debug('ERROR retrieving BCL categories');
      deferred.reject(response);
    });

    return deferred.promise;

  }

  getBCLCategories() {
    const vm = this;
    return vm.BCLCategories;
  }


  // OPEN BCL LIBRARY MODAL
  // TODO: update is not necessary: we always check for updates (remove update variable)
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
