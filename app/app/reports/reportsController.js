import jetpack from 'fs-jetpack';

export class ReportsController {

  constructor($log, Project, $scope) {
    'ngInject';

    const vm = this;
    vm.jetpack = jetpack;

    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;

    // Find all possible reports
    var html_reports = vm.jetpack.find('app/app/reports/projectReports', {matching: '*.html'});
    vm.$scope.projectReports = [];
    _.forEach(html_reports, function (html_report) {
      var report = {};
      report.name = html_report.split('\\').pop().replace(".html", "");
      report.url = html_report.replace("app\\app\\", "app\\");//).replace("\\","/");
      vm.$scope.projectReports.push(report);
    });

    // Set the default project report to the first one found
    vm.$scope.selectedReportName = vm.$scope.projectReports[0].name;
    vm.$scope.selectedReportURL = vm.$scope.projectReports[0].url;

    // Update the selected report
    $scope.updateSelectedReport = function (newReportName) {
      _.forEach(vm.$scope.projectReports, function (report) {
        if (report.name == newReportName) {
          vm.$scope.selectedReportName = report.name;
          vm.$scope.selectedReportURL = report.url;
        }
      });
    };

    // Uncomment this to view webview developer tools to debug project reports
    //vm.openWebViewDevTools();

  }

  // Opens the developer tools for the webview
  openWebViewDevTools() {
    var wv = document.getElementById("wv");
    wv.addEventListener('dom-ready', function () {
      console.log("Opening the dev tools for the webview.");
      wv.openDevTools();
    });
  }

}
