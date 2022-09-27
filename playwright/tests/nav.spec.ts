import { test } from '@playwright/test';
import { EXPECTED_DETAILS_BY_PAGE } from '../constants';
import { IPC_MAIN_HANDLE_MOCKS, PROJECT_NEW, PROJECT_OFFICE_HVAC } from '../mocks';
import { NavPO, NewProjectModalPO, PagePO, SelectProjectModalPO } from '../page-objects';
import { beforeAndAfterEachFileSetup, testNavItemsCorrect } from './shared.spec';

beforeAndAfterEachFileSetup();

const PROJECT_TYPES: Record<string, { projectName: string; beforeEach: () => Promise<void> }> = {
  existing: {
    projectName: PROJECT_OFFICE_HVAC.name,
    beforeEach: async () => {
      await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validOfficeHVAC);
    }
  },
  new: {
    projectName: PROJECT_NEW.name,
    beforeEach: async () => {
      await SelectProjectModalPO.clickButton(SelectProjectModalPO.EXPECTED_FOOTER_BUTTONS.MAKE_NEW_PROJECT);
      await NewProjectModalPO.nameInput.fill(PROJECT_NEW.name);
      await NewProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validNew);
    }
  }
};
for (const [projectType, v] of Object.entries(PROJECT_TYPES)) {
  test.describe(`open ${projectType} project`, () => {
    test.beforeEach(async () => await v.beforeEach());

    for (const [name, page] of Object.entries(EXPECTED_DETAILS_BY_PAGE)) {
      test.describe(`click "${page.iconAlt}" icon`, () => {
        let pagePO: PagePO;
        test.beforeEach(async () => {
          if (name === 'ANALYSIS') {
            pagePO = new PagePO({
              ...page,
              title: v.projectName
            });
            // Go to a different page before clicking the "Analysis" icon
            await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE.SERVER.iconAlt);
          } else {
            pagePO = new PagePO(page);
          }

          await NavPO.clickIcon(page.iconAlt);
        });

        test(`"${page.iconAlt}" page is shown`, async () => {
          await pagePO.isOk();
        });
        testNavItemsCorrect();
      });
    }
  });
}
