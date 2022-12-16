import { test } from '@playwright/test';
import { testServerPage } from '../shared.spec';
import { EXPECTED_DETAILS_BY_PAGE, Page } from '../../constants';
import { NavPO } from '../../page-objects';

export const serverPageTests = () =>
  test.describe('"Server" page', () => {
    test.beforeEach(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[Page.SERVER].iconAlt));

    testServerPage(true);
  });
