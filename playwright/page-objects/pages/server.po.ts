import { PAGES } from '../../constants';
import { PagePO } from './page.po';

export class ServerPO extends PagePO {
  static readonly EXPECTED_PAGE = PAGES.SERVER;
}
