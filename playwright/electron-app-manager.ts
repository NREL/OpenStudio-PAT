import {
  ElectronApplication,
  Page,
  _electron as electron
} from '@playwright/test';

export class ElectronAppManager {
  static app: ElectronApplication;
  static page: Page;

  static get isClosed() {
    return !ElectronAppManager.app?.windows().length;
  }

  static async closeApp() {
    try {
      if (!ElectronAppManager.isClosed) {
        await ElectronAppManager.app.close();
      }
    } catch {}
  }

  static async launchNewAppInstance() {
    await ElectronAppManager.closeApp();

    ElectronAppManager.app = await electron.launch({
      args: ['./build/background.js']
    });
    ElectronAppManager.app.on('window', async page => {
      const filename = page.url()?.split('/').pop();
      console.log(`Window opened: ${filename}`);

      // capture errors
      page.on('pageerror', error => {
        console.error(error);
      });
      // capture console messages
      page.on('console', msg => {
        console.log(msg.text());
      });
    });

    ElectronAppManager.page = await ElectronAppManager.app.firstWindow();
  }

  static async launchAppIfClosed() {
    if (ElectronAppManager.isClosed) {
      await ElectronAppManager.launchNewAppInstance();
    }
  }

  static async mockIpcMainHandle(channel: string, returnValue: any) {
    await ElectronAppManager.app.evaluate(
      ({ ipcMain }, params) =>
        ipcMain.handle(params.channel, () => params.returnValue),
      { channel, returnValue }
    );
  }

  static async removeAllIpcMainListeners(channel?: string) {
    try {
      await ElectronAppManager.app?.evaluate(
        ({ ipcMain }, params) => ipcMain.removeAllListeners(params.channel),
        {
          channel
        }
      );
    } catch {}
  }
}
