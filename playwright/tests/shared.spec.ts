import { test } from '@playwright/test';
import { App } from '../App';
import {
  AnalysisType,
  EXPECTED_ANALYSIS_TYPE_BY_PROJECT,
  EXPECTED_DATAPOINTS_BY_PROJECT,
  Projects
} from '../constants';
import { IPC_MAIN_HANDLE_MOCKS } from '../mocks';
import { NavPO, NewProjectModalPO, RunPO, RunTypes, SelectProjectModalPO, ServerPO } from '../page-objects';

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

export type ProjectSetupDetails = Record<Projects, { beforeHook: () => Promise<void> }>;

export const PROJECT_SETUP_DETAILS: ProjectSetupDetails = {
  [Projects.OFFICE_HVAC]: {
    beforeHook: async () => {
      await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(Projects.OFFICE_HVAC));
    }
  },
  [Projects.OFFICE_STUDY]: {
    beforeHook: async () => {
      await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(Projects.OFFICE_STUDY));
    }
  },
  [Projects.NEW]: {
    beforeHook: async () => {
      await SelectProjectModalPO.clickButton(SelectProjectModalPO.EXPECTED_FOOTER_BUTTONS.MAKE_NEW_PROJECT);
      await NewProjectModalPO.nameInput.fill(Projects.NEW);
      await NewProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(Projects.NEW));
    }
  }
};

export const describeProjects = (
  tests: (CURRENT_PROJECT: Projects) => void,
  projects: Projects[] = Object.keys(PROJECT_SETUP_DETAILS) as Projects[],
  hook = Hook.each
) => {
  for (const CURRENT_PROJECT of projects) {
    test.describe(CURRENT_PROJECT, () => {
      hook === Hook.each
        ? test.beforeEach(PROJECT_SETUP_DETAILS[CURRENT_PROJECT].beforeHook)
        : test.beforeAll(PROJECT_SETUP_DETAILS[CURRENT_PROJECT].beforeHook);
      tests(CURRENT_PROJECT as Projects);
    });
  }
};

export const testNavItemsCorrect = () =>
  test('nav items are correct', async () => {
    await NavPO.areItemsOk();
  });

export const testRunPage = (isServerRunning: boolean, CURRENT_PROJECT: Projects) => {
  test('is shown', async () => {
    await RunPO.isOk();
  });

  test(`selected run type is "${RunPO.EXPECTED_RUN_TYPES[RunTypes.LOCAL]}"`, async () => {
    await RunPO.isSelectedRunTypeOk(RunTypes.LOCAL);
  });

  test(`server status icon is a ${isServerRunning ? 'green checkmark' : 'red x'}`, async () => {
    await RunPO.isServerStatusOk(isServerRunning);
  });

  test(`analysis name is "${CURRENT_PROJECT}"`, async () => {
    await RunPO.isAnalysisNameOk(CURRENT_PROJECT);
  });

  test(`${EXPECTED_DATAPOINTS_BY_PROJECT[CURRENT_PROJECT].length} datapoints are shown correctly`, async () => {
    await RunPO.areDatapointsOk(EXPECTED_DATAPOINTS_BY_PROJECT[CURRENT_PROJECT]);
  });

  test(`"No algorithmic on local" is ${
    EXPECTED_ANALYSIS_TYPE_BY_PROJECT[CURRENT_PROJECT] === AnalysisType.ALGORITHMIC ? '' : 'NOT '
  }shown`, async () => {
    await RunPO.isAlgNoLocalMsgOk(RunTypes.LOCAL, EXPECTED_ANALYSIS_TYPE_BY_PROJECT[CURRENT_PROJECT]);
  });
};

export const testServerPage = (isServerRunning: boolean) => {
  test('is shown', async () => {
    await ServerPO.isOk();
  });

  test.describe(`server is ${isServerRunning ? '' : 'NOT '}running`, () => {
    test(`status is "${isServerRunning ? ServerPO.STATUS_STARTED : ServerPO.STATUS_STOPPED}"`, async () => {
      await ServerPO.isStatusOk(isServerRunning);
    });

    test(`type is "${ServerPO.TYPE_LOCAL}"`, async () => {
      await ServerPO.isTypeOk(ServerPO.TYPE_LOCAL);
    });

    test(`url is "${isServerRunning ? ServerPO.LOCALHOST_URL : ''}"`, async () => {
      await ServerPO.isTypeOk(ServerPO.TYPE_LOCAL);
    });

    test.describe('webview', async () => {
      test(`is ${isServerRunning ? '' : 'NOT '}shown`, async () => {
        await ServerPO.isWebviewOk(isServerRunning, ServerPO.LOCALHOST_URL);
      });
    });
  });
};
