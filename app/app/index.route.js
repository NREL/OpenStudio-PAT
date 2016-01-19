export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })

  .state('projectMeasures', {
      url: '/projectMeasures',
      templateUrl: 'app/projectMeasures/projectMeasures.html',
      controller: 'ProjectMeasuresController',
      controllerAs: 'projectMeasures'
    });

  $urlRouterProvider.otherwise('/');
}
