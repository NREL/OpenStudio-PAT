import { expect, test } from '@playwright/test';
import { beforeAndAfterEachFileSetup } from './shared.spec';
import { App } from '../App';
import { PROJECTS } from '../constants';
import { IPC_MAIN_HANDLE_MOCKS } from '../mocks';
import {
  ServerToolsMenuItemPO,
  SelectProjectModalPO,
  ServerToolsModalPO,
  ServerOfflineToastPO,
  AnalysisPO
} from '../page-objects';

beforeAndAfterEachFileSetup();

test.describe('no project open', async () => {
  test.describe('"Server Tools" modal with "must open project first" message', () => {
    test.beforeEach(async () => {
      await SelectProjectModalPO.isOk(); // effectively waits for app (and menu bar) to load
      await ServerToolsMenuItemPO.click();
    });
    test('is shown', async () => {
      await ServerToolsModalPO.isOk(false);
    });

    test.describe('click "OK" footer button', () => {
      test('modal closes and "Select a Project" modal is shown again', async () => {
        await ServerToolsModalPO.clickButton(ServerToolsModalPO.EXPECTED_FOOTER_BUTTONS.OK);
        await ServerToolsModalPO.dialog.waitFor({ state: 'hidden' });
        await SelectProjectModalPO.isOk();
      });
    });
  });
});

test.describe('open existing project', async () => {
  test.beforeEach(
    async () => await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.OFFICE_HVAC))
  );

  test.describe('"Server Tools" modal with buttons', () => {
    test.beforeEach(async () => await ServerToolsMenuItemPO.click());

    test('is shown', async () => {
      await ServerToolsModalPO.isOk(true);
    });

    test.describe('click "Ping Server and Set Status" button', () => {
      test('"Server is offline" toast is shown', async () => {
        await ServerToolsModalPO.clickButton(
          ServerToolsModalPO.EXPECTED_BODY_BUTTONS.PING_AND_SET_STATUS,
          ServerToolsModalPO.bodyButtons
        );
        await ServerOfflineToastPO.isOk();
      });
    });

    test.describe('click "View Local Server" button', () => {
      test('"http://localhost:8080" launches in external browser', async () => {
        const argsPromise = App.mockIpcMainHandle(IPC_MAIN_HANDLE_MOCKS.openExternalChannel);
        await ServerToolsModalPO.clickButton(
          ServerToolsModalPO.EXPECTED_BODY_BUTTONS.VIEW,
          ServerToolsModalPO.bodyButtons
        );
        expect((await argsPromise)[0]).toBe('http://localhost:8080');
      });
    });

    test.describe('click "OK" footer button', () => {
      test('modal closes and "Analysis" page is shown again', async () => {
        await ServerToolsModalPO.clickButton(ServerToolsModalPO.EXPECTED_FOOTER_BUTTONS.OK);
        await ServerToolsModalPO.dialog.waitFor({ state: 'hidden' });
        AnalysisPO.EXPECTED_TITLE = PROJECTS.OFFICE_HVAC;
        await AnalysisPO.isOkShallow();
      });
    });
  });
});
