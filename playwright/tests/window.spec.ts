import { expect, test } from '@playwright/test';
import { App } from '../App';
import { beforeAndAfterEachFileSetup } from './shared.spec';

beforeAndAfterEachFileSetup();

test('application window title is "ParametricAnalysisTool"', async () => {
  await expect(App.page).toHaveTitle(/ParametricAnalysisTool/);
});
