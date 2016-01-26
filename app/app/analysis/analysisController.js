export class AnalysisController {

  constructor () {
    'ngInject';

    this.test = 'Analysis Controller';

    $scope.oneAtATime = true;

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
      var newItemNo = this.items.length + 1;
      this.items.push('Item ' + newItemNo);
    };

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

  }

}
