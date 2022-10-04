import { expect, Locator } from '@playwright/test';
import { PAGES } from '../../constants';
import { PagePO } from './page.po';

enum InfoLabels {
  STATUS = 'Status:',
  TYPE = 'Type:',
  URL = 'URL:'
}
export class ServerPO extends PagePO {
  static readonly EXPECTED_PAGE = PAGES.SERVER;
  static readonly STATUS_STARTED = 'started';
  static readonly STATUS_STOPPED = 'stopped';
  static readonly TYPE_LOCAL = 'local';
  static readonly URL = 'http://localhost:8080';

  static get infoDivs(): Locator {
    return this.container.locator('div:nth-child(2) > div');
  }
  static get webview(): Locator {
    return this.container.locator('webview');
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

  static async isWebviewOk(isServerRunning: boolean, expectedSrc: string) {
    if (isServerRunning) {
      await expect(this.webview).toBeVisible();
      await expect(this.webview).toHaveAttribute('src', expectedSrc);
    } else {
      await expect(this.webview).toBeHidden();
    }
  }

  static async isInState(isServerRunning: boolean, type: string) {
    await this.isStatusOk(isServerRunning);
    await this.isTypeOk(type);
    await this.isURLOk(isServerRunning ? this.URL : '');
    await this.isWebviewOk(isServerRunning, `${this.URL}/`);
  }
}
