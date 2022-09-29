import { expect, test } from '@playwright/test';
import { beforeAndAfterEachFileSetup, describeProjects } from './shared.spec';
import { EXPECTED_DATAPOINTS_STATE, EXPECTED_DETAILS_BY_PAGE, PAGES } from '../constants';
import { RunPO, NavPO } from '../page-objects';

beforeAndAfterEachFileSetup();

describeProjects(CURRENT_PROJECT => {
  test.describe('"Run" page', () => {
    test.beforeEach(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[PAGES.RUN].iconAlt));

    test('is shown', async () => {
      await RunPO.isOk();
      await RunPO.isInState(false, CURRENT_PROJECT, EXPECTED_DATAPOINTS_STATE[CURRENT_PROJECT]);
    });

    test.describe('"Select All" button', () => {
      if (EXPECTED_DATAPOINTS_STATE[CURRENT_PROJECT].length === 0) {
        test('is hidden', async () => {
          await expect(RunPO.getButton(RunPO.EXPECTED_BUTTONS.SELECT_ALL)).toBeHidden();
        });
      } else {
        test.describe('click', () => {
          test.beforeEach(async () => await RunPO.clickButton(RunPO.EXPECTED_BUTTONS.SELECT_ALL));

          test('all datapoint checkboxes are checked', async () => {
            await RunPO.areDatapointsOk(
              EXPECTED_DATAPOINTS_STATE[CURRENT_PROJECT].map(expectedState => ({
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
              await RunPO.areDatapointsOk(EXPECTED_DATAPOINTS_STATE[CURRENT_PROJECT]);
            });
          });
        });
      }
    });
  });
});
