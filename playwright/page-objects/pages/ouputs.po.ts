import { expect, Locator } from '@playwright/test';
import { AnalysisType, Page } from '../../constants';
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

  static async isNoOutputsMsgOk(analysisType: AnalysisType) {
    if (analysisType === AnalysisType.MANUAL) {
      await expect(this.noOutputsMsg).toBeVisible();
      await expect(this.noOutputsMsg).toHaveText(this.EXPECTED_NO_OUTPUTS_MSG);
    } else {
      await expect(this.noOutputsMsg).toBeHidden();
    }
  }

  static async isAccordianOk(analysisType: AnalysisType) {
    analysisType === AnalysisType.ALGORITHMIC
      ? await expect(this.outputsAccordion).toBeVisible()
      : await expect(this.outputsAccordion).toBeHidden();
  }

  static async isAddMeasureButtonOk(analysisType: AnalysisType) {
    if (analysisType === AnalysisType.ALGORITHMIC) {
      await expect(this.addMeasureButton).toBeVisible();
      await expect(this.addMeasureButton).toHaveText(this.EXPECTED_ADD_MEASURE_TEXT);
    } else {
      await expect(this.addMeasureButton).toBeHidden();
    }
  }

  static async isInState(analysisType: AnalysisType) {
    await this.isNoOutputsMsgOk(analysisType);
    await this.isAccordianOk(analysisType);
    await this.isAddMeasureButtonOk(analysisType);
  }
}
