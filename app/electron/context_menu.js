import {remote} from 'electron';
import jetpack from 'fs-jetpack';
const {app, Menu, MenuItem} = remote;

const env = jetpack.cwd(app.getAppPath()).read('env.json', 'json');

(function () {
  'use strict';

  const cut = new MenuItem({
    label: 'Cut',
    click: () => {
      document.execCommand('cut');
    }
  });

  const copy = new MenuItem({
    label: 'Copy',
    click: () => {
      document.execCommand('copy');
    }
  });

  const paste = new MenuItem({
    label: 'Paste',
    click: () => {
      document.execCommand('paste');
    }
  });

  // const inspect = new MenuItem({
  //   label: 'Inspect',
  //   accelerator: 'CmdOrCtrl+Shift+I',
  //   click: () => {
  //     remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y);
  //   }
  // });

  const textMenu = new Menu();
  textMenu.append(cut);
  textMenu.append(copy);
  textMenu.append(paste);

  let rightClickPosition = null;
  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (env.name == 'development') {
      rightClickPosition = {x: e.x, y: e.y};
      remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y);
    }

    // Set the default context menu (cut, copy, paste) in all input textarea fields elements
    switch (e.target.nodeName) {
      case 'TEXTAREA':
      case 'INPUT':
        textMenu.popup(remote.getCurrentWindow());
        break;
    }
  }, false);
}());
