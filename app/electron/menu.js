import { app, Menu, shell } from 'electron';
import env from './env';

const menu = [];

const fileMenu = {
  label: 'File',
  submenu: [{
    label: 'Quit',
    accelerator: 'Ctrl+Q',
    click: () => {
      app.quit();
    }
  }]
};

const macFileMenu = {
  label: 'Electron',
  submenu: [{
    label: 'About Electron',
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
    label: 'Hide Electron',
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
    click: () => {
      app.quit();
    }
  }]
};

const editMenu = {
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
};

const helpMenu = {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'About ParametricAnalysisTool',
    role: 'about'
  }, {
    label: 'Search Issues',
    click: () => {
      shell.openExternal('https://github.com/NREL/OpenStudio-PAT/issues');
    }
  }]
};

const devMenu = {
  label: 'Development',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow)
        focusedWindow.reload();
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: (() => {
      if (process.platform == 'darwin') return 'Ctrl+Command+F';
      return 'F11';
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: (() => {
      if (process.platform == 'darwin')
        return 'Alt+Command+I';
      else
        return 'Ctrl+Shift+I';
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) focusedWindow.toggleDevTools();
    }
  }]
};

if (process.platform == 'darwin') {
  menu.push(macFileMenu);
  menu.push(editMenu);
  menu.push(helpMenu);

  menu[menu.length - 1].submenu.push({
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    role: 'front'
  });
} else {
  menu.push(fileMenu);
  menu.push(editMenu);
  menu.push(helpMenu);
}

if (env.name !== 'production') {
  menu.push(devMenu);
}


export default {
  setMenu: () => {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  }
};
