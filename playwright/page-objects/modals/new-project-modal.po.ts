import { expect, Locator } from '@playwright/test';
import { ProjectModalPageObject } from './project-modal.po';

export class NewProjectModalPageObject extends ProjectModalPageObject {
  readonly EXPECTED_TITLE = 'New Project';
  readonly EXPECTED_FOOTER_BUTTONS = {
    CONTINUE: 'Continue',
    CANCEL: 'Cancel'
  };
  readonly OPEN_BUTTON_TEXT = this.EXPECTED_FOOTER_BUTTONS.CONTINUE;

  get nameInput(): Locator {
    return this.dialog.locator('input');
  }

  async isOk() {
    await super.isOk();
    await expect(this.nameInput).toBeVisible();
  }
}
