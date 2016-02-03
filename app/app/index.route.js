export function routerConfig($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    /*.state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })*/
    .state('analysis', {
      url: '/analysis',
      templateUrl: 'app/analysis/analysis.html',
      controller: 'AnalysisController',
      controllerAs: 'analysis'
    })
    .state('design_alternatives', {
      url: '/design_alternatives',
      templateUrl: 'app/design_alts/designAlternatives.html',
      controller: 'DesignAlternativesController',
      controllerAs: 'design_alternatives'
    })
    .state('outputs', {
      url: '/outputs',
      templateUrl: 'app/outputs/outputs.html',
      controller: 'OutputsController',
      controllerAs: 'outputs'
    })
    .state('run', {
      url: '/run',
      templateUrl: 'app/run/run.html',
      controller: 'RunController',
      controllerAs: 'run'
    })
    .state('reports', {
      url: '/reports',
      templateUrl: 'app/reports/reports.html',
      controller: 'ReportsController',
      controllerAs: 'reports'
    })
    .state('server', {
      url: '/server',
      templateUrl: 'app/server/server.html',
      controller: 'ServerController',
      controllerAs: 'server'
    });

  $urlRouterProvider.otherwise('/analysis');
}


