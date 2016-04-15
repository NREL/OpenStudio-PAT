// Electron
import * as contextMenu from '../electron/context_menu'; // eslint-disable-line no-unused-vars

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { BCL } from '../app/bcl/bclService';
import { Project } from '../app/project/projectService';
import { ModalBclController } from '../app/bcl/modalBclController';
import { NavController } from '../app/nav/navController';
import { AnalysisController } from '../app/analysis/analysisController';
import { DesignAlternativesController } from '../app/design_alts/designAlternativesController';
import { OutputsController } from '../app/outputs/outputsController';
import { RunController } from '../app/run/runController';
import { ReportsController } from '../app/reports/reportsController';
import { ServerController } from '../app/server/serverController';

angular.module('PAT', ['ngAnimate', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'pascalprecht.translate', 'ui.router', 'ui.router.stateHelper', 'ui.bootstrap', 'toastr', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.pinning'])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .controller('NavController', NavController)
  .controller('ModalBclController', ModalBclController)
  .controller('AnalysisController', AnalysisController)
  .controller('DesignAlternativesController', DesignAlternativesController)
  .controller('OutputsController', OutputsController)
  .controller('RunController', RunController)
  .controller('ReportsController', ReportsController)
  .controller('ServerController', ServerController)
  .service('Project', Project)
  .service('BCL', BCL);
