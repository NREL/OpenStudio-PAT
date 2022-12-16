import { ToastLevels } from '../../constants';
import { ToastPO } from './toast.po';

export class NoServerStartToastPO extends ToastPO {
  static readonly EXPECTED_LEVEL = ToastLevels.WARNING;
  static readonly EXPECTED_MESSAGE =
    'Local Server no longer start by default.  You can start Local Server manually from the Server Tools menu.';
}
