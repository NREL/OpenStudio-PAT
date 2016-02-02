import { app, Menu, BrowserWindow } from 'electron';

const setDevMenu = () => {
  const devMenu = Menu.buildFromTemplate([{
    label: 'Development',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: () => {
        BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
      }
    }, {
      label: 'Toggle DevTools',
      accelerator: 'Alt+CmdOrCtrl+I',
      click: () => {
        BrowserWindow.getFocusedWindow().toggleDevTools();
      }
    }, {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: () => {
        app.quit();
      }
    }]
  }]);
  Menu.setApplicationMenu(devMenu);
};

export default {
  setDevMenu: setDevMenu
};
