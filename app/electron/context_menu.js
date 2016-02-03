// This gives you default context menu (cut, copy, paste)
// in all input fields and textareas across your app.

'use strict';
if (require) {


  const remote = require('electron').remote;
  const Menu = remote.Menu;
  const MenuItem = remote.MenuItem;

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

  const textMenu = new Menu();
  textMenu.append(cut);
  textMenu.append(copy);
  textMenu.append(paste);

  document.addEventListener('contextmenu', e => {

    switch (e.target.nodeName) {
      case 'TEXTAREA':
      case 'INPUT':
        e.preventDefault();
        textMenu.popup(remote.getCurrentWindow());
        break;
    }

  }, false);
}
