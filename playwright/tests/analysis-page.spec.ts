import { test } from '@playwright/test';
import { appHooksSetup, describeProjects } from './shared.spec';
import {
  AnalysisDetails,
  EXPECTED_ANALYSIS_BY_PROJECT,
  EXPECTED_DETAILS_BY_PAGE,
  MeasureTypes,
  Page
} from '../constants';
import { AnalysisPO, NavPO } from '../page-objects';

appHooksSetup();

const testMeasureType = (EXPECTED_ANALYSIS: AnalysisDetails, measureType: MeasureTypes) => {
  test.describe(`"${measureType}"`, async () => {
    test(
      EXPECTED_ANALYSIS[measureType].length > 0
        ? `${EXPECTED_ANALYSIS[measureType].length} panels are shown with correct titles`
        : 'no panels are shown',
      async () => {
        await AnalysisPO.areMeasuresOk(measureType, EXPECTED_ANALYSIS[measureType]);
      }
    );
  });
};

describeProjects(CURRENT_PROJECT => {
  const EXPECTED_ANALYSIS = EXPECTED_ANALYSIS_BY_PROJECT[CURRENT_PROJECT];
  test.describe('"Analysis" page', () => {
    test.beforeEach(async () => {
      await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[Page.ANALYSIS].iconAlt);
      AnalysisPO.EXPECTED_TITLE = CURRENT_PROJECT;
    });

    test('is shown', async () => {
      await AnalysisPO.isOk();
    });

    test.describe('options', () => {
      test(`type is "${EXPECTED_ANALYSIS.type}"`, async () => {
        await AnalysisPO.isDropdownSelectedValueOk(AnalysisPO.EXPECTED_DROPDOWN_MENUS.TYPE, EXPECTED_ANALYSIS.type);
      });

      test(`algorithmic method is ${
        EXPECTED_ANALYSIS.algorithmicMethod ? `"${EXPECTED_ANALYSIS.algorithmicMethod}"` : 'NOT shown'
      }`, async () => {
        await AnalysisPO.isDropdownSelectedValueOk(
          AnalysisPO.EXPECTED_DROPDOWN_MENUS.ALGORITHMIC_METHOD,
          EXPECTED_ANALYSIS.algorithmicMethod
        );
      });

      test(`seed model is "${EXPECTED_ANALYSIS.defaultSeedModel}"`, async () => {
        await AnalysisPO.isDropdownSelectedValueOk(
          AnalysisPO.EXPECTED_DROPDOWN_MENUS.DEFAULT_SEED_MODEL,
          EXPECTED_ANALYSIS.defaultSeedModel
        );
      });

      test(`weather file is "${EXPECTED_ANALYSIS.defaultWeatherFile}"`, async () => {
        await AnalysisPO.isDropdownSelectedValueOk(
          AnalysisPO.EXPECTED_DROPDOWN_MENUS.DEFAULT_WEATHER_FILE,
          EXPECTED_ANALYSIS.defaultWeatherFile
        );
      });
    });

    testMeasureType(EXPECTED_ANALYSIS, MeasureTypes.OPEN_STUDIO);
    testMeasureType(EXPECTED_ANALYSIS, MeasureTypes.ENERGY_PLUS);
    testMeasureType(EXPECTED_ANALYSIS, MeasureTypes.REPORTING);
  });
});
