import { test } from '@playwright/test';
import { EXPECTED_DETAILS_BY_PAGE, PAGES } from '../constants';
import { IPC_MAIN_HANDLE_MOCKS, PROJECT_NEW, PROJECT_OFFICE_HVAC } from '../mocks';
import {
  AnalysisPO,
  DesignAlternativesPO,
  NavPO,
  NewProjectModalPO,
  OutputsPO,
  ReportsPO,
  RunPO,
  SelectProjectModalPO,
  ServerPO
} from '../page-objects';
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
        let pageIsOk: () => Promise<void>;
        test.beforeEach(async () => {
          if (name === PAGES.ANALYSIS) {
            AnalysisPO.EXPECTED_TITLE = v.projectName;
            pageIsOk = async () => await AnalysisPO.isOkShallow();
            // Go to a different page before clicking the "Analysis" icon
            await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[PAGES.SERVER].iconAlt);
          } else if (name === PAGES.DESIGN_ALTERNATIVES) {
            pageIsOk = async () => await DesignAlternativesPO.isOkShallow();
          } else if (name === PAGES.OUTPUTS) {
            pageIsOk = async () => await OutputsPO.isOkShallow();
          } else if (name === PAGES.RUN) {
            pageIsOk = async () => await RunPO.isOkShallow();
          } else if (name === PAGES.REPORTS) {
            pageIsOk = async () => await ReportsPO.isOkShallow();
          } else if (name === PAGES.SERVER) {
            pageIsOk = async () => await ServerPO.isOkShallow();
          }

          await NavPO.clickIcon(page.iconAlt);
        });

        test(`"${page.iconAlt}" page is shown`, async () => {
          await pageIsOk();
        });
        testNavItemsCorrect();
      });
    }
  });
}
