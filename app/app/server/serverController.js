export class ServerController {

  constructor($log, OsServer, $sce) {
    'ngInject';

    const vm = this;
    vm.OsServer = OsServer;
    vm.$log = $log;
    vm.$sce = $sce;

    vm.serverStatus = vm.OsServer.getServerStatus();
    vm.serverType = vm.OsServer.getServerType();
    vm.serverURL = vm.OsServer.getServerURL();
    vm.safeURL = vm.$sce.trustAsResourceUrl(vm.serverURL);

    // TODO: fake it for now
    vm.serverStatus = 'started';

  }

}
