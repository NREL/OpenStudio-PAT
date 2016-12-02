/*global bootlint*/

import {remote} from 'electron';
const {app, Menu, shell} = remote;
import jetpack from 'fs-jetpack';

export function runBlock($rootScope, $state, $window, $document, $translate, toastr, MeasureManager, DependencyManager, Project, BCL, OsServer, SetProject, OpenProject, $log) {
  'ngInject';

  let exitReady = false;

  $window.onbeforeunload = e => {
    console.log('EXIT BUTTON CLICKED?: ', remote.getGlobal('exitClicked'));
    if (!exitReady && remote.getGlobal('exitClicked')) {
      try {
        // only if project is set
        if (Project.getProjectDir() != null) {
          e.returnValue = false;
          toastr.info('Preparing to Exit');
          Project.modifiedModal().then(() => {
            $log.debug('Resolving modifiedModal()');
            MeasureManager.stopMeasureManager();
            // force stop LOCAL server (even if remote server is running)
            // TODO: what to do about remote server?
            OsServer.stopServer('local').then(response => {
              //  server is stopped
              exitReady = true;
              app.quit();
            }, error => {
              exitReady = true;
              app.quit();
            });
          }, () => {
            exitReady = true;
            app.quit();
          });
        } else {
          // nothing to do, exit.
          exitReady = true;
          app.quit();
        }
      } catch (e) {
        // TODO: log something to a file
        if (Project.getProjectDir() != null) {
          //jetpack.write(Project.getProjectDir().path('serverStopTest.json'), {message: 'There was an error closing the app.'});
        }
        exitReady = true;
        app.quit();
      }
    }

    // Prevent exit.  Uncomment to test
    //e.returnValue = false;
  };

  $window.lint = () => {
    const s = $document[0].createElement('script');
    s.src = 'https://maxcdn.bootstrapcdn.com/bootlint/latest/bootlint.min.js';
    s.onload = () => bootlint.showLintReportForCurrentDocument([]);
    $document[0].body.appendChild(s);
  };


  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    // Save pretty options when leaving analysis state (needed for PAT.json and for DesignAlternatives tab)
    if (fromState.name == 'analysis') {
      Project.savePrettyOptions();
    }
    // warn user that they need to cancel their run before moving from this state
    if (fromState.name == 'run' && OsServer.getAnalysisRunningFlag()) {
      event.preventDefault();
      OsServer.showAnalysisRunningDialog();
    }

  });

  // For now don't check for dependencies..wait for Kyle's new code
  //DependencyManager.checkDependencies()
  //  .then(_.bind(MeasureManager.startMeasureManager, MeasureManager), _.bind(MeasureManager.startMeasureManager, MeasureManager));
  MeasureManager.startMeasureManager();

  // open project and navigate to analysis tab
  OpenProject.openModal().then(() => {
    //$state.go('analysis');
    $log.debug('RELOADING PAGE / NAVIGATE TO ANALYSIS PAGE');
    $state.transitionTo('analysis', {}, {reload: true});
  });

  const initialLanguage = $translate.use();
  const setLanguage = language => {
    console.log(language);
    $translate.use(language);
  };

  const fileMenu = {
    label: 'File',
    submenu: [{
      label: 'New',
      accelerator: 'Ctrl+N',
      click: () => SetProject.newProject()
    }, {
      label: 'Open',
      accelerator: 'Ctrl+O',
      click: () => SetProject.openProject()
    }, {
      label: 'Save',
      accelerator: 'Ctrl+S',
      click: () => SetProject.saveProject()
    }, {
      label: 'Save As',
      click: () => SetProject.saveAsProject()
    }, {
      label: 'Quit',
      accelerator: 'Ctrl+Q',
      click: () => app.quit()
    }]
  };
  const template = [{
    label: 'Edit',
    submenu: [{
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    }, {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }]
  }, {
    label: 'View',
    submenu: [{
      label: 'Language',
      submenu: [{
        label: 'English',
        type: 'radio',
        checked: initialLanguage == 'en',
        click() {
          setLanguage('en');
        }
      }, {
        label: 'French',
        type: 'radio',
        checked: initialLanguage == 'fr',
        click() {
          setLanguage('fr');
        }
      }]
    }, {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click(item, focusedWindow) {
        if (focusedWindow) focusedWindow.reload();
      }
    }, {
      label: 'Toggle Full Screen',
      accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
      click(item, focusedWindow) {
        if (focusedWindow) focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click(item, focusedWindow) {
        if (focusedWindow) focusedWindow.webContents.toggleDevTools();
      }
    }]
  }, {
    label: 'Window',
    role: 'window',
    submenu: [{
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }, {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }, {
      label: 'Open BCL',
      click() {
        BCL.openBCLModal().then(() => {
          // Do something
        });
      }
    }]
  }, {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: 'Learn More',
      click() {
        shell.openExternal('https://www.openstudio.net/');
      }
    }, {
      label: 'Search Issues',
      click() {
        shell.openExternal('https://github.com/NREL/OpenStudio-PAT/issues');
      }
    }]
  }];

  if (process.platform === 'darwin') {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [{
        label: 'About ' + name,
        role: 'about'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      }, {
        label: 'Show All',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        }
      }]
    }, {
      label: 'File',
      submenu: [{
        label: 'New',
        accelerator: 'Command+N',
        click() {
          SetProject.newProject();
        }
      }, {
        label: 'Open',
        accelerator: 'Command+O',
        click() {
          SetProject.openProject();
        }
      }, {
        label: 'Save',
        accelerator: 'Command+S',
        click() {
          SetProject.saveProject();
        }
      }, {
        label: 'Save As',
        click() {
          SetProject.saveAsProject();
        }
      }]
    });

    // Window menu.
    template[3].submenu.push({
      type: 'separator'
    }, {
      label: 'Bring All to Front',
      role: 'front'
    });
  } else {
    template.unshift(fileMenu);
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
