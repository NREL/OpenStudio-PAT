export class NavController {

  constructor($location) {
    'ngInject';

    this.$location = $location;

    this.isActive = tabIndicator => {
      const tabRegex = new RegExp(tabIndicator);
      return tabRegex.test(this.$location.path());
    };

    this.analysisPath = '/analysis';
    this.designAlternativesPath = '/design_alternatives';
    this.outputsPath = '/outputs';
    this.runPath = '/run';
    this.reportsPath = '/reports';
    this.serverPath = '/server';

  }

}
