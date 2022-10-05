import { test } from '@playwright/test';
import { App } from '../App';
import { PROJECTS } from '../constants';
import { IPC_MAIN_HANDLE_MOCKS } from '../mocks';
import { NavPO, NewProjectModalPO, SelectProjectModalPO } from '../page-objects';

export enum Hook {
  each = 'each',
  all = 'all'
}

export const removeListenersAndCloseApp = async () => {
  await App.removeAllIpcMainListeners();
  await App.close();
};

export const appHooksSetup = (hook = Hook.each) => {
  if (hook === Hook.each) {
    test.beforeEach(App.launchIfClosed);
    test.afterEach(removeListenersAndCloseApp);
  } else {
    test.beforeAll(App.launchIfClosed);
    test.afterAll(removeListenersAndCloseApp);
  }
};

export type ProjectSetupDetails = Record<PROJECTS, { description: string; beforeHook: () => Promise<void> }>;

export const PROJECT_SETUP_DETAILS: ProjectSetupDetails = {
  [PROJECTS.OFFICE_HVAC]: {
    description: 'open Office_HVAC project',
    beforeHook: async () => {
      await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.OFFICE_HVAC));
    }
  },
  [PROJECTS.OFFICE_STUDY]: {
    description: 'open Office_Study project',
    beforeHook: async () => {
      await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.OFFICE_STUDY));
    }
  },
  [PROJECTS.NEW]: {
    description: 'make new project',
    beforeHook: async () => {
      await SelectProjectModalPO.clickButton(SelectProjectModalPO.EXPECTED_FOOTER_BUTTONS.MAKE_NEW_PROJECT);
      await NewProjectModalPO.nameInput.fill(PROJECTS.NEW);
      await NewProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.NEW));
    }
  }
};

export const describeProjects = (
  tests: (CURRENT_PROJECT: PROJECTS) => void,
  projectSetupDetails: Partial<ProjectSetupDetails> = PROJECT_SETUP_DETAILS,
  hook = Hook.each
) => {
  for (const [CURRENT_PROJECT, setupDetails] of Object.entries(projectSetupDetails)) {
    test.describe(setupDetails.description, () => {
      hook === Hook.each ? test.beforeEach(setupDetails.beforeHook) : test.beforeAll(setupDetails.beforeHook);
      tests(CURRENT_PROJECT as PROJECTS);
    });
  }
};

export const testNavItemsCorrect = () =>
  test('nav items are correct', async () => {
    await NavPO.areItemsOk();
  });
