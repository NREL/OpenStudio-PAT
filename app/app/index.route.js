export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .state('analysis', {
      url: "/analysis",
      templateUrl: "app/analysis/analysis.html",
      controller: 'AnalysisController',
      controllerAs: 'analysis'
    })
    .state('design_alternatives', {
      url: "/design_alternatives",
      templateUrl: "app/design_alts/design_alternatives.html",
      controller: 'DesignAlternativesController',
      controllerAs: 'design_alternatives'
    })
    .state('outputs', {
      url: "/outputs",
      templateUrl: "app/outputs/outputs.html",
      controller: 'OutputsController',
      controllerAs: 'outputs'
    });

  $urlRouterProvider.otherwise('/');
}


