import { test } from '@playwright/test';
import { appHooksSetup, describeProjects } from './shared.spec';
import { EXPECTED_ANALYSIS_TYPE_BY_PROJECT, EXPECTED_DETAILS_BY_PAGE, Page } from '../constants';
import { NavPO, OutputsPO } from '../page-objects';

appHooksSetup();

describeProjects(CURRENT_PROJECT => {
  test.describe('"Outputs" page', () => {
    test.beforeEach(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[Page.OUTPUTS].iconAlt));

    test('is shown', async () => {
      await OutputsPO.isOk();
      await OutputsPO.isInState(EXPECTED_ANALYSIS_TYPE_BY_PROJECT[CURRENT_PROJECT]);
    });
  });
});
