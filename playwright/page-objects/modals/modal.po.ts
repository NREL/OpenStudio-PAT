import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { BasePageObject } from '../base.po';

export class ModalPageObject extends BasePageObject {
  readonly EXPECTED_TITLE: string;
  readonly EXPECTED_FOOTER_BUTTONS: Record<string, string>;

  get dialog(): Locator {
    return App.page.locator('.modal-dialog').filter({
      has: App.page.locator('.modal-title', { hasText: this.EXPECTED_TITLE })
    });
  }
  get title(): Locator {
    return this.dialog.locator('.modal-title');
  }
  get footerButtons(): Locator {
    return this.dialog.locator('.modal-footer button');
  }

  getButton(buttonText: string, buttons = this.footerButtons) {
    return buttons.filter({ hasText: buttonText });
  }

  async clickButton(buttonText: string, buttons = this.footerButtons) {
    return this.getButton(buttonText, buttons).click();
  }

  async isTitleOk() {
    await expect(this.title).toHaveText(this.EXPECTED_TITLE);
  }

  async areButtonsOk(EXPECTED_BUTTONS = this.EXPECTED_FOOTER_BUTTONS, buttons = this.footerButtons) {
    await expect(buttons).toHaveCount(Object.keys(EXPECTED_BUTTONS).length);
    const allInnerTexts = await buttons.allInnerTexts();
    Object.values(EXPECTED_BUTTONS).forEach(buttonText => expect(allInnerTexts).toContain(buttonText));
  }

  async isOk() {
    await this.isTitleOk();
    await this.areButtonsOk();
  }
}
