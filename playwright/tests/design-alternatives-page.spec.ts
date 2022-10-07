import { test } from '@playwright/test';
import { appHooksSetup, describeProjects } from './shared.spec';
import {
  AnalysisType,
  EXPECTED_ANALYSIS_BY_PROJECT,
  EXPECTED_DESIGN_ALTS_BY_PROJECT,
  EXPECTED_DETAILS_BY_PAGE,
  Page
} from '../constants';
import { DesignAlternativesPO, NavPO } from '../page-objects';

appHooksSetup();

describeProjects(CURRENT_PROJECT => {
  const ANALYSIS_TYPE = EXPECTED_ANALYSIS_BY_PROJECT[CURRENT_PROJECT].type;
  test.describe('"Design Alternatives" page', () => {
    test.beforeEach(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[Page.DESIGN_ALTERNATIVES].iconAlt));

    test('is shown', async () => {
      await DesignAlternativesPO.isOk();
    });

    test.describe('"created automatically" message', () => {
      test(`is ${ANALYSIS_TYPE === AnalysisType.ALGORITHMIC ? '' : 'NOT '}shown`, async () => {
        await DesignAlternativesPO.isAutomaticAltsMsgOk(ANALYSIS_TYPE);
      });
    });

    test.describe('buttons', () => {
      test(`are ${ANALYSIS_TYPE === AnalysisType.MANUAL ? '' : 'NOT '}shown`, async () => {
        await DesignAlternativesPO.areButtonsOk(ANALYSIS_TYPE);
      });
    });

    test.describe('design alternatives', () => {
      test(`are ${ANALYSIS_TYPE === AnalysisType.MANUAL ? '' : 'NOT '}shown`, async () => {
        await DesignAlternativesPO.areDesignAltsOk(ANALYSIS_TYPE, EXPECTED_DESIGN_ALTS_BY_PROJECT[CURRENT_PROJECT]);
      });
    });
  });
});
