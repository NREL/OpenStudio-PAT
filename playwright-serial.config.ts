import type { PlaywrightTestConfig } from "@playwright/test";
import defaultConfig from "./playwright.config";

const DEFAULT_REPORTERS: PlaywrightTestConfig["reporter"] = [
  ["html", { outputFolder: "reports/playwright/serial" }],
];

const config: PlaywrightTestConfig = {
  ...defaultConfig,
  testIgnore: undefined,
  testMatch: "serial/serial.list.ts",
  fullyParallel: false,
  timeout: 60_000,
  workers: 1,
  retries: 0,
  reporter: process.env.CI
    ? [...DEFAULT_REPORTERS, ["github"]]
    : DEFAULT_REPORTERS,
};

export default config;
