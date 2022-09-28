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
    App.instance.on('window', async page => {
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
    console.info('* 1 - waitForServerState() called!');
    App.page.on('console', msg => console.log(msg.text()));
    await App.page.evaluate(
      async ({ shouldBeRunning, statusUrl }) => {
        const hardWait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const pollDuration = 1_000;

        while (true) {
          try {
            console.info('* 2 - calling fetch() / checking server status!');
            const statusResponse = await fetch(statusUrl);
            if (statusResponse.ok === shouldBeRunning) {
              console.info('*   - OK, returning!');
              return;
            }
          } catch {
            if (!shouldBeRunning) {
              console.info('*   - OK, returning!');
              return;
            }
          }
          console.info('* 3 - waiting...');
          await hardWait(pollDuration);
        }
      },
      { shouldBeRunning, statusUrl }
    );
  }
}
