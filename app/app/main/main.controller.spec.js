describe('controllers', () => {
  let vm;

  beforeEach(angular.mock.module('PAT'));

  beforeEach(inject(($controller) => {

    vm = $controller('MainController');
  }));

});
