import { expect, test } from '@playwright/test';
import { ElectronAppManager } from '../electron-app-manager';
import {
  NewProjectModalPageObject,
  NoServerStartToastPageObject,
  SelectProjectModalPageObject
} from '../page-objects';

test.beforeEach(ElectronAppManager.launchAppIfClosed);
test.afterAll(ElectronAppManager.closeApp);

const VALID_EXISTING_PROJECT_PATH = './sample_projects/Office_HVAC';
const VALID_NEW_PROJECT_PATH = './playwright/.tmp/Playwright__Project';
const VALID_NEW_PROJECT_NAME = 'Playwright__Project';

let selectProjPO: SelectProjectModalPageObject;
test.beforeEach(() => {
  selectProjPO = new SelectProjectModalPageObject(ElectronAppManager.page);
});
test.afterEach(() => ElectronAppManager.removeAllIpcMainListeners());

test('shows the correct title and buttons', async () => {
  await selectProjPO.isOk();
});

test.describe('"Make New Project" button', () => {
  let newProjPO: NewProjectModalPageObject;
  test.beforeEach(async () => {
    await selectProjPO.clickButton(
      selectProjPO.EXPECTED_BUTTONS.MAKE_NEW_PROJECT
    );
    newProjPO = new NewProjectModalPageObject(ElectronAppManager.page);
  });

  test('when clicked, "New Project" modal opens', async () => {
    await newProjPO.isOk();
  });

  test.describe('"New Project" modal', () => {
    test.describe('"Continue" button', () => {
      test.describe('when clicked and valid directory selected', () => {
        test.beforeEach(async () => {
          await ElectronAppManager.mockIpcMainHandle(
            'test-dialog-showOpenDialog',
            { canceled: false, filePaths: [VALID_NEW_PROJECT_PATH] }
          );
          await newProjPO.nameInput.fill(VALID_NEW_PROJECT_NAME);
          await newProjPO.clickButton(newProjPO.EXPECTED_BUTTONS.CONTINUE);
        });

        test('both modals close', async () => {
          await newProjPO.dialog.waitFor({ state: 'hidden' });
          await selectProjPO.dialog.waitFor({ state: 'hidden' });
        });

        test('"Server no longer starts by default" toast is shown', async () => {
          const noServerStartToastPO = new NoServerStartToastPageObject(
            ElectronAppManager.page
          );
          await noServerStartToastPO.isOk();
        });

        // TODO: write test for checking that project name is populated on first page
      });

      // TODO: write test for when cancelled and/or invalid directory selected
    });

    test.describe('"Cancel" button', () => {
      test('when clicked, "New Project" modal closes and "Select a Project" modal is displayed again', async () => {
        await newProjPO.clickButton(selectProjPO.EXPECTED_BUTTONS.CANCEL);
        await newProjPO.dialog.waitFor({ state: 'hidden' });

        await selectProjPO.isOk();
      });
    });
  });
});

test.describe('"Open Existing Project" button', () => {
  test.describe('when clicked and valid directory selected', () => {
    test.beforeEach(async () => {
      await ElectronAppManager.mockIpcMainHandle('test-dialog-showOpenDialog', {
        canceled: false,
        filePaths: [VALID_EXISTING_PROJECT_PATH]
      });
      await selectProjPO.clickButton(
        selectProjPO.EXPECTED_BUTTONS.OPEN_EXISTING_PROJECT
      );
    });

    test('modal closes', async () => {
      await selectProjPO.dialog.waitFor({ state: 'hidden' });
    });

    test('"Server no longer starts by default" toast is shown', async () => {
      const noServerStartToastPO = new NoServerStartToastPageObject(
        ElectronAppManager.page
      );
      await noServerStartToastPO.isOk();
    });

    // TODO: write test for checking that project name is populated on first page
  });

  // TODO: write test for when cancelled and/or invalid directory selected
});

test.describe('"Cancel" button', () => {
  test('when clicked, application closes', async () => {
    await selectProjPO.clickButton(selectProjPO.EXPECTED_BUTTONS.CANCEL);
    expect(ElectronAppManager.isClosed).toBe(true);
  });
});
