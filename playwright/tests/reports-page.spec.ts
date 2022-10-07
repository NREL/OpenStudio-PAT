import { test } from '@playwright/test';
import { appHooksSetup, describeProjects } from './shared.spec';
import { EXPECTED_DETAILS_BY_PAGE, EXPECTED_REPORT_VIEWS, Page, ReportView } from '../constants';
import { NavPO, ReportsPO } from '../page-objects';

appHooksSetup();

const testReportsViewSelectDropdown = (expectedReportView: ReportView) =>
  test.describe('view select dropdown', () => {
    test('is shown with the expected options', async () => {
      await ReportsPO.isViewSelectDropdownOk();
    });
  });

const testReportsWebView = (expectedReportView: ReportView) =>
  test.describe('webview', () => {
    test(`shows "${expectedReportView}" view`, async () => {
      await ReportsPO.isWebviewOk(expectedReportView);
    });
  });

describeProjects(() => {
  test.describe('"Reports" page', () => {
    test.beforeEach(async () => await NavPO.clickIcon(EXPECTED_DETAILS_BY_PAGE[Page.REPORTS].iconAlt));

    test('is shown', async () => {
      await ReportsPO.isOk();
    });

    test.describe('default state', () => {
      testReportsViewSelectDropdown(ReportView.SUMMARY_TABLE);
      testReportsWebView(ReportView.SUMMARY_TABLE);
    });

    for (const reportView of EXPECTED_REPORT_VIEWS) {
      test.describe(`select "${reportView}" option from dropdown`, () => {
        test.beforeEach(async () => {
          if (reportView === ReportView.SUMMARY_TABLE) {
            // Select a different option before selecting the "Summary Table" option
            await ReportsPO.selectView(ReportView.EDAPT_EXPORT);
          }
          await ReportsPO.selectView(reportView);
        });

        testReportsViewSelectDropdown(reportView);
        testReportsWebView(reportView);
      });
    }
  });
});
