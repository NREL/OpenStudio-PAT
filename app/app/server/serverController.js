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

    //uncomment to open webview devtools
    //vm.openWebViewDevTools();

  }

  openWebViewDevTools() {
    const wv = document.getElementById('wv');
    wv.addEventListener('dom-ready', () => {
      console.log('Opening the dev tools for the webview.');
      wv.openDevTools();
    });
  }

}
