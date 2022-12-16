import { EXPECTED_MENU } from '../../constants';
import { MenuItemPO } from './menu-item.po';

export class ServerToolsMenuItemPO extends MenuItemPO {
  static readonly MENUS = [EXPECTED_MENU.WINDOW.id, EXPECTED_MENU.WINDOW.x.SERVER_TOOLS.id];
}
