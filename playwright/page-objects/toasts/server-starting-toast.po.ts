import { ToastLevels } from '../../constants';
import { ToastPO } from './toast.po';

export class ServerStartingToastPO extends ToastPO {
  static readonly EXPECTED_LEVEL = ToastLevels.INFO;
  static readonly EXPECTED_MESSAGE = 'Starting Local Server...this may take a while';
}
