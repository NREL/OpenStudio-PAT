import { EXPECTED_MENU_ITEMS } from '../../constants';
import { MenuItemPageObject } from './menu-item.po';

export class ServerToolsMenuItemPageObject extends MenuItemPageObject {
  readonly MENUS = [EXPECTED_MENU_ITEMS.WINDOW.id, EXPECTED_MENU_ITEMS.WINDOW.x.SERVER_TOOLS.id];
}
