import { expect, test } from '@playwright/test';
import { EXPECTED_DATAPOINTS_STATE, EXPECTED_DETAILS_BY_PAGE, PAGES, PROJECTS } from '../../constants';
import { NavPO, RunPO, DeleteResultsModalPO, SaveMenuItemPO } from '../../page-objects';

export const runAnalysisTests = (CURRENT_PROJECT: PROJECTS) =>
  test.describe('"Run" page', () => {
    test.beforeAll(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[PAGES.RUN].iconAlt));

    test('is shown', async () => {
      await RunPO.isOk();
      await RunPO.isInState(true, CURRENT_PROJECT, EXPECTED_DATAPOINTS_STATE[CURRENT_PROJECT]);
    });

    test('progress bar is 0%', async () => {
      expect(await RunPO.getProgressBarPercent()).toBe(0);
    });

    test.describe('click "Run Entire Workflow" button', () => {
      test.beforeAll(async () => await RunPO.clickButton(RunPO.EXPECTED_BUTTONS.RUN_ENTIRE_WORKFLOW));

      test.describe('"Delete Local Results?" modal', () => {
        test('is shown', async () => {
          await DeleteResultsModalPO.isOk();
        });

        test.describe('click "OK" button', () => {
          test.beforeAll(
            async () => await DeleteResultsModalPO.clickButton(DeleteResultsModalPO.EXPECTED_FOOTER_BUTTONS.OK)
          );

          test('run is queued', async () => {
            await expect(RunPO.progressBar).toHaveText(RunPO.EXPECTED_PROGRESS_BAR_TEXT.ANALYSIS_STARTED);
            const percent = await RunPO.getProgressBarPercent();
            expect(percent).toBeGreaterThan(0);
            expect(percent).toBeLessThan(100);
            expect(RunPO.runStatus).toContainText('queued');
          });

          test('run starts', async () => {
            expect(RunPO.runStatus).toContainText('started', { timeout: 90_000 });
            expect((await RunPO.getRunID()).length).toBeGreaterThan(0);
          });

          test('run completes', async () => {
            await expect(RunPO.progressBar).toHaveText(RunPO.EXPECTED_PROGRESS_BAR_TEXT.ANALYSIS_COMPLETED, {
              timeout: 180_000
            });
            expect(await RunPO.getProgressBarPercent()).toBe(100);
            await expect(RunPO.runStatus).toContainText('completed');
          });
        });
      });
    });
  });
