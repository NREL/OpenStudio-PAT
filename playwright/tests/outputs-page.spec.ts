import { test } from '@playwright/test';
import { appHooksSetup, describeProjects } from './shared.spec';
import {
  AnalysisType,
  EXPECTED_ANALYSIS_BY_PROJECT,
  EXPECTED_DETAILS_BY_PAGE,
  EXPECTED_MEASURE_OUTPUTS_BY_PROJECT,
  Page
} from '../constants';
import { NavPO, OutputsPO } from '../page-objects';

appHooksSetup();

describeProjects(CURRENT_PROJECT => {
  const ANALYSIS_TYPE = EXPECTED_ANALYSIS_BY_PROJECT[CURRENT_PROJECT].type;
  test.describe('"Outputs" page', () => {
    test.beforeEach(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[Page.OUTPUTS].iconAlt));

    test('is shown', async () => {
      await OutputsPO.isOk();
    });

    test.describe('"no outputs in manual mode" message', () => {
      test(`is ${ANALYSIS_TYPE === AnalysisType.MANUAL ? '' : 'NOT '}shown`, async () => {
        await OutputsPO.isNoOutputsMsgOk(ANALYSIS_TYPE);
      });
    });

    test.describe('"Add Measure" button', () => {
      test(`is ${ANALYSIS_TYPE === AnalysisType.ALGORITHMIC ? '' : 'NOT '}shown`, async () => {
        await OutputsPO.isAddMeasureButtonOk(ANALYSIS_TYPE);
      });
    });

    test.describe('measure outputs', () => {
      test(`are ${ANALYSIS_TYPE === AnalysisType.ALGORITHMIC ? '' : 'NOT '}shown`, async () => {
        await OutputsPO.areMeasureOutputsOk(ANALYSIS_TYPE, EXPECTED_MEASURE_OUTPUTS_BY_PROJECT[CURRENT_PROJECT]);
      });
    });
  });
});
