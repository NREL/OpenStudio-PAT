import type { PlaywrightTestConfig } from "@playwright/test";

const DEFAULT_REPORTERS: PlaywrightTestConfig["reporter"] = [
  ["html", { outputFolder: "reports/playwright/" }],
];

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
  reporter: process.env.CI
    ? [...DEFAULT_REPORTERS, ["github"]]
    : DEFAULT_REPORTERS,
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",
  },
  outputDir: "playwright-results/",
};

export default config;
