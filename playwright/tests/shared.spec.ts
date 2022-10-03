import { test } from '@playwright/test';
import { App } from '../App';
import { PROJECTS } from '../constants';
import { IPC_MAIN_HANDLE_MOCKS } from '../mocks';
import { NavPO, NewProjectModalPO, SelectProjectModalPO } from '../page-objects';

export const beforeAndAfterEachFileSetup = () => {
  test.beforeEach(async () => await App.launchIfClosed());
  test.afterEach(async () => {
    await App.removeAllIpcMainListeners();
    await App.close();
  });
};

export const PROJECT_SETUP_DETAILS: Record<PROJECTS, { description: string; beforeEach: () => Promise<void> }> = {
  [PROJECTS.OFFICE_HVAC]: {
    description: 'open Office_HVAC project',
    beforeEach: async () => {
      await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.OFFICE_HVAC));
    }
  },
  [PROJECTS.NEW]: {
    description: 'make new project',
    beforeEach: async () => {
      await SelectProjectModalPO.clickButton(SelectProjectModalPO.EXPECTED_FOOTER_BUTTONS.MAKE_NEW_PROJECT);
      await NewProjectModalPO.nameInput.fill(PROJECTS.NEW);
      await NewProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.NEW));
    }
  }
};

export const describeProjects = (tests: (CURRENT_PROJECT: PROJECTS) => void) => {
  for (const [CURRENT_PROJECT, setupDetails] of Object.entries(PROJECT_SETUP_DETAILS)) {
    test.describe(setupDetails.description, () => {
      test.beforeEach(async () => await setupDetails.beforeEach());
      tests(CURRENT_PROJECT as PROJECTS);
    });
  }
};

export const testNavItemsCorrect = () =>
  test('nav items are correct', async () => {
    await NavPO.areItemsOk();
  });
