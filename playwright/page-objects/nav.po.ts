import { expect, Locator } from '@playwright/test';
import { App } from '../App';
import { EXPECTED_DETAILS_BY_PAGE, PageDetails } from '../mocks';
import { BasePageObject } from './base.po';

export class NavPageObject extends BasePageObject {
  get list(): Locator {
    return App.page.locator('ul.nav');
  }

  get items(): Locator {
    return this.list.locator('li');
  }

  get activeItem(): Locator {
    return this.list.locator('li.active');
  }

  async getRouteFor(item: Locator) {
    const href = (await item.locator('a').getAttribute('href')) ?? '';
    return href.startsWith('#') ? href.slice(1) : href;
  }

  async getIconAltFor(item: Locator) {
    const img = item.locator('a img');
    return (await img.getAttribute('alt')) ?? '';
  }

  async getIconImgNameFor(item: Locator) {
    const img = item.locator('a img');
    const iconImgSrc = (await img.getAttribute('src')) ?? '';
    return iconImgSrc.slice(iconImgSrc.lastIndexOf('/') + 1);
  }

  async isItemOk(item: Locator, expectedPageDetails: Omit<PageDetails, 'title'>) {
    expect(await this.getRouteFor(item)).toBe(expectedPageDetails.route);
    expect(await this.getIconAltFor(item)).toBe(expectedPageDetails.iconAlt);
    expect(await this.getIconImgNameFor(item)).toBe(expectedPageDetails.iconImgName);
  }

  async areItemsOk() {
    const EXPECTED_DETAILS = Object.values(EXPECTED_DETAILS_BY_PAGE);
    expect(await this.items.count()).toEqual(EXPECTED_DETAILS.length);
    for (const [n, expectedDetails] of EXPECTED_DETAILS.entries()) {
      await this.isItemOk(this.items.nth(n), expectedDetails);
    }
  }

  async clickIcon(iconAlt: string) {
    const anchorTag = this.items.locator('a').filter({
      has: App.page.locator(`img[alt="${iconAlt}"]`)
    });
    await anchorTag.click();
  }
}
