import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { ToastLevels } from '../../constants';
import { BasePageObject } from '../base.po';

export class ToastPO extends BasePageObject {
  static readonly EXPECTED_LEVEL: string;
  static readonly EXPECTED_MESSAGE: string;

  static get toast(): Locator {
    return App.page.locator('#toast-container .toast', {
      has: App.page.locator('.toast-message', {
        hasText: this.EXPECTED_MESSAGE
      })
    });
  }
  static get message(): Locator {
    return this.toast.locator('.toast-message');
  }

  static async isMessageOk() {
    await expect(this.message).toHaveText(this.EXPECTED_MESSAGE);
  }

  static async isLevelOk() {
    await expect(this.toast).toHaveClass(new RegExp(ToastLevels[this.EXPECTED_LEVEL]));
  }

  static async isOk() {
    await this.isMessageOk();
    await this.isLevelOk();
  }
}
