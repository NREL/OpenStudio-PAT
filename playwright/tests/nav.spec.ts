import { test } from '@playwright/test';
import { beforeAndAfterEachFileSetup, testNavItemsCorrect } from './shared.spec';
import { EXPECTED_DETAILS_BY_PAGE, PAGES, PROJECTS } from '../constants';
import { IPC_MAIN_HANDLE_MOCKS } from '../mocks';
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

beforeAndAfterEachFileSetup();

const PROJECT_TYPES: Record<string, { projectName: string; beforeEach: () => Promise<void> }> = {
  existing: {
    projectName: PROJECTS.OFFICE_HVAC,
    beforeEach: async () => {
      await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.OFFICE_HVAC));
    }
  },
  new: {
    projectName: PROJECTS.NEW,
    beforeEach: async () => {
      await SelectProjectModalPO.clickButton(SelectProjectModalPO.EXPECTED_FOOTER_BUTTONS.MAKE_NEW_PROJECT);
      await NewProjectModalPO.nameInput.fill(PROJECTS.NEW);
      await NewProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.getShowOpenDialogFor(PROJECTS.NEW));
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
            pageIsOk = async () => await AnalysisPO.isOk();
            // Go to a different page before clicking the "Analysis" icon
            await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[PAGES.SERVER].iconAlt);
          } else if (name === PAGES.DESIGN_ALTERNATIVES) {
            pageIsOk = async () => await DesignAlternativesPO.isOk();
          } else if (name === PAGES.OUTPUTS) {
            pageIsOk = async () => await OutputsPO.isOk();
          } else if (name === PAGES.RUN) {
            pageIsOk = async () => await RunPO.isOk();
          } else if (name === PAGES.REPORTS) {
            pageIsOk = async () => await ReportsPO.isOk();
          } else if (name === PAGES.SERVER) {
            pageIsOk = async () => await ServerPO.isOk();
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
