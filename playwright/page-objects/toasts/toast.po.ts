import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { ToastLevels } from '../../constants';
import { BasePageObject } from '../base.po';

export class ToastPageObject extends BasePageObject {
  readonly EXPECTED_LEVEL: string;
  readonly EXPECTED_MESSAGE: string;

  get toast(): Locator {
    return App.page.locator('#toast-container .toast', {
      has: App.page.locator('.toast-message', {
        hasText: this.EXPECTED_MESSAGE
      })
    });
  }
  get message(): Locator {
    return this.toast.locator('.toast-message');
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
