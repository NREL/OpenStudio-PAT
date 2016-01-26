describe('controllers', () => {
  beforeEach(angular.mock.module('PAT'));

  beforeEach(inject(($controller) => {

    $controller('MainController');
  }));

});
