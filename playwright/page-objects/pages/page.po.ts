import { expect, Locator } from '@playwright/test';
import { PageDetails } from '../../mocks';
import { BasePageObject } from '../base.po';
import { NavPageObject } from '../nav.po';

export class PagePageObject extends BasePageObject {
  readonly EXPECTED_PAGE_DETAILS: PageDetails;

  get route(): string {
    const PRE_ROUTE_STR = 'index.html#';
    const pageUrl = this.page.url();
    return pageUrl.slice(pageUrl.indexOf(PRE_ROUTE_STR) + PRE_ROUTE_STR.length);
  }
  get container(): Locator {
    return this.page.locator('main.container-fluid');
  }
  get title(): Locator {
    return this.container.locator('h4').first();
  }

  isRouteOk() {
    expect(this.route).toBe(this.EXPECTED_PAGE_DETAILS.route);
  }

  async isTitleOk() {
    await expect(this.title).toHaveText(this.EXPECTED_PAGE_DETAILS.title);
  }

  async isNavOk() {
    const navPO = new NavPageObject();
    await navPO.isItemOk(navPO.activeItem, this.EXPECTED_PAGE_DETAILS);
  }

  async isOk() {
    this.isRouteOk();
    await this.isTitleOk();
    await this.isNavOk();
  }
}
