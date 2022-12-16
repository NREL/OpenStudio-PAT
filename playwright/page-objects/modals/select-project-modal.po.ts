import { ProjectModalPO } from './project-modal.po';

export class SelectProjectModalPO extends ProjectModalPO {
  static readonly EXPECTED_TITLE = 'Select a Project';
  static readonly EXPECTED_FOOTER_BUTTONS = {
    MAKE_NEW_PROJECT: 'Make New Project',
    OPEN_EXISTING_PROJECT: 'Open Existing Project',
    CANCEL: 'Cancel'
  };
  static readonly OPEN_BUTTON_TEXT = this.EXPECTED_FOOTER_BUTTONS.OPEN_EXISTING_PROJECT;
}
