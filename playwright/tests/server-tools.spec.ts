import { test } from '@playwright/test';
import { App } from '../App';
import { IPC_MAIN_HANDLE_MOCKS } from '../mocks';
import {
  ServerToolsMenuItemPageObject,
  SelectProjectModalPageObject,
  ServerToolsModalPageObject,
  ServerOfflineToastPageObject
} from '../page-objects';

const selectProjPO = new SelectProjectModalPageObject();
const serverToolsMenuItemPO = new ServerToolsMenuItemPageObject();
const serverToolsModalPO = new ServerToolsModalPageObject();
const serverOfflineToastPO = new ServerOfflineToastPageObject();

test.beforeEach(async () => {
  await App.launchIfClosed();
});
test.afterEach(async () => {
  await App.removeAllIpcMainListeners();
  await App.close();
});

const wait = (ms = 3_000) => new Promise(f => setTimeout(f, ms));

test.describe('no project open', async () => {
  test.beforeEach(async () => {
    await selectProjPO.isOk(); // effectively waits for app (and menu bar) to load
    await serverToolsMenuItemPO.click();
  });

  test.describe('"Server Tools" modal with "must open project first" message', () => {
    test('is shown', async () => {
      await serverToolsModalPO.isOk(false);
    });

    test.describe('click "OK" footer button', () => {
      test('modal closes and "Select a Project" modal is shown again', async () => {
        await serverToolsModalPO.clickButton(serverToolsModalPO.EXPECTED_FOOTER_BUTTONS.OK);
        await serverToolsModalPO.dialog.waitFor({ state: 'hidden' });

        await selectProjPO.isOk();
      });
    });
  });
});

test.describe('existing project open', async () => {
  test.beforeEach(async () => {
    await selectProjPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validOfficeHVAC);
    await serverToolsMenuItemPO.click();
  });

  test.describe('"Server Tools" modal with buttons', () => {
    test('is shown', async () => {
      await serverToolsModalPO.isOk();
    });

    test.describe('click "Ping Server and Set Status" button', () => {
      test('"Server is offline" toast is shown', async () => {
        await serverToolsModalPO.clickButton(
          serverToolsModalPO.EXPECTED_BODY_BUTTONS.PING_AND_SET_STATUS,
          serverToolsModalPO.bodyButtons
        );
        await serverOfflineToastPO.isOk();
      });
    });

    test.describe('click "OK" footer button', () => {
      test('modal closes', async () => {
        await serverToolsModalPO.clickButton(serverToolsModalPO.EXPECTED_FOOTER_BUTTONS.OK);
        await serverToolsModalPO.dialog.waitFor({ state: 'hidden' });
      });
    });
  });
});
