import jetpack from 'fs-jetpack';
import os from 'os';

export class ReportsController {

  constructor($log, Project, $scope) {
    'ngInject';

    const vm = this;
    vm.jetpack = jetpack;
    vm.os = os;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;

    // data to pass to preloader script
    vm.$scope.datapoints = vm.Project.getDatapoints();

    // TODO: we'll have to figure out this if it needs to be an absolute path
    vm.$scope.preloadPath = '/Users/kflemin/repos/OpenStudio-PAT/app/app/reports/preload.js';

    // Find all possible reports
    var html_reports = vm.jetpack.find('app/app/reports/projectReports', {matching: '*.html'});
    vm.$scope.projectReports = [];
    _.forEach(html_reports, function (html_report) {
      var report = {};
      if (vm.os.platform() == 'win32'){
        report.name = html_report.split('\\').pop().replace('.html', '');
        report.url = html_report.replace('app\\app\\', 'app\\');//).replace("\\","/");
      } else {
        report.name = html_report.split('/').pop().replace('.html', '');
        report.url = html_report.replace('app/app/', 'app/');//).replace("\\","/");
        vm.$log.debug('REPORT name: ', report.name);
        vm.$log.debug('REPORT url: ', report.url);
      }

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
    var wv = document.getElementById('wv');
    wv.addEventListener('dom-ready', function () {
      console.log('Opening the dev tools for the webview.');
      wv.openDevTools();
    });
  }

}
