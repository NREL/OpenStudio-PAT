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

    vm.selectedDistributions = vm.getSelectedDistributions();
    vm.selectedDistribution = vm.selectedDistributions[0];

    vm.selectedArguments = vm.getSelectedArguments();
    vm.selectedArgument = vm.selectedArguments[0];

    vm.variableSettings = vm.getVariableSettings();
    vm.variableSetting = vm.variableSettings[0];

    // TODO: load measures from PAT.json & project dir the first time around
    vm.measures = [];
    vm.designAlternatives = [];

    // do this last...it will overwrite defaults
    vm.initializeProject();

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
      vm.selectedDistribution = vm.pat.selectedDistribution ? vm.pat.selectedDistribution : vm.selectedDistribution;
      vm.selectedArgument = vm.pat.selectedArgument ? vm.pat.selectedArgument : vm.selectedArgument;
      vm.variableSetting = vm.pat.variableSetting ? vm.pat.variableSetting : vm.variableSetting;
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
    vm.pat.selectedDistribution = vm.selectedDistribution;
    vm.pat.selectedArgument = vm.selectedArgument;
    vm.pat.variableSetting = vm.variableSetting;

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

  setSamplingMethods() {

    return [{
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
      shortName: 'L-BFGS-B'
    }, {
      name: 'Latin Hypercube Sampling',
      shortName: 'LHS'
    }, {
      name: 'Morris Method',
      shortName: 'Morris'
    }, {
      name: 'DesignOfExperiements',
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

  getVariableSetting() {
    const vm = this;
    return vm.variableSetting;
  }

  setVariableSetting(setting) {
    const vm = this;
    vm.variableSetting = setting;
  }

  getVariableSettings() {
    const vm = this;
    return ['Static', 'Discrete', 'Continuous', 'Pivot'];
  }

  setVariableSettings() {
    const vm = this;
    return 'test';
  }

  getSelectedArgument() {
    const vm = this;
    return vm.selectedArgument;
  }

  setSelectedArgument(argument) {
    const vm = this;
    vm.selectedArgument = argument;
  }

  getSelectedArguments() {
    const vm = this;
    return ['Double', 'Choice', 'String'];
  }

  setSelectedArguments() {
    const vm = this;
    return 'test';
  }

  getSelectedDistribution() {
    const vm = this;
    return vm.selectedDistribution;
  }

  setSelectedDistribution(distribution) {
    const vm = this;
    vm.selectedDistribution = distribution;
  }

  getSelectedDistributions() {
    const vm = this;
    return ['Normal', 'Uniform', 'Triangle'];
  }

  setSelectedDistributions() {
    const vm = this;
    return 'test';
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
