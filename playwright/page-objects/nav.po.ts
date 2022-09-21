import { expect, Locator } from '@playwright/test';
import { PageDetails } from '../mocks';
import { BasePageObject } from './base.po';

export class NavPageObject extends BasePageObject {
  get list(): Locator {
    return this.page.locator('ul.nav');
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

  async isItemOk(
    item: Locator,
    expectedPageDetails: Omit<PageDetails, 'title'>
  ) {
    expect(await this.getRouteFor(item)).toBe(expectedPageDetails.route);
    expect(await this.getIconAltFor(item)).toBe(expectedPageDetails.iconAlt);
    expect(await this.getIconImgNameFor(item)).toBe(
      expectedPageDetails.iconImgName
    );
  }
}
