import { expect, test } from '@playwright/test';
import { App } from '../App';

test.beforeEach(App.launchIfClosed);
test.afterAll(App.close);

test('application window title is "ParametricAnalysisTool"', async () => {
  await expect(App.page).toHaveTitle(/ParametricAnalysisTool/);
});
