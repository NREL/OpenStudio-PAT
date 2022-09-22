import { expect } from '@playwright/test';
import { App } from '../../App';
import { BasePageObject } from '../base.po';

export class MenuItemPageObject extends BasePageObject {
  readonly MENUS: string[];

  async click() {
    return App.clickMenuItem(this.MENUS);
  }

  async isOk() {
    const menu = await App.getMenuItem(this.MENUS[0]);
    expect(menu).toBeDefined();
    expect(menu!.label).toBe(this.MENUS[0]);

    let submenuItems = this.MENUS.length > 1 ? menu!.submenu!.items : undefined;
    for (let i = 1; i < this.MENUS.length; ++i) {
      expect(submenuItems).toContainEqual(expect.objectContaining({ label: this.MENUS[i] }));
      if (i < this.MENUS.length - 1) {
        submenuItems = submenuItems!.find(item => item.label === this.MENUS[i])!.submenu!.items;
      }
    }
  }
}
