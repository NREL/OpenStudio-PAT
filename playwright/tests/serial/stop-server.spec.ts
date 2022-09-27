import { test } from '@playwright/test';
import { App } from '../../App';
import {
  ServerToolsModalPO,
  ServerOfflineToastPO,
  ServerStoppingToastPO,
  ServerStoppedToastPO
} from '../../page-objects';
import { describeServerToolsModalWithButtons } from './shared.spec';

export const stopServerTests = () =>
  describeServerToolsModalWithButtons(() => {
    test.describe('click "Stop Local Server" button', () => {
      let serverStoppedPromise: Promise<void>;
      test.beforeAll(async () => {
        await ServerToolsModalPO.clickButton(
          ServerToolsModalPO.EXPECTED_BODY_BUTTONS.STOP,
          ServerToolsModalPO.bodyButtons
        );
        serverStoppedPromise = App.waitForServerState(false);
      });

      test('"Server Stopping" toast is shown', async () => {
        await ServerStoppingToastPO.isOk();
      });

      test.describe('server stops', () => {
        test.beforeAll(async () => await serverStoppedPromise);

        test('"Server Stopped" toast is shown', async () => {
          await ServerStoppedToastPO.isOk();
        });

        test.describe('click "Ping Server and Set Status" button', () => {
          test('"Server is offline" toast is shown', async () => {
            await ServerToolsModalPO.clickButton(
              ServerToolsModalPO.EXPECTED_BODY_BUTTONS.PING_AND_SET_STATUS,
              ServerToolsModalPO.bodyButtons
            );
            await ServerOfflineToastPO.isOk();
          });
        });
      });
    });
  });
