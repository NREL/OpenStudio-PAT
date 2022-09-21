import { expect, test } from '@playwright/test';
import { ElectronAppManager } from '../electron-app-manager';

test.beforeEach(ElectronAppManager.launchAppIfClosed);
test.afterAll(ElectronAppManager.closeApp);

test('renders the application window with the "ParametricAnalysisTool" title', async () => {
  await expect(ElectronAppManager.page).toHaveTitle(/ParametricAnalysisTool/);
});
