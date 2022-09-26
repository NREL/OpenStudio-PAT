import { expect, test } from '@playwright/test';
import { App } from '../App';
import { EXPECTED_DETAILS_BY_PAGE } from '../constants';
import { IPC_MAIN_HANDLE_MOCKS, PROJECT_NEW, PROJECT_OFFICE_HVAC } from '../mocks';
import {
  NavPageObject,
  NewProjectModalPageObject,
  NoServerStartToastPageObject,
  PagePageObject,
  ProjectModalArgsPromises,
  SelectProjectModalPageObject
} from '../page-objects';
import { testNavItemsCorrect } from '../shared-tests';

const selectProjPO = new SelectProjectModalPageObject();
const navPO = new NavPageObject();
const noServerStartToastPO = new NoServerStartToastPageObject();

const testNoServerStartToast = (noServerStartToastPO: NoServerStartToastPageObject) =>
  test('"Server no longer starts by default" toast is shown', async () => {
    await noServerStartToastPO.isOk();
  });
const testAnalysisPageShown = (analysisPO: PagePageObject) =>
  test('"Analysis" page with project name as title is shown', async () => {
    await analysisPO.isOk();
  });

test.beforeEach(App.launchIfClosed);
test.afterEach(async () => {
  await App.removeAllIpcMainListeners();
  await App.close();
});

test('correct title and buttons are shown', async () => {
  await selectProjPO.isOk();
});

test.describe('click "Make New Project" button', () => {
  const newProjPO = new NewProjectModalPageObject();
  test.beforeEach(async () => await selectProjPO.clickButton(selectProjPO.EXPECTED_FOOTER_BUTTONS.MAKE_NEW_PROJECT));

  test.describe('"New Project" modal', () => {
    test('is shown', async () => {
      await newProjPO.isOk();
    });

    test.describe('click "Continue" button', () => {
      test.beforeEach(async () => await newProjPO.nameInput.fill(PROJECT_NEW.name));

      test('file dialog is shown correctly', async () => {
        const argsPromises = await newProjPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validNew);
        expect((await argsPromises.showOpenDialog)[0]).toEqual({
          title: 'Choose New ParametricAnalysisTool Project Folder',
          properties: ['openDirectory']
        });
      });

      test.describe('select valid directory', () => {
        const analysisPO = new PagePageObject({
          ...EXPECTED_DETAILS_BY_PAGE.ANALYSIS,
          title: PROJECT_NEW.name
        });
        test.beforeEach(async () => await newProjPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validNew));

        test('both modals close', async () => {
          await newProjPO.dialog.waitFor({ state: 'hidden' });
          await selectProjPO.dialog.waitFor({ state: 'hidden' });
        });
        testNoServerStartToast(noServerStartToastPO);
        testAnalysisPageShown(analysisPO);
        testNavItemsCorrect(navPO);
      });

      // NOTE - should both modals really close here?
      test('cancel dialog and both modals close', async () => {
        await newProjPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.canceled);

        await newProjPO.clickButton(newProjPO.EXPECTED_FOOTER_BUTTONS.CONTINUE);
        await newProjPO.dialog.waitFor({ state: 'hidden' });
        await selectProjPO.dialog.waitFor({ state: 'hidden' });
      });
    });

    test.describe('click "Cancel" button', () => {
      test('"New Project" modal closes and "Select a Project" modal is shown again', async () => {
        await newProjPO.clickButton(selectProjPO.EXPECTED_FOOTER_BUTTONS.CANCEL);
        await newProjPO.dialog.waitFor({ state: 'hidden' });

        await selectProjPO.isOk();
      });
    });
  });
});

test.describe('click "Open Existing Project" button', () => {
  test('file dialog is shown correctly', async () => {
    const argsPromises = await selectProjPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validOfficeHVAC);
    expect((await argsPromises.showOpenDialog)[0]).toEqual({
      title: 'Open ParametricAnalysisTool Project',
      properties: ['openDirectory']
    });
  });

  test.describe('select valid directory', () => {
    const analysisPO = new PagePageObject({
      ...EXPECTED_DETAILS_BY_PAGE.ANALYSIS,
      title: PROJECT_OFFICE_HVAC.name
    });
    test.beforeEach(async () => await selectProjPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validOfficeHVAC));

    test('modal closes', async () => {
      await selectProjPO.dialog.waitFor({ state: 'hidden' });
    });
    testNoServerStartToast(noServerStartToastPO);
    testAnalysisPageShown(analysisPO);
    testNavItemsCorrect(navPO);
  });
  test.describe('select invalid directory', () => {
    let argsPromises: ProjectModalArgsPromises;
    test.beforeEach(async () => {
      argsPromises = await selectProjPO.open(
        IPC_MAIN_HANDLE_MOCKS.showOpenDialog.invalid,
        IPC_MAIN_HANDLE_MOCKS.showMessageBox.ok
      );
    });

    test('message box is shown correctly', async () => {
      expect((await argsPromises.showMessageBox)[0]).toEqual({
        type: 'info',
        buttons: ['OK'],
        title: 'Open ParametricAnalysisTool Project',
        message: 'This is not a valid ParametricAnalysisTool project, as it has no file named "pat.json".'
      });
    });

    test('modal remains open', async () => {
      await selectProjPO.isOk();
    });
  });

  test('cancel dialog and modal remains open', async () => {
    await selectProjPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.canceled);
    await selectProjPO.isOk();
  });
});

test.describe('click "Cancel" button', () => {
  test('application closes', async () => {
    await selectProjPO.clickButton(selectProjPO.EXPECTED_FOOTER_BUTTONS.CANCEL);
    expect(App.isClosed).toBe(true);
  });
});
