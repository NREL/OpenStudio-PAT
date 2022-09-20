import { expect, test } from '@playwright/test';
import { ElectronAppManager } from '../electron-app-manager';

test.beforeEach(ElectronAppManager.launchAppIfClosed);
test.afterAll(ElectronAppManager.closeApp);

test('application window title is "ParametricAnalysisTool"', async () => {
  await expect(ElectronAppManager.page).toHaveTitle(/ParametricAnalysisTool/);
});
