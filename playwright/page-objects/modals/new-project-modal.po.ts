import { expect, Locator } from '@playwright/test';
import { ProjectModalPO } from './project-modal.po';

export class NewProjectModalPO extends ProjectModalPO {
  static readonly EXPECTED_TITLE = 'New Project';
  static readonly EXPECTED_FOOTER_BUTTONS = {
    CONTINUE: 'Continue',
    CANCEL: 'Cancel'
  };
  static readonly OPEN_BUTTON_TEXT = this.EXPECTED_FOOTER_BUTTONS.CONTINUE;

  static get nameInput(): Locator {
    return this.dialog.locator('input');
  }

  static async isOk() {
    await super.isOk();
    await expect(this.nameInput).toBeVisible();
  }
}
