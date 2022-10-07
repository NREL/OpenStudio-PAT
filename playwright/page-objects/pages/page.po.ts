import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { EXPECTED_DETAILS_BY_PAGE, Page } from '../../constants';
import { BasePageObject } from '../base.po';
import { NavPO } from '../nav.po';

export class PagePO extends BasePageObject {
  static readonly EXPECTED_PAGE: Page;

  static get route(): string {
    const PRE_ROUTE_STR = 'index.html#';
    const pageUrl = App.page.url();
    return pageUrl.slice(pageUrl.indexOf(PRE_ROUTE_STR) + PRE_ROUTE_STR.length);
  }
  static get container(): Locator {
    return App.page.locator('main.container-fluid');
  }
  static get webview(): Locator {
    return this.container.locator('webview');
  }

  static async getTitle(): Promise<Locator> {
    const h4 = this.container.locator('h4').first();
    const translate = h4.locator('translate');
    return (await translate.count()) > 0 ? translate : h4;
  }

  static isRouteOk() {
    expect(this.route).toBe(EXPECTED_DETAILS_BY_PAGE[this.EXPECTED_PAGE].route);
  }

  static async isTitleOk() {
    expect(await this.getTitle()).toHaveText(this.EXPECTED_PAGE);
  }

  static async isNavOk() {
    await NavPO.isItemOk(NavPO.activeItem, EXPECTED_DETAILS_BY_PAGE[this.EXPECTED_PAGE]);
  }

  static async isOk() {
    this.isRouteOk();
    await this.isTitleOk();
    await this.isNavOk();
  }
}
