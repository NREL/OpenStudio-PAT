  export class ProjectMeasuresController {
    constructor () {
      'ngInject';

      this.oneAtATime = true;

      this.groups = [
        {
          title: 'Dynamic Group Header - 1',
          content: 'Dynamic Group Body - 1'
        },
        {
          title: 'Dynamic Group Header - 2',
          content: 'Dynamic Group Body - 2'
        }
      ];

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
