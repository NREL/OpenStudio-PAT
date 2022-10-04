import { test } from '@playwright/test';
import { appHooksSetup, describeProjects } from './shared.spec';
import { EXPECTED_DETAILS_BY_PAGE, PAGES } from '../constants';
import { NavPO, OutputsPO } from '../page-objects';

appHooksSetup();

describeProjects(() => {
  test.describe('"Outputs" page', () => {
    test.beforeEach(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[PAGES.OUTPUTS].iconAlt));

    test('is shown', async () => {
      await OutputsPO.isOk();
      await OutputsPO.isNoOutputsMsgOk(true);
    });
  });
});
