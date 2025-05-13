import { expect, Locator } from '@playwright/test';
import { MeasureTypes, Page } from '../../constants';
import { PagePO } from './page.po';

export class AnalysisPO extends PagePO {
  static readonly EXPECTED_PAGE = Page.ANALYSIS;
  static readonly EXPECTED_DROPDOWN_MENUS = {
    TYPE: 'selectedAnalysisType',
    ALGORITHMIC_METHOD: 'selectedSamplingMethod',
    DEFAULT_SEED_MODEL: 'defaultSeed',
    DEFAULT_WEATHER_FILE: 'defaultWeatherFile'
  };
  static EXPECTED_TITLE: string;

  static get detailsSection(): Locator {
    return this.container.locator('.gray-top');
  }

  static getSelectDropdown(ngModel: string) {
    return this.detailsSection.locator(`select[ng-model="${ngModel}"]`);
  }

  static getSelectedOptionFor(selectDropdown: Locator) {
    return selectDropdown.locator('option[selected="selected"]');
  }

  static getMeasures(measureType: MeasureTypes) {
    return this.container
      .locator(`.analysis-custom:not(.panel-default):below(.measure-type:text("${measureType}"))`)
      .first();
  }

  static async getTitlesOfMeasures(measures: Locator) {
    const allInnerTexts = await measures
      .locator(
        'div:not(.analysis-descriptions) > uib-accordion > .panel-group > .panel-default > .panel-heading > .panel-title > .accordion-toggle > span'
      )
      .allInnerTexts();
    return allInnerTexts.map(innerText => innerText.trim().replace(/\n/g, ''));
  }

  static async isDropdownSelectedValueOk(ngModel: string, expectedSelectedValue?: string) {
    if (expectedSelectedValue !== undefined) {
      const selectDropdown = this.getSelectDropdown(ngModel);
      await expect(selectDropdown).toBeVisible();
      expect(await this.getSelectedOptionFor(selectDropdown).innerText()).toBe(expectedSelectedValue);
    } else {
      await expect(this.getSelectDropdown(ngModel)).toBeHidden();
    }
  }

  static async areMeasuresOk(measureType: MeasureTypes, expectedMeasureTitles: string[]) {
    const measures = this.getMeasures(measureType);
    const titles = await this.getTitlesOfMeasures(measures);
    expect(titles).toStrictEqual(expectedMeasureTitles);
  }

  static async isTitleOk() {
    expect(await this.getTitle()).toHaveText(this.EXPECTED_TITLE ?? this.EXPECTED_PAGE);
  }
}
