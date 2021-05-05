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
import {shell} from 'electron';

export class ModalServerToolsController {

  constructor($log, $scope, $uibModalInstance, OsServer, Project, $translate, toastr, Message) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.OsServer = OsServer;
    vm.Project = Project;
    vm.$scope = $scope;
    vm.toastr = toastr;
    vm.$translate = $translate;
    vm.shell = shell;
    vm.Message = Message;

    vm.$scope.projectDir = vm.Project.getProjectDir();
    if (vm.$scope.projectDir){
      vm.$scope.projectDir = vm.$scope.projectDir.path();
    }
    if (vm.Message.showDebug()) vm.$log.debug('Project dir: ', vm.$scope.projectDir);

  }

  getLocalServer() {
    const vm = this;
    return vm.OsServer.getLocalServerUrl();
  }

  startLocalServer() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('IN MODAL START LOCAL SERVER');
    vm.$translate('toastr.startLocalServer').then(translation => {
      vm.toastr.info(translation);
    });

    vm.OsServer.startServer('local').then(() => {
      vm.$translate('toastr.connectedServer').then(translation => {
        vm.toastr.success(translation);
      });
    }, response => {
      if (vm.Message.showDebug()) vm.$log.debug('SERVER NOT STARTED, ERROR: ', response);
      vm.$translate('toastr.connectedServerError').then(translation => {
        vm.toastr.error(translation);
      });
    });
  }

  stopLocalServer() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('IN MODAL STOP LOCAL SERVER');
    vm.$translate('toastr.stopLocalServer').then(translation => {
      vm.toastr.info(translation);
    });
    vm.OsServer.stopServer('local').then(() => {
      if (vm.Message.showDebug()) vm.$log.debug('*****  Local Server Stopped *****');
      vm.$translate('toastr.stoppedServer').then(translation => {
        vm.toastr.success(translation);
      });

    }, error => {
      vm.OsServer.setProgress(0, 'Error Stopping Server');
      if (vm.Message.showDebug()) vm.$log.debug('ERROR STOPPING SERVER, ERROR: ', error);
      vm.$translate('toastr.stoppedServerError').then(translation => {
        vm.toastr.error(translation);
      });
    });
  }

  // check if selected server is alive, if so set its status to 'started', otherwise set status to 'stopped'
  pingServer() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('IN MODAL PING SELECTED SERVER');
    vm.OsServer.pingServer().then(() => {
      vm.$translate('toastr.serverAlive').then(translation => {
        vm.toastr.success(translation);
      });

    }, error => {
      if (vm.Message.showDebug()) vm.$log.debug('Server is offline: ', error);
      vm.$translate('toastr.serverOffline').then(translation => {
        vm.toastr.error(translation);
      });
    });
  }

  viewLocalServer() {
    const vm = this;
    vm.shell.openExternal(vm.OsServer.getLocalServerUrl());
  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }
}
