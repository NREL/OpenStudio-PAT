import { ToastLevels } from '../../constants';
import { ToastPO } from './toast.po';

export class ProjectSavedToastPO extends ToastPO {
  static readonly EXPECTED_LEVEL = ToastLevels.SUCCESS;
  static readonly EXPECTED_MESSAGE = 'Project saved!';
}
