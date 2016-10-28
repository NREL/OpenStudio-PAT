import {remote} from 'electron';
const {app} = remote;
import jetpack from 'fs-jetpack';
import AdmZip from 'adm-zip';
import https from 'https';
import os from 'os';
import path from 'path';
import url from 'url';
const env = jetpack.cwd(app.getAppPath()).read('env.json', 'json');
const manifest = jetpack.cwd(app.getAppPath()).read('manifest.json', 'json');

export class DependencyManager {

  constructor($q, $http, $log, $translate, $uibModal, StatusBar) {
    'ngInject';

    const vm = this;
    vm.$http = $http;
    vm.$q = $q;
    vm.$log = $log;
    vm.$translate = $translate;
    vm.jetpack = jetpack;
    vm.AdmZip = AdmZip;
    vm.StatusBar = StatusBar;
    vm.translations = {};
    vm.exec = require('child_process').exec;
    vm.platform = os.platform();
    vm.$q = $q;
    vm.$uibModal = $uibModal;
    vm.downloadStatus = 'N/A';

    vm.tempDir = jetpack.cwd(app.getPath('temp'));
    vm.$log.debug('TEMPDIR HERE: ', app.getPath('temp'));
    vm.src = jetpack.cwd(app.getAppPath() + "/Resources/");
    vm.$log.debug('src:', vm.src.path());
  }

  // The following are valid names to ask for
  // "PAT_OS_CLI_PATH" "PAT_OS_META_CLI_PATH" "PAT_OS_BINDING_PATH" "PAT_RUBY_PATH" "PAT_MONGO_PATH"
  getPath(name) {
    const vm = this;

    let prefixPath = undefined;

    let exeExt = '';
    if( os.platform() == 'win32' ) {
      exeExt = '.exe';
    }
    let bindingExt = '.bundle';
    if( os.platform() == 'win32' ) {
      bindingExt = '.so';
    }

    if( env.name == 'production' ) {
      if( os.platform() == 'win32' ) {
        prefixPath = jetpack.cwd(app.getPath('exe'), '..');

        if( name == 'PAT_OS_CLI_PATH' ) {
           return prefixPath.path('..', 'bin/openstudio' + exeExt);
        } else if( name == 'PAT_OS_BINDING_PATH' ) {
          return prefixPath.path('..', 'Ruby/openstudio' + bindingExt);
        } else if( name == 'PAT_OS_META_CLI_PATH' ) {
          return prefixPath.path('OpenStudio-server/bin/openstudio_meta');
        } else if( name == 'PAT_RUBY_PATH' ) {
          return prefixPath.path('ruby/bin/ruby' + exeExt);
        } else if( name == 'PAT_MONGO_PATH' ) {
          return prefixPath.path('mongo/bin/mongod' + exeExt);
        }
      } else {
        prefixPath = jetpack.cwd(app.getPath('exe'), '../..', 'Resources');

        if( name == 'PAT_OS_CLI_PATH' ) {
           return prefixPath.path('OpenStudio/bin/openstudio' + exeExt);
        } else if( name == 'PAT_OS_BINDING_PATH' ) {
          return prefixPath.path('OpenStudio/Ruby/openstudio' + bindingExt);
        } else if( name == 'PAT_OS_META_CLI_PATH' ) {
          return prefixPath.path('OpenStudio-server/bin/openstudio_meta');
        } else if( name == 'PAT_RUBY_PATH' ) {
          return prefixPath.path('ruby/bin/ruby' + exeExt);
        } else if( name == 'PAT_MONGO_PATH' ) {
          return prefixPath.path('mongo/bin/mongod' + exeExt);
        }
      }
    } else {
      prefixPath = jetpack.cwd(app.getAppPath(),'..', 'depend');
    }

    if( env[name] ) {
      // Look in the env.json file 
      return env[name];
    } else if( process.env[name] ) {
      // Look for a system environment variable
      return process.env[name];  
    } else {
      // Look in a default location
      if( name == 'PAT_OS_CLI_PATH' ) {
         return prefixPath.path('OpenStudio/bin/openstudio' + exeExt);
      } else if( name == 'PAT_OS_BINDING_PATH' ) {
        return prefixPath.path('OpenStudio/Ruby/openstudio' + bindingExt);
      } else if( name == 'PAT_OS_META_CLI_PATH' ) {
        return prefixPath.path('OpenStudio-server/bin/openstudio_meta');
      } else if( name == 'PAT_RUBY_PATH' ) {
        return prefixPath.path('ruby/bin/ruby' + exeExt);
      } else if( name == 'PAT_MONGO_PATH' ) {
        return prefixPath.path('mongo/bin/mongod' + exeExt);
      }
    }
  }
}
