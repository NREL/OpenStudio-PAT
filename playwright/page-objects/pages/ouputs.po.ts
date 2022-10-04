import { expect, Locator } from '@playwright/test';
import { PAGES } from '../../constants';
import { PagePO } from './page.po';

export class OutputsPO extends PagePO {
  static readonly EXPECTED_PAGE = PAGES.OUTPUTS;
  static readonly EXPECTED_NO_OUTPUTS_MSG = 'There are no outputs to set in Manual mode.';

  static get noOutputsMsg(): Locator {
    return this.container.locator('.outputs-manual');
  }

  static async isNoOutputsMsgOk(expectedIsVisible: boolean) {
    if (expectedIsVisible) {
      await expect(this.noOutputsMsg).toBeVisible();
      await expect(this.noOutputsMsg).toHaveText(this.EXPECTED_NO_OUTPUTS_MSG);
    } else {
      await expect(this.noOutputsMsg).toBeHidden();
    }
  }
}
