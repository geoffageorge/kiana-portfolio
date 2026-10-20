import { defineConfig, devices } from '@playwright/test';

const production = process.env.PORTFOLIO_TEST_TARGET === 'production';
const baseURL = production ? 'http://127.0.0.1:4173' : 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { channel: 'chrome', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', channel: 'chrome' } },
    ...(process.env.PORTFOLIO_TEST_WEBKIT === '1' ? [{
      name: 'safari-webkit',
      testMatch: ['obayashi-design.spec.js', 'pointly-design.spec.js', 'home-about-design.spec.js'],
      use: { browserName: 'webkit', viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 },
    }] : []),
  ],
  webServer: {
    command: production ? 'npm run preview' : 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
