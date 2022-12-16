import { Locator } from '@playwright/test';
import { ModalPO } from './modal.po';

export class DeleteResultsModalPO extends ModalPO {
  static readonly EXPECTED_TITLE = 'Delete Local Results?';
  static readonly EXPECTED_FOOTER_BUTTONS = {
    OK: 'OK',
    CANCEL: 'Cancel'
  };
  static readonly EXPECTED_BODY_TEXT = {
    newRun: 'Running a new analysis will delete your local results. Are you sure you want to continue?',
    newRunType: 'Selecting a new run type will delete your local results.  Are you sure you want to continue?',
    newRunOnSelected:
      'Running a new analysis will delete your local results for the selected datapoints.  Are you sure you want to continue?'
  };

  static get bodyText(): Locator {
    return this.dialog.locator('.modal-text span[aria-hidden=false] translate');
  }

  static async isOk() {
    await super.isOk();
    await this.isBodyTextOk(this.EXPECTED_BODY_TEXT.newRun);
  }
}
