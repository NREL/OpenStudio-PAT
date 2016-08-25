/*global bootlint*/

import {remote} from 'electron';
const {app, Menu, shell} = remote;

export function runBlock($rootScope, $state, $window, $document, $translate, MeasureManager, DependencyManager, Project, BCL, OsServer) {
  'ngInject';

  $window.onbeforeunload = e => {

    // Save project automatically on exit
    Project.exportPAT();

    // Stop server
    // THE CLI doesn't work to stop the server yet
    //OsServer.stopServer().then(response => {
    //  server is stopped
    //});

    // Prevent exit
    //e.returnValue = false;
    MeasureManager.stopMeasureManager();
  };

  $window.lint = () => {
    const s = $document[0].createElement('script');
    s.src = 'https://maxcdn.bootstrapcdn.com/bootlint/latest/bootlint.min.js';
    s.onload = () => bootlint.showLintReportForCurrentDocument([]);
    $document[0].body.appendChild(s);
  };

  // Save pretty options when leaving analysis state (needed for PAT.json and for DesignAlternatives tab)
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (fromState.name == 'analysis') {
      Project.savePrettyOptions();
    }
  });

  DependencyManager.checkDependencies();

  MeasureManager.startMeasureManager();

  const initialLanguage = $translate.use();
  const setLanguage = language => {
    console.log(language);
    $translate.use(language);
  };

  const fileMenu = {
    label: 'File',
    submenu: [{
      label: 'Quit',
      accelerator: 'Ctrl+Q',
      click: () => app.quit()
    }]
  };
  const template = [{
    label: 'Edit',
    submenu: [{
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    }, {
      label: 'Redo',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    }, {
      type: 'separator'
    }, {
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
