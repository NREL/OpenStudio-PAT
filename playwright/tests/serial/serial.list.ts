import { test } from '@playwright/test';
import { startServerTests } from './start-server.spec';
import { stopServerTests } from './stop-server.spec';
import { App } from '../../App';
import { IPC_MAIN_HANDLE_MOCKS } from '../../mocks';
import { SelectProjectModalPO } from '../../page-objects';

test.describe.configure({ mode: 'serial' });
test.beforeAll(async () => await App.launchIfClosed());
// test.afterAll(async () => {
//   await App.removeAllIpcMainListeners();
//   await App.close();
// });

test.describe('open existing project', async () => {
  test.beforeAll(async () => {
    await SelectProjectModalPO.open(IPC_MAIN_HANDLE_MOCKS.showOpenDialog.validOfficeHVAC);
  });

  startServerTests();
  // stopServerTests();
});
