export class NavController {

  constructor($location) {
    this.isActive = function (tabIndicator) {
      var tabRegex = new RegExp(tabIndicator);
      return tabRegex.test($location.path());
    };

    this.analysisPath = '/analysis';
    this.designAlternativesPath = '/design_alternatives';
    this.outputsPath = '/outputs';
    this.runPath = '/run';
    this.reportsPath = '/reports';
    this.serverPath = '/server';

  }

}
