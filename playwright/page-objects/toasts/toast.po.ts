import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { ToastLevels } from '../../constants';
import { BasePageObject } from '../base.po';

export class ToastPageObject extends BasePageObject {
  readonly EXPECTED_LEVEL: string;
  readonly EXPECTED_MESSAGE: string;

  get toastContainer(): Locator {
    return App.page.locator('#toast-container').filter({
      has: App.page.locator('.toast-message', {
        hasText: this.EXPECTED_MESSAGE
      })
    });
  }
  get toast(): Locator {
    return this.toastContainer.locator('.toast');
  }
  get message(): Locator {
    return this.toastContainer.locator('.toast-message');
  }

  async isMessageOk() {
    await expect(this.message).toHaveText(this.EXPECTED_MESSAGE);
  }

  async isLevelOk() {
    await expect(this.toast).toHaveClass(new RegExp(ToastLevels[this.EXPECTED_LEVEL]));
  }

  async isOk() {
    await this.isMessageOk();
    await this.isLevelOk();
  }
}
