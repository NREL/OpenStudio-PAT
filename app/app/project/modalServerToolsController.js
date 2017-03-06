import {shell} from 'electron';

export class ModalServerToolsController {

  constructor($log, $scope, $uibModalInstance, OsServer, Project, toastr, Message) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.OsServer = OsServer;
    vm.Project = Project;
    vm.$scope = $scope;
    vm.toastr = toastr;
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
    vm.toastr.info('Starting Local Server...This make take a while.');
    vm.OsServer.startServer('local').then(() => {
      vm.toastr.success('Connected to server!');
    }, response => {
      if (vm.Message.showDebug()) vm.$log.debug('SERVER NOT STARTED, ERROR: ', response);
      vm.toastr.error('Error: server did not start');
    });
  }

  stopLocalServer() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('IN MODAL STOP LOCAL SERVER');
    vm.toastr.info('Stopping Local Server...This make take a while.');
    vm.OsServer.stopServer('local').then(() => {
      if (vm.Message.showDebug()) vm.$log.debug('*****  Local Server Stopped *****');
      vm.toastr.success('Server stopped successfully');

    }, error => {
      vm.OsServer.setProgress(0, 'Error Stopping Server');
      if (vm.Message.showDebug()) vm.$log.debug('ERROR STOPPING SERVER, ERROR: ', error);
      vm.toastr.error('Error: server could not be stopped');
    });
  }

  // check if selected server is alive, if so set its status to 'started', otherwise set status to 'stopped'
  pingServer() {
    const vm = this;
    if (vm.Message.showDebug()) vm.$log.debug('IN MODAL PING SELECTED SERVER');
    vm.OsServer.pingServer().then(() => {
      vm.toastr.success('Server is Alive');
    }, error => {
      if (vm.Message.showDebug()) vm.$log.debug('Server is offline: ', error);
      vm.toastr.error('Server is Offline');
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
