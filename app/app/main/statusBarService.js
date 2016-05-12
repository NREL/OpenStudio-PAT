export class StatusBar {
  constructor() {
    'ngInject';

    const vm = this;
    vm.status = '';
  }

  set(status) {
    const vm = this;
    vm.status = status;
  }

  get() {
    const vm = this;
    return vm.status;
  }
}
