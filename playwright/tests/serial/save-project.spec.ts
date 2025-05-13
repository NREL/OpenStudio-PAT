import { test } from '@playwright/test';
import { ProjectSavedToastPO, SaveMenuItemPO } from '../../page-objects';

export const saveProjectTests = () =>
  test.describe('save project', () => {
    test.beforeEach(async () => await SaveMenuItemPO.click());

    test('"Project saved!" toast is shown', async () => {
      await ProjectSavedToastPO.isOk();
    });
  });
