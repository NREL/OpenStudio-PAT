///* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/mainController';
import { ProjectMeasuresController } from './projectMeasures/projectMeasuresController';
import { BCL } from './bcl/bclService'

//import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
//import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
//import { NavbarDirective } from '../app/components/navbar/navbar.directive';
//import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';

angular.module('PAT', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'ui.bootstrap', 'toastr'])
//  .constant('malarkey', malarkey)
//  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .controller('MainController', MainController)
  .controller('ProjectMeasuresController', ProjectMeasuresController)
  .service('BCL', BCL);
//  .service('githubContributor', GithubContributorService)
//  .service('webDevTec', WebDevTecService)
//  .directive('acmeNavbar', NavbarDirective)
//  .directive('acmeMalarkey', MalarkeyDirective);
