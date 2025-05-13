import { PlaywrightTestConfig } from '@playwright/test';

export const getReporter = (serial: boolean): PlaywrightTestConfig['reporter'] => {
  const DEFAULT_REPORTERS: PlaywrightTestConfig['reporter'] = [
    ['html', { outputFolder: `reports/playwright/${serial ? 'serial/' : ''}` }]
  ];
  return process.env.CI ? [...DEFAULT_REPORTERS, ['github']] : DEFAULT_REPORTERS;
};
