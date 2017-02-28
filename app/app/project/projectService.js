import jetpack from 'fs-jetpack';
import os from 'os';
import path from 'path';
import {remote} from 'electron';
import jsZip from 'jszip';
import fs from 'fs';
import archiver from 'archiver';

const {app, dialog} = remote;

export class Project {
  constructor($q, $log, $http, $uibModal, MeasureManager, $sce) {
    'ngInject';
    const vm = this;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.fs = fs;
    vm.jsZip = jsZip;
    vm.MeasureManager = MeasureManager;
    vm.dialog = dialog;
    vm.archiver = archiver;
    vm.$q = $q;
    vm.$http = $http;
    vm.$uibModal = $uibModal;
    vm.$sce = $sce;

    // ignore camelcase for this file
    /* eslint camelcase: 0 */

    vm.analysisTypes = ['Manual', 'Algorithmic'];

    vm.reportTypes = [{
      id: 'Calibration Report',
      name: 'reports.type.calibrationReport'
    }, {
      id: 'Radiance Report',
      name: 'reports.type.radianceReport'
    }, {
      id: 'Parallel Coordinates',
      name: 'reports.type.parallelCoordinates'
    }, {
      id: 'Radar Chart',
      name: 'reports.type.radarChart'
    }, {
      id: 'EDAPT Export',
      name: 'reports.type.edaptExport'
    }];

    vm.samplingMethods = vm.setSamplingMethods();
    vm.runTypes = vm.setRunTypes();
    vm.remoteTypes = vm.setRemoteTypes();
    vm.algorithmOptions = vm.setAlgorithmOptions();
    vm.resetRemoteSettings();
    vm.setOsServerVersions();
    vm.setServerInstanceTypes();
    vm.setWorkerInstanceTypes();
    vm.setAwsRegions();

    vm.clusters = [];
    vm.modified = false;
    vm.analysisType = null;
    vm.reportType = null;
    vm.runType = vm.runTypes[0];
    vm.samplingMethod = vm.samplingMethods[0];
    vm.rubyMD5 = null;
    vm.mongoMD5 = null;
    vm.openstudioServerMD5 = null;
    vm.openstudioCLIMD5 = null;
    vm.openstudioMD5 = null;
    vm.projectDir = null;  // this is a jetpack object (like all other *Dir variables)
    vm.projectLocalResultsDir = null;
    vm.projectClustersDir = null;
    vm.projectName = null;
    vm.mongoDir = null;
    vm.logsDir = null;
    vm.projectMeasuresDir = null;
    vm.seedDir = null;
    vm.weatherDir = null;
    vm.seeds = [];
    vm.defaultSeed = null;
    vm.weatherFiles = [];
    vm.defaultWeatherFile = null;
    vm.algorithmSettings = [];
    vm.measures = [];
    vm.designAlternatives = [];
    vm.filesToInclude = [];
    vm.setServerScripts();

    vm.analysisID = '';
    vm.datapoints = [];

    const src = jetpack.cwd(app.getPath('userData'));
    vm.railsDir = jetpack.dir(path.resolve(src.path() + '/openstudioServer/openstudio-server/server'));
    // aws path
    vm.awsDir = jetpack.dir(app.getPath('appData') + '/.aws');
    vm.$log.debug('.aws dir location: ', vm.awsDir.path());

    // set my measures dir
    vm.MeasureManager.isReady().then(() => {
      vm.MeasureManager.getMyMeasuresDir().then(response => {
        if (angular.isUndefined(response.my_measures_dir)) {
          vm.$log.error('response.my_measures_dir undefined');
        }
        if (response.my_measures_dir) {
          vm.setMeasuresDir(response.my_measures_dir);
        }
        vm.$log.debug('My measures Dir: ', vm.myMeasuresDir.path());
      }, error => {
        vm.$log.debug('Error in Measure Manager getMyMeasuresDir');
      });
    }, error => {
      vm.$log.debug('Error in Measure Manager isReady function ', error);
    });

    // json objects
    vm.pat = {};
    vm.osa = {};
  }

  setDefaults() {
    const vm = this;
    vm.seeds = [];
    vm.weatherFiles = [];
    vm.setSeeds();
    vm.setWeatherFiles();
    vm.defaultSeed = vm.seeds.length > 0 ? vm.seeds[0] : null;
    vm.defaultWeatherFile = vm.weatherFiles.length > 0 ? vm.weatherFiles[0] : null;
    vm.seedsDropdownArr = [];
    vm.weatherFilesDropdownArr = [];
    vm.setSeedsDropdownOptions();
    vm.setWeatherFilesDropdownOptions();
    vm.filesToInclude = [];
    vm.setServerScripts();

    vm.analysisType = 'Manual';
    vm.reportType = 'Calibration Report';
    vm.samplingMethod = vm.samplingMethods.length > 0 ? vm.samplingMethods[0] : null;
    vm.runType = vm.runTypes[0];
    vm.resetRemoteSettings();

    vm.algorithmSettings = [];
    vm.measures = [];
    vm.designAlternatives = [];
    vm.osa = {};

    vm.analysisID = '';
    vm.datapoints = [];

    // TODO: still need these?
    vm.rubyMD5 = '';
    vm.mongoMD5 = '';
    vm.openstudioServerMD5 = '';
    vm.openstudioCLIMD5 = '';
    vm.openstudioMD5 = '';

  }

  // import from pat.json
  // TODO: add check to ensure that the measures really are in the PAT project folder and haven't been deleted
  // TODO: if measure is in pat dir but not in json, ignore
  // TODO: if measure is in pat dir, not in json, and user tries to add it, overwrite existing measure in dir? (currently it doesn't overwrite)
  initializeProject() {
    const vm = this;
    vm.$log.debug('Project initializeProject');
    if (angular.isDefined(vm.projectName)) {
      const filename = vm.projectDir.path('pat.json');
      vm.$log.debug('filename: ', filename);
      // for new and existing projects
      vm.setDefaults();

      if (vm.jetpack.exists(filename)) {
        // existing project
        vm.pat = vm.jetpack.read(filename, 'json');
        vm.$log.debug('PAT.json: ', vm.pat);
        vm.$log.debug('filename: ', filename);

        vm.measures = vm.pat.measures;
        if (!angular.isDefined(vm.measures)) {
          vm.measures = [];
        }

        // recalculate measure_dir to point to this location (in case project moved/copied)
        _.forEach(vm.measures, (measure) => {
          const path_parts = _.split(measure.measure_dir, '/');
          measure.measure_dir = vm.projectDir.path('measures', _.last(path_parts));
          measure.directory = measure.measure_dir;
        });

        vm.$log.debug('InitializeProject-measures with updated dir paths: ', vm.measures);

        vm.designAlternatives = vm.pat.designAlternatives;
        if (!angular.isDefined(vm.designAlternatives)) {
          vm.designAlternatives = [];
        }

        vm.analysisType = vm.pat.analysis_type ? vm.pat.analysis_type : vm.analysisType;
        vm.samplingMethod = vm.pat.samplingMethod ? vm.pat.samplingMethod : vm.samplingMethod;
        vm.defaultSeed = vm.pat.seed ? vm.pat.seed : vm.defaultSeed;
        vm.defaultWeatherFile = vm.pat.weatherFile ? vm.pat.weatherFile : vm.defaultWeatherFile;
        vm.$log.debug('vm.algorithmSettings: ', vm.algorithmSettings);
        vm.$log.debug('vm.pat.algorithmSettings: ', vm.pat.algorithmSettings);
        vm.algorithmSettings = vm.pat.algorithmSettings ? vm.pat.algorithmSettings : vm.algorithmSettings;
        vm.rubyMD5 = vm.pat.rubyMD5 ? vm.pat.rubyMD5 : vm.rubyMD5;
        vm.mongoMD5 = vm.pat.mongoMD5 ? vm.pat.mongoMD5 : vm.mongoMD5;
        vm.openstudioServerMD5 = vm.pat.openstudioServerMD5 ? vm.pat.openstudioServerMD5 : vm.openstudioServerMD5;
        vm.openstudioCLIMD5 = vm.pat.openstudioCLIMD5 ? vm.pat.openstudioCLIMD5 : vm.openstudioCLIMD5;
        vm.openstudioMD5 = vm.pat.openstudioMD5 ? vm.pat.openstudioMD5 : vm.openstudioMD5;
        vm.analysisID = vm.pat.analysisID ? vm.pat.analysisID : vm.analysisID;
        vm.datapoints = vm.pat.datapoints ? vm.pat.datapoints : vm.datapoints;
        vm.remoteSettings = vm.pat.remoteSettings ? vm.pat.remoteSettings : vm.remoteSettings;
        vm.filesToInclude = vm.pat.filesToInclude ? vm.pat.filesToInclude : vm.filesToInclude;
        vm.serverScripts = vm.pat.serverScripts ? vm.pat.serverScripts : vm.serverScripts;
      }
    } else {
      vm.$log.error('No project selected...cannot initialize project');
    }

    vm.$log.debug("Server Scripts: ", vm.serverScripts);

  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  savePrettyOptions() {
    const vm = this;
    vm.$log.debug('Parse arguments and save Options hash to each measure');

    _.forEach(vm.measures, (measure) => {

      const options = [];
      // first find out how many options there are (from the optionDelete special argument)
      let optionKeys = [];
      if (!_.isNil(measure.arguments) && measure.arguments.length > 0) {
        const keys = Object.keys(measure.arguments[0]);
        optionKeys = _.filter(keys, function (k) {
          return k.indexOf('option_') !== -1;
        });
      }

      _.forEach(optionKeys, (key) => {

        const theOption = {};
        // option name and ID
        theOption.id = key;

        // set argument values
        theOption.arguments = [];
        _.forEach(measure.arguments, (argument) => {
          const theArg = {};
          if (argument.specialRowId == 'optionName') {
            theOption.name = argument[key];
          } else if (argument.specialRowId == 'optionDescription') {
            theOption.description = argument[key];
          }

          // get the row's value for key corresponding to the col's name
          // add to arguments array
          else if (!('specialRowId' in argument)) {
            if (key in argument) {
              theArg.name = argument.name;
              theArg.value = argument[key];
              theOption.arguments.push(theArg);
            } else {
              // check if argument is required
              if (argument.required) {
                // TODO: throw an error here: need a value for this argument in this option
                vm.$log.debug('ARG: ', argument.name, ' value left blank in option: ', theOption.name);
              }
            }
          }

        });
        options.push(theOption);
      });
      // save to measure
      measure.options = options;

    });

    vm.$log.debug('Measures with pretty options: ', vm.measures);

  }

  // computes all project measure arguments with selected seed
  // uses empty seed model otherwise
  computeAllMeasureArguments() {
    const vm = this;
    const deferred = vm.$q.defer();
    const promises = [];

    vm.$log.debug('in Project computeAllMeasureArguments()');
    let osmPath = (vm.defaultSeed == null) ? null : vm.seedDir.path(vm.defaultSeed);

    _.forEach(vm.measures, (measure) => {
      if (!_.isNil(measure.seed)) {
        vm.$log.debug(`computeAllMeasureArguments using unique seed for measure: ${measure}`);
      }
      // todo: ensure that this modifies the vm.measures directly
      const promise = vm.computeMeasureArguments(measure);
      promises.push(promise);
    });

    vm.$q.all(promises).then(response => {
      vm.$log.debug('ComputeAllMeasures resolved');
      deferred.resolve();
      vm.setModified(true);
    }, error => {
      vm.$log.debug('ERROR in ComputeAllMeasures: ', error);
      deferred.reject(error);
    });

    // recalculate pretty options (not unless we modify the actual options themselves
    //vm.savePrettyOptions();

    return deferred.promise;

  }

  computeMeasureArguments(measure) {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.$log.debug('in Project computeMeasureArguments()');
    let osmPath;
    if (_.isNil(vm.seedDir)) {
      vm.$log.error('vm.seedDir is undefined. Unable to compute measure arguments.');
      deferred.reject('vm.seedDir isNil');
      return deferred.promise;
    } else if (_.isNil(measure.seed)) {
      vm.$log.error('measure.seed is undefined. Unable to compute measure arguments.');
      deferred.reject('measure.seed isNil');
      return deferred.promise;
    } else {
      osmPath = vm.seedDir.path(measure.seed);
    }

    vm.MeasureManager.computeArguments(measure.measure_dir, osmPath).then((newMeasure) => {
      // merge with existing project measure
      vm.$log.debug('New computed measure: ', newMeasure);

      // remove arguments that no longer exist (by name) (in reverse) (except for special display args)
      _.forEachRight(measure.arguments, (arg, index) => {
        if (_.isUndefined(arg.specialRowId)) {
          const match = _.find(measure.arguments, {name: arg.name});
          if (_.isUndefined(match)) {
            measure.arguments.splice(index, 1);
          }
        }
      });
      // then add/merge (at argument level)
      _.forEach(newMeasure.arguments, (arg) => {
        const match = _.find(measure.arguments, {name: arg.name});
        if (_.isUndefined(match)) {
          measure.arguments.push(arg);
        } else {
          _.merge(match, arg);
        }
      });

      deferred.resolve(measure);

    }, error => {
      vm.$log.debug('Error in MM computerArguments: ', error);
      deferred.reject();

    });

    return deferred.promise;

  }

  // export OSA
  exportOSA(selectedOnly = false) {
    const vm = this;
    vm.$log.debug('In Project::exportOSA');
    vm.$log.debug('SelectedOnly? ', selectedOnly);

    // first export common data
    vm.exportCommon();

    // check what kind of analysis it is
    if (vm.analysisType == 'Manual') {
      vm.exportManual(selectedOnly);
    } else {
      vm.exportAlgorithmic();
    }

    // export serverScripts
    vm.exportScripts();

    // write to file
    let filename = vm.projectDir.path(vm.projectName + '.json');
    vm.jetpack.write(filename, vm.osa);
    vm.$log.debug('Project OSA file exported to ' + filename);

    var output = fs.createWriteStream(vm.projectDir.path(vm.projectName + '.zip'));
    var archive = archiver('zip');

    output.on('close', function () {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on('error', function (err) {
      throw err;
    });

    archive.pipe(output);

    archive.bulk([
      {expand: true, cwd: vm.projectMeasuresDir.path(), src: ['**'], dest: 'measures/'}
    ]);

    archive.bulk([
      {expand: true, cwd: vm.seedDir.path(), src: ['**'], dest: 'seeds/'}
    ]);

    archive.bulk([
      {expand: true, cwd: vm.weatherDir.path(), src: ['**'], dest: 'weather/'}
    ]);

    // add server scripts (if they exist)
    _.forEach(vm.serverScripts, (script, type) => {
      if (script.file){
        archive.bulk([
          {expand: true, cwd: vm.projectDir.path('scripts', type), src: ['**'], dest: 'scripts/' + type}
        ]);
      }
    });

    // add 'files to include
    _.forEach(vm.filesToInclude, (file) => {
      if (file.dirToInclude){
        if (!file.unpackDirName){
          // use same name if no name is provided
          file.unpackDirName = file.dirToInclude.replace(/^.*[\\\/]/, '');
        }
        archive.bulk([
          {expand: true, cwd: file.dirToInclude, src: ['**'], dest: 'lib/' + file.unpackDirName}
        ]);
      }
    });

    archive.finalize();
  }

  // export data common to both manual and algorithmic workflows
  exportCommon() {

    const vm = this;
    vm.osa = {};
    vm.osa.analysis = {};
    vm.osa.analysis.display_name = vm.projectName;
    vm.osa.analysis.name = vm.projectName;

    // these are all empty for manual / initialized for algorithmic
    vm.osa.analysis.output_variables = [];
    vm.osa.analysis.problem = {};
    vm.osa.analysis.problem.workflow = [];
    vm.osa.analysis.problem.algorithm = {objective_functions: []};

    vm.osa.analysis.seed = {};
    vm.osa.analysis.seed.file_type = 'OSM';
    vm.osa.analysis.seed.path = './seeds/' + vm.defaultSeed;
    vm.osa.analysis.weather_file = {};
    vm.osa.analysis.weather_file.file_type = 'EPW';
    vm.osa.analysis.weather_file.path = './weather/' + vm.defaultWeatherFile;
    vm.osa.analysis.file_format_version = 1;

    // server scripts (will only work on the cloud, but always put in OSA?)
    vm.osa.analysis.server_scripts = {};
    _.forEach(vm.serverScripts, (script, type) => {
      if (script.file){
        vm.osa.analysis.server_scripts[type] = './scripts/' + type + '/' + script.file;
      }
    });

  }

  exportManual(selectedOnly = false) {
    const vm = this;
    vm.$log.debug('In Project::exportManual');
    vm.$log.debug('selectedONly? ', selectedOnly);

    //vm.osa.analysis.problem.analysis_type = 'batch_datapoints'; // TODO which is correct?
    vm.osa.analysis.problem.analysis_type = null;

    // DESIGN ALTERNATIVES ARRAY
    vm.osa.analysis.problem.design_alternatives = [];
    _.forEach(vm.designAlternatives, (da) => {
      const dpMatch = _.find(vm.datapoints, {name: da.name});
      // do this for entire workflow or if matching datapoint is selected
      if (!selectedOnly || (dpMatch && dpMatch.selected)){
        const da_hash = {};
        da_hash.name = da.name;
        da_hash.description = da.description;
        if (da.seedModel != vm.defaultSeed) {
          const seed = {};
          seed.file_type = 'OSM';
          seed.path = './seeds/' + da.seedModel;
          da_hash.seed = seed;
        }
        // add option names and descriptions
        const options = [];
        _.forEach(vm.measures, (measure) => {
          const option = {};
          option.measure_name = measure.name;
          option.workflow_index = measure.workflow_index;
          option.name = da[measure.name];
          if (option.name == 'None' || !option.name) {
            // use measure name/desc if no option
            option.name = measure.name;
            option.description = measure.description;
          }
          else {
            const opt = _.find(measure.options, {name: option.name});
            if (opt)
              option.description = opt.description;
            else
              option.description = measure.description;
          }
          options.push(option);
        });
        da_hash.options = options;
        vm.osa.analysis.problem.design_alternatives.push(da_hash);
      }
    });

    // MEASURE DETAILS
    let measure_count = 0;
    _.forEach(vm.measures, (measure) => {
      // ONLY INCLUDE if measure has options set AND if at least 1 option is added to a DA
      let measureAdded = false;
      // go through alternatives, also see if need skip
      const vars = [];
      _.forEach(vm.designAlternatives, (da) => {
        const dpMatch = _.find(vm.datapoints, {name: da.name});
        // do this for entire workflow or if matching datapoint is selected
        if (!selectedOnly || (dpMatch && dpMatch.selected)){
          if (da[measure.name] == 'None' || _.isUndefined(da[measure.name])) {
            vars.push(true);
          } else {
            vars.push(false);
            measureAdded = true; // measure option is added to at least 1 DA
          }
        }
      });
      vm.$log.debug('Measure: ', measure.name, ', numOfOptions: ', measure.numberOfOptions, ' measure added to at least 1 DA? ', measureAdded);
      if (measure.numberOfOptions > 0 && measureAdded) {
        const m = {};
        m.name = measure.name;
        m.display_name = measure.display_name;
        m.measure_type = vm.getMeasureType(measure);
        m.measure_definition_class_name = measure.className;
        //m.measure_definition_measureUID = measure.colDef.measureUID;

        let mdir = vm.getMeasureBaseDir(measure);
        m.measure_definition_directory = './measures/' + mdir;
        m.measure_definition_directory_local = measure.measure_dir;
        m.measure_definition_class_name = measure.class_name;
        m.measure_definition_display_name = measure.display_name;
        m.measure_definition_name = measure.name;
        m.measure_definition_name_xml = null;
        m.measure_definition_uuid = measure.uid;
        m.measure_definition_version_uuid = measure.version_id;

        // adding these to support EDAPT reporting
        m.uuid = measure.uid;
        m.version_uuid = measure.version_id;
        m.description = measure.description; // TODO: verify this works in JSON (could have line breaks and other special characters)
        m.taxonomy = measure.tags;

        // first find out how many options there are
        let optionKeys = [];
        //if (measure.arguments.length > 0) {
        const keys = Object.keys(measure.arguments[0]);
        optionKeys = _.filter(keys, function (k) {
          return k.indexOf('option_') !== -1;
        });
        //}

        // ARGUMENTS
        m.arguments = [];
        // This portion only has arguments that don't have the variable box checked
        _.forEach(measure.arguments, (arg) => {
          if (
            (_.isUndefined(arg.specialRowId) || (angular.isDefined(arg.specialRowId) && arg.specialRowId.length === 0)) &&
            (_.isUndefined(arg.variable) || arg.variable === false)
          ) {
            vm.$log.debug('ARGUMENT, not variable!');
            const argument = vm.makeArgument(arg);
            // Make sure that argument is "complete"
            if (argument.display_name && argument.display_name_short && argument.name && argument.value_type && angular.isDefined(argument.default_value) && angular.isDefined(argument.value)) {
              var_count += 1;
              m.arguments.push(argument);
            } else {
              vm.$log.debug('Not pushing partial arg to m.arguments');
              vm.$log.debug('partial arg: ', argument);
            }
          }
        });

        // VARIABLES
        let var_count = 0;
        m.variables = [];

        // need a __SKIP__ argument
        if (_.includes(vars, true)) {
          const v = vm.makeSkip(measure);

          const valArr = [];
          _.forEach(vars, (skip) => {
            valArr.push({value: skip, weight: 1 / vars.length});
          });

          v.uncertainty_description.attributes.push({name: 'discrete', values_and_weights: valArr});
          v.workflow_index = var_count;
          var_count += 1;
          m.variables.push(v);
        }

        let DAlength = null;
        if (selectedOnly){
          DAlength = _.filter(vm.datapoints, {selected: true}).length;
        } else {
          DAlength = vm.designAlternatives.length;
        }
        // Variable arguments
        _.forEach(measure.arguments, (arg) => {
          if (((_.isUndefined(arg.specialRowId)) || (angular.isDefined(arg.specialRowId) && arg.specialRowId.length === 0)) && (arg.variable === true)) {
            vm.$log.debug('Project::exportManual arg: ', arg);
            // see what arg is set to in each design alternative
            const valArr = [];
            let option_id;

            _.forEach(vm.designAlternatives, (da) => {
              const dpMatch = _.find(vm.datapoints, {name: da.name});
              // do this for entire workflow or if matching datapoint is selected
              if (!selectedOnly || (dpMatch && dpMatch.selected)){
                vm.$log.debug('Project::exportManual da: ', da);
                if (da[measure.name] == 'None') {
                  vm.$log.debug('value: None');
                  // when set to 'None', sub a value of the right type
                  let the_value = arg.default_value;
                  if (!the_value) {
                    // if no default value, use first option value, otherwise set to None
                    the_value = (arg.option_1) ? arg.option_1 : 'None';
                  }
                  valArr.push({value: the_value, weight: 1 / DAlength});

                } else {
                  const option_name = da[measure.name];
                  vm.$log.debug('arg: ', arg);
                  vm.$log.debug('option_name: ', option_name);
                  vm.$log.debug('MEASURE', measure);
                  // retrieve the option ID from the option_name in measure.options
                  _.forEach(measure.options, (option) => {
                    if (option.name == option_name) {
                      option_id = option.id;
                    }
                  });
                  vm.$log.debug('arg[option_id]: ', arg[option_id]);
                  // check that you have a value here...if not error
                  if (!arg[option_id]) {
                    vm.$log.error('Option: ', option_name, 'for measure \'', measure.display_name, '\' does not have a value. Analysis will error.');
                  }
                  valArr.push({value: arg[option_id], weight: 1 / DAlength});
                }
              }
            });

            const values = _.values(_.pick(arg, optionKeys));

            const min = _.min(values),
              max = _.max(values);

            const mode = function mode(ar) {
              let numMapping = {};
              let greatestFreq = 0;
              let currentMode = 0;
              ar.forEach(function findMode(number) {
                numMapping[number] = (numMapping[number] || 0) + 1;

                if (greatestFreq < numMapping[number]) {
                  greatestFreq = numMapping[number];
                  currentMode = number;
                }
              });
              return +currentMode;
            };

            arg.units = '';
            arg.minimum = min;
            arg.maximum = max;
            arg.mode = mode(values);

            // VARIABLE ARGUMENT SECTION
            const v = {};
            v.argument = vm.makeArgument(arg);
            vm.$log.info(arg.choice_display_names);
            v.argument.choice_display_names = arg.choice_display_names;

            // VARIABLE DETAILS
            v.display_name = arg.display_name;  // same as arg
            v.display_name_short = arg.display_name;
            v.variable_type = 'variable'; //this is always 'variable'
            v.units = arg.units;
            v.minimum = arg.minimum;  // TODO: must be alphabetically ordered if string, otherwise standard order (pick from option values mean must be btw min and max, and max > min)
            v.maximum = arg.maximum;  // TODO: must be alphabetically ordered
            v.relation_to_output = null;
            v.static_value = arg.default_value;
            v.uuid = '';
            v.version_uuid = '';
            v.variable = true; // this is always true
            v.uncertainty_description = {};
            v.uncertainty_description.type = 'discrete'; //use "discrete" always for manual.  options are triangle, uniform, discrete, and normal.
            v.uncertainty_description.attributes = [];

            v.uncertainty_description.attributes.push({name: 'discrete', values_and_weights: valArr});
            v.uncertainty_description.attributes.push({name: 'lower_bounds', value: arg.minimum});  // minimum
            v.uncertainty_description.attributes.push({name: 'upper_bounds', value: arg.maximum});  // maximum
            if (valArr.length > 0) {
              vm.$log.debug('Setting attribute');
              v.uncertainty_description.attributes.push({name: 'modes', value: arg.mode}); // TODO: use minimum? or fake-calculate a mode btw min and max and of right type
            } else {
              vm.$log.debug('Skipping attribute');
            }
            v.uncertainty_description.attributes.push({name: 'delta_x', value: null});
            v.uncertainty_description.attributes.push({name: 'stddev', value: null});

            v.workflow_index = var_count;
            var_count += 1;

            m.variables.push(v);
          }
        });

        m.workflow_index = measure_count;
        measure_count += 1;
        // push measure to OSA
        vm.osa.analysis.problem.workflow.push(m);
      } // end if measure has options or is used
    });
  }

  exportAlgorithmic() {
    const vm = this;
    vm.$log.debug('In Project::exportAlgorithmic');

    // ALGORITHM SETTINGS
    vm.osa.analysis.problem.analysis_type = vm.samplingMethod.id.toLowerCase();
    vm.osa.analysis.problem.algorithm = {};
    _.forEach(vm.algorithmSettings, (setting) => {
      vm.osa.analysis.problem.algorithm[_.snakeCase(setting.name)] = setting.value;
    });

    // OUTPUTS
    let groupFlag = false;
    if (['NSGA2', 'SPEA2', 'Morris'].indexOf(vm.samplingMethod.id) != -1) {
      // this sampling method supports groups
      groupFlag = true;
    }

    // flatten outputs & order
    let tempOutputs = [];
    _.forEach(vm.measures, (measure) => {
      _.forEach(measure.analysisOutputs, (out) => {
        out.measure_name = measure.name;
        out.measure_uid = measure.uid;
        tempOutputs.push(out);
      });
    });
    if (groupFlag) {
      tempOutputs = _.sortBy(tempOutputs, ['obj_function_group']);
    }
    vm.$log.debug("tempOutputs sorted: ", tempOutputs);

    // add objective function names to algorithm section
    vm.osa.analysis.problem.algorithm.objective_functions = _.map(_.filter(tempOutputs, {objective_function: true}), 'name');
    if (!vm.osa.analysis.problem.algorithm.objective_functions) {
      vm.osa.analysis.problem.algorithm.objective_functions = [];
    }
    vm.osa.analysis.output_variables = vm.makeOutputs(tempOutputs, groupFlag);

    // MEASURE DETAILS
    let measure_count = 0;
    _.forEach(vm.measures, (measure) => {
      const m = {};
      m.name = measure.name;
      m.display_name = measure.display_name;

      m.measure_type = vm.getMeasureType(measure);

      m.measure_definition_class_name = measure.className;
      //m.measure_definition_measureUID = measure.colDef.measureUID;

      let mdir = vm.getMeasureBaseDir(measure);
      m.measure_definition_directory = './measures/' + mdir;
      m.measure_definition_directory_local = measure.measure_dir;
      m.measure_definition_class_name = measure.class_name;
      m.measure_definition_display_name = measure.display_name;
      m.measure_definition_name = measure.name;
      m.measure_definition_name_xml = null;
      m.measure_definition_uuid = measure.uid;
      m.measure_definition_version_uuid = measure.version_id;

      // adding these to support EDAPT reporting
      m.uuid = measure.uid;
      m.version_uuid = measure.version_id;
      m.description = measure.description;
      m.taxonomy = measure.tags;

      // ARGUMENTS
      m.arguments = [];
      // This portion only has arguments that don't have the variable box checked
      _.forEach(measure.arguments, (arg) => {
        // if argument is set to 'Argument' or if the variable setting is not supported by selected algorithm
        if ((!arg.inputs || !arg.inputs.variableSetting || arg.inputs.variableSetting == 'Argument') || (arg.inputs.showWarningIcon)) {
          vm.$log.debug(arg.name, ' treated as ARGUMENT');
          const argument = vm.makeArgument(arg);
          // Make sure that argument is "complete"
          if (argument.display_name && argument.display_name_short && argument.name && argument.value_type && angular.isDefined(argument.default_value) && angular.isDefined(argument.value)) {
            var_count += 1;
            m.arguments.push(argument);
          } else {
            vm.$log.debug('Not pushing partial arg to m.arguments');
            vm.$log.debug('partial arg: ', argument);
          }
        }
      });

      // VARIABLES
      let var_count = 0;
      m.variables = [];

      // skip this measure?
      if (measure.skip) {
        const v =  vm.makeSkip(measure);
        v.workflow_index = var_count;
        var_count += 1;
        m.variables.push(v);
      }

      // Variable arguments
      _.forEach(measure.arguments, (arg) => {
        if (arg.inputs && arg.inputs.variableSetting && arg.inputs.variableSetting != 'Argument' && !arg.inputs.showWarningIcon) {
          vm.$log.debug('Project::exportAlgorithmic arg: ', arg);

          // VARIABLE ARGUMENT SECTION
          const v = {};
          v.argument = vm.makeArgument(arg);

          vm.$log.info(arg.choice_display_names);
          v.argument.choice_display_names = arg.choice_display_names;  // TODO: not sure about this?

          // VARIABLE DETAILS
          v.display_name = arg.display_name;  // same as arg
          v.display_name_short = arg.display_name_short;
          v.variable_type = (arg.inputs.variableSetting == 'Pivot') ? 'pivot' : 'variable'; // this is 'variable' or 'pivot'
          v.units = arg.units;
          v.minimum = arg.inputs.minimum;
          v.maximum = arg.inputs.maximum;
          v.relation_to_output = arg.relationship;
          v.static_value = arg.default_value;
          v.uuid = '';
          v.version_uuid = '';
          if (arg.inputs.variableSetting == 'Pivot') {
            v.pivot = true;
          } else {
            v.variable = true;
          }
          v.uncertainty_description = {};
          // pivots can be discrete or integer_sequence_uncertain (handled in analysis controller)
          // options are triangle, uniform, discrete, and normal, integer_sequence_uncertain
          v.uncertainty_description.type = arg.inputs.distribution == 'Integer Sequence' ? 'integer_sequence' : arg.inputs.distribution.toLowerCase();
          v.uncertainty_description.attributes = [];

          // if discrete or pivot, make values and weights array (unless pivot w/ integer_sequence)
          if ((arg.inputs.variableSetting == 'Pivot' || arg.inputs.variableSetting == 'Discrete') && arg.inputs.distribution != 'Integer Sequence'){
            const valArr = vm.makeDiscreteValuesArray(arg.inputs.discreteVariables);
            v.uncertainty_description.attributes.push({name: 'discrete', values_and_weights: valArr});
          }

          // TODO: if any of these don't exist, set to inputs.default_value
          v.uncertainty_description.attributes.push({name: 'lower_bounds', value: arg.inputs.minimum});  // minimum
          v.uncertainty_description.attributes.push({name: 'upper_bounds', value: arg.inputs.maximum});  // maximum
          v.uncertainty_description.attributes.push({name: 'modes', value: arg.inputs.mean}); // mean
          v.uncertainty_description.attributes.push({name: 'delta_x', value: arg.inputs.deltaX}); // delta x
          v.uncertainty_description.attributes.push({name: 'stddev', value: arg.inputs.stdDev});  // std dev

          v.workflow_index = var_count;
          var_count += 1;
          m.variables.push(v);
        }
      });

      m.workflow_index = measure_count;
      measure_count += 1;
      // push measure to OSA
      vm.osa.analysis.problem.workflow.push(m);
    });
  }

  makeDiscreteValuesArray(discreteVariables){
    const vm = this;
    const valArr = [];
    _.forEach(discreteVariables, (valueHash) => {
      valArr.push({value: valueHash.value, weight: valueHash.weight});
    });

    // TODO: more complicated weighting scheme?
    let weightSum = 0;
    _.forEach(valArr, (valueHash) => {
      vm.$log.debug('weight: ', parseFloat(valueHash.weight));

      if (vm.isNumeric(valueHash.weight)){
        vm.$log.debug('weight for ', valueHash.value);
        valueHash.weight = parseFloat(valueHash.weight);
        weightSum = weightSum + valueHash.weight;
      }
    });
    vm.$log.debug('current weight sum: ', weightSum);

    if (weightSum > 1){
      vm.$log.debug('ERROR: weights do not add up to 1');
      // TODO: what to do here?
    }

    let missingCount = 0;
    _.forEach(valArr, (valueHash) => {
      if (!vm.isNumeric(valueHash.weight)){
        missingCount = missingCount + 1;
      }
    });
    vm.$log.debug('missing count: ', missingCount);

    if (missingCount > 0){
      vm.$log.debug('calculating missing weights');
      const weightVal = (1 - weightSum)/missingCount; // TODO: limit
      vm.$log.debug('calculated weight Val: ', weightVal);
      _.forEach(valArr, (valueHash) => {
        if (!vm.isNumeric(valueHash.weight)){
          valueHash.weight = weightVal;
        }
      });
    }

    vm.$log.debug('Final discrete values array: ', valArr);
    return valArr;
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  getMeasureType(measure) {
    const vm = this;
    // measure types: ModelMeasure, EnergyPlusMeasure, ReportingMeasure
    // OSA wants: Ruby, EnergyPlus, Reporting
    let type = null;
    if (measure.type === 'ModelMeasure') {
      //type = 'Ruby';
       type = 'RubyMeasure';
    } else if (measure.type === 'EnergyPlusMeasure') {
      //type = 'EnergyPlus';
      type = 'EnergyPlusMeasure';
    } else if (measure.type === 'ReportingMeasure') {
      //type = 'Reporting';
      type = 'ReportingMeasure';
    } else {
      type = 'unknown';
    }
    return type;
  }

  makeOutputs(outputs, groupFlag){
    const vm = this;
    let index = 0;
    let currentGroup = null;
    const finalOutputs = [];
    _.forEach(outputs, (out) => {
      vm.$log.debug('OUTPUT: ', out);
      const outHash = {};
      outHash.units = out.units;
      outHash.objective_function = out.objective_function == 'true';  // true or false
      // only set following fields if object_function is true, otherwise null
      if (outHash.objective_function) {

        if (outHash.objective_function) {
          if (groupFlag) {
            if (out.obj_function_group == null) {
              if (currentGroup) {
                // get out of group and increment
                currentGroup = null;
                index = index + 1;
              }
              outHash.objective_function_index = index;
              index = index + 1;
            } else {
              // group defined
              if (currentGroup == out.obj_function_group) {
                // same group, don't increment
                outHash.objective_function_index = index;

              } else if (currentGroup == null) {
                // no group, assign, don't increment
                currentGroup = out.obj_function_group;
                outHash.objective_function_index = index;

              } else {
                // currentGroup != obj_function_group
                // change group, increment
                currentGroup = out.obj_function_group;
                index = index + 1;
                outHash.objective_function_index = index;
              }
            }
          } else {
            outHash.objective_function_index = index;
            // increment
            index = index + 1;
          }
        } else {
          outHash.objective_function_index = null;
        }
        outHash.objective_function_target = vm.typeTargetValue(out.target_value, out.type);
        outHash.objective_function_group = out.obj_function_group ? out.obj_function_group : null;
        outHash.scaling_factor = out.weighting_factor ? out.weighting_factor : null;
      } else {
        outHash.objective_function_index = null;
        outHash.objective_function_target = null;
        outHash.objective_function_group = null;
        outHash.scaling_factor = null;
      }
      outHash.display_name = out.display_name;
      outHash.display_name_short = out.short_name;
      outHash.metadata_id = null; // always null for now.  This is related to DEnCity?
      outHash.name = out.name; // always measure.name . measure.argument.name
      outHash.visualize = out.visualize == 'true';
      outHash.export = true; // always true
      outHash.variable_type = out.type;  // options are: string, bool, double, integer?  TODO: find out what these can be. for now: use argument type
      finalOutputs.push(outHash);
    });
    return finalOutputs;
  }

  getMeasureBaseDir(measure) {
    const vm = this;
    let mdir = '';
    // windows path vs. mac
    if (measure.measure_dir.indexOf('/') != -1) {
      // correct paths
      mdir = _.last(_.split(measure.measure_dir, '/'));
    } else {
      // assume windows paths '\\'
      mdir = _.last(_.split(measure.measure_dir, '\\'));
    }
    vm.$log.debug("***MEASURE DIR NAME: ", mdir);
    return mdir;
  }

  makeArgument(arg){
    const vm = this;
    const argument = {};
    argument.display_name = arg.display_name;
    argument.display_name_short = arg.display_name_short ? arg.display_name_short : arg.name;
    argument.name = arg.name;
    argument.value_type = _.toLower(arg.type); // TODO: choice, double, integer, bool, string (convert from BCL types)
    argument.default_value = arg.default_value;
    if (vm.analysisType == 'Manual')
      argument.value = arg.option_1 ? arg.option_1 : arg.default_value;
    else
      argument.value = (arg.inputs && !_.isNil(arg.inputs.default_value)) ? arg.inputs.default_value : arg.default_value;

    return argument;
  }

  makeSkip(measure){
    const vm = this;
    const v = {
      argument: {
        display_name: 'Skip ' + measure.display_name,
        display_name_short: 'Skip entire measure',
        name: '__SKIP__',
        value_type: 'bool',
        default_value: false,
        value: false
      },
      display_name: 'Skip ' + measure.display_name,
      display_name_short: 'Skip entire measure',
      variable_type: 'variable',
      units: null,
      minimum: false,
      maximum: true,
      relation_to_output: null,
      static_value: false,
      variable: true,
      uncertainty_description: {
        attributes: [],
        type: 'discrete'
      }
    };

    v.uncertainty_description.attributes.push({name: 'discrete', values_and_weights: []});
    v.uncertainty_description.attributes.push({name: 'lower_bounds', value: false});
    v.uncertainty_description.attributes.push({name: 'upper_bounds', value: false});
    v.uncertainty_description.attributes.push({name: 'modes', value: false});
    v.uncertainty_description.attributes.push({name: 'delta_x', value: null});
    v.uncertainty_description.attributes.push({name: 'stddev', value: null});

    return v;
  }

  exportScripts() {
    const vm = this;
    vm.$log.debug('exporting server scripts');
    _.forEach(vm.serverScripts, (script, type) => {
      // vm.$log.debug('type: ', type, 'scriptdata: ', script);
      if (script.file) {
        // create argument file
        let argFilename = script.file.substr(0, script.file.lastIndexOf('.')) || script.file;
        argFilename = argFilename + '.args';
        vm.jetpack.write(vm.projectDir.path('scripts', type, argFilename), script.arguments);
      }
    });
  }

  typeTargetValue(value, type) {
    const vm = this;
    let newVal;
    if (value == null) {
      newVal = value;
    } else if (type == 'Double' || type == 'Integer') {
      // this might be NAN if value cannot be converted
      newVal = Number(value);
    } else if (type == 'Bool') {
      if (value == 'true' || value == '1') {
        newVal = true;
      } else if (value == 'false' || value == '0') {
        newVal = false;
      } else {
        // this will cause an error
        newVal = value;
      }
    } else {
      newVal = value;
    }
    return newVal;
  }

  // export variables to pat.json
  exportPAT() {
    const vm = this;
    vm.savePrettyOptions();  // must do this first in case we are closing the app on the analysis tab

    // general
    vm.pat = {};
    vm.pat.projectName = vm.projectName;
    vm.pat.projectDir = vm.projectDir.path();
    vm.pat.seed = vm.defaultSeed;
    vm.pat.weatherFile = vm.defaultWeatherFile;
    vm.pat.analysis_type = vm.analysisType; // eslint-disable-line camelcase
    vm.pat.dirToInclude = vm.dirToInclude;
    vm.pat.dirToUnpackTo = vm.dirToUnpackTo;
    vm.pat.remoteSettings = angular.copy(vm.remoteSettings);
    // clear out aws.connected
    if (vm.pat.remoteSettings.aws && vm.pat.remoteSettings.aws.connected) {
      vm.pat.remoteSettings.aws.connected = false;
    }
    vm.pat.samplingMethod = vm.samplingMethod;
    vm.pat.algorithmSettings = vm.algorithmSettings;
    vm.pat.rubyMD5 = vm.rubyMD5;
    vm.pat.mongoMD5 = vm.mongoMD5;
    vm.pat.openstudioServerMD5 = vm.openstudioServerMD5;
    vm.pat.openstudioCLIMD5 = vm.openstudioCLIMD5;
    vm.pat.openstudioMD5 = vm.openstudioMD5;

    // measures and options
    vm.pat.measures = vm.measures;

    // files to include
    vm.pat.filesToInclude = vm.filesToInclude;
    vm.pat.serverScripts = vm.serverScripts;

    // design alternatives
    vm.pat.designAlternatives = vm.designAlternatives;

    // run / results
    vm.pat.analysisID = vm.analysisID;
    vm.pat.datapoints = vm.datapoints;

    vm.jetpack.write(vm.projectDir.path('pat.json'), vm.pat);
    vm.$log.debug('Project exported to pat.json');
    vm.setModified(false);
  }

  // reconcile measures and save
  updateProjectMeasures(updatedMeasures) {

    const vm = this;
    const newMeasures = [];

    _.forEach(updatedMeasures, (measure) => {
      const match = _.find(vm.measures, {instanceId: measure.instanceId});
      if (angular.isDefined(match)) {
        // if there's a match, merge (update)
        _.merge(match, measure);
        newMeasures.push(match);
      } else {
        // otherwise add
        newMeasures.push(angular.copy(measure));
      }
    });

    vm.setMeasuresAndOptions(updatedMeasures);
    //vm.measures = updatedMeasures;
  }

  recalculateMeasureWorkflowIndexes() {
    // measures should already be in correct order
    // make sure workflowIndex's are consecutive and match measure index in array
    const vm = this;
    vm.$log.debug('ProjectService::RecalculateMeasureWorkflowIndexes');
    _.forEach(vm.measures, (measure, key) => {
      measure.workflow_index = key;
      vm.$log.debug('key: ', key);
    });

    vm.$log.debug('***REORDERED PROJECT MEASURES: ', vm.measures);
  }

  openSetMyMeasuresDirModal() {
    const vm = this;
    vm.$log.debug('in SetMyMeasures Modal function');
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalSetMeasuresDirController',
      controllerAs: 'modal',
      templateUrl: 'app/project/setMeasuresDir.html',
      windowClass: 'modal'
    });
  }

  getProjectName() {
    const vm = this;
    return vm.projectName;
  }

  setProjectName(name) {
    const vm = this;
    vm.$log.debug('Project setProjectName name:', name);
    vm.projectName = name;
  }

  getProjectDir() {
    const vm = this;
    return vm.projectDir;
  }

  setProjectDir(dir) {
    const vm = this;
    // this should be a jetpack object (not a string)
    vm.projectDir = dir;
    vm.setProjectLocalResultsDir(dir);
    vm.setProjectClustersDir(dir);
  }

  setProjectLocalResultsDir(projectDir) {
    const vm = this;
    vm.projectLocalResultsDir = vm.jetpack.dir(projectDir.path('localResults'));
  }

  getProjectLocalResultsDir() {
    const vm = this;
    return vm.projectLocalResultsDir;
  }

  setProjectClustersDir(projectDir) {
    const vm = this;
    return vm.projectClustersDir = vm.jetpack.dir(projectDir.path('clusters'));
  }

  getProjectClustersDir() {
    const vm = this;
    return vm.projectClustersDir;
  }

  getAwsDir() {
    const vm = this;
    return vm.awsDir;
  }

  // projectDir is a jetpack object (not a string)
  setProject(projectDir) {
    const vm = this;
    vm.$log.debug('Project setProject');

    vm.setProjectDir(projectDir);
    vm.$log.debug('in set project: projectDir: ', vm.projectDir.path());
    vm.setProjectName(projectDir.path().replace(/^.*[\\\/]/, ''));
    vm.$log.debug('project name: ', vm.projectName);

    vm.mongoDir = jetpack.dir(path.resolve(vm.projectDir.path() + '/data/db'));
    vm.logsDir = jetpack.dir(path.resolve(vm.projectDir.path() + '/logs'));
    vm.projectMeasuresDir = jetpack.dir(path.resolve(vm.projectDir.path() + '/measures'));
    vm.seedDir = jetpack.dir(path.resolve(vm.projectDir.path() + '/seeds'));
    vm.weatherDir = jetpack.dir(path.resolve(vm.projectDir.path() + '/weather'));

    // initializeProject will also create the basic folder structure, if it is missing
    vm.initializeProject();

  }

  setAnalysisID(id) {
    const vm = this;
    vm.analysisID = id;
  }

  getAnalysisID() {
    const vm = this;
    return vm.analysisID;
  }

  setDatapoints(dps) {
    const vm = this;
    vm.datapoints = dps;
  }

  getDatapoints() {
    const vm = this;
    return vm.datapoints;
  }

  setDesignAlternatives(alts) {
    const vm = this;
    vm.designAlternatives = alts;
  }

  getDesignAlternatives() {
    const vm = this;
    return vm.designAlternatives;
  }

  setMeasuresAndOptions(measures) {
    const vm = this;
    vm.savePrettyOptions();
    vm.measures = measures;
  }

  getMeasuresAndOptions() {
    const vm = this;
    vm.$log.debug('GetMeasuresAndOptions measures: ', vm.measures);
    return vm.measures;
  }

  getProjectMeasuresDir() {
    const vm = this;
    return vm.projectMeasuresDir;
  }

  getMeasuresDir() {
    const vm = this;
    return vm.myMeasuresDir;
  }

  setMeasuresDir(strPath) {
    const vm = this;
    vm.myMeasuresDir = vm.jetpack.cwd(strPath);
  }

  getSeedDir() {
    const vm = this;
    return vm.seedDir;
  }

  getWeatherDir() {
    const vm = this;
    return vm.weatherDir;
  }

  getMongoDir() {
    const vm = this;
    return vm.mongoDir;
  }

  getRailsDir() {
    const vm = this;
    return vm.railsDir;
  }

  setRunTypes() {

    return [{displayName: 'Run Locally', name: 'local'}, {displayName: 'Run on Cloud', name: 'remote'}];
  }

  getRunTypes() {
    const vm = this;
    return vm.runTypes;
  }

  getRunType() {
    const vm = this;
    return vm.runType;
  }

  setRunType(type) {
    const vm = this;
    vm.runType = type;
  }

  getRemoteTypes() {
    const vm = this;
    return vm.remoteTypes;
  }

  setRemoteTypes() {
    return ['Existing Remote Server', 'Amazon Cloud'];
    //return ['Existing Remote Server'];
  }

  resetRemoteSettings() {
    const vm = this;
    vm.setRemoteSettings({
      open: true,
      remoteType: vm.remoteTypes[1],
      remoteServerURL: null,
      aws: {},
      credentials: {yamlFilename: null, accessKey: null, region: 'us-east-1'}
    });
    vm.$log.debug('Remote settings reset to: ', vm.getRemoteSettings());
  }

  setRemoteSettings(settings) {
    const vm = this;
    vm.remoteSettings = settings;
  }

  getRemoteSettings() {
    const vm = this;
    return vm.remoteSettings;
  }

  // always get from disk and extract unique name
  getAwsYamlFiles() {
    const vm = this;
    vm.awsYamlFiles = [];
    const files = vm.jetpack.find(vm.awsDir.path(), {matching: '*.yml'});
    _.forEach(files, file => {
      vm.awsYamlFiles.push(_.replace(_.last(_.split(file, '/')), '.yml', ''));
    });
    return vm.awsYamlFiles;
  }

  // always get from disk and extract unique name
  getClusters() {
    const vm = this;
    vm.clusters = {running: [], all: []};
    const tempClusters = vm.jetpack.find(vm.projectDir.path(), {matching: '*_cluster.json'});
    _.forEach(tempClusters, cluster => {
      vm.$log.debug('CLUSTER: ', cluster);
      const clusterFile = vm.jetpack.read(cluster);
      let clusterName = _.last(_.split(cluster, '/'));
      clusterName = _.replace(clusterName, '_cluster.json', '');
      vm.clusters.all.push(clusterName);
      // PING (by name)
      vm.pingCluster(clusterName).then((dns) => {
        // running
        vm.clusters.running.push(clusterName);
      }, () => {
        // terminated
      });
    });

    vm.$log.debug('Cluster files found: ', vm.clusters);
    return vm.clusters;
  }

  getDNSFromFile(clusterName) {
    const vm = this;
    let dns = null;
    if (clusterName && vm.jetpack.exists(vm.projectClustersDir.path(clusterName, clusterName + '.json'))) {
      const clusterData = vm.jetpack.read(vm.projectClustersDir.path(clusterName, clusterName + '.json'), 'json');
      vm.$log.debug('Cluster File Data: ', clusterData);
      if (clusterData && clusterData.server && clusterData.server.dns) {
        dns = clusterData.server.dns;
      }
    }
    return dns;
  }

  readClusterFile(clusterName) {
    const vm = this;
    let clusterData = {};
    if (clusterName && vm.jetpack.exists(vm.projectClustersDir.path(clusterName, clusterName + '.json'))) {
      clusterData = vm.jetpack.read(vm.projectClustersDir.path(clusterName, clusterName + '.json'), 'json');
    }
    return clusterData;
  }

  pingCluster(clusterName) {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.$log.debug('Locating config file for cluster: ', clusterName);

    const dns = vm.getDNSFromFile(clusterName);

    if (dns) {
      vm.$log.debug('PING: ', dns);
      vm.$http.get(vm.fixURL(dns)).then(response => {
        // send json to run controller
        vm.$log.debug('Cluster RUNNING at: ', dns);
        vm.$log.debug('JSON response: ', response);
        deferred.resolve(dns);
      }, () => {
        vm.$log.debug('Cluster TERMINATED at: ', dns);
        deferred.reject();
      });
    } else {
      // nothing to ping
      vm.$log.debug("Nothing to ping");
      deferred.reject();
    }

    return deferred.promise;
  }

  fixURL(url) {
    // if http:// is missing from URL, $http actions won't work
    if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
      url = 'http://' + url;
    }
    return url;
  }

  getOsServerVersions() {
    const vm = this;
    return vm.osServerVersions;
  }

  saveClusterToFile() {
    const vm = this;
    vm.$log.debug('FILE DATA: ', vm.remoteSettings.aws);
    // copy and clean up what you don't need
    const cluster = angular.copy(vm.remoteSettings.aws);
    cluster.server_instance_type = cluster.server_instance_type ? cluster.server_instance_type.name : null;
    cluster.worker_instance_type = cluster.worker_instance_type ? cluster.worker_instance_type.name : null;
    cluster.openstudio_server_version = cluster.openstudio_server_version ? cluster.openstudio_server_version.name : null;
    // TODO: make sure worker number is a number
    // this is hard-coded
    cluster.ami_lookup_version = 3;
    vm.jetpack.write(vm.getProjectDir().path(vm.remoteSettings.aws.cluster_name + '_cluster.json'), cluster);
  }

  setOsServerVersions() {
    const vm = this;
    vm.osServerVersions = [];
    const amiURL = 'http://s3.amazonaws.com/openstudio-resources/server/api/v3/amis.json';
    vm.$http.get(amiURL, {cache: false}).then(response => {
      if (response.data && response.data.builds) {
        vm.$log.debug('OPENSTUDIO SERVER AMIS: ', response.data.builds);
        _.forEach(response.data.builds, version => {
          vm.osServerVersions.push(version);
        });
      }
      vm.$log.debug('OS Server Versions: ', vm.osServerVersions);

    }, error => {
      vm.$log.debug('Error retrieving the OsServerVersions: ', error);
    });
  }

  setServerInstanceTypes() {
    const vm = this;
    vm.serverInstanceTypes = [
      {
        name: 'm3.xlarge',
        cpus: '4',
        memory: '15 GiB',
        storage: '2 x 40 GB',
        cost: '$0.28/hr'
      },
      {
        name: 'm3.2xlarge',
        cpus: '8',
        memory: '30 GiB',
        storage: '2 x 80 GB',
        cost: '$0.56/hr'
      },
      {
        name: 'c3.xlarge',
        cpus: '4',
        memory: '7.5 GiB',
        storage: '2 x 40 GB',
        cost: '$0.21/hr'
      },
      {
        name: 'c3.2xlarge',
        cpus: '8',
        memory: '15 GiB',
        storage: '2 x 80 GB',
        cost: '	$0.42/hr'
      },
      {
        name: 'c3.4xlarge',
        cpus: '16',
        memory: '30 GiB',
        storage: '2 x 160 GB',
        cost: '$0.84/hr'
      },
      {
        name: 'c3.8xlarge',
        cpus: '32',
        memory: '60 GiB',
        storage: '2 x 320 GB',
        cost: '$1.68/hr'
      },
      {
        name: 'i2.xlarge',
        cpus: '4',
        memory: '30.5 GiB',
        storage: '1 x 800 GB',
        cost: '$0.85/hr'
      },
      {
        name: 'i2.2xlarge',
        cpus: '8',
        memory: '61 GiB',
        storage: '2 x 800 GB',
        cost: '$1.71/hr'
      },
      {
        name: 'i2.4xlarge',
        cpus: '16',
        memory: '122 GiB',
        storage: '4 x 800 GB',
        cost: '$3.41/hr'
      }
    ];
  }

  setWorkerInstanceTypes() {
    const vm = this;
    vm.workerInstanceTypes = [
      {
        name: 'm3.medium',
        cpus: '1',
        memory: '3.75 GiB',
        storage: '1 x 4 GB',
        cost: '$0.07/hr'
      },
      {
        name: 'm3.large',
        cpus: '2',
        memory: '7.5 GiB',
        storage: '1 x 32 GB',
        cost: '$0.14/hr'
      },
      {
        name: 'm3.xlarge',
        cpus: '4',
        memory: '15 GiB',
        storage: '2 x 40 GB',
        cost: '$0.28/hr'
      },
      {
        name: 'm3.2xlarge',
        cpus: '8',
        memory: '30 GiB',
        storage: '2 x 80 GB',
        cost: '$0.56/hr'
      },
      {
        name: 'c3.large',
        cpus: '2',
        memory: '3.75 GiB',
        storage: '2 x 16 GB',
        cost: '$0.11/hr'
      },
      {
        name: 'c3.xlarge',
        cpus: '4',
        memory: '7.5 GiB',
        storage: '2 x 40 GB',
        cost: '$0.21/hr'
      },
      {
        name: 'c3.2xlarge',
        cpus: '8',
        memory: '15 GiB',
        storage: '2 x 80 GB',
        cost: '$0.42/hr'
      },
      {
        name: 'c3.4xlarge',
        cpus: '16',
        memory: '30 GiB',
        storage: '2 x 160 GB',
        cost: '$0.84/hr'
      },
      {
        name: 'c3.8xlarge',
        cpus: '32',
        memory: '60 GiB',
        storage: '2 x 320 GB',
        cost: '$1.68/hr'
      },
      {
        name: 'r3.large',
        cpus: '2',
        memory: '15.25 GiB',
        storage: '1 x 32 GB',
        cost: '$0.85/hr'
      },
      {
        name: 'i2.xlarge',
        cpus: '4',
        memory: '30.5 GiB',
        storage: '1 x 800 GB',
        cost: '$1.71/hr'
      },
      {
        name: 'i2.2xlarge',
        cpus: '8',
        memory: '61 GiB',
        storage: '2 x 800 GB',
        cost: '$1.71/hr'
      },
      {
        name: 'i2.4xlarge',
        cpus: '16',
        memory: '122 GiB',
        storage: '4 x 800 GB',
        cost: '$3.41/hr'
      }
    ];
  }

  getServerInstanceTypes() {
    const vm = this;
    return vm.serverInstanceTypes;
  }

  getWorkerInstanceTypes() {
    const vm = this;
    return vm.workerInstanceTypes;
  }

  setAwsRegions() {
    const vm = this;
    vm.awsRegions = [
      'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'eu-central-1', 'eu-west-1'
    ];
  }

  getAwsRegions() {
    const vm = this;
    return vm.awsRegions;
  }

  setAnalysisType(name) {
    const vm = this;
    vm.analysisType = name;
  }

  getAnalysisType() {
    const vm = this;
    return vm.analysisType;
  }

  getFilesToInclude() {
    const vm = this;
    return vm.filesToInclude;
  }

  setServerScripts() {
    const vm = this;
    vm.serverScripts = {
      server_initialization: {file: null, arguments: []},
      server_finalization: {file: null, arguments: []},
      worker_initialization: {file: null, arguments: []},
      worker_finalization: {file: null, arguments: []}
    };
    vm.$log.debug('setServerScripts: ', vm.serverScripts);
  }

  getServerScripts() {
    const vm = this;
    return vm.serverScripts;
  }

  setSamplingMethod(method) {
    const vm = this;
    vm.samplingMethod = method;
  }

  getSamplingMethod() {
    const vm = this;
    return vm.samplingMethod;
  }

  getSamplingMethods() {
    const vm = this;
    return vm.samplingMethods;
  }

  setAlgorithmOptions() {
    const at = {};
    at.BaselinePerturbation =[{
      name: 'in_measure_combinations',
      description: '(TRUE/FALSE) Run full factorial search over in-measure variable combinations',
      defaultValue: 'TRUE'
    }];
    at.Diagonal = [{
      name: 'Number of Samples',
      description: 'positive integer (this discretizes a continuous variable)',
      defaultValue: 2
    }, {
      name: 'Run_Baseline',
      description: '(1/0) Run static values',
      defaultValue: 1
    }];
    at.Morris = [{
      name: 'r',
      description: 'integer giving the number of repetitions of the design',
      defaultValue: 10
    }, {
      name: 'levels',
      description: '',
      defaultValue: 10
    }, {
      name: 'grid_jump',
      description: '',
      defaultValue: 1
    }, {
      name: 'type',
      description: 'oat',
      defaultValue: 'oat'
    }];
    at.LHS = [{
      name: 'Sample Method',
      description: 'individual_variables / all_variables',
      defaultValue: 'individual_variables'
    }, {
      name: 'Number of Samples',
      description: 'positive integer (if individual, total simulations is this times each variable)',
      defaultValue: 30
    }];
    at.Optim = [{
      name: 'epsilonGradient',
      description: 'epsilon in gradient calculation',
      defaultValue: 0.01
    }, {
      name: 'pgtol',
      description: 'tolerance on the projected gradient',
      defaultValue: 0.01
    }, {
      name: 'factr',
      description: 'Tolerance on delta_F',
      defaultValue: 45036000000000
    }, {
      name: 'maxit',
      description: 'Maximum number of iterations',
      defaultValue: 100
    }, {
      name: 'normType',
      description: '',
      defaultValue: 'minkowski'
    }, {
      name: 'pPower',
      description: 'Lp norm power',
      defaultValue: 2
    }, {
      name: 'Exit On Guideline14',
      description: '0 false / 1 true (for use with calibration report)',
      defaultValue: 0
    }];
    at.RGENOUD = [{
      name: 'popSize',
      description: 'Size of initial population',
      defaultValue: 30
    }, {
      name: 'Generations',
      description: 'Number of generations',
      defaultValue: 5
    }, {
      name: 'waitGenerations',
      description: 'If no improvement in waitGenerations of generations, then exit',
      defaultValue: 2
    }, {
      name: 'bfgsburnin',
      description: 'The number of generations which are run before the BFGS is ﬁrst used',
      defaultValue: 2
    }, {
      name: 'gradientcheck',
      description: '0 false / 1 true',
      defaultValue: 1
    }, {
      name: 'solutionTolerance',
      description: '',
      defaultValue: 0.01
    }, {
      name: 'epsilonGradient',
      description: 'epsilon in gradient calculation',
      defaultValue: 0.01
    }, {
      name: 'pgtol',
      description: 'tolerance on the projected gradient',
      defaultValue: 0.01
    }, {
      name: 'factr',
      description: 'Tolerance on delta_F',
      defaultValue: 45036000000000
    }, {
      name: 'maxit',
      description: 'Maximum number of iterations',
      defaultValue: 100
    }, {
      name: 'normType',
      description: '',
      defaultValue: 'minkowski'
    }, {
      name: 'pPower',
      description: 'Lp norm power',
      defaultValue: 2
    }, {
      name: 'Exit On Guideline14',
      description: '0 false / 1 true (for use with calibration report)',
      defaultValue: 0
    }, {
      name: 'balance',
      description: '0 false / 1 true (load balancing)',
      defaultValue: 1
    }];
    at.NSGA2 = [{
      name: 'Number of Samples',
      description: 'Size of initial population',
      defaultValue: 30
    }, {
      name: 'Generations',
      description: 'Number of generations',
      defaultValue: 30
    }, {
      name: 'cprob',
      description: 'Crossover probability [0,1]',
      defaultValue: 0.85
    }, {
      name: 'XoverDistIdx',
      description: 'Crossover Distribution Index (large values give higher probabilities of offspring close to parent)',
      defaultValue: 5
    }, {
      name: 'MuDistIdx',
      description: 'Mutation Distribution Index (large values give higher probabilities of offspring close to parent)',
      defaultValue: 5
    }, {
      name: 'mprob',
      description: 'Mutation probability [0,1]',
      defaultValue: 0.8
    }, {
      name: 'toursize',
      description: 'Tournament Size',
      defaultValue: 2
    }, {
      name: 'normType',
      description: '',
      defaultValue: 'minkowski'
    }, {
      name: 'pPower',
      description: 'Lp norm power',
      defaultValue: 2
    }, {
      name: 'Exit On Guideline14',
      description: '0 false / 1 true (for use with calibration report)',
      defaultValue: 0
    }];
    at.SPEA2 = [{
      name: 'Number of Samples',
      description: 'Size of initial population',
      defaultValue: 30
    }, {
      name: 'Generations',
      description: 'Number of generations',
      defaultValue: 30
    }, {
      name: 'cprob',
      description: 'Crossover probability [0,1]',
      defaultValue: 0.85
    }, {
      name: 'XoverDistIdx',
      description: 'Crossover Distribution Index (large values give higher probabilities of offspring close to parent)',
      defaultValue: 5
    }, {
      name: 'MuDistIdx',
      description: 'Mutation Distribution Index (large values give higher probabilities of offspring close to parent)',
      defaultValue: 5
    }, {
      name: 'mprob',
      description: 'Mutation probability [0,1]',
      defaultValue: 0.8
    }, {
      name: 'toursize',
      description: 'Tournament Size',
      defaultValue: 2
    }, {
      name: 'normType',
      description: '',
      defaultValue: 'minkowski'
    }, {
      name: 'pPower',
      description: 'Lp norm power',
      defaultValue: 2
    }, {
      name: 'Exit On Guideline14',
      description: '0 false / 1 true (for use with calibration report)',
      defaultValue: 0
    }];
    at.PreFlight = [];
    at.DOE = [{
      name: 'Experiment Type',
      description: 'full_factorial',
      defaultValue: 'full_factorial'
    }, {
      name: 'Number of Samples',
      description: 'positive integer (this discretizes a continuous variable)',
      defaultValue: 2
    }];
    at.SingleRun = [{
      name: '',
      description: '',
      defaultValue: ''
    }];
    at.RepeatRun = [{
      name: 'Number of Runs',
      description: 'positive integer (if individual, total simulations is this times each variable)',
      defaultValue: 30
    }];
    at.PSO = [{
      name: 'in_measure_combinations',
      description: '(TRUE/FALSE) Run full factorial search over in-measure variable combinations',
      defaultValue: 'TRUE'
    }, {
      name: 'include_baseline_in_combinations',
      description: '(TRUE/FALSE) If in_measure_combinations are TRUE, sets if static values be included in combinations',
      defaultValue: 'TRUE'
    }];
    return at;
  }

  getRubyMD5() {
    const vm = this;
    return vm.rubyMD5;
  }

  setRubyMD5(md5) {
    const vm = this;
    vm.rubyMD5 = md5;
  }

  getMongoMD5() {
    const vm = this;
    return vm.mongoMD5;
  }

  setMongoMD5(md5) {
    const vm = this;
    vm.mongoMD5 = md5;
  }

  getOpenstudioServerMD5() {
    const vm = this;
    return vm.openstudioServerMD5;
  }

  setOpenstudioServerMD5(md5) {
    const vm = this;
    vm.openstudioServerMD5 = md5;
  }

  getOpenstudioCLIMD5() {
    const vm = this;
    return vm.openstudioCLIMD5;
  }

  setOpenstudioCLIMD5(md5) {
    const vm = this;
    vm.openstudioCLIMD5 = md5;
  }

  getOpenstudioMD5() {
    const vm = this;
    return vm.openstudioMD5;
  }

  setOpenstudioMD5(md5) {
    const vm = this;
    vm.openstudioMD5 = md5;
  }

  // this will return all settings that have been set regardless of sampling method (not useful)
  getAlgorithmSettings() {
    const vm = this;
    return vm.algorithmSettings;
  }

  getAlgorithmSettingsForMethod() {
    const vm = this;
    vm.$log.debug('In getAlgorithmSettingsForMethod in Project');

    const settings = [];
    _.forEach(vm.algorithmOptions[vm.samplingMethod.id], object => {
      settings.push(object);
    });

    return settings;

  }

  setAlgorithmSettings(algorithm) {
    const vm = this;
    vm.$log.debug('In setAlgorithmSettings in Project');

    // remove non-applicable settings
    _.forEachRight(vm.algorithmSettings, (setting, key) => {
      const match = _.find(vm.algorithmOptions[algorithm.id], {name: setting.name});
      if (!match) {
        vm.algorithmSettings.splice(key, 0);
      }
    });

    // add/update new settings
    _.forEach(vm.algorithmOptions[algorithm.id], (object) => {
      const match = _.find(vm.algorithmSettings, {name: object.name});
      if (match) {
        match.description = object.description;
        match.defaultValue = object.defaultValue;
        match.value = _.isNil(match.value) ? object.defaultValue : match.value;
      }
      else {
        const temp = angular.copy(object);
        temp.value = temp.defaultValue;
        vm.algorithmSettings.push(temp);
      }
    });
  }

  getAlgorithmOptions() {
    const vm = this;
    return vm.algorithmOptions;
  }

  setSamplingMethods() {
    const vm = this;

    return [{
      id: 'NSGA2',
      name: 'analysis.type.nsga2'
    }, {
      id: 'SPEA2',
      name: 'analysis.type.spea2'
    }, {
      id: 'PSO',
      name: 'analysis.type.pso'
    }, {
      id: 'RGENOUD',
      name: 'analysis.type.rgenoud'
    }, {
      id: 'Optim',
      name: 'analysis.type.optim'
    }, {
      id: 'LHS',
      name: 'analysis.type.lhs'
    }, {
      id: 'Morris',
      name: 'analysis.type.morris'
    }, {
      id: 'DOE',
      name: 'analysis.type.doe'
    }, {
      id: 'PreFlight',
      name: 'analysis.type.preFlight'
    }, {
      id: 'SingleRun',
      name: 'analysis.type.singleRun'
    }, {
      id: 'RepeatRun',
      name: 'analysis.type.repeatRun'
    }, {
      id: 'BaselinePerturbation',
      name: 'analysis.type.baselinePerturbation'
    },{
      id: 'Diagonal',
      name: 'analysis.type.diagonal'
    }];
  }

  getAnalysisTypes() {
    const vm = this;
    return vm.analysisTypes;
  }

  setReportType(name) {
    const vm = this;
    vm.reportType = name;
  }

  getReportType() {
    const vm = this;
    return vm.reportType;
  }

  getReportTypes() {
    const vm = this;
    return vm.reportTypes;
  }

  setDefaultSeed(name) {
    const vm = this;
    vm.defaultSeed = name;
  }

  getDefaultSeed() {
    const vm = this;
    return vm.defaultSeed;
  }

  setDefaultWeatherFile(name) {
    const vm = this;
    vm.defaultWeatherFile = name;
  }

  getDefaultWeatherFile() {
    const vm = this;
    return vm.defaultWeatherFile;
  }

  getSeeds() {
    const vm = this;
    return vm.seeds;
  }

  getWeatherFiles() {
    const vm = this;
    return vm.weatherFiles;
  }

  setSeeds() {
    const vm = this;

    if (angular.isDefined(vm.seedDir)) {
      if (vm.jetpack.exists(vm.seedDir.cwd())) {
        vm.seeds = vm.seedDir.find('.', {matching: '*.osm'}, 'relativePath');
        _.forEach(vm.seeds, (seed, index) => {
          vm.seeds[index] = _.replace(seed, './', '');
        });
      }
      else vm.$log.error('The seeds directory (%s) does not exist', vm.seedDir.cwd());
    } else {
      vm.$log.debug('There is no seed directory defined (project not selected?)');
    }

  }

  setWeatherFiles() {
    const vm = this;
    if (angular.isDefined(vm.weatherDir)) {
      if (vm.jetpack.exists(vm.weatherDir.cwd())) {
        vm.weatherFiles = vm.weatherDir.find('.', {matching: '*.epw'}, 'relativePath');
        _.forEach(vm.weatherFiles, (w, index) => {
          vm.weatherFiles[index] = _.replace(w, './', '');
        });
      }
      else vm.$log.error('The weather file directory (%s) does not exist', vm.weatherDir.cwd());
    } else {
      vm.$log.debug('There is no weather directory defined (project not selected?)');
    }

  }

  setSeedsDropdownOptions() {
    const vm = this;
    vm.seedsDropdownArr = [];
    vm.setSeeds();
    _.forEach(vm.seeds, (seed) => {
      vm.seedsDropdownArr.push({id: seed, name: seed});
    });

  }

  setWeatherFilesDropdownOptions() {
    const vm = this;
    vm.weatherFilesDropdownArr = [];
    vm.setWeatherFiles();
    _.forEach(vm.weatherFiles, (weather) => {
      vm.weatherFilesDropdownArr.push({id: weather, name: weather});
    });
  }

  getSeedsDropdownArr() {
    const vm = this;
    return vm.seedsDropdownArr;
  }

  getWeatherFilesDropdownArr() {
    const vm = this;
    return vm.weatherFilesDropdownArr;
  }

  setModified(isModified) {
    const vm = this;
    vm.$log.debug('Project::setModified isModified: ', isModified);
    vm.modified = isModified;
  }

  // takes datestrings like these: 20161110T212644Z, 2016-11-22 11:10:50 -0700, 2016-11-22 04:32:23 UTC, or 2016-11-22T04:32:13.626Z
  makeDate(dateString) {
    const vm = this;
    let theDate = '';
    if (dateString) {

      if (dateString.slice(8, 9) == 'T') {
        // YYYYMMDDTHHMMSSZ: add punctuation to convert to valid datetime format and parse normally
        const tmp = dateString.slice(0, 4) + '-' + dateString.slice(4, 6) + '-' + dateString.slice(6, 11) + ':' + dateString.slice(11, 13) + ':' + dateString.slice(13, 16);
        theDate = new Date(tmp);
      } else {
        theDate = new Date(dateString);
      }

      // vm.$log.debug('***DATE: ', theDate, 'datestring was: ', dateString);
    }

    return theDate;

  }

  formatDate(dateString) {
    const vm = this;
    let theDate = '';

    if (dateString) {
      theDate = vm.makeDate(dateString);
      // format
      theDate = theDate.getMonth() + 1 + "/" + theDate.getDate() + "/" + theDate.getFullYear();
    }

    return theDate;
  }

  getModified() {
    const vm = this;
    return vm.modified;
  }

  modifiedModal() {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.$log.debug('Project::modifiedModal');

    if (vm.getModified()) {
      const modalInstance = vm.$uibModal.open({
        backdrop: 'static',
        controller: 'ModalModifiedController',
        controllerAs: 'modal',
        templateUrl: 'app/project/modified.html'
      });

      modalInstance.result.then(() => {
        vm.$log.debug('Resolving openModal()');
        deferred.resolve('resolved');
      }, () => {
        // Modal canceled
        deferred.reject('rejected');
      });
    } else {
      deferred.resolve('resolved');
    }

    return deferred.promise;
  }

  html(input) {
    const vm = this;
    return vm.$sce.trustAsHtml(input);
  }

}
