import { PagePageObject } from './page.po';

export class AnalysisPageObject extends PagePageObject {
  EXPECTED_ROUTE = '/analysis';
  EXPECTED_TITLE = '';

  constructor(expectedTitle: string) {
    super();
    this.EXPECTED_TITLE = expectedTitle;
  }
}
