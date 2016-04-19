import * as jetpack from 'fs-jetpack';
import * as os from 'os';
import * as path from 'path';

export class OsServer {
  constructor($log) {
    'ngInject';
    const vm = this;


  }

  // start server (remote or local)
  startServer(type='local', options={}) {
    const vm = this;
    if (type == 'local')
      vm.remoteServer(options);
    else
      vm.localServer(options);


  }

  remoteServer(options={}) {
    const vm = this;

    // TODO: any other options need to be passed in (aws_config.yml)?

  }

  localServer(options={}) {
    const vm = this;

    // TODO: get path to local mongod
    // TODO: get path to local os server

  }


}
