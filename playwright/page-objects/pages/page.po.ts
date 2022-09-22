import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { PageDetails } from '../../mocks';
import { BasePageObject } from '../base.po';
import { NavPageObject } from '../nav.po';

export class PagePageObject extends BasePageObject {
  private EXPECTED_PAGE_DETAILS: PageDetails;

  get route(): string {
    const PRE_ROUTE_STR = 'index.html#';
    const pageUrl = App.page.url();
    return pageUrl.slice(pageUrl.indexOf(PRE_ROUTE_STR) + PRE_ROUTE_STR.length);
  }
  get container(): Locator {
    return App.page.locator('main.container-fluid');
  }

  constructor(page: PageDetails) {
    super();
    this.EXPECTED_PAGE_DETAILS = page;
  }

  async getTitle(): Promise<Locator> {
    const h4 = this.container.locator('h4').first();
    const translate = h4.locator('translate');
    return (await translate.count()) > 0 ? translate : h4;
  }

  isRouteOk() {
    expect(this.route).toBe(this.EXPECTED_PAGE_DETAILS.route);
  }

  async isTitleOk() {
    await expect(await this.getTitle()).toHaveText(this.EXPECTED_PAGE_DETAILS.title);
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
