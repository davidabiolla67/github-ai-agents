// Demo-focused Playwright config for headed Chromium-only execution.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/registration-demo',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    headless: false,
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

