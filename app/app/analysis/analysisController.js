import * as jetpack from 'fs-jetpack';
import * as os from 'os';
import * as path from 'path';
import { parseString } from 'xml2js';

export class AnalysisController {

  constructor($log, BCL) {
    'ngInject';

    const vm = this;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.BCL = BCL;

    vm.srcDir = jetpack.cwd(path.resolve(os.homedir(), 'OpenStudio/Measures'));

    vm.measures = vm.BCL.getProjectMeasures();
    vm.$log.debug('PROJECT MEASURES RETRIEVED: ', vm.measures);

    vm.analysisTypes = ['Manual', 'Auto'];

  }

}
