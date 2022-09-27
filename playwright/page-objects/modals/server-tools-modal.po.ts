import { expect, Locator } from '@playwright/test';
import { ModalPO } from './modal.po';

export class ServerToolsModalPO extends ModalPO {
  static readonly EXPECTED_TITLE = 'Server Troubleshooting Tools';
  static readonly EXPECTED_FOOTER_BUTTONS = {
    OK: 'OK'
  };
  static readonly EXPECTED_BODY_BUTTONS = {
    START: 'Start Local Server',
    STOP: 'Stop Local Server',
    PING_AND_SET_STATUS: 'Ping Server and Set Status',
    VIEW: 'View Local Server'
  };

  static readonly EXPECTED_TEXT_WHEN_PROJECT_NOT_OPENED = 'You must open a project first';

  static get bodyText(): Locator {
    return this.dialog.locator('.modal-text translate');
  }
  static get bodyButtons(): Locator {
    return this.dialog.locator('.modal-body button:not(.modal-footer button)');
  }

  static async areBodyButtonsOk() {
    await expect(this.bodyButtons).toHaveCount(Object.keys(this.EXPECTED_BODY_BUTTONS).length);
    const allInnerTexts = await this.bodyButtons.allInnerTexts();
    Object.values(this.EXPECTED_BODY_BUTTONS).forEach(buttonText => expect(allInnerTexts).toContain(buttonText));
  }

  static async isOk(isProjectOpen = true) {
    await super.isOk();
    if (!isProjectOpen) {
      await expect(this.bodyText).toHaveText(this.EXPECTED_TEXT_WHEN_PROJECT_NOT_OPENED);
    } else {
      await this.areButtonsOk(this.EXPECTED_BODY_BUTTONS, this.bodyButtons);
    }
  }
}
