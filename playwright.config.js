const { defineConfig, devices } = require('@playwright/test');
const testConfig = require('./prism-toolshop-playwright/test-data/test-config.json');

module.exports = defineConfig({
  testDir: './prism-toolshop-playwright/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'prism-toolshop-playwright/reports/html-report', open: 'never' }],
    ['json', { outputFile: 'prism-toolshop-playwright/reports/results.json' }],
  ],
  use: {
    baseURL: testConfig.ui.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui-chromium',
      testMatch: '**/ui/**/*.spec.js',
      workers: 1,
      timeout: 60000,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.js',
      use: {
        baseURL: testConfig.api.baseUrl,
      },
    },
  ],
});
