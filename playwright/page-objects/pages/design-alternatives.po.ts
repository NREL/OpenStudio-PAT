import { expect, Locator } from '@playwright/test';
import { App } from '../../App';
import { AnalysisType, DesignAltColumn, DesignAltDetails, Page } from '../../constants';
import { PagePO } from './page.po';

export class DesignAlternativesPO extends PagePO {
  static readonly EXPECTED_PAGE = Page.DESIGN_ALTERNATIVES;
  static readonly EXPECTED_AUTOMATIC_ALTS_MSG =
    'For an Algorithmic Analysis, Design Alternatives are created automatically.';
  static readonly EXPECTED_BUTTONS = {
    ADD_ALTERNATIVE: 'Add Alternative',
    CREATE_ONE_ALT_WITH_EACH_MEASURE_OPT: 'Create One Design Alternative with Each Measure Option',
    DUPLICATE_ALTERNATIVE: 'Duplicate Alternative'
  };

  static get pageContent(): Locator {
    return this.container.locator('ng-switch > div');
  }
  static get automaticAltsMsg(): Locator {
    return this.pageContent.locator('p');
  }
  static get buttons(): Locator {
    return this.pageContent.locator('> div.row > div > button');
  }

  static getButton(buttonText: string, buttons = this.buttons) {
    return buttons.filter({ has: App.page.locator(`:text("${buttonText}")`) });
  }

  static getRowWithName(rows: Locator, name: string): Locator {
    return rows.filter({
      has: App.page
        .locator('.ui-grid-cell-contents')
        .nth(0)
        .filter({ has: App.page.locator(`text="${name}"`) })
    });
  }

  static async areButtonsOk(
    analysisType: AnalysisType,
    EXPECTED_BUTTONS = this.EXPECTED_BUTTONS,
    buttons = this.buttons
  ) {
    if (analysisType === AnalysisType.MANUAL) {
      await expect(buttons).toHaveCount(Object.keys(EXPECTED_BUTTONS).length);
      for (const buttonText of Object.values(EXPECTED_BUTTONS)) {
        await expect(this.getButton(buttonText)).toBeVisible();
      }
    } else {
      await expect(buttons).toHaveCount(0);
    }
  }

  static async isDesignAltOk(rows: Locator, expectedDesignAlt: DesignAltDetails) {
    const row = this.getRowWithName(rows, expectedDesignAlt[DesignAltColumn.name]);
    const cols = row.locator('.ui-grid-cell-contents');
    expect(await cols.count()).toBeGreaterThanOrEqual(Object.keys(expectedDesignAlt).length);
    for (const [colIndex, expectedValue] of Object.entries(expectedDesignAlt)) {
      const colValue = (await cols.nth(Number(colIndex)).innerText()).trim();
      expect(colValue).toBe(expectedValue);
    }
  }

  static async areDesignAltsOk(analysisType: AnalysisType, expectedDesignAlts: DesignAltDetails[] | undefined) {
    const uiGridCanvases = this.pageContent.locator('.ui-grid-canvas');
    if (analysisType === AnalysisType.MANUAL) {
      const canvas = uiGridCanvases.nth(1);
      await expect(canvas).toBeVisible();

      if (expectedDesignAlts!.length === 0) {
        await expect(canvas.locator('*')).toHaveCount(0);
      } else {
        const rows = canvas.locator('.ui-grid-row');
        await expect(rows).toHaveCount(expectedDesignAlts!.length);
        for (const expectedDesignAlt of expectedDesignAlts!) {
          await this.isDesignAltOk(rows, expectedDesignAlt);
        }
      }
    } else {
      expect(uiGridCanvases).toHaveCount(0);
    }
  }

  static async isAutomaticAltsMsgOk(analysisType: AnalysisType) {
    if (analysisType === AnalysisType.ALGORITHMIC) {
      await expect(this.automaticAltsMsg).toBeVisible();
      await expect(this.automaticAltsMsg).toHaveText(this.EXPECTED_AUTOMATIC_ALTS_MSG);
    } else {
      await expect(this.automaticAltsMsg).toBeHidden();
    }
  }
}
