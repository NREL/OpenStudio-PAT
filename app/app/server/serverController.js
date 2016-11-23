export class ServerController {

  constructor($log, Project, OsServer, $sce) {
    'ngInject';

    const vm = this;
    vm.OsServer = OsServer;
    vm.Project = Project;
    vm.$log = $log;
    vm.$sce = $sce;

    vm.serverType = vm.Project.getRunType().name;
    vm.serverStatus = vm.OsServer.getServerStatus(vm.serverType);
    vm.serverURL = vm.OsServer.getSelectedServerURL();
    vm.safeURL = vm.$sce.trustAsResourceUrl(vm.serverURL);

  }

}
