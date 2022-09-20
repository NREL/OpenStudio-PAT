import { expect, Locator } from '@playwright/test';
import { ProjectModalPageObject } from './project-modal.po';

export class NewProjectModalPageObject extends ProjectModalPageObject {
  readonly EXPECTED_TITLE = 'New Project';
  readonly EXPECTED_BUTTONS = {
    CONTINUE: 'Continue',
    CANCEL: 'Cancel'
  };
  readonly OPEN_BUTTON_TEXT = this.EXPECTED_BUTTONS.CONTINUE;

  get nameInput(): Locator {
    return this.dialog.locator('input');
  }

  async isOk() {
    await this.isTitleOk();
    await this.areButtonsOk();
    await expect(this.nameInput).toBeVisible();
  }
}
