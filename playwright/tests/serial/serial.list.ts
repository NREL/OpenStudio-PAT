import { test } from '@playwright/test';
import { runAnalysisTests } from './run-analysis.spec';
import { saveProjectTests } from './save-project.spec';
import { startServerTests } from './start-server.spec';
import { stopServerTests } from './stop-server.spec';
import { PROJECT_SETUP_DETAILS } from '../shared.spec';
import { App } from '../../App';
import { PROJECTS } from '../../constants';

test.describe.configure({ mode: 'serial' });
test.beforeAll(async () => await App.launchIfClosed());
test.afterAll(async () => {
  await App.removeAllIpcMainListeners();
  await App.close();
});

const CURRENT_PROJECT = PROJECTS.OFFICE_HVAC;
const setupDetails = PROJECT_SETUP_DETAILS[CURRENT_PROJECT];

test.describe(setupDetails.description, async () => {
  test.beforeAll(async () => await setupDetails.beforeEach());

  startServerTests();
  runAnalysisTests(CURRENT_PROJECT);
  if (!process.env.CI) {
    stopServerTests();
  }
  saveProjectTests();
});
