import { test } from '@playwright/test';
import { appHooksSetup, describeProjects, testNavItemsCorrect } from './shared.spec';
import { EXPECTED_DETAILS_BY_PAGE, Page, Projects } from '../constants';
import { AnalysisPO, DesignAlternativesPO, NavPO, OutputsPO, ReportsPO, RunPO, ServerPO } from '../page-objects';

appHooksSetup();

describeProjects((CURRENT_PROJECT: Projects) => {
  for (const [name, page] of Object.entries(EXPECTED_DETAILS_BY_PAGE)) {
    test.describe(`click "${page.iconAlt}" icon`, () => {
      let pageIsOk: () => Promise<void>;
      test.beforeEach(async () => {
        if (name === Page.ANALYSIS) {
          AnalysisPO.EXPECTED_TITLE = CURRENT_PROJECT;
          pageIsOk = async () => await AnalysisPO.isOk();
          // Go to a different page before clicking the "Analysis" icon
          await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[Page.SERVER].iconAlt);
        } else if (name === Page.DESIGN_ALTERNATIVES) {
          pageIsOk = async () => await DesignAlternativesPO.isOk();
        } else if (name === Page.OUTPUTS) {
          pageIsOk = async () => await OutputsPO.isOk();
        } else if (name === Page.RUN) {
          pageIsOk = async () => await RunPO.isOk();
        } else if (name === Page.REPORTS) {
          pageIsOk = async () => await ReportsPO.isOk();
        } else if (name === Page.SERVER) {
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
