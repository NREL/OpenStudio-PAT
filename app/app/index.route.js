export function routerConfig($urlRouterProvider, stateHelperProvider) {
  'ngInject';

  $urlRouterProvider.when('', '/analysis').otherwise('/analysis');

  stateHelperProvider
    .state({
      name: 'analysis',
      url: '/analysis',
      templateUrl: 'app/analysis/analysis.html',
      controller: 'AnalysisController',
      controllerAs: 'analysis'
    })
    .state({
      name: 'design_alternatives',
      url: '/design_alternatives',
      templateUrl: 'app/design_alts/designAlternatives.html',
      controller: 'DesignAlternativesController',
      controllerAs: 'da'
    })
    .state({
      name: 'outputs',
      url: '/outputs',
      templateUrl: 'app/outputs/outputs.html',
      controller: 'OutputsController',
      controllerAs: 'outputs'
    })
    .state({
      name: 'run',
      url: '/run',
      templateUrl: 'app/run/run.html',
      controller: 'RunController',
      controllerAs: 'run'
    })
    .state({
      name: 'reports',
      url: '/reports',
      templateUrl: 'app/reports/reports.html',
      controller: 'ReportsController',
      controllerAs: 'reports'
    })
    .state({
      name: 'server',
      url: '/server',
      templateUrl: 'app/server/server.html',
      controller: 'ServerController',
      controllerAs: 'server'
    });
}
