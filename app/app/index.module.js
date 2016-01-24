///* global malarkey:false, moment:false */

/* global _:false */

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

//import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
//import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
//import { NavbarDirective } from '../app/components/navbar/navbar.directive';
//import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';

angular.module('PAT', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'ui.bootstrap', 'toastr'])
//  .constant('malarkey', malarkey)
//  .constant('moment', moment)
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
//  .service('githubContributor', GithubContributorService)
//  .service('webDevTec', WebDevTecService)
//  .directive('acmeNavbar', NavbarDirective)
//  .directive('acmeMalarkey', MalarkeyDirective);
