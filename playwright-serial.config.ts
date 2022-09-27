import type { PlaywrightTestConfig } from "@playwright/test";
import defaultConfig from "./playwright.config";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  ...defaultConfig,
  testIgnore: undefined,
  testMatch: "serial/serial.list.ts",
  fullyParallel: false,
  timeout: 300_000,
  workers: 1,
  reporter: process.env.CI
    ? "github"
    : [["html", { outputFolder: "reports/playwright/serial/" }]],
};

export default config;
