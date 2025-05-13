import { test } from '@playwright/test';
import { ServerToolsMenuItemPO, ServerToolsModalPO } from '../../page-objects';

export const describeServerToolsModalWithButtons = (tests: () => void) =>
  test.describe('"Server Tools" modal with buttons', () => {
    test.beforeAll(async () => await ServerToolsMenuItemPO.click());
    test.afterAll(async () => {
      await ServerToolsModalPO.clickButton(ServerToolsModalPO.EXPECTED_FOOTER_BUTTONS.OK);
      await ServerToolsModalPO.dialog.waitFor({ state: 'hidden' });
    });

    tests();
  });
