import { test, expect } from '@playwright/test';

test('old preview query strings do not bring back the old hero or inspector controls', async ({ page }) => {
  for (const path of ['/', '/?heroDebug=1', '/?heroAlign=1']) {
    await page.goto(path);
    await expect(page.locator('.hero-artwork,.hero-debug,.hero-alignment')).toHaveCount(0);
    await expect(page.locator('.hero-section__animation')).toBeVisible();
    await expect(page.locator('input[name="placement.x"]')).toHaveCount(0);
  }
});

test('the supplied motion passes through all four focus words and settles on the final headline', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const frame=page.frameLocator('.hero-section__animation');
  await expect(frame.locator('.spiro path')).toHaveCount(8);
  await page.clock.runFor(600);
  for (const [index,word] of ['Gather','Connect','Synthesize','Shape'].entries()) {
    await expect(frame.locator('.focus-word').nth(index)).toHaveCSS('opacity','1');
    await expect(frame.locator('.focus-word').nth(index)).toHaveText(word);
    if (index<3) await page.clock.runFor(1200);
  }
  await page.clock.runFor(1400);
  expect(await frame.locator('.orbit-donut .label').evaluateAll(nodes=>nodes.some(n=>Number(getComputedStyle(n).opacity)>.5))).toBe(true);
  await page.clock.runFor(4000);
  await expect(frame.locator('.subhead')).toHaveText('A journalist’s curiosity. A strategist’s perspective.');
  await expect(frame.locator('.subhead')).toHaveCSS('opacity','1');
  await expect(frame.locator('.scene')).toHaveCSS('overflow','hidden');
  await expect(frame.locator('.orbit-donut').first()).toHaveCSS('box-shadow','none');
});
