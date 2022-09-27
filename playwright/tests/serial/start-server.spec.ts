import { test } from '@playwright/test';
import { App } from '../../App';
import { ServerToolsModalPO, ServerAliveToastPO, ServerStartingToastPO } from '../../page-objects';
import { describeServerToolsModalWithButtons } from './shared.spec';

export const startServerTests = () =>
  describeServerToolsModalWithButtons(() => {
    test.describe('click "Start Local Server" button', () => {
      let serverStartedPromise: Promise<void>;
      test.beforeAll(async () => {
        await ServerToolsModalPO.clickButton(
          ServerToolsModalPO.EXPECTED_BODY_BUTTONS.START,
          ServerToolsModalPO.bodyButtons
        );
        serverStartedPromise = App.waitForServerState(true);
      });

      test('"Server Starting" toast is shown', async () => {
        await ServerStartingToastPO.isOk();
      });

      test.describe('server starts', () => {
        test.beforeAll(async () => await serverStartedPromise);
        test.describe('click "Ping Server and Set Status" button', () => {
          test('"Server is Alive" toast is shown', async () => {
            await ServerToolsModalPO.clickButton(
              ServerToolsModalPO.EXPECTED_BODY_BUTTONS.PING_AND_SET_STATUS,
              ServerToolsModalPO.bodyButtons
            );
            await ServerAliveToastPO.isOk();
          });
        });
      });
    });
  });
