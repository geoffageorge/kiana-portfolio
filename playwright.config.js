import { defineConfig, devices } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const production = process.env.PORTFOLIO_TEST_TARGET === 'production';
const baseURL = production ? 'http://127.0.0.1:4173' : 'http://127.0.0.1:5173';
const crossBrowser = process.env.PORTFOLIO_TEST_CROSS_BROWSER === '1';
const regressionSpecs = ['version4.spec.js', 'home-about-design.spec.js', 'case-study.spec.js', 'portfolio.spec.js'];
// Keep automated Firefox app data separate from the personal profile, which
// macOS 27 protects even when Playwright supplies a temporary browser profile.
const firefoxLaunchOptions = crossBrowser && process.platform === 'darwin'
  ? { env: { ...process.env, CFFIXED_USER_HOME: mkdtempSync(join(tmpdir(), 'kiana-firefox-data-')) }, timeout: 20000 }
  : { timeout: 20000 };

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
    ...(crossBrowser ? [
      { name: 'safari-webkit', testMatch: regressionSpecs, use: { browserName: 'webkit', viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 } },
      { name: 'safari-mobile', testMatch: regressionSpecs, use: { ...devices['iPhone 13'], browserName: 'webkit' } },
      { name: 'firefox', testMatch: regressionSpecs, use: { browserName: 'firefox', launchOptions: firefoxLaunchOptions, viewport: { width: 1440, height: 1000 } } },
      // Firefox desktop does not emulate isMobile; this checks the phone viewport.
      { name: 'firefox-mobile', testMatch: regressionSpecs, use: { browserName: 'firefox', launchOptions: firefoxLaunchOptions, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 } },
    ] : process.env.PORTFOLIO_TEST_WEBKIT === '1' ? [{
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
