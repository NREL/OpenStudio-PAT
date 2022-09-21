import { expect, Locator } from '@playwright/test';
import { ModalPageObject } from './modal.po';

export class NewProjectModalPageObject extends ModalPageObject {
  readonly EXPECTED_TITLE = 'New Project';
  readonly EXPECTED_BUTTONS = {
    CONTINUE: 'Continue',
    CANCEL: 'Cancel'
  };

  get nameInput(): Locator {
    return this.dialog.locator('input');
  }

  async isOk() {
    await this.isTitleOk();
    await this.areButtonsOk();
    expect(this.nameInput).toBeVisible();
  }
}
