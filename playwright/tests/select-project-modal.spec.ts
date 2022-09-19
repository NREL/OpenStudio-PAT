import { expect, test } from '@playwright/test';
import { ElectronAppManager } from '../electron-app-manager';
import {
  IPC_MAIN_HANDLE_MOCKS,
  PROJECT_NEW,
  PROJECT_OFFICE_HVAC
} from '../mocks';
import {
  AnalysisPageObject,
  NavPageObject,
  NewProjectModalPageObject,
  NoServerStartToastPageObject,
  SelectProjectModalPageObject
} from '../page-objects';

const selectProjPO = new SelectProjectModalPageObject();
const noServerStartToastPO = new NoServerStartToastPageObject();

test.beforeEach(async () => {
  await ElectronAppManager.launchAppIfClosed();
});
test.afterEach(async () => {
  await ElectronAppManager.removeAllIpcMainListeners();
  await ElectronAppManager.closeApp();
});

test('shows the correct title and buttons', async () => {
  await selectProjPO.isOk();
});

test.describe('"Make New Project" button', () => {
  const newProjPO = new NewProjectModalPageObject();
  test.beforeEach(async () => {
    await selectProjPO.clickButton(
      selectProjPO.EXPECTED_BUTTONS.MAKE_NEW_PROJECT
    );
  });

  test('when clicked, "New Project" modal opens', async () => {
    await newProjPO.isOk();
  });

  test.describe('"New Project" modal', () => {
    test.describe('"Continue" button', () => {
      test.describe('when clicked and valid directory selected', () => {
        const analysisPO = new AnalysisPageObject(PROJECT_NEW.name);
        const navPO = new NavPageObject();

        test.beforeEach(async () => {
          await ElectronAppManager.mockIpcMainHandle(
            IPC_MAIN_HANDLE_MOCKS.showOpenDialog.channel,
            IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validNew
          );
          await newProjPO.nameInput.fill(PROJECT_NEW.name);
          await newProjPO.clickButton(newProjPO.EXPECTED_BUTTONS.CONTINUE);
        });

        test('both modals close', async () => {
          await newProjPO.dialog.waitFor({ state: 'hidden' });
          await selectProjPO.dialog.waitFor({ state: 'hidden' });
        });

        test('"Server no longer starts by default" toast is shown', async () => {
          await noServerStartToastPO.isOk();
        });

        test('the analysis page with the project name as the title is shown', async () => {
          await analysisPO.isOk();
        });

        test('the nav items are shown correctly', async () => {
          await navPO.areItemsOk();
        });
      });

      // NOTE - should both modals really close here?
      test('when clicked and file picker dialog is canceled, both modals close', async () => {
        await ElectronAppManager.mockIpcMainHandle(
          IPC_MAIN_HANDLE_MOCKS.showOpenDialog.channel,
          IPC_MAIN_HANDLE_MOCKS.showOpenDialog.canceled
        );
        await newProjPO.nameInput.fill(PROJECT_NEW.name);
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
    const analysisPO = new AnalysisPageObject(PROJECT_OFFICE_HVAC.name);
    const navPO = new NavPageObject();

    test.beforeEach(async () => {
      await ElectronAppManager.mockIpcMainHandle(
        IPC_MAIN_HANDLE_MOCKS.showOpenDialog.channel,
        IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validOfficeHVAC
      );
      await selectProjPO.clickButton(
        selectProjPO.EXPECTED_BUTTONS.OPEN_EXISTING_PROJECT
      );
    });

    test('modal closes', async () => {
      await selectProjPO.dialog.waitFor({ state: 'hidden' });
    });

    test('"Server no longer starts by default" toast is shown', async () => {
      await noServerStartToastPO.isOk();
    });

    test('the analysis page with the project name as the title is shown', async () => {
      await analysisPO.isOk();
    });

    test('the nav items are shown correctly', async () => {
      await navPO.areItemsOk();
    });
  });

  test('when clicked and invalid directory selected, modal remains open', async () => {
    await ElectronAppManager.mockIpcMainHandle(
      IPC_MAIN_HANDLE_MOCKS.showOpenDialog.channel,
      IPC_MAIN_HANDLE_MOCKS.showOpenDialog.invalid
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
