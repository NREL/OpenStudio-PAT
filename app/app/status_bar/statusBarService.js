export class StatusBar {
  constructor() {
    'ngInject';

    const vm = this;

    vm.data = {
      status: '',
      showLoading: false
    };

    vm.deregisterObserver();
  }

  registerObserver(cb) {
    const vm = this;
    vm.observerCallback = cb;
  }

  deregisterObserver() {
    const vm = this;
    vm.observerCallback = null;
  }

  set(status, showLoading = false) {
    const vm = this;
    if (vm.data.status !== status || vm.data.showLoading !== showLoading) {
      vm.data.status = status;
      vm.data.showLoading = showLoading;
      vm.observerCallback(status, showLoading);
    }
  }

  clear() {
    const vm = this;
    vm.set('');
  }
}
