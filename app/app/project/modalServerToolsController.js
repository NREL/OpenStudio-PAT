export class ModalServerToolsController {

  constructor($log, $scope, $uibModalInstance, OsServer, Project, toastr) {
    'ngInject';

    const vm = this;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$log = $log;
    vm.OsServer = OsServer;
    vm.Project = Project;
    vm.$scope = $scope;
    vm.toastr = toastr;

    vm.$scope.projectDir = vm.Project.getProjectDir();
    if (vm.$scope.projectDir){
      vm.$scope.projectDir = vm.$scope.projectDir.path();
    }
    vm.$log.debug("Project dir: ", vm.$scope.projectDir);

  }

  startLocalServer() {
    const vm = this;
    vm.$log.debug('IN MODAL START LOCAL SERVER');
    vm.toastr.info('Starting Local Server...This make take a while.');
    vm.OsServer.startServer('local').then(response => {
      vm.toastr.success('Connected to server!');
    }, response => {
      vm.$log.debug('SERVER NOT STARTED, ERROR: ', response);
      vm.toastr.error('Error: server did not start');
    });
  }

  stopLocalServer() {
    const vm = this;
    vm.$log.debug('IN MODAL STOP LOCAL SERVER');
    vm.toastr.info('Stopping Local Server...This make take a while.');
    vm.OsServer.stopServer('local').then(response => {
      vm.$log.debug('*****  Local Server Stopped *****');
      vm.toastr.success('Server stopped successfully');

    }, error => {
      vm.OsServer.setProgress(0, 'Error Stopping Server');
      vm.$log.debug('ERROR STOPPING SERVER, ERROR: ', error);
      vm.toastr.error('Error: server could not be stopped');
    });
  }

  // check if selected server is alive, if so set its status to 'started', otherwise set status to 'stopped'
  pingServer() {
    const vm = this;
    vm.$log.debug('IN MODAL PING SELECTED SERVER');
    vm.OsServer.pingServer().then(response => {
      vm.toastr.success('Server is Alive');
    }, error => {
      vm.$log.debug('Server is offline: ', error);
      vm.toastr.error('Server is Offline');
    });
  }

  ok() {
    const vm = this;
    vm.$uibModalInstance.close();
  }
}
