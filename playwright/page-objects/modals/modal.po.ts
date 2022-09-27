import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { BasePageObject } from '../base.po';

export class ModalPO extends BasePageObject {
  static readonly EXPECTED_TITLE: string;
  static readonly EXPECTED_FOOTER_BUTTONS: Record<string, string>;

  static get dialog(): Locator {
    return App.page.locator('.modal-dialog').filter({
      has: App.page.locator('.modal-title', { hasText: this.EXPECTED_TITLE })
    });
  }
  static get title(): Locator {
    return this.dialog.locator('.modal-title');
  }
  static get footerButtons(): Locator {
    return this.dialog.locator('.modal-footer button');
  }

  static getButton(buttonText: string, buttons = this.footerButtons) {
    return buttons.filter({ hasText: buttonText });
  }

  static async clickButton(buttonText: string, buttons = this.footerButtons) {
    return this.getButton(buttonText, buttons).click();
  }

  static async isTitleOk() {
    await expect(this.title).toHaveText(this.EXPECTED_TITLE);
  }

  static async areButtonsOk(EXPECTED_BUTTONS = this.EXPECTED_FOOTER_BUTTONS, buttons = this.footerButtons) {
    await expect(buttons).toHaveCount(Object.keys(EXPECTED_BUTTONS).length);
    const allInnerTexts = await buttons.allInnerTexts();
    Object.values(EXPECTED_BUTTONS).forEach(buttonText => expect(allInnerTexts).toContain(buttonText));
  }

  static async isOk() {
    await this.isTitleOk();
    await this.areButtonsOk();
  }
}
