import { ToastLevels } from '../../constants';
import { ToastPO } from './toast.po';

export class ServerOfflineToastPO extends ToastPO {
  static readonly EXPECTED_LEVEL = ToastLevels.ERROR;
  static readonly EXPECTED_MESSAGE = 'Server is Offline';
}
