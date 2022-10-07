import { expect, Locator } from '@playwright/test';
import { Page } from '../../constants';
import { PagePO } from './page.po';

enum InfoLabels {
  STATUS = 'Status:',
  TYPE = 'Type:',
  URL = 'URL:'
}
export class ServerPO extends PagePO {
  static readonly EXPECTED_PAGE = Page.SERVER;
  static readonly STATUS_STARTED = 'started';
  static readonly STATUS_STOPPED = 'stopped';
  static readonly TYPE_LOCAL = 'local';
  static readonly LOCALHOST_URL = 'http://localhost:8080';

  static get infoDivs(): Locator {
    return this.container.locator('div:nth-child(2) > div');
  }

  static async getInfo(label: InfoLabels) {
    const infoElem = this.infoDivs.filter({ hasText: label });
    return (await infoElem.innerText()).replace(label, '').trim();
  }

  static async isStatusOk(isServerRunning: boolean) {
    expect(await this.getInfo(InfoLabels.STATUS)).toBe(isServerRunning ? this.STATUS_STARTED : this.STATUS_STOPPED);
  }

  static async isTypeOk(type: string) {
    expect(await this.getInfo(InfoLabels.TYPE)).toBe(type);
  }

  static async isURLOk(expectedUrl: string) {
    expect(await this.getInfo(InfoLabels.URL)).toBe(expectedUrl);
  }

  static async isWebviewOk(isServerRunning: boolean, expectedUrl: string) {
    if (isServerRunning) {
      await expect(this.webview).toBeVisible();
      await expect(this.webview).toHaveAttribute('src', `${expectedUrl}/`);
    } else {
      await expect(this.webview).toBeHidden();
    }
  }
}
