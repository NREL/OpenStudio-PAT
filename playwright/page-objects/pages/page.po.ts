import { expect, Locator } from '@playwright/test';
import { BasePageObject } from '../base.po';

export class PagePageObject extends BasePageObject {
  readonly EXPECTED_ROUTE: string;
  readonly EXPECTED_TITLE: string;

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
    expect(this.route).toBe(this.EXPECTED_ROUTE);
  }

  async isTitleOk() {
    await expect(this.title).toHaveText(this.EXPECTED_TITLE);
  }

  async isOk() {
    this.isRouteOk();
    await this.isTitleOk();
  }
}
