import { ElectronApplication, Page, _electron as electron } from '@playwright/test';
import { MAIN_SCRIPT_PATH } from './paths';

export class App {
  static instance: ElectronApplication;
  static page: Page;

  static get isClosed() {
    return !App.instance?.windows().length;
  }

  static async close() {
    try {
      if (!App.isClosed) {
        await App.instance.close();
      }
    } catch {}
  }

  static async launchNewInstance() {
    await App.close();

    App.instance = await electron.launch({
      args: [MAIN_SCRIPT_PATH]
    });

    App.page = await App.instance.firstWindow();
  }

  static async launchIfClosed() {
    if (App.isClosed) {
      await App.launchNewInstance();
    }
  }

  static async mockIpcMainHandle(channel: string, returnValue?: any) {
    return App.instance.evaluate(
      ({ ipcMain }, params) => {
        return new Promise<any[]>(resolve => {
          ipcMain.handle(params.channel, (_, ...args) => {
            resolve(args);
            return params.returnValue;
          });
        });
      },
      {
        channel,
        returnValue
      }
    );
  }

  static async removeAllIpcMainListeners(channel?: string) {
    try {
      await App.instance?.evaluate(({ ipcMain }, params) => ipcMain.removeAllListeners(params.channel), {
        channel
      });
    } catch {}
  }

  static async getMenuItem(menuItem: string) {
    return App.instance.evaluate(async ({ app }, params) => app.applicationMenu!.getMenuItemById(params.menuItem), {
      menuItem
    });
  }

  static async clickMenuItem(menuItems: string[]) {
    return App.instance.evaluate(
      async ({ app }, params) => {
        let menuItem = app.applicationMenu!.getMenuItemById(params.menuItems[0]);
        for (let i = 1; i < params.menuItems.length; ++i) {
          menuItem = menuItem!.submenu!.getMenuItemById(params.menuItems[i]);
        }
        await menuItem!.click();
      },
      { menuItems }
    );
  }

  static async waitForServerState(shouldBeRunning = true, statusUrl = 'http://localhost:8080/status.json') {
    await App.page.evaluate(
      async ({ shouldBeRunning, statusUrl }) => {
        const hardWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const pollDuration = 10_000;
        console.log(
          `${new Date().toTimeString().substring(0, 8)} - waiting until server is${
            shouldBeRunning ? '' : ' NOT'
          } running...`
        );

        while (true) {
          try {
            const statusResponse = await fetch(statusUrl);
            if (statusResponse.ok === shouldBeRunning) {
              return;
            }
          } catch {
            if (!shouldBeRunning) {
              return;
            }
          }
          console.log(`${new Date().toTimeString().substring(0, 8)} - waiting ${pollDuration / 100}s...`);
          await hardWait(pollDuration);
        }
      },
      { shouldBeRunning, statusUrl }
    );
  }
}
