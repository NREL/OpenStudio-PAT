import jetpack from 'fs-jetpack';
export class ModalNewClusterController {

  constructor($log, $uibModalInstance, $scope, Project, Message) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.Project = Project;
    vm.$scope = $scope;
    vm.Message = Message;

    if (vm.Message.showDebug()) vm.$log.debug('in Modal New Cluster Controller');

    vm.$scope.name = '';

  }

  ok() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in OK function');
    // make a new cluster.json file with name in it
    const filename = vm.$scope.name + '_cluster.json';
    const jsonObj = {cluster_name: vm.$scope.name};
    vm.jetpack.write(vm.Project.getProjectDir().path(filename), jsonObj);
    vm.$uibModalInstance.close(vm.$scope.name);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
