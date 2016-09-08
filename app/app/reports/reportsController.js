export class ReportsController {

  constructor($log, Project, $scope) {
    'ngInject';

    const vm = this;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;

    vm.reportTypes = vm.Project.getReportTypes();
    vm.$scope.selectedReportType = vm.Project.getReportType();
    vm.openWebViewDevTools(); // Uncomment this line to debug project reports

  }

  setType() {
    const vm = this;
    vm.Project.setReportType(vm.$scope.selectedReportType);
  }

  openWebViewDevTools() {
    var wv = document.getElementById("wv");
    wv.addEventListener('dom-ready', function () {
      console.log("Opening the dev tools for the webview.");
      wv.openDevTools();
    });
  }

}
