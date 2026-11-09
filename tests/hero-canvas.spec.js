import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { installSourceClock, sampleSourceState } from './hero-source-clock.js';

test('old preview query strings do not bring back the old hero or inspector controls', async ({ page }) => {
  for (const path of ['/', '/?heroDebug=1', '/?heroAlign=1']) {
    await page.goto(path);
    await expect(page.locator('.hero-artwork,.hero-debug,.hero-alignment')).toHaveCount(0);
    await expect(page.locator('.hero-section__animation')).toBeVisible();
    await expect(page.locator('input[name="placement.x"]')).toHaveCount(0);
  }
});

test('the new close-ups, four-circle convergence and final reveal match the unmodified supplied animation', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.addInitScript(`if (window !== window.top) (${installSourceClock.toString()})();`);
  await page.goto('/');
  const frame=page.frameLocator('.hero-section__animation');
  await expect.poll(()=>frame.locator('.scene').evaluate(()=>typeof window.__heroDraw)).toBe('function');
  const width=await frame.locator('.scene').evaluate(n=>n.clientWidth);
  const reference=await page.context().newPage();
  try {
    await reference.setViewportSize({width,height:width<=480?460:560});
    await reference.emulateMedia({reducedMotion:'no-preference'});
    await reference.addInitScript(installSourceClock);
    const source=await readFile(new URL('../Assets/new hero 2/animation.html',import.meta.url),'utf8');
    await reference.goto(`data:text/html;charset=utf-8,${encodeURIComponent(source)}`);
    await expect.poll(()=>reference.evaluate(()=>typeof window.__heroDraw)).toBe('function');
    expect(await reference.evaluate(()=>performance.now())).toBe(0);
    expect(await frame.locator('.scene').evaluate(()=>performance.now())).toBe(0);
    for(const seconds of [0,.6,1.6,2.6,3.6,4.5,4.85,5.4,6.1,6.8,7.3,7.9,8.3,9.1]) {
      const expected=await reference.locator('.scene').evaluate(sampleSourceState,seconds);
      const actual=await frame.locator('.scene').evaluate(sampleSourceState,seconds);
      expect(actual,`source animation state at ${seconds}s`).toEqual(expected);
    }
    await expect(frame.locator('.scene')).toHaveCSS('overflow','hidden');
    await expect(frame.locator('.orbit-donut').first()).toHaveCSS('box-shadow','none');
    await expect(frame.getByRole('button')).toHaveCount(0);
  } finally { await reference.close(); }
});
