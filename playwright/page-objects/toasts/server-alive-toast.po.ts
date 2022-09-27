import { ToastLevels } from '../../constants';
import { ToastPO } from './toast.po';

export class ServerAliveToastPO extends ToastPO {
  static readonly EXPECTED_LEVEL = ToastLevels.SUCCESS;
  static readonly EXPECTED_MESSAGE = 'Server is Alive';
}
