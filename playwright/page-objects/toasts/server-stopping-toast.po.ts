import { ToastLevels } from '../../constants';
import { ToastPO } from './toast.po';

export class ServerStoppingToastPO extends ToastPO {
  static readonly EXPECTED_LEVEL = ToastLevels.INFO;
  static readonly EXPECTED_MESSAGE = 'Stopping Local Server...this may take a while';
}
