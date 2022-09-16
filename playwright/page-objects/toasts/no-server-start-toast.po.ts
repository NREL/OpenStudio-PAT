import { ToastPageObject } from './toast.po';

export class NoServerStartToastPageObject extends ToastPageObject {
  EXPECTED_LEVEL = 'WARNING';
  EXPECTED_MESSAGE =
    'Local Server no longer start by default.  You can start Local Server manually from the Server Tools menu.';
}
