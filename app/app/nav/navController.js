export class NavController {

  constructor($location) {
    'ngInject';

    const vm = this;
    vm.$location = $location;

    vm.isActive = tabIndicator => {
      const tabRegex = new RegExp(tabIndicator);
      return tabRegex.test(vm.$location.path());
    };

    vm.analysisPath = '/analysis';
    vm.designAlternativesPath = '/design_alternatives';
    vm.outputsPath = '/outputs';
    vm.runPath = '/run';
    vm.reportsPath = '/reports';
    vm.serverPath = '/server';

  }

}
