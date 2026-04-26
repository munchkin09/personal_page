import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration.
 * Runs against `vite preview` serving the pre-built static output.
 * The build is expected to exist in ./build before running tests.
 * Run `npm run build` first, or rely on the CI step that builds.
 */
export default defineConfig({
  testDir: './e2e',
  /* Max parallelism – static site so no shared state issues */
  fullyParallel: true,
  /* Fail fast in CI */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: 'http://localhost:4173',
    /* Collect traces on first retry to ease debugging */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],

  /**
   * Start the static preview server before tests.
   * Requires the build to be present in ./build.
   */
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
