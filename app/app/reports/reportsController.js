import jetpack from 'fs-jetpack';
import os from 'os';
import {remote} from 'electron';
import env from '../../env';

const {app} = remote;
export class ReportsController {

  constructor($log, Project, $scope) {
    'ngInject';

    const vm = this;
    vm.jetpack = jetpack;
    vm.os = os;
    vm.$log = $log;
    vm.$scope = $scope;
    vm.Project = Project;
    vm.env = env;
    vm.preloadPath = 'file://';
    vm.reportDir = os.homedir() + '/Openstudio/PAT/Project_Reporting_Measures';

    // data to pass to preloader script
    vm.$scope.datapoints = vm.Project.getDatapoints();
    vm.$log.debug('DATAPOINTS: ', vm.$scope.datapoints);
    vm.testResults = vm.$scope.datapoints;

    // preload.js path depends on environment.  we need full path to file
    vm.$scope.preloadPath = `file://${app.getAppPath()}/scripts/preload.js`;

    vm.$log.debug("PRELOAD PATH: ", vm.$scope.preloadPath);

    // Find all possible reports
    var html_reports = [];
    // TODO figure out why vm.env does not seem to be defined in development
    if (vm.env && (vm.env.name == 'production')) {
      html_reports = vm.jetpack.find(`${app.getAppPath()}/../projectReports`, {matching: '*.html'});
    } else {
      html_reports = vm.jetpack.find('app/app/reports/projectReports', {matching: '*.html'});
    }
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

    var wv = angular.element(document.getElementById('wv'));
    wv.attr('preload',vm.$scope.preloadPath);

    // Set the default project report to the first one found
    vm.$scope.selectedReportName = vm.$scope.projectReports[0].name;
    vm.$scope.selectedReportURL = vm.$scope.projectReports[0].url;
    wv.attr('src',vm.$scope.selectedReportURL);

    // Update the selected report
    $scope.updateSelectedReport = function (newReportName) {
      _.forEach(vm.$scope.projectReports, function (report) {
        if (report.name == newReportName) {
          vm.$scope.selectedReportName = report.name;
          vm.$scope.selectedReportURL = report.url;

      	  wv.attr('src',vm.$scope.selectedReportURL);
        }
      });
      //pass data into webview when dom is ready
      angular.element(document).ready(function () {
        vm.passData();
      });
    };

    // Uncomment this to view webview developer tools to debug project reports
    if (vm.env != 'production') {
      vm.openWebViewDevTools();
    }

    //pass data into webview when dom is ready
    angular.element(document).ready(function () {
      vm.passData();
    });
  }

  // Opens the developer tools for the webview
  openWebViewDevTools() {
    var wv = document.getElementById('wv');
    wv.addEventListener('dom-ready', function () {
      console.log('Opening the dev tools for the webview.');
      wv.openDevTools();
    });
  }

  // pass Data to report.html
  passData() {
    const vm = this;
    var wv = document.getElementById('wv');
    wv.executeJavaScript(`setReportDir(${JSON.stringify(vm.reportDir)});`);
    wv.executeJavaScript(`setData(${JSON.stringify(vm.testResults)});`);
  }

}
