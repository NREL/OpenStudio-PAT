import { EXPECTED_DETAILS_BY_PAGE } from '../../mocks';
import { PagePageObject } from './page.po';

export class AnalysisPageObject extends PagePageObject {
  EXPECTED_PAGE_DETAILS = EXPECTED_DETAILS_BY_PAGE.ANALYSIS;

  constructor(expectedTitle: string) {
    super();
    this.EXPECTED_PAGE_DETAILS = {
      ...EXPECTED_DETAILS_BY_PAGE.ANALYSIS,
      title: expectedTitle
    };
  }
}
