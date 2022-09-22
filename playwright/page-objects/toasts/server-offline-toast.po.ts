import { ToastLevels } from '../../constants';
import { ToastPageObject } from './toast.po';

export class ServerOfflineToastPageObject extends ToastPageObject {
  EXPECTED_LEVEL = ToastLevels.ERROR;
  EXPECTED_MESSAGE = 'Server is Offline';
}
