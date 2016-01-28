/* global _:false */

// Electron
import * as context_menu from '../electron/context_menu'; // eslint-disable-line no-unused-vars

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from '../app/main/mainController';
import { BCL } from '../app/bcl/bclService';
import { ModalBclController } from '../app/bcl/modalBclController';
import { NavController } from '../app/nav/navController';
import { AnalysisController } from '../app/analysis/analysisController';
import { DesignAlternativesController } from '../app/design_alts/designAlternativesController';
import { OutputsController } from '../app/outputs/outputsController';
import { RunController } from '../app/run/runController';
import { ReportsController } from '../app/reports/reportsController';
import { ServerController } from '../app/server/serverController';

angular.module('PAT', ['ngAnimate', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'ui.bootstrap', 'toastr'])
  .constant('_', _)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .controller('MainController', MainController)
  .controller('NavController', NavController)
  .controller('ModalBclController', ModalBclController)
  .controller('AnalysisController', AnalysisController)
  .controller('DesignAlternativesController', DesignAlternativesController)
  .controller('OutputsController', OutputsController)
  .controller('RunController', RunController)
  .controller('ReportsController', ReportsController)
  .controller('ServerController', ServerController)
  .service('BCL', BCL);
