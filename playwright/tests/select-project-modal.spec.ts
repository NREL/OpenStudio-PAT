import { expect, test } from '@playwright/test';
import { ElectronAppManager } from '../electron-app-manager';
import { IPC_MAIN_HANDLE_MOCKS } from '../mocks';
import {
  NewProjectModalPageObject,
  NoServerStartToastPageObject,
  SelectProjectModalPageObject
} from '../page-objects';

const VALID_NEW_PROJECT_NAME = 'Playwright__Project';

let selectProjPO: SelectProjectModalPageObject;
test.beforeEach(async () => {
  await ElectronAppManager.launchAppIfClosed();
  selectProjPO = new SelectProjectModalPageObject(ElectronAppManager.page);
});
test.afterEach(async () => {
  await ElectronAppManager.removeAllIpcMainListeners();
  await ElectronAppManager.closeApp();
});

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
            IPC_MAIN_HANDLE_MOCKS.showOpenDialog.channel,
            IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validNew
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

      // NOTE - should both modals really close here?
      test('when clicked and file picker dialog is canceled, both modals close', async () => {
        await ElectronAppManager.mockIpcMainHandle(
          IPC_MAIN_HANDLE_MOCKS.showOpenDialog.channel,
          IPC_MAIN_HANDLE_MOCKS.showOpenDialog.canceled
        );
        await newProjPO.nameInput.fill(VALID_NEW_PROJECT_NAME);
        await newProjPO.clickButton(newProjPO.EXPECTED_BUTTONS.CONTINUE);
        await newProjPO.dialog.waitFor({ state: 'hidden' });
        await selectProjPO.dialog.waitFor({ state: 'hidden' });
      });
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
      await ElectronAppManager.mockIpcMainHandle(
        IPC_MAIN_HANDLE_MOCKS.showOpenDialog.channel,
        IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validExisting
      );
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

  test('when clicked and invalid directory selected, modal remains open', async () => {
    await ElectronAppManager.mockIpcMainHandle(
      IPC_MAIN_HANDLE_MOCKS.showOpenDialog.channel,
      IPC_MAIN_HANDLE_MOCKS.showOpenDialog.invalidExisting
    );
    await ElectronAppManager.mockIpcMainHandle(
      IPC_MAIN_HANDLE_MOCKS.showMessageBox.channel,
      IPC_MAIN_HANDLE_MOCKS.showMessageBox.ok
    );
    await selectProjPO.clickButton(
      selectProjPO.EXPECTED_BUTTONS.OPEN_EXISTING_PROJECT
    );
    await selectProjPO.isOk();
  });

  test('when clicked and file picker dialog is canceled, modal remains open', async () => {
    await ElectronAppManager.mockIpcMainHandle(
      IPC_MAIN_HANDLE_MOCKS.showOpenDialog.channel,
      IPC_MAIN_HANDLE_MOCKS.showOpenDialog.canceled
    );
    await selectProjPO.clickButton(
      selectProjPO.EXPECTED_BUTTONS.OPEN_EXISTING_PROJECT
    );
    await selectProjPO.isOk();
  });
});

test.describe('"Cancel" button', () => {
  test('when clicked, application closes', async () => {
    await selectProjPO.clickButton(selectProjPO.EXPECTED_BUTTONS.CANCEL);
    expect(ElectronAppManager.isClosed).toBe(true);
  });
});
