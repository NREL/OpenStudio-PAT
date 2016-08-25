import jetpack from 'fs-jetpack';
import os from 'os';
import path from 'path';
import {remote} from 'electron';
import jsZip from 'jszip';
import fs from 'fs';
import http from 'http';

const {app} = remote;

export class Project {
  constructor($log) {
    'ngInject';
    const vm = this;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.fs = fs;
    vm.jsZip = jsZip;

    vm.projectName = '';
    // TODO: grab from PAT Electron settings. For now, default to 'the_project'
    vm.setProjectName('the_project');

    // TODO: get some of these from electron settings?
    vm.seedDir = jetpack.dir(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName + '/seeds'));
    vm.weatherDir = jetpack.dir(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName + '/weather'));
    vm.myMeasuresDir = jetpack.dir(path.resolve(os.homedir(), 'OpenStudio/Measures'));
    vm.localDir = jetpack.dir(path.resolve(os.homedir(), 'OpenStudio/LocalBCL'));
    vm.projectMeasuresDir = jetpack.dir(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName + '/measures'));
    vm.projectDir = jetpack.dir(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName));
    vm.mongoDir = jetpack.dir(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName + '/data/db'));
    vm.logsDir = jetpack.dir(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName + '/logs'));

    const src = jetpack.cwd(app.getPath('userData'));
    vm.railsDir = jetpack.dir(path.resolve(src.path() + '/openstudioServer/openstudio-server/server'));

    vm.seeds = [];
    vm.weatherFiles = [];
    vm.setSeeds();
    vm.setWeatherFiles();

    // seed and weather data
    vm.defaultSeed = vm.seeds.length > 0 ? vm.seeds[0] : null;
    vm.defaultWeatherFile = vm.weatherFiles.length > 0 ? vm.weatherFiles[0] : null;

    vm.seedsDropdownArr = [];
    vm.weatherFilesDropdownArr = [];
    vm.setSeedsDropdownOptions();
    vm.setWeatherFilesDropdownOptions();

    vm.analysisType = 'Manual';
    vm.analysisTypes = ['Manual', 'Algorithmic'];

    vm.reportType = 'Calibration Report';
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
    }];

    vm.samplingMethods = Project.setSamplingMethods();

    vm.samplingMethod = vm.samplingMethods.length > 0 ? vm.samplingMethods[0] : null;

    vm.runTypes = vm.getRunTypes();
    vm.runType = vm.runTypes[0];

    vm.algorithmOptions = vm.setAlgorithmOptions();

    vm.algorithmSettings = [];

    vm.measures = [];
    vm.designAlternatives = [];

    // do this last...it will overwrite defaults
    vm.initializeProject();

    // json objects
    vm.pat = {};
    vm.osa = {};
  }

  // import from pat.json
  // TODO: add check to ensure that the measures really are in the PAT project folder and haven't been deleted
  // TODO: if measure is in pat dir but not in json, ignore
  // TODO: if measure is in pat dir, not in json, and user tries to add it, overwrite existing measure in dir? (currently it doesn't overwrite)
  initializeProject() {
    const vm = this;
    if (vm.jetpack.exists(vm.projectDir.path('pat.json'))) {
      vm.pat = vm.jetpack.read(vm.projectDir.path('pat.json'), 'json');
      //vm.$log.debug('PAT JSON: ', vm.pat);

      vm.measures = vm.pat.measures;
      if (!angular.isDefined(vm.measures)) {
        vm.measures = [];
      }
      vm.computeAllArguments();
      vm.designAlternatives = vm.pat.designAlternatives;
      if (!angular.isDefined(vm.designAlternatives)) {
        vm.designAlternatives = [];
      }

      vm.projectName = vm.pat.projectName;
      vm.defaultSeed = vm.pat.seed ? vm.pat.seed : vm.defaultSeed;
      vm.defaultWeatherFile = vm.pat.weatherFile ? vm.pat.weatherFile : vm.defaultWeatherFile;
      vm.analysisType = vm.pat.analysis_type ? vm.pat.analysis_type : vm.analysisType;
      vm.runType = vm.pat.runType ? vm.pat.runType : vm.runType;
      vm.samplingMethod = vm.pat.samplingMethod ? vm.pat.samplingMethod : vm.samplingMethod;
      vm.$log.debug('vm.algorithmSettings: ', vm.algorithmSettings);
      vm.$log.debug('vm.pat.algorithmSettings: ', vm.pat.algorithmSettings);
      vm.algorithmSettings = vm.pat.algorithmSettings ? vm.pat.algorithmSettings : vm.algorithmSettings;

    }
  }

  savePrettyOptions() {
    const vm = this;
    vm.$log.debug('Parse arguments and save Options hash to each measure');

    _.forEach(vm.measures, (measure) => {

      const options = [];

      // first find out how many options there are (from the optionDelete special argument)
      const keys = Object.keys(measure.arguments[0]);
      const optionKeys = _.filter(keys, function (k) {
        return k.indexOf('option_') !== -1;
      });

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

  computeAllArguments() {
    const vm = this;

    var filenames = fs.readdirSync(vm.projectMeasuresDir.path());
    filenames.forEach(function (name) {
      vm.$log.debug('name: ' + name);
      if (name === "." || name === "..") {
        return;
      }
      if (fs.lstatSync(vm.projectMeasuresDir.path() + '/' + name).isDirectory()) {
        vm.computeArguments(name);
      }
    });
  }

  computeArguments(measureDirName) {
    const vm = this;

    let measurePath = vm.projectMeasuresDir.path() + '\\' + measureDirName + '\\';
    let seedPath = vm.seedDir.path() + '\\' + vm.defaultSeed;

    vm.$log.debug('measurePath: ' + measurePath);
    vm.$log.debug('seedPath: ' + seedPath);

    const postData = JSON.stringify({
      measure_dir: measurePath,
      osm_path: seedPath
    });

    var options = {
      hostname: 'localhost',
      port: 1234,
      path: '/compute_arguments',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    var req = http.request(options, (res) => {
      vm.$log.debug(`STATUS: ${res.statusCode}`);
      vm.$log.debug(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });

    // write data to request body
    req.write(postData);
    req.end();
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
    let filename = vm.projectName + '.json';
    vm.jetpack.write(vm.projectDir.path(filename), vm.osa);
    vm.$log.debug('Project OSA file exported to ' + filename);

    // create archives
    const zip = new vm.jsZip();

    let fileContents = jetpack.read(vm.seedDir.path() + '\\' + vm.defaultSeed);
    zip.file('.\\seeds\\' + vm.defaultSeed, fileContents);

    fileContents = jetpack.read(vm.weatherDir.path() + '\\' + vm.defaultWeatherFile);
    zip.file('.\\weather\\' + vm.defaultWeatherFile, fileContents);

    var filenames = fs.readdirSync(vm.projectMeasuresDir.path());
    filenames.forEach(function (name) {
      vm.$log.debug('name: ' + name);
      if (name === "." || name === "..") {
        return;
      }
      if (fs.lstatSync(vm.projectMeasuresDir.path() + '/' + name).isDirectory()) {
        fileContents = jetpack.read(vm.projectMeasuresDir.path() + '\\' + name + '\\' + 'measure.rb');
        zip.file('.\\measures\\' + name + '\\' + 'measure.rb', fileContents);

        fileContents = jetpack.read(vm.projectMeasuresDir.path() + '\\' + name + '\\' + 'measure.xml');
        zip.file('.\\measures\\' + name + '\\' + 'measure.xml', fileContents);
      }
    });

    filename = vm.projectDir.path() + '\\' + vm.projectName + '.zip';
    vm.$log.debug('Zip name: ' + filename);
    zip.generateNodeStream({compression: 'DEFLATE', type: 'nodebuffer', streamFiles: true})
      .pipe(jetpack.createWriteStream(filename))
      .on('finish', () => {
        console.log('zip written successfully');
      });

  }

  exportManual() {
    const vm = this;
    vm.$log.debug('In Project::exportManual');

    vm.osa = {};
    vm.osa.analysis = {};
    vm.osa.analysis.uuid = "";
    vm.osa.analysis.display_name = vm.projectName;
    vm.osa.analysis.name = vm.projectName;

    // empty for manual
    vm.osa.analysis.output_variables = [];

    vm.osa.analysis.problem = {};
    //vm.osa.analysis.problem.analysis_type = 'batch_datapoints'; // TODO Evan which is correct?
    vm.osa.analysis.problem.analysis_type = null;
    // empty for manual
    vm.osa.analysis.problem.algorithm = {objective_functions: []};
    vm.osa.analysis.problem.workflow = [];

    let measure_count = 0;
    _.forEach(vm.measures, (measure) => {
      const m = {};
      m.name = measure.name;
      m.display_name = measure.displayName;
      if (measure.type === 'ModelMeasure') {
        m.measure_type = 'RubyMeasure';
      } else if (measure.type === 'EnergyPlusMeasure') {
        m.measure_type = 'EnergyPlusMeasure';
      } else if (measure.type === 'RubyMeasure') {
        m.measure_type = 'RubyMeasure';
      } else {
        m.measure_type = 'unknown';
      }
      m.measure_definition_class_name = measure.className;
      //m.measure_definition_measureUID = measure.colDef.measureUID; // TODO: fix this
      m.measure_definition_directory = './measures/' + measure.name;
      m.measure_definition_directory_local = vm.projectMeasuresDir.path() + '/' + measure.name;
      m.measure_definition_display_name = measure.displayName;
      m.measure_definition_name = measure.name;
      m.measure_definition_name_xml = null;
      m.measure_definition_uuid = measure.uid;
      m.measure_definition_version_uuid = measure.versionId;

      // first find out how many options there are
      const keys = Object.keys(measure.arguments[0]);
      const optionKeys = _.filter(keys, function (k) {
        return k.indexOf('option_') !== -1;
      });

      m.arguments = [];
      // This portion only has arguments that don't have the variable box checked
      _.forEach(measure.arguments, (arg) => {
        if (((typeof arg.specialRowId === 'undefined') || (typeof arg.specialRowId !== 'undefined' && arg.specialRowId.length === 0)) && (typeof arg.variable === 'undefined' || arg.variable === false)) {
          const argument = {};
          argument.display_name = arg.displayName;
          //argument.display_name_short = arg.id; TODO
          argument.display_name_short = arg.displayName;
          argument.name = arg.name;
          argument.value_type = _.toLower(arg.type); // TODO: do this: downcase: choice, double, integer, bool, string (convert from BCL types)
          argument.default_value = arg.defaultValue;
          argument.value = arg.defaultValue; // TODO: do this: if 'variable' isn't checked, use option1 value.  if it is checked, the argument is a variable and shouldn't be in the top-level arguments hash.s
          // Make sure that argument is "complete"
          if (((typeof argument.display_name !== 'undefined' && argument.display_name.length) ||
            (typeof argument.display_name_short !== 'undefined' && argument.display_name_short.length) ||
            (typeof argument.name !== 'undefined' && argument.name.length)) &&
            typeof argument.value_type !== 'undefined' && argument.value_type.length &&
            typeof argument.default_value !== 'undefined' && argument.default_value.length &&
            typeof argument.value !== 'undefined' && argument.value.length) {
            var_count += 1;
            m.arguments.push(argument);
          } else {
            vm.$log.debug('Not pushing partial arg to m.arguments');
          }
        }
      });

      let var_count = 0;
      m.variables = [];

      // go through alternatives, see if each has an option selected
      const vars = [];
      _.forEach(vm.designAlternatives, (da) => {
        if (da[measure.name] == 'None') {
          vars.push(true);
        } else {
          vars.push(false);
        }
      });

      // need a __SKIP__ argument
      // TODO: verify that this is still valid syntax-wise
      // TODO: Should this not appear up here anymore? (b/c it's a variable?)
      if (_.includes(vars, true)) {
        const v = {
          argument: {
            display_name: '__SKIP__',
            display_name_short: '__SKIP__',
            name: '__SKIP__',
            value_type: 'bool',
            default_value: false,
            value: false
          },
          display_name: '__SKIP__',
          display_name_short: '__SKIP__',
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
        if (((typeof arg.specialRowId === 'undefined') || (typeof arg.specialRowId !== 'undefined' && arg.specialRowId.length === 0)) && (arg.variable === true)) {
          vm.$log.debug('Project::exportManual arg: ', arg);
          // see what arg is set to in each design alternative
          const valArr = [];
          let option_id;
          _.forEach(vm.designAlternatives, (da) => {
              vm.$log.debug('Project::exportManual da: ', da);
            if (da[measure.name] == 'None') {
                vm.$log.debug('value: None');
              // TODO: Review what value to assign when no option is selected for that design alternative.
              // TODO: Does it matter what we put here?  'None' is put there for now, if doesn't work, try value of the same type.
              valArr.push({value: 'None', weight: 1 / vm.designAlternatives.length});
            } else {
              const option_name = da[measure.name];
              vm.$log.debug('arg: ', arg);
              vm.$log.debug('option_name: ', option_name);
              vm.$log.debug('MEASURE', measure);
              // retrieve the option ID from the option_name in measure.options
              _.forEach(measure.options, (option) => {
                if (option.name == option_name){
                  option_id = option.id;
                }
              });
              vm.$log.debug('arg[option_id]: ', arg[option_id]);
              valArr.push({value: arg[option_id], weight: 1 / vm.designAlternatives.length});
            }
          });

          const values = _.values(_.pick(arg,optionKeys));


          const min = _.min( values ),
            max = _.max( values );

          const mode = function mode(ar) {
            var numMapping = {};
            var greatestFreq = 0;
            var mode = 0;
            ar.forEach(function findMode(number) {
              numMapping[number] = (numMapping[number] || 0) + 1;

              if (greatestFreq < numMapping[number]) {
                greatestFreq = numMapping[number];
                mode = number;
              }
            });
            return +mode;
          };

          arg.units = '';
          arg.minimum = min; // TODO is this meta data or calculated form options? Is it same as lower_bound below?
          arg.maximum = max; // TODO is this meta data or calculated form options? Is it same as upper_bound below?
          arg.mode = mode(values);

          const v = {};
          v.argument = {};
          v.argument.display_name = arg.displayName;
          //v.argument.display_name_short = arg.id; TODO
          v.argument.display_name_short = arg.displayName;
          v.argument.name = arg.name;
          v.argument.value_type = _.toLower(arg.type); // TODO: see above
          v.argument.default_value = arg.defaultValue;
          v.argument.value = _.toString(arg.option_1);

          v.display_name = arg.displayName;  // same as arg
          //v.display_name_short = arg.id; // entered in PAT TODO
          v.display_name_short = arg.displayName;
          v.variable_type = 'variable'; //this is always 'variable'
          v.units = arg.units;
          v.minimum = arg.minimum;  // TODO: must be alphabetically ordered if string, otherwise standard order (pick from option values mean must be btw min and max, and max > min)
          v.maximum = arg.maximum;  // TODO: must be alphabetically ordered
          v.relation_to_output = null;
          //v.static_value = false; // TODO: verify that this should always be 1
          v.static_value = 1;
          v.uuid = '';
          v.version_uuid = '';
          v.variable = true; // this is always true
          v.uncertainty_description = {};
          v.uncertainty_description.type = 'discrete'; //options are triangle, uniform, discrete, and normal.  use "discrete" always for manual
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

      vm.osa.analysis.problem.workflow.push(m);
    });

    vm.osa.analysis.seed = {};
    vm.osa.analysis.seed.file_type = 'OSM';
    vm.osa.analysis.seed.path = './seed/' + vm.defaultSeed;
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
    vm.pat.seed = vm.defaultSeed;
    vm.pat.weatherFile = vm.defaultWeatherFile;
    vm.pat.analysis_type = vm.analysisType; // eslint-disable-line camelcase
    vm.pat.runType = vm.runType;
    vm.pat.samplingMethod = vm.samplingMethod;
    vm.pat.algorithmSettings = vm.algorithmSettings;

    // measures and options
    vm.pat.measures = vm.measures;

    // design alternatives
    vm.pat.designAlternatives = vm.designAlternatives;

    vm.jetpack.write(vm.projectDir.path('pat.json'), vm.pat);
    vm.$log.debug('Project exported to pat.json');
  }

  // reconcile measures and save
  updateProjectMeasures(updatedMeasures) {

    const vm = this;
    const newMeasures = [];

    _.forEach(updatedMeasures, (measure) => {
      const match = _.find(vm.measures, {uid: measure.uid});
      if (angular.isDefined(match)) {
        // if there's a match, merge (update)
        angular.merge(match, measure);
        newMeasures.push(match);
      } else {
        // otherwise add
        newMeasures.push(measure);
      }
    });

    vm.setMeasuresAndOptions(newMeasures);

  }

  getProjectName() {
    const vm = this;
    return vm.projectName;
  }

  setProjectName(name) {
    const vm = this;
    vm.projectName = name;
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
    vm.measures = measures;
  }

  getMeasuresAndOptions() {
    const vm = this;
    //vm.$log.debug('GetMeasuresAndOptions measures: ', vm.measures);
    return vm.measures;
  }

  getProjectDir() {
    const vm = this;
    return vm.projectDir;
  }

  getProjectMeasuresDir() {
    const vm = this;
    return vm.projectMeasuresDir;
  }

  getLocalBCLDir() {
    const vm = this;
    return vm.localDir;
  }

  getMeasureDir() {
    const vm = this;
    return vm.myMeasuresDir;
  }

  getMongoDir() {
    const vm = this;
    return vm.mongoDir;
  }

  getRailsDir() {
    const vm = this;
    return vm.railsDir;
  }

  getRunTypes() {

    return [{displayName: 'Run Locally', name: 'local'}, {displayName: 'Run on Cloud', name: 'remote'}];
  }

  getRunType() {
    const vm = this;
    return vm.runType;
  }

  setRunType(type) {
    const vm = this;
    vm.runType = type;
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

  // this will return all settings that have been set regardless of sampling method (not useful)
  getAlgorithmSettings() {
    const vm = this;
    return vm.algorithmSettings;
  }

  getAlgorithmSettingsForMethod(samplingMethod) {
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

  static setSamplingMethods() {

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
    if (vm.jetpack.exists(vm.seedDir.cwd())) {
      vm.seeds = vm.seedDir.find('.', {matching: '*.osm'}, 'relativePath');
      _.forEach(vm.seeds, (seed, index) => {
        vm.seeds[index] = _.replace(seed, './', '');
      });
    }
    else vm.$log.error('The seeds directory (%s) does not exist', vm.seedDir.cwd());
  }

  setWeatherFiles() {
    const vm = this;
    if (vm.jetpack.exists(vm.weatherDir.cwd())) {
      vm.weatherFiles = vm.weatherDir.find('.', {matching: '*.epw'}, 'relativePath');
      _.forEach(vm.weatherFiles, (w, index) => {
        vm.weatherFiles[index] = _.replace(w, './', '');
      });
    }
    else vm.$log.error('The weather file directory (%s) does not exist', vm.weatherDir.cwd());
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

}
