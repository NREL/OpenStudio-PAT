import * as jetpack from 'fs-jetpack';
import * as os from 'os';
import * as path from 'path';

export class Project {
  constructor($log) {
    'ngInject';
    const vm = this;
    vm.$log = $log;
    vm.jetpack = jetpack;

    vm.projectName = '';
    // TODO: grab from PAT Electron settings. For now, default to 'the_project'
    vm.setProjectName('the_project');

    // TODO: get some of these from electron settings?
    vm.seedDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName + '/seeds'));
    vm.weatherDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName + '/weather'));
    vm.myMeasuresDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));
    vm.localDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/LocalBCL'));
    vm.projectMeasuresDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName + '/measures'));
    vm.projectDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName));
    vm.mongoDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/PAT/' + vm.projectName + '/data/db'));
    vm.railsDir = jetpack.cwd('Users/kflemin/repos/OpenStudio-server/server');

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
    vm.reportTypes = ['Calibration Report', 'Radiance Report', 'Parallel Coordinates', 'Radar Chart'];

    vm.samplingMethods = vm.setSamplingMethods();

    vm.samplingMethod = '';

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
  initializeProject() {
    const vm = this;
    if (vm.jetpack.exists(vm.projectDir.path('pat.json'))) {
      vm.pat = vm.jetpack.read(vm.projectDir.path('pat.json'), 'json');

      vm.measures = vm.pat.measures;
      if (!angular.isDefined(vm.measures)) {
        vm.measures = [];
      }
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
      vm.$log.debug('in initializeProject in Project');
      vm.$log.debug('vm.algorithmSettings: ', vm.algorithmSettings);
      vm.$log.debug('vm.pat.algorithmSettings: ', vm.pat.algorithmSettings);
      vm.algorithmSettings = vm.pat.algorithmSettings ? vm.pat.algorithmSettings : vm.algorithmSettings;
    }
  }

  // TODO: need to be able to do this just by looking at the ugly hash inside measure arguments
  savePrettyOptions() {
    const vm = this;

    vm.$log.debug('Saving all measure option hashes');

    _.forEach(vm.measures, (measure) => {

      const options = [];

      // first find out how many options there are
      for (let i = 1; i <= measure.number_of_options; i++) {

        const theOption = {};
        // option name and ID
        theOption.id = 'option_' + i;
        // TODO: the name will eventually be from the first row of data, for now set same as ID
        theOption.name = theOption.id;

        // set argument values
        theOption.arguments = [];
        _.forEach(measure.arguments, (argument) => {
          // TODO: when rows for name and descriptions are added, refactor this a bit

          // get the row's value for key corresponding to the col's name
          // add to arguments array
          const theArg = {};
          if (theOption.id in argument) {
            theArg.name = argument.name;
            theArg.value = argument[theOption.id];
            theOption.arguments.push(theArg);
          } else {
            // check if argument is required
            if (argument.required) {
              // TODO: throw an error here: need a value for this argument in this option
              vm.$log.debug('ARG: ', argument.name, ' value left blank in option: ', theOption.name);
            }
          }

        });
        options.push(theOption);
      }
      // save to measure
      measure.options = options;

    });

  }

  // export OSA
  exportOSA() {
    const vm = this;
    // check what kind of analysis it is
    if (vm.analysisType == 'Manual'){
      vm.exportManual();
    } else {
      vm.exportAlgorithmic();
    }

    // write to file
    vm.jetpack.write(vm.projectDir.path('osa.json'), vm.osa);
    vm.$log.debug('Project OSA file exported to osa.json');

  }

  exportManual() {
    const vm = this;

    vm.osa = {};
    vm.osa.analysis = {};
    vm.osa.analysis.display_name = vm.projectName;
    vm.osa.analysis.name = vm.projectName;
    vm.osa.seed = {};
    vm.osa.seed.file_type = 'OSM';
    vm.osa.seed.path = './seed/' + vm.defaultSeed;
    vm.osa.weather_file = {};
    vm.osa.weather_file.file_type = 'EPW';
    vm.osa.weather_file.path = './weather/' + vm.defaultWeatherFile;
    vm.osa.file_format_version = 1;

    // empty for manual
    vm.osa.analysis.output_variables = [];

    vm.osa.analysis.problem = {};
    vm.osa.analysis.problem.analysis_type = 'batch_datapoints';
    // empty for manual
    vm.osa.analysis.problem.algorithm = {objective_functions: []};
    vm.osa.analysis.problem.workflow = [];
    let measure_count = 0;
    _.forEach(vm.measures, (measure) => {

      const m = {};
      m.name = measure.name;
      m.display_name = measure.displayName;
      m.measure_type = measure.type; // TODO: convert this.  options are:  Ruby (same as OpenStudioMeasure), EnergyPlus, and Reporting
      m.measure_definition_class_name = measure.className;
      m.measure_definition_directory = './measures/' + measure.name;
      m.measure_definition_directory_local = vm.projectMeasuresDir.path() + '/' + measure.name;
      m.measure_definition_display_name = measure.displayName;
      m.measure_definition_name = measure.name;
      m.measure_definition_name_xml = null;
      m.measure_definition_uuid = measure.uid;
      m.measure_definition_version_uuid = measure.versionId;

      m.arguments = [];
        // TODO: this portion only has arguments that don't have the variable box checked
      _.forEach(measure.arguments, (arg) => {
        const argument = {};
        argument.display_name = arg.displayName;
        argument.display_name_short = arg.shortName;
        argument.name = arg.name;
        argument.value_type = _.toLower(arg.type); // TODO: do this: downcase: choice, double, integer, bool, string (convert from BCL types)
        argument.default_value = arg.defaultValue;
        argument.value = arg.defaultValue; // TODO: do this: if 'variable' isn't checked, use option1 value.  if it is checked, the argument is a variable and shouldn't be in the top-level arguments hash.s
        m.arguments.push(argument);
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
      if (_.includes(vars, true)) {
        const v = {};
        v.argument = {};
        v.argument.display_name = '__SKIP__';
        v.argument.display_name_short = '__SKIP__';
        v.argument.name = '__SKIP__';
        v.argument.value_type = 'bool';
        v.argument.default_value = false;
        v.argument.value = false;

        v.display_name = '__SKIP__';
        v.display_name_short = '__SKIP__';
        v.variable_type = 'variable';
        v.units = null;
        v.minimum = false;
        v.maximum = true;
        v.relation_to_output = null;
        v.static_value = false;
        v.variable = true;
        v.uncertainty_description = {};
        v.uncertainty_description.type = 'discrete';
        v.uncertainty_description.attributes = [];

        const valArr = [];
        _.forEach(vars, (skip) => {
          valArr.push({value: skip, weight: 0});
        });
        // fix weights (set 1st one to 1)
        valArr[0].weight = 1;

        v.uncertainty_description.attributes.push({name: 'discrete', values_and_weights: valArr});
        v.uncertainty_description.attributes.push({name: 'lower_bounds', value: false});
        v.uncertainty_description.attributes.push({name: 'upper_bounds', value: false});
        v.uncertainty_description.attributes.push({name: 'mode', value: false});
        v.uncertainty_description.attributes.push({name: 'delta_x', value: null});
        v.uncertainty_description.attributes.push({name: 'stddev', value: null});

        v.workflow_index = var_count;
        var_count += 1;

        m.variables.push(v);
      }

      // other arguments
      _.forEach(measure.arguments, (arg) => {

        // see what arg is set to in each design alternative
        const valArr = [];
        _.forEach(vm.designAlternatives, (da) => {
          if (da[measure.name] == 'None') {
            valArr.push({value: 'None', weight: 0}); // TODO: does this matter?
          } else {
            const option_id = da[measure.name];
            valArr.push({value: arg[option_id], weight: 0});
          }
        });
        // fix weights (set 1st one to 1)
        valArr[0].weight = 1;

        const v = {};
        // TODO: only arguments that are variables go here
        v.argument = {};
        v.argument.display_name = arg.displayName;
        v.argument.display_name_short = arg.shortName;
        v.argument.name = arg.name;
        v.argument.value_type = _.toLower(arg.type); // TODO: see above

        v.display_name = arg.displayName;  // same as arg
        v.display_name_short = arg.shortName; // entered in PAT
        v.variable_type = 'variable'; //this is always 'variable'
        v.units = arg.units;
        v.minimum = arg.minimum;  // TODO: must be alphabetically ordered if string, otherwise standard order (pick from option values mean must be btw min and max, and max > min)
        v.maximum = arg.maximum;  // TODO: must be alphabetically ordered
        v.relation_to_output = null;
        v.static_value = false; // TODO: do this: 1st option value
        v.variable = true; // this is always true
        v.uncertainty_description = {};
        v.uncertainty_description.type = 'discrete'; //options are triangle, uniform, discrete, and normal.  use "discrete" always for manual
        v.uncertainty_description.attributes = [];

        v.uncertainty_description.attributes.push({name: 'discrete', values_and_weights: valArr});
        v.uncertainty_description.attributes.push({name: 'lower_bounds', value: arg.minimum});  // minimum
        v.uncertainty_description.attributes.push({name: 'upper_bounds', value: arg.maximum});  // maximum
        v.uncertainty_description.attributes.push({name: 'mode', value: valArr[0].value}); // TODO: use minimum? or fake-calculate a mode btw min and max and of right type
        v.uncertainty_description.attributes.push({name: 'delta_x', value: null});
        v.uncertainty_description.attributes.push({name: 'stddev', value: null});

        v.workflow_index = var_count;
        var_count += 1;

        m.variables.push(v);

      });

      m.workflow_index = measure_count;
      measure_count += 1;

      vm.osa.analysis.problem.workflow.push(m);
    });
  }

  exportAlgorithmic() {
    // TODO
  }

  // export variables to pat.json
  exportPAT() {
    const vm = this;
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
    _.forEach(vm.algorithmOptions[vm.samplingMethod.shortName], object => {
      settings.push(object);
    });

    return settings;

  }

  setAlgorithmSettings(algorithm) {
    const vm = this;
    vm.$log.debug('In setAlgorithmSettings in Project');

    _.forEach(vm.algorithmOptions[algorithm.shortName], (object) => {
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

    vm.algorithmSettings = vm.algorithmOptions[algorithm.shortName];
  }

  getAlgorithmOptions() {
    const vm = this;
    return vm.algorithmOptions;
  }

  setSamplingMethods() {

    return [{
      name: 'BatchRun',
      shortName: 'BatchRun'
    }, {
      name: 'Nondominated Sorting Genetic Algorithm 2',
      shortName: 'NSGA2'
    }, {
      name: 'Strength Pareto Evolutionary Algorithm 2',
      shortName: 'SPEA2'
    }, {
      name: 'Particle Swarm',
      shortName: 'PSO'
    }, {
      name: 'R-GENetic Optimization Using Derivatives',
      shortName: 'RGENOUD'
    }, {
      name: 'Optim',
      shortName: 'Optim'
    }, {
      name: 'Latin Hypercube Sampling',
      shortName: 'LHS'
    }, {
      name: 'Morris Method',
      shortName: 'Morris'
    }, {
      name: 'DesignOfExperiments',
      shortName: 'DOE'
    }, {
      name: 'PreFlight',
      shortName: 'PreFlight'
    }, {
      name: 'SingleRun',
      shortName: 'SingleRun'
    }, {
      name: 'RepeatRun',
      shortName: 'RepeatRun'
    }, {
      name: 'BaselinePerturbation',
      shortName: 'BaselinePerturbation'
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
