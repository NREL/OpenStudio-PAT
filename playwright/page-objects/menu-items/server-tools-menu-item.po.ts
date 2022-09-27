import { EXPECTED_MENU_ITEMS } from '../../constants';
import { MenuItemPO } from './menu-item.po';

export class ServerToolsMenuItemPO extends MenuItemPO {
  static readonly MENUS = [EXPECTED_MENU_ITEMS.WINDOW.id, EXPECTED_MENU_ITEMS.WINDOW.x.SERVER_TOOLS.id];
}
