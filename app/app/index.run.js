/*global bootlint*/

export function runBlock($window, DependencyManager) {
  'ngInject';

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
