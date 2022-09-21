import { test } from '@playwright/test';
import { ElectronAppManager } from '../electron-app-manager';
import { EXPECTED_DETAILS_BY_PAGE, IPC_MAIN_HANDLE_MOCKS, PROJECT_NEW, PROJECT_OFFICE_HVAC } from '../mocks';
import {
  NavPageObject,
  NewProjectModalPageObject,
  PagePageObject,
  SelectProjectModalPageObject
} from '../page-objects';
import { testNavItemsCorrect } from '../shared-tests';

const navPO = new NavPageObject();
const selectProjPO = new SelectProjectModalPageObject();
const newProjPO = new NewProjectModalPageObject();

test.beforeEach(async () => {
  await ElectronAppManager.launchAppIfClosed();
});
test.afterEach(async () => {
  await ElectronAppManager.removeAllIpcMainListeners();
  await ElectronAppManager.closeApp();
});

const PROJECT_TYPES: Record<string, { projectName: string; beforeEach: () => Promise<void> }> = {
  existing: {
    projectName: PROJECT_OFFICE_HVAC.name,
    beforeEach: async () => {
      await selectProjPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validOfficeHVAC);
    }
  },
  new: {
    projectName: PROJECT_NEW.name,
    beforeEach: async () => {
      await selectProjPO.clickButton(selectProjPO.EXPECTED_BUTTONS.MAKE_NEW_PROJECT);
      await newProjPO.nameInput.fill(PROJECT_NEW.name);
      await newProjPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validNew);
    }
  }
};
for (const [projectType, v] of Object.entries(PROJECT_TYPES)) {
  test.describe(`open ${projectType} project`, () => {
    test.beforeEach(async () => {
      await v.beforeEach();
    });

    for (const [name, page] of Object.entries(EXPECTED_DETAILS_BY_PAGE)) {
      test.describe(`click "${page.iconAlt}" icon`, () => {
        let pagePO: PagePageObject;
        test.beforeEach(async () => {
          if (name === 'ANALYSIS') {
            pagePO = new PagePageObject({
              ...page,
              title: v.projectName
            });
            // Go to a different page before clicking the "Analysis" icon
            await navPO.clickIcon(EXPECTED_DETAILS_BY_PAGE.SERVER.iconAlt);
          } else {
            pagePO = new PagePageObject(page);
          }

          await navPO.clickIcon(page.iconAlt);
        });

        test(`"${page.iconAlt}" page is shown`, async () => {
          await pagePO.isOk();
        });
        testNavItemsCorrect(navPO);
      });
    }
  });
}
