import { test } from '@playwright/test';
import { runPageTests } from './run-page.spec';
import { saveProjectTests } from './save-project.spec';
import { serverPageTests } from './server-page.spec';
import { startServerTests } from './start-server.spec';
import { stopServerTests } from './stop-server.spec';
import { appHooksSetup, describeProjects, Hook } from '../shared.spec';
import { Projects } from '../../constants';

test.describe.configure({ mode: 'serial' });
appHooksSetup(Hook.all);

describeProjects(
  CURRENT_PROJECT => {
    startServerTests();
    serverPageTests();
    runPageTests(CURRENT_PROJECT);
    // Only stop server when running locally since the server stop command times out in GitHub Actions
    if (!process.env.CI) {
      stopServerTests();
    }
    saveProjectTests();
  },
  [Projects.OFFICE_HVAC],
  Hook.all
);
