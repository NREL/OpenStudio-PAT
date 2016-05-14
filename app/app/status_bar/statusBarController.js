export class StatusBarController {
  constructor($scope, StatusBar) {
    'ngInject';

    const vm = this;
    vm.$scope = $scope;

    vm.status = StatusBar.data.status;
    vm.showLoading = StatusBar.data.showLoading;

    const updateStatus = function (status, showLoading) {
      vm.status = status;
      vm.showLoading = showLoading;
      vm.$scope.$digest();
    };

    StatusBar.registerObserver(updateStatus);
  }
}
