/*global bootlint*/

export function runBlock($window, DependencyManager, Project) {
  'ngInject';

  $window.onbeforeunload = e => {
    // just in case we are closing from the analysis tab, save pretty options first
    Project.savePrettyOptions();

    // Save project automatically on exit
    Project.exportPAT();

    // Prevent exit
    //e.returnValue = false;
  };

  $window.lint = function () {
    const s = document.createElement('script');
    s.src = 'https://maxcdn.bootstrapcdn.com/bootlint/latest/bootlint.min.js';
    s.onload = function () {
      bootlint.showLintReportForCurrentDocument([]);
    };
    document.body.appendChild(s);
  };

  DependencyManager.checkDependencies();
}
