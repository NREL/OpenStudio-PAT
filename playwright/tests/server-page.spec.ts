import { test } from '@playwright/test';
import { appHooksSetup, describeProjects } from './shared.spec';
import { EXPECTED_DETAILS_BY_PAGE, PAGES } from '../constants';
import { NavPO, ServerPO } from '../page-objects';

appHooksSetup();

describeProjects(() => {
  test.describe('"Server" page', () => {
    test.beforeEach(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[PAGES.SERVER].iconAlt));

    test('is shown', async () => {
      await ServerPO.isOk();
      await ServerPO.isInState(false, 'local');
    });
  });
});
