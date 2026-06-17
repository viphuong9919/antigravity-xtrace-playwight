import { defineConfig, devices } from '@playwright/test';
// import * as dotenv from 'dotenv';
import * as path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './src/tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['html', { open: 'never' }], ['list'], ['allure-playwright', { detail: false }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://172.16.50.198:8080/xtrace-ui',
    headless: false,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
