export class AnalysisController {

  constructor () {
    'ngInject';

    this.test = 'Analysis Controller';

    this.oneAtATime = true;

    this.items = ['Item 1', 'Item 2', 'Item 3'];

    this.addItem = function() {
      var newItemNo = this.items.length + 1;
      this.items.push('Item ' + newItemNo);
    };

    this.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

  }

}
