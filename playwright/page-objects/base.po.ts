import { Page } from "@playwright/test";

export class BasePageObject {
  private readonly _page: Page;
  get page() {
    return this._page;
  }

  constructor(page: Page) {
    this._page = page;
  }
}