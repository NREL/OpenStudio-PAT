/***********************************************************************************************************************
 *  OpenStudio(R), Copyright (c) 2008-2020, Alliance for Sustainable Energy, LLC. All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 *  following conditions are met:
 *
 *  (1) Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 *  disclaimer.
 *
 *  (2) Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 *  following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 *  (3) Neither the name of the copyright holder nor the names of any contributors may be used to endorse or promote
 *  products derived from this software without specific prior written permission from the respective party.
 *
 *  (4) Other than as required in clauses (1) and (2), distributions in any form of modifications or other derivative
 *  works may not use the "OpenStudio" trademark, "OS", "os", or any other confusingly similar designation without
 *  specific prior written permission from Alliance for Sustainable Energy, LLC.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 *  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER, THE UNITED STATES GOVERNMENT, OR ANY CONTRIBUTORS BE LIABLE FOR
 *  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 *  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 *  AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **********************************************************************************************************************/
import jetpack from 'fs-jetpack';
import YAML from 'yamljs';
export class ModalNewAwsCredentialsController {

  constructor($log, $uibModalInstance, $scope, Project, Message) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.jetpack = jetpack;
    vm.Project = Project;
    vm.YAML = YAML;
    vm.$scope = $scope;
    vm.Message = Message;

    if (vm.Message.showDebug()) vm.$log.debug('in Modal New Aws Credentials Controller');

    vm.$scope.name = null;
    vm.$scope.accessKey = null;
    vm.$scope.secretKey = null;

  }

  ok() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('in OK function');
    // make a new yaml file
    let filename = vm.$scope.name;
    if (filename.substr(-4, 4) != '.yml') {
      filename = filename + '.yml';
    }
    const data = {accessKey: vm.$scope.accessKey, secretKey: vm.$scope.secretKey};
    const yamlString = vm.YAML.stringify(data, 4);
    vm.jetpack.write(vm.Project.getAwsDir().path(filename), yamlString);
    const truncatedAccessKey = vm.$scope.accessKey.substr(0, 4) + '****';
    // reset variables
    vm.$scope.accessKey = null;
    vm.$scope.secretKey = null;

    vm.$uibModalInstance.close([_.replace(vm.$scope.name, '.yml', ''), truncatedAccessKey]);
  }

  cancel() {
    const vm = this;
    vm.$uibModalInstance.dismiss('cancel');
  }

}
