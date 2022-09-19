import { ElectronAppManager } from '../electron-app-manager';

export class BasePageObject {
  get page() {
    return ElectronAppManager.page;
  }
}
