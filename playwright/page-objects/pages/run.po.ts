import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { AnalysisType, DATAPOINT_STATE, PAGES } from '../../constants';
import { PagePO } from './page.po';

export enum RunTypes {
  LOCAL = 'LOCAL',
  CLOUD = 'CLOUD'
}

export class RunPO extends PagePO {
  static readonly EXPECTED_PAGE = PAGES.RUN;
  static readonly EXPECTED_RUN_TYPES = {
    [RunTypes.LOCAL]: 'Run Locally',
    [RunTypes.CLOUD]: 'Run on Cloud'
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
  static readonly EXPECTED_ALG_NO_LOCAL_MSG = `Algorithmic analyses cannot be run locally.  Select 'Run on Cloud' from the dropdown above to run this analysis remotely.`;

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
  static get algNoLocalRow(): Locator {
    return this.container.locator('> div:nth-child(3) > div');
  }
  static get algNoLocalIcon(): Locator {
    return this.algNoLocalRow.locator('span');
  }
  static get algNoLocalMsg(): Locator {
    return this.algNoLocalRow.locator('translate');
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

  static getDatapointWithName(name: string): Locator {
    return this.datapoints.filter({
      has: App.page
        .locator('.datapoint-header > div:first-child > span')
        .filter({ has: App.page.locator(`text="${name}"`) })
    });
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

  static async isSelectedRunTypeOk(selectedRunType: RunTypes) {
    await expect(this.selectedRunType).toHaveText(this.EXPECTED_RUN_TYPES[selectedRunType]);
  }

  static async isServerStatusOk(isServerRunning: boolean) {
    await expect(this.serverStatus).toHaveClass(new RegExp(isServerRunning ? 'glyphicon-ok' : 'glyphicon-remove'));
  }

  static async isAnalysisNameOk(expectedAnalysisName: string) {
    await expect(this.analysisName).toHaveValue(expectedAnalysisName);
  }

  static async isDatapointOk(datapoint: Locator, expectedDatapoint: DATAPOINT_STATE) {
    await expect(this.getNameFor(datapoint)).toHaveText(expectedDatapoint.name);

    const checkbox = this.getCheckboxButtonFor(datapoint);
    expectedDatapoint.isChecked === undefined
      ? await expect(checkbox).toHaveCount(0)
      : await expect(checkbox.locator('span')).toHaveClass(
          `glyphicon${expectedDatapoint.isChecked ? ' glyphicon-ok' : ''}`
        );
  }

  static async areDatapointsOk(expectedDatapoints: DATAPOINT_STATE[]) {
    expect(await this.datapoints.count()).toEqual(expectedDatapoints.length);
    for (const expectedDatapoint of expectedDatapoints) {
      await this.isDatapointOk(this.getDatapointWithName(expectedDatapoint.name), expectedDatapoint);
    }
  }

  static async isAlgNoLocalMsgOk(selectedRunType: RunTypes, expectedAnalysisType: AnalysisType) {
    if (selectedRunType === RunTypes.LOCAL && expectedAnalysisType === AnalysisType.ALGORITHMIC) {
      await expect(this.algNoLocalIcon).toBeVisible();
      await expect(this.algNoLocalIcon).toHaveClass(new RegExp('glyphicon-warning-sign'));
      await expect(this.algNoLocalMsg).toBeVisible();
      await expect(this.algNoLocalMsg).toHaveText(this.EXPECTED_ALG_NO_LOCAL_MSG);
    } else {
      await expect(this.algNoLocalIcon).toBeHidden();
      await expect(this.algNoLocalMsg).toBeHidden();
    }
  }

  static async isInState(
    selectedRunType: RunTypes,
    isServerRunning: boolean,
    analysisName: string,
    expectedDatapoints: DATAPOINT_STATE[],
    expectedAnalysisType: AnalysisType
  ) {
    await this.isSelectedRunTypeOk(selectedRunType);
    await this.isServerStatusOk(isServerRunning);
    await this.isAnalysisNameOk(analysisName);
    await this.areDatapointsOk(expectedDatapoints);
    await this.isAlgNoLocalMsgOk(selectedRunType, expectedAnalysisType);
  }
}
