import { expect, test } from '@playwright/test';
import { beforeAndAfterEachFileSetup } from './shared.spec';
import { App } from '../App';

beforeAndAfterEachFileSetup();

test('application window title is "ParametricAnalysisTool"', async () => {
  await expect(App.page).toHaveTitle(/ParametricAnalysisTool/);
});
