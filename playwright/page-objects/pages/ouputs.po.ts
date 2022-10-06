import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { AnalysisType, MeasureOutputs, OutputColumn, OutputDetails, Page } from '../../constants';
import { PagePO } from './page.po';

export class OutputsPO extends PagePO {
  static readonly EXPECTED_PAGE = Page.OUTPUTS;
  static readonly EXPECTED_NO_OUTPUTS_MSG = 'There are no outputs to set in Manual mode.';
  static readonly EXPECTED_ADD_MEASURE_TEXT = 'Add Measure';

  static get noOutputsMsg(): Locator {
    return this.container.locator('.outputs-manual');
  }
  static get outputsAccordion(): Locator {
    return this.container.locator('uib-accordion');
  }
  static get addMeasureButton(): Locator {
    return this.container.locator('button', { hasText: this.EXPECTED_ADD_MEASURE_TEXT });
  }
  static get panels(): Locator {
    return this.outputsAccordion.locator('.panel-group > div');
  }

  static getPanelWithTitle(title: string): Locator {
    return this.panels.filter({
      has: App.page.locator('.panel-title').filter({ has: App.page.locator(`text="${title}"`) })
    });
  }

  static getRowWithDisplayName(rows: Locator, displayName: string): Locator {
    return rows.filter({
      has: App.page
        .locator('.ui-grid-cell-contents')
        .nth(0)
        .filter({ has: App.page.locator(`text="${displayName}"`) })
    });
  }

  static async isOutputOk(rows: Locator, expectedOutput: OutputDetails) {
    const row = this.getRowWithDisplayName(rows, expectedOutput[OutputColumn.displayName]);
    const cols = row.locator('.ui-grid-cell-contents');
    expect(cols).toHaveCount(Object.keys(expectedOutput).length);
    for (const [colIndex, expectedValue] of Object.entries(expectedOutput)) {
      const colValue = (await cols.nth(Number(colIndex)).innerText()).trim();
      expect(colValue).toBe(expectedValue);
    }
  }

  static async areOutputsOk(panel: Locator, expectedOutputs: OutputDetails[]) {
    const canvas = panel.locator('.ui-grid-canvas');
    await expect(canvas).toBeVisible();

    if (expectedOutputs.length === 0) {
      await expect(canvas.locator('*')).toHaveCount(0);
    } else {
      const rows = canvas.locator('.ui-grid-row');
      await expect(rows).toHaveCount(expectedOutputs.length);
      for (const expectedOutput of expectedOutputs) {
        await this.isOutputOk(rows, expectedOutput);
      }
    }
  }

  static async areMeasureOutputsOk(analysisType: AnalysisType, expectedMeasureOutputs: MeasureOutputs | undefined) {
    if (analysisType === AnalysisType.ALGORITHMIC && expectedMeasureOutputs !== undefined) {
      await expect(this.outputsAccordion).toBeVisible();
      await expect(this.panels).toHaveCount(Object.keys(expectedMeasureOutputs).length);
      for (const [measure, expectedOutputs] of Object.entries(expectedMeasureOutputs)) {
        const panel = this.getPanelWithTitle(measure);
        await expect(panel).toBeVisible();
        await this.areOutputsOk(panel, expectedOutputs);
      }
    } else {
      await expect(this.outputsAccordion).toBeHidden();
      await expect(this.panels).toHaveCount(0);
    }
  }

  static async isAddMeasureButtonOk(analysisType: AnalysisType) {
    if (analysisType === AnalysisType.ALGORITHMIC) {
      await expect(this.addMeasureButton).toBeVisible();
      await expect(this.addMeasureButton).toHaveText(this.EXPECTED_ADD_MEASURE_TEXT);
    } else {
      await expect(this.addMeasureButton).toBeHidden();
    }
  }

  static async isNoOutputsMsgOk(analysisType: AnalysisType) {
    if (analysisType === AnalysisType.MANUAL) {
      await expect(this.noOutputsMsg).toBeVisible();
      await expect(this.noOutputsMsg).toHaveText(this.EXPECTED_NO_OUTPUTS_MSG);
    } else {
      await expect(this.noOutputsMsg).toBeHidden();
    }
  }
}
