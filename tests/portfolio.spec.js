import { test, expect } from '@playwright/test';

test('portfolio renders four projects with working local artwork', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ClarifyingChaos');
  await expect(page.getByRole('heading', { name: 'Select Work' })).toBeVisible();
  const cards = page.getByRole('link', { name: /^View project/ });
  await expect(cards).toHaveCount(4);
  for (const card of await cards.all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('img')).toHaveJSProperty('complete', true);
    expect(await card.locator('img').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('shared navigation dialogs work and restore keyboard focus', async ({ page }) => {
  await page.goto('/');
  const about = page.getByRole('button', { name: 'About', exact: true });
  await about.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toHaveText('A little about me');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(about).toBeFocused();
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  await expect(dialog.getByRole('heading')).toHaveText('Résumé coming soon');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole('link', { name: 'kianageo@uw.edu', exact: true })).toHaveAttribute('href', 'mailto:kianageo@uw.edu');
  await page.getByRole('button', { name: 'LinkedIn', exact: true }).click();
  await expect(dialog.getByRole('heading')).toHaveText('Let’s connect');
});

test('animation loops continuously and respects reduced motion', async ({ page }) => {
  await page.goto('/');
  const animation = page.locator('.hero-artwork__svg');
  await expect(animation).toBeVisible();
  await expect(animation.locator('.ring')).toHaveCount(4);
  await expect(page.getByRole('button', { name: /(?:Pause|Play|Replay) hero animation/ })).toHaveCount(0);
  const startTime = await animation.evaluate(svg => svg.getCurrentTime());
  await page.waitForTimeout(200);
  expect(await animation.evaluate(svg => svg.getCurrentTime())).toBeGreaterThan(startTime);
  expect(await animation.evaluate(svg => !svg.animationsPaused() && svg.getAnimations({ subtree: true }).every(item => item.playState === 'running' && item.effect.getTiming().iterations === Infinity))).toBe(true);
  // Let the actual page clock cross a complete 10-second cycle, without seeking
  // or clicking any controls, to verify automatic looping after initial load.
  await expect.poll(() => animation.evaluate(svg => svg.getAnimations({ subtree: true }).every(item => item.playState === 'running' && item.effect.getComputedTiming().currentIteration >= 1)), { timeout: 15000 }).toBe(true);
  expect(await animation.evaluate(svg => svg.getCurrentTime())).toBeGreaterThan(10);
  await page.reload();
  await expect.poll(() => animation.evaluate(svg => !svg.animationsPaused() && svg.getCurrentTime() > .1 && svg.getAnimations({ subtree: true }).length === 15)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(animation.locator('.orbit')).not.toBeVisible();
  await expect(animation.locator('.clarity')).toHaveCSS('opacity', '1');
  await expect.poll(() => animation.evaluate(svg => svg.animationsPaused() && svg.getAnimations({ subtree: true }).length === 0)).toBe(true);
  await expect(page.getByRole('button', { name: /hero animation/ })).toHaveCount(0);
});

test('layout fits narrow phones and tablets', async ({ page }) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole('navigation')).toBeVisible();
  }
});
