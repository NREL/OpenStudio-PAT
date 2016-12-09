import jetpack from 'fs-jetpack';
import os from 'os';
import path from 'path';
import {remote} from 'electron';
import jsZip from 'jszip';
import fs from 'fs';
import archiver from 'archiver';

const {app, dialog} = remote;

export class Project {
  constructor($q, $log, $uibModal, MeasureManager) {
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
    vm.$uibModal = $uibModal;

    // ignore camelcase for this file
    /* eslint camelcase: 0 */

    vm.analysisTypes = ['Manual'];
    //vm.analysisTypes = ['Manual', 'Algorithmic']; // TODO implement this after initial release

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

    vm.analysisID = '';
    vm.datapoints = [];

    const src = jetpack.cwd(app.getPath('userData'));
    vm.railsDir = jetpack.dir(path.resolve(src.path() + '/openstudioServer/openstudio-server/server'));

    // set my measures dir
    vm.MeasureManager.isReady().then( () => {
      vm.MeasureManager.getMyMeasuresDir().then ( response => {
        if (angular.isUndefined(response.my_measures_dir)) {
          vm.$log.error('response.my_measures_dir undefined');
        }
        if (response.my_measures_dir){
          // make this a jetpack object
          vm.myMeasuresDir = vm.jetpack.cwd(response.my_measures_dir);
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

        vm.measures = vm.pat.measures;
        if (!angular.isDefined(vm.measures)) {
          vm.measures = [];
        }

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
      }
    } else {
      vm.$log.error('No project selected...cannot initialize project');
    }

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
      if (measure.arguments.length > 0) {
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
    const osmPath = vm.seedDir.path(measure.seed);

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
  exportOSA() {
    const vm = this;
    vm.$log.debug('In Project::exportOSA');

    // check what kind of analysis it is
    if (vm.analysisType == 'Manual') {
      vm.exportManual();
    } else {
      vm.exportAlgorithmic();
    }

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

    archive.finalize();
  }

  exportManual() {
    const vm = this;
    vm.$log.debug('In Project::exportManual');

    vm.osa = {};
    vm.osa.analysis = {};
    vm.osa.analysis.display_name = vm.projectName;
    vm.osa.analysis.name = vm.projectName;

    // empty for manual
    vm.osa.analysis.output_variables = [];

    vm.osa.analysis.problem = {};
    //vm.osa.analysis.problem.analysis_type = 'batch_datapoints'; // TODO which is correct?
    vm.osa.analysis.problem.analysis_type = null;
    // empty for manual
    vm.osa.analysis.problem.algorithm = {objective_functions: []};
    vm.osa.analysis.problem.workflow = [];

    // DESIGN ALTERNATIVES ARRAY
    vm.osa.analysis.problem.design_alternatives = [];
    _.forEach(vm.designAlternatives, (da) => {
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
    });

    // MEASURE DETAILS
    let measure_count = 0;
    _.forEach(vm.measures, (measure) => {
      // ONLY INCLUDE if measure has options set AND if at least 1 option is added to a DA
      let measureAdded = false;
      // go through alternatives, also see if need skip
      const vars = [];
      _.forEach(vm.designAlternatives, (da) => {
        if (da[measure.name] == 'None' || _.isUndefined(da[measure.name])) {
          vars.push(true);
        } else {
          vars.push(false);
          measureAdded = true; // measure option is added to at least 1 DA
        }
      });
      vm.$log.debug('Measure: ', measure.name, ', numOfOptions: ', measure.numberOfOptions, ' measure added to at least 1 DA? ', measureAdded);
      if (measure.numberOfOptions > 0 && measureAdded) {

        const m = {};
        m.name = measure.name;
        m.display_name = measure.display_name;
        // measure types: ModelMeasure, EnergyPlusMeasure, ReportingMeasure
        // OSA wants: Ruby, EnergyPlus, Reporting
        if (measure.type === 'ModelMeasure') {
          //m.measure_type = 'Ruby';
          m.measure_type = 'RubyMeasure';
        } else if (measure.type === 'EnergyPlusMeasure') {
          //m.measure_type = 'EnergyPlus';
          m.measure_type = 'EnergyPlusMeasure';
        } else if (measure.type === 'ReportingMeasure') {
          //m.measure_type = 'Reporting';
          m.measure_type = 'ReportingMeasure';
        } else {
          m.measure_type = 'unknown';
        }
        m.measure_definition_class_name = measure.className;
        //m.measure_definition_measureUID = measure.colDef.measureUID; // TODO: fix this
        const mdir = _.last(_.split(measure.measure_dir, '/'));
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
            const argument = {};
            argument.display_name = arg.display_name;
            argument.display_name_short = arg.display_name_short ? arg.display_name_short : arg.display_name;
            argument.name = arg.name;
            argument.value_type = _.toLower(arg.type); // TODO: do this: downcase: choice, double, integer, bool, string (convert from BCL types)
            argument.default_value = arg.default_value;
            argument.value = arg.option_1 ? arg.option_1 : arg.default_value; // TODO: do this: if 'variable' isn't checked, use option1 value.  if it is checked, the argument is a variable and shouldn't be in the top-level arguments hash.s
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

          const valArr = [];
          _.forEach(vars, (skip) => {
            valArr.push({value: skip, weight: 1 / vars.length});
          });

          v.uncertainty_description.attributes.push({name: 'discrete', values_and_weights: valArr});
          v.uncertainty_description.attributes.push({name: 'lower_bounds', value: false});
          v.uncertainty_description.attributes.push({name: 'upper_bounds', value: false});
          v.uncertainty_description.attributes.push({name: 'modes', value: false});
          v.uncertainty_description.attributes.push({name: 'delta_x', value: null});
          v.uncertainty_description.attributes.push({name: 'stddev', value: null});

          v.workflow_index = var_count;
          var_count += 1;

          m.variables.push(v);
        }

        // Variable arguments
        _.forEach(measure.arguments, (arg) => {
          if (((_.isUndefined(arg.specialRowId)) || (angular.isDefined(arg.specialRowId) && arg.specialRowId.length === 0)) && (arg.variable === true)) {
            vm.$log.debug('Project::exportManual arg: ', arg);
            // see what arg is set to in each design alternative
            const valArr = [];
            let option_id;
            _.forEach(vm.designAlternatives, (da) => {
              vm.$log.debug('Project::exportManual da: ', da);
              if (da[measure.name] == 'None') {
                vm.$log.debug('value: None');
                // when set to 'None', sub a value of the right type
                let the_value = arg.default_value;
                if (!the_value){
                  // if no default value, use first option value, otherwise set to None
                  the_value = (arg.option_1) ? arg.option_1 : 'None';
                }
                valArr.push({value: the_value, weight: 1 / vm.designAlternatives.length});

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
                if (!arg[option_id]){
                  vm.$log.error('Option: ', option_name, 'for measure \'', measure.display_name,'\' does not have a value. Analysis will error.');
                }
                valArr.push({value: arg[option_id], weight: 1 / vm.designAlternatives.length});
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
            v.argument = {};
            v.argument.display_name = arg.display_name;
            v.argument.display_name_short = arg.display_name;
            v.argument.name = arg.name;
            v.argument.value_type = _.toLower(arg.type); // TODO: see above
            v.argument.default_value = arg.default_value;
            vm.$log.info(arg.choice_display_names);
            v.argument.choice_display_names = arg.choice_display_names;
            v.argument.value = arg.option_1;

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

    vm.osa.analysis.seed = {};
    vm.osa.analysis.seed.file_type = 'OSM';
    vm.osa.analysis.seed.path = './seeds/' + vm.defaultSeed;
    vm.osa.analysis.weather_file = {};
    vm.osa.analysis.weather_file.file_type = 'EPW';
    vm.osa.analysis.weather_file.path = './weather/' + vm.defaultWeatherFile;
    vm.osa.analysis.file_format_version = 1;
  }

  exportAlgorithmic() {
    const vm = this;
    vm.$log.debug('In Project::exportAlgorithmic');
    // TODO
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
    vm.pat.remoteSettings = vm.remoteSettings;
    vm.pat.samplingMethod = vm.samplingMethod;
    vm.pat.algorithmSettings = vm.algorithmSettings;
    vm.pat.rubyMD5 = vm.rubyMD5;
    vm.pat.mongoMD5 = vm.mongoMD5;
    vm.pat.openstudioServerMD5 = vm.openstudioServerMD5;
    vm.pat.openstudioCLIMD5 = vm.openstudioCLIMD5;
    vm.pat.openstudioMD5 = vm.openstudioMD5;

    // measures and options
    vm.pat.measures = vm.measures;

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
      const match = _.find(vm.measures, {uid: measure.uid});
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
  }

  setProjectLocalResultsDir(projectDir) {
    const vm = this;
    vm.projectLocalResultsDir = vm.jetpack.dir(projectDir.path('localResults'));
  }

  getProjectLocalResultsDir() {
    const vm = this;
    return vm.projectLocalResultsDir;
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
    //return ['Existing Remote Server', 'Amazon Cloud'];
    return ['Existing Remote Server'];
  }

  resetRemoteSettings() {
    const vm = this;
    vm.setRemoteSettings({open: false, remoteType: vm.remoteTypes[0], remoteServerURL: null, cloudServerURL: null});
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

  setAnalysisType(name) {
    const vm = this;
    vm.analysisType = name;
  }

  getAnalysisType() {
    const vm = this;
    return vm.analysisType;
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

    at.BatchRun = [];
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
    _.forEach(vm.algorithmOptions[algorithm.id], (object) => {
      let flag = 0;
      _.forEach(vm.algorithmSettings, (setting) => {
        if (object.name === setting.name) {
          setting.description = object.description;
          setting.defaultValue = object.defaultValue;
          if (!setting.value) {
            setting.value = object.value;
          }
          flag = 1;
        }
      });
      if (!flag) {
        object.value = object.defaultValue;
        vm.algorithmSettings.push(object);
      }
    });

    vm.algorithmSettings = vm.algorithmOptions[algorithm.id];
  }

  getAlgorithmOptions() {
    const vm = this;
    return vm.algorithmOptions;
  }

  setSamplingMethods() {
    const vm = this;

    return [{
      id: 'BatchRun',
      name: 'analysis.type.batchRun'
    }, {
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

}
