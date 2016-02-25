import { parseString } from 'xml2js';

export class BCL {
  constructor($q, $http, $uibModal, $log) {
    'ngInject';

    const vm = this;
    vm.service = {};
    vm.$http = $http;
    vm.$uibModal = $uibModal;
    vm.$q = $q;
    vm.$log = $log;
    vm.bcl_measures = [];
    vm.bcl_url = 'https://bcl.nrel.gov/api/';

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

  // GET ALL MEASURES
  // TODO: don't call this directly from modal controller!
  getMeasureMetadata() {
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
        vm.$log.debug('RESPONSE: ', response);
        // parse response
        _.each(response.data.result, function(input) {
          let measure = vm.parseMeasure(input);
          measure = vm.prepareMeasure(measure, 'BCL');
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
       vm.$log.debug('measures array: ', measures_arrays);
        _.each(measures_arrays, function(measures) {
          vm.bcl_measures = _.concat(vm.bcl_measures, measures);

        });
       deferred.resolve(vm.bcl_measures);

     }, function(response) {
       vm.$log.debug('ERROR retrieving BCL online measures!');
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

    vm.$log.debug('parsed XML: ', input);

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
      uid: _.result(input, 'measure.uid'),
      versionId: _.result(input, 'measure.version_id'),
      versionModified: _.result(input, 'measure.version_modified'),
      xmlChecksum: _.result(input, 'measure.xml_checksum'),
      className: _.result(input, 'measure.class_name'),
      displayName: _.result(input, 'measure.display_name'),
      shortName: _.result(input, 'measure.short_name'),
      description: _.result(input, 'measure.description'),
      modelerDescription: _.result(input, 'measure.modeler_description'),
      arguments: measureArguments,
      provenances: provenances,
      tags: _.result(input, 'measure.tags.tag[0]', ''),
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
    measure.location = (type == 'project') ? vm.findMeasureOrigin(measure.uid) : _.capitalize(type);
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
      return 'My';
    } else if (vm.lib_measures && _.find(vm.lib_measures.local, {uid: id})) {
      return 'Local';
    } else {
      return 'Project';
    }
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
