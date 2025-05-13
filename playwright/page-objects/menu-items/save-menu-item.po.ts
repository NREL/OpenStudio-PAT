import { EXPECTED_MENU } from '../../constants';
import { MenuItemPO } from './menu-item.po';

export class SaveMenuItemPO extends MenuItemPO {
  static readonly MENUS = [EXPECTED_MENU.FILE.id, EXPECTED_MENU.FILE.x.SAVE.id];
}
