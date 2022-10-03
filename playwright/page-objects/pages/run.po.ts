import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { DATAPOINT_STATE, PAGES } from '../../constants';
import { PagePO } from './page.po';

export class RunPO extends PagePO {
  static readonly EXPECTED_PAGE = PAGES.RUN;
  static readonly EXPECTED_RUN_TYPES = {
    LOCAL: 'Run Locally',
    CLOUD: 'Run on Cloud'
  };
  static readonly EXPECTED_BUTTONS = {
    RUN_ENTIRE_WORKFLOW: 'Run Entire Workflow',
    RUN_SELECTED: 'Run Selected',
    EXPORT_OSA: 'Export OSA',
    SELECT_ALL: 'Select All',
    CLEAR_SELECTIONS: 'Clear Selections'
  };
  static readonly EXPECTED_PROGRESS_BAR_TEXT = {
    ANALYSIS_STARTED: 'Analysis started',
    ANALYSIS_COMPLETED: 'Analysis completed'
  };

  static get selectedRunType(): Locator {
    return this.container.locator('#runType option[selected="selected"]');
  }

  static get serverStatus(): Locator {
    return this.container
      .locator('div.tab-text')
      .filter({
        hasText: 'Server Status'
      })
      .locator('span[aria-hidden=false]');
  }

  static get analysisName(): Locator {
    return this.container.locator('#analysisName');
  }

  static get progressBar(): Locator {
    return this.container.locator('.progress-bar');
  }

  static get runDetailDivs(): Locator {
    return this.container.locator('> div > div > div.tab-text');
  }

  static get runStatus(): Locator {
    return this.runDetailDivs.filter({ has: App.page.locator('label', { hasText: 'Analysis Status' }) });
  }

  static get datapoints(): Locator {
    return this.container.locator('.run-datapoints .panel-group > div[is-open="datapoint.open"]');
  }

  static getButton(buttonText: string) {
    return this.container.locator('button', { hasText: buttonText });
  }

  static async clickButton(buttonText: string) {
    return this.getButton(buttonText).click();
  }

  static async getProgressBarPercent() {
    return Number(await this.progressBar.getAttribute('aria-valuenow'));
  }

  static async getRunID() {
    const idElem = this.runDetailDivs.filter({ has: App.page.locator('label', { hasText: 'ID' }) });
    return (await idElem.innerText()).replace('ID', '').trim();
  }

  static getNameFor(datapoint: Locator): Locator {
    return datapoint.locator('.datapoint-header > div:first-child > span');
  }

  static getCheckboxButtonFor(datapoint: Locator): Locator {
    return datapoint.locator('.datapoint-header > div:first-child > button');
  }

  static async isSelectedRunTypeOk(expectedSelectedRunType: string) {
    await expect(this.selectedRunType).toHaveText(expectedSelectedRunType);
  }

  static async isServerStatusOk(isServerRunning: boolean) {
    await expect(this.serverStatus).toHaveClass(new RegExp(isServerRunning ? 'glyphicon-ok' : 'glyphicon-remove'));
  }

  static async isAnalysisNameOk(expectedAnalysisName: string) {
    await expect(this.analysisName).toHaveValue(expectedAnalysisName);
  }

  static async isDatapointOk(datapoint: Locator, expectedState: DATAPOINT_STATE) {
    await expect(this.getNameFor(datapoint)).toHaveText(expectedState.name);
    await expect(this.getCheckboxButtonFor(datapoint).locator('span')).toHaveClass(
      `glyphicon${expectedState.isChecked ? ' glyphicon-ok' : ''}`
    );
  }

  static async areDatapointsOk(expectedDatapoints: DATAPOINT_STATE[]) {
    expect(await this.datapoints.count()).toEqual(expectedDatapoints.length);
    for (const [n, expectedState] of expectedDatapoints.entries()) {
      await this.isDatapointOk(this.datapoints.nth(n), expectedState);
    }
  }

  static async isInState(isServerRunning: boolean, analysisName: string, expectedDatapoints: DATAPOINT_STATE[]) {
    await this.isSelectedRunTypeOk(this.EXPECTED_RUN_TYPES.LOCAL);
    await this.isServerStatusOk(isServerRunning);
    await this.isAnalysisNameOk(analysisName);
    await this.areDatapointsOk(expectedDatapoints);
  }
}
