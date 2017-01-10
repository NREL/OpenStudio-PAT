import jetpack from 'fs-jetpack';
import YAML from 'yamljs';
export class ModalNewAwsCredentialsController {

  constructor($log, $uibModalInstance, $scope, Project) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.Project = Project;
    vm.YAML = YAML;
    vm.$scope = $scope;
    vm.$log.debug('in Modal New Aws Credentials Controller');

    vm.$scope.name = null;
    vm.$scope.accessKey = null;
    vm.$scope.secretKey = null;

  }

  ok() {
    const vm = this;
    vm.$log.debug('in OK function');
    // make a new yaml file
    let filename = vm.$scope.name;
    if (filename.substr(-4, 4) != '.yml') {
      filename = filename + '.yml';
    }
    const data = {accessKey: vm.$scope.accessKey, secretKey: vm.$scope.secretKey};
    const yamlString = vm.YAML.stringify(data, 4);
    vm.jetpack.write(vm.Project.getAwsDir().path(filename), yamlString);
    const truncatedAccessKey = vm.$scope.accessKey.substr(0,4) + '****';
    // reset variables
    vm.$scope.accessKey = null;
    vm.$scope.secretKey = null;

    vm.$uibModalInstance.close(vm.$scope.name, truncatedAccessKey);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
