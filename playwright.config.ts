import { defineConfig, devices } from '@playwright/test';

const externalBaseUrl = process.env.SITE_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.playwright.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['line'], ['html', { outputFolder: 'playwright-report' }]]
    : 'line',
  use: {
    baseURL: externalBaseUrl ?? 'http://127.0.0.1:4321',
    colorScheme: 'light',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 },
      },
    },
  ],
  webServer: externalBaseUrl
    ? undefined
    : {
        command:
          'ASTRO_PREVIEW_BACKGROUND=0 npm run preview -- --host 127.0.0.1 --port 4321',
        url: 'http://127.0.0.1:4321/',
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
