import { test } from '@playwright/test';
import { NavPageObject } from './page-objects';

export const testNavItemsCorrect = (navPO: NavPageObject) =>
  test('nav items are correct', async () => {
    await navPO.areItemsOk();
  });
