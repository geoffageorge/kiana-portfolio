import { test, expect } from '@playwright/test';

test('portfolio renders only the two current projects with working artwork and page links', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ClarifyingChaos');
  await expect(page.getByRole('heading', { name: 'Select Work' })).toBeVisible();
  const cards = page.getByRole('link', { name: /^View project/ });
  await expect(cards).toHaveCount(2);
  await expect(page.locator('.project-card h3')).toHaveText(['Obayashi', 'Point.ly']);
  for (const [index, slug, title] of [[0, 'obayashi', 'Obayashi'], [1, 'pointly', 'Point.ly']]) {
    const card = cards.nth(index);
    await card.scrollIntoViewIfNeeded();
    for (const image of await card.locator('img').all()) {
      await image.evaluate(image => image.decode());
      expect(await image.evaluate(image => image.naturalWidth)).toBeGreaterThan(0);
    }
    await expect(card).toHaveAttribute('href', `/projects/${slug}/`);
    await card.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await page.goto('/');
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('shared About+Contact link opens the full page and Work returns home', async ({ page }) => {
  await page.goto('/');
  const about = page.getByRole('link', { name: 'About+Contact', exact: true });
  await about.click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Curious George, Literally');
  await expect(page.getByRole('link', { name: /Resume/ })).toHaveAttribute('href', '/assets/kiana-george-resume.pdf');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'kikig6204@gmail.com', exact: true })).toHaveAttribute('href', 'mailto:kikig6204@gmail.com');
  await expect(page.getByRole('link', { name: '650-817-5454' })).toHaveAttribute('href', 'tel:+16508175454');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/\/#work$/);
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
