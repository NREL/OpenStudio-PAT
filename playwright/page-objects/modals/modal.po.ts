import { expect, Locator } from '@playwright/test';
import { BasePageObject } from '../base.po';

export class ModalPageObject extends BasePageObject {
  readonly EXPECTED_TITLE: string;
  readonly EXPECTED_BUTTONS: Record<string, string>;

  get dialog(): Locator {
    return this.page.locator('.modal-dialog').filter({
      has: this.page.locator('.modal-title', { hasText: this.EXPECTED_TITLE })
    });
  }
  get title(): Locator {
    return this.dialog.locator('.modal-title');
  }
  get buttons(): Locator {
    return this.dialog.locator('.modal-footer button');
  }

  getButton(buttonText: string) {
    return this.buttons.filter({ hasText: buttonText });
  }

  async clickButton(buttonText: string) {
    return this.getButton(buttonText).click();
  }

  async isTitleOk() {
    await expect(this.title).toHaveText(this.EXPECTED_TITLE);
  }

  async areButtonsOk() {
    await expect(this.buttons).toHaveCount(Object.keys(this.EXPECTED_BUTTONS).length);
    const allInnerTexts = await this.buttons.allInnerTexts();
    Object.values(this.EXPECTED_BUTTONS).forEach(buttonText => expect(allInnerTexts).toContain(buttonText));
  }

  async isOk() {
    await this.isTitleOk();
    await this.areButtonsOk();
  }
}
