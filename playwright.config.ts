import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:3000',
  },
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000/health',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
