import { EXPECTED_MENU_ITEMS } from '../../constants';
import { MenuItemPO } from './menu-item.po';

export class SaveMenuItemPO extends MenuItemPO {
  static readonly MENUS = [EXPECTED_MENU_ITEMS.FILE.id, EXPECTED_MENU_ITEMS.FILE.x.SAVE.id];
}
