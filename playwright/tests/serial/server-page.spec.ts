import { test } from '@playwright/test';
import { testServerPage } from '../shared.spec';
import { EXPECTED_DETAILS_BY_PAGE, Page } from '../../constants';
import { NavPO, ServerPO } from '../../page-objects';

export const serverPageTests = () =>
  test.describe('"Server" page', () => {
    test.beforeEach(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[Page.SERVER].iconAlt));

    test('is shown', async () => {
      await ServerPO.isOk();
    });

    testServerPage(true);
  });
