import { expect, test } from '@playwright/test';
import { appHooksSetup, describeProjects, testRunPage } from './shared.spec';
import {
  AnalysisType,
  EXPECTED_ANALYSIS_BY_PROJECT,
  EXPECTED_DATAPOINTS_BY_PROJECT,
  EXPECTED_DETAILS_BY_PAGE,
  Page
} from '../constants';
import { NavPO, RunPO } from '../page-objects';

appHooksSetup();

describeProjects(CURRENT_PROJECT => {
  test.describe('"Run" page', () => {
    test.beforeEach(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[Page.RUN].iconAlt));

    testRunPage(false, CURRENT_PROJECT);

    test.describe('"Select All" button', () => {
      if (
        EXPECTED_DATAPOINTS_BY_PROJECT[CURRENT_PROJECT].length > 0 &&
        EXPECTED_ANALYSIS_BY_PROJECT[CURRENT_PROJECT].type !== AnalysisType.ALGORITHMIC
      ) {
        test.describe('click', () => {
          test.beforeEach(async () => await RunPO.clickButton(RunPO.EXPECTED_BUTTONS.SELECT_ALL));

          test('all datapoint checkboxes are checked', async () => {
            await RunPO.areDatapointsOk(
              EXPECTED_DATAPOINTS_BY_PROJECT[CURRENT_PROJECT].map(expectedState => ({
                ...expectedState,
                isChecked: true
              }))
            );
          });

          test('"Run Selected" button is shown', async () => {
            await expect(RunPO.getButton(RunPO.EXPECTED_BUTTONS.RUN_SELECTED)).toBeVisible();
          });

          test.describe('click "Clear Selections" button', () => {
            test.beforeEach(async () => await RunPO.clickButton(RunPO.EXPECTED_BUTTONS.CLEAR_SELECTIONS));
            test('all datapoint checkboxes are unchecked', async () => {
              await RunPO.areDatapointsOk(EXPECTED_DATAPOINTS_BY_PROJECT[CURRENT_PROJECT]);
            });
          });
        });
      } else {
        test('is hidden', async () => {
          await expect(RunPO.getButton(RunPO.EXPECTED_BUTTONS.SELECT_ALL)).toBeHidden();
        });
      }
    });
  });
});
