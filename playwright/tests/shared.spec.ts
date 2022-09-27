import { test } from '@playwright/test';
import { App } from '../App';
import { NavPO } from '../page-objects';

export const beforeAndAfterEachFileSetup = () => {
  test.beforeEach(async () => await App.launchIfClosed());
  test.afterEach(async () => {
    await App.removeAllIpcMainListeners();
    await App.close();
  });
};

export const testNavItemsCorrect = () =>
  test('nav items are correct', async () => {
    await NavPO.areItemsOk();
  });
