import type { PlaywrightTestConfig } from "@playwright/test";
import { getReporter } from "./playwright/config-reporter";

const config: PlaywrightTestConfig = {
  testDir: "./playwright/tests",
  testIgnore: "serial",
  fullyParallel: true,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 5,
  reporter: getReporter(false),
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",
  },
  outputDir: "playwright-results/",
};

export default config;
