import type { PlaywrightTestConfig } from "@playwright/test";
import defaultConfig from "./playwright.config";
import { getReporter } from "./playwright/config-reporter";

const config: PlaywrightTestConfig = {
  ...defaultConfig,
  testIgnore: undefined,
  testMatch: "serial/serial.list.ts",
  fullyParallel: false,
  timeout: 300_000,
  workers: 1,
  retries: 0,
  reporter: getReporter(true),
};

export default config;
