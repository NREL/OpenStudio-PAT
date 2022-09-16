import { ModalPageObject } from './modal.po';

export class SelectProjectModalPageObject extends ModalPageObject {
  readonly EXPECTED_TITLE = 'Select a Project';
  readonly EXPECTED_BUTTONS = {
    MAKE_NEW_PROJECT: 'Make New Project',
    OPEN_EXISTING_PROJECT: 'Open Existing Project',
    CANCEL: 'Cancel'
  };
}
