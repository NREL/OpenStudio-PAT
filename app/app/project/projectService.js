import * as jetpack from 'fs-jetpack';
import * as os from 'os';
import * as path from 'path';

export class Project {
  constructor($log) {
    'ngInject';
    const vm = this;
    vm.$log = $log;
    vm.jetpack = jetpack;

    vm.seedDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/PAT/the_project/seeds'));
    vm.weatherDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/PAT/the_project/weather'));

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
    vm.analysisTypes = ['Manual', 'Auto'];

    vm.reportType = 'Calibration Report';
    vm.reportTypes = ['Calibration Report', 'Radiance Report', 'Parallel Coordinates', 'Radar Chart'];

  }

  setAnalysisType(name) {
    const vm = this;
    vm.analysisType = name;
  }

  getAnalysisType(){
    const vm = this;
    return vm.analysisType;
  }

  getAnalysisTypes(){
    const vm = this;
    return vm.analysisTypes;
  }

  setReportType(name) {
    const vm = this;
    vm.reportType = name;
  }

  getReportType(){
    const vm = this;
    return vm.reportType;
  }

  getReportTypes(){
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
