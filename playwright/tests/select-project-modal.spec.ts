import { expect, test } from '@playwright/test';
import { appHooksSetup, testNavItemsCorrect } from './shared.spec';
import { App } from '../App';
import { PROJECTS } from '../constants';
import { IPC_MAIN_HANDLE_MOCKS } from '../mocks';
import {
  AnalysisPO,
  NewProjectModalPO,
  NoServerStartToastPO,
  ProjectModalArgsPromises,
  SelectProjectModalPO
} from '../page-objects';

const testNoServerStartToast = () =>
  test('"Server no longer starts by default" toast is shown', async () => {
    await NoServerStartToastPO.isOk();
  });
const testAnalysisPageShown = (expectedTitle: string) =>
  test('"Analysis" page with project name as title is shown', async () => {
    AnalysisPO.EXPECTED_TITLE = expectedTitle;
    await AnalysisPO.isOk();
  });

appHooksSetup();

test('correct title and buttons are shown', async () => {
  await SelectProjectModalPO.isOk();
});

test.describe('click "Make New Project" button', () => {
  test.beforeEach(
    async () => await SelectProjectModalPO.clickButton(SelectProjectModalPO.EXPECTED_FOOTER_BUTTONS.MAKE_NEW_PROJECT)
  );

  test.describe('"New Project" modal', () => {
    test('is shown', async () => {
      await NewProjectModalPO.isOk();
    });

    test.describe('click "Continue" button', () => {
      test.beforeEach(async () => await NewProjectModalPO.nameInput.fill(PROJECTS.NEW));

      test('file dialog is shown correctly', async () => {
        const argsPromises = await NewProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.NEW));
        expect((await argsPromises.showOpenDialog)[0]).toEqual({
          title: 'Choose New ParametricAnalysisTool Project Folder',
          properties: ['openDirectory']
        });
      });

      test.describe('select valid directory', () => {
        test.beforeEach(
          async () => await NewProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.NEW))
        );

        test('both modals close', async () => {
          await NewProjectModalPO.dialog.waitFor({ state: 'hidden' });
          await SelectProjectModalPO.dialog.waitFor({ state: 'hidden' });
        });
        testNoServerStartToast();
        testAnalysisPageShown(PROJECTS.NEW);
        testNavItemsCorrect();
      });

      // NOTE - should both modals really close here?
      test('cancel dialog and both modals close', async () => {
        await NewProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.canceled);

        await NewProjectModalPO.clickButton(NewProjectModalPO.EXPECTED_FOOTER_BUTTONS.CONTINUE);
        await NewProjectModalPO.dialog.waitFor({ state: 'hidden' });
        await SelectProjectModalPO.dialog.waitFor({ state: 'hidden' });
      });
    });

    test.describe('click "Cancel" button', () => {
      test('"New Project" modal closes and "Select a Project" modal is shown again', async () => {
        await NewProjectModalPO.clickButton(SelectProjectModalPO.EXPECTED_FOOTER_BUTTONS.CANCEL);
        await NewProjectModalPO.dialog.waitFor({ state: 'hidden' });

        await SelectProjectModalPO.isOk();
      });
    });
  });
});

test.describe('click "Open Existing Project" button', () => {
  test('file dialog is shown correctly', async () => {
    const argsPromises = await SelectProjectModalPO.open(
      IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.OFFICE_HVAC)
    );
    expect((await argsPromises.showOpenDialog)[0]).toEqual({
      title: 'Open ParametricAnalysisTool Project',
      properties: ['openDirectory']
    });
  });

  test.describe('select valid directory', () => {
    test.beforeEach(
      async () => await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.OFFICE_HVAC))
    );

    test('modal closes', async () => {
      await SelectProjectModalPO.dialog.waitFor({ state: 'hidden' });
    });
    testNoServerStartToast();
    testAnalysisPageShown(PROJECTS.OFFICE_HVAC);
    testNavItemsCorrect();
  });
  test.describe('select invalid directory', () => {
    let argsPromises: ProjectModalArgsPromises;
    test.beforeEach(async () => {
      argsPromises = await SelectProjectModalPO.open(
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
      await SelectProjectModalPO.isOk();
    });
  });

  test('cancel dialog and modal remains open', async () => {
    await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.canceled);
    await SelectProjectModalPO.isOk();
  });
});

test.describe('click "Cancel" button', () => {
  test('application closes', async () => {
    await SelectProjectModalPO.clickButton(SelectProjectModalPO.EXPECTED_FOOTER_BUTTONS.CANCEL);
    expect(App.isClosed).toBe(true);
  });
});
