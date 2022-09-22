import { ProjectModalPageObject } from './project-modal.po';

export class SelectProjectModalPageObject extends ProjectModalPageObject {
  readonly EXPECTED_TITLE = 'Select a Project';
  readonly EXPECTED_FOOTER_BUTTONS = {
    MAKE_NEW_PROJECT: 'Make New Project',
    OPEN_EXISTING_PROJECT: 'Open Existing Project',
    CANCEL: 'Cancel'
  };
  readonly OPEN_BUTTON_TEXT = this.EXPECTED_FOOTER_BUTTONS.OPEN_EXISTING_PROJECT;
}
