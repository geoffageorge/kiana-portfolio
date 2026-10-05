import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import defaults from '../src/data/heroArtwork.json' with { type: 'json' };

async function apply(page, values) {
  for (const [name, value] of Object.entries(values)) await page.locator(`input[name="${name}"]`).fill(String(value));
  await page.getByRole('button', { name: 'Apply settings', exact: true }).click();
  await expect(page.locator('.hero-settings [role="status"]')).toContainText('Preview updated');
}

async function checkLayout(page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const bounds = await page.evaluate(() => {
    const rectangle = selector => {
      const box = document.querySelector(selector).getBoundingClientRect();
      return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height };
    };
    return { art: rectangle('.hero-artwork__svg'), copy: rectangle('.hero-section__copy'), header: rectangle('.site-header'), work: rectangle('#work'), controls: rectangle('.hero-settings'), viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth };
  });
  const intersects = (first, second) => first.left < second.right - .5 && first.right > second.left + .5 && first.top < second.bottom - .5 && first.bottom > second.top + .5;
  expect(intersects(bounds.art, bounds.header), 'art and header do not overlap on page load').toBe(false);
  expect(intersects(bounds.art, bounds.copy), 'art and headline do not overlap').toBe(false);
  expect(intersects(bounds.art, bounds.work), 'art and Select Work do not overlap').toBe(false);
  expect(bounds.art.top).toBeGreaterThanOrEqual(bounds.header.bottom + 28);
  expect(bounds.art.bottom).toBeLessThanOrEqual(bounds.controls.top);
  expect(bounds.controls.bottom).toBeLessThanOrEqual(bounds.work.top);
  expect(bounds.art.left).toBeGreaterThanOrEqual(0);
  expect(bounds.art.right).toBeLessThanOrEqual(bounds.viewport);
  expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.viewport);
  return bounds;
}

test('width, framing, movement, downloads, and browser persistence work', async ({ page }) => {
  test.skip(process.env.PORTFOLIO_TEST_TARGET !== 'production', 'Use the static production preview so this test does not change source defaults.');
  await page.goto('/');
  await checkLayout(page);
  await page.getByText('Adjust hero artwork', { exact: false }).click();
  for (const [name, value] of Object.entries({ maxWidth: defaults.maxWidth, 'viewBox.x': defaults.viewBox.x, 'viewBox.y': defaults.viewBox.y, 'viewBox.width': defaults.viewBox.width, 'viewBox.height': defaults.viewBox.height, 'movement.x': defaults.movement.x, 'movement.y': defaults.movement.y })) {
    await expect(page.locator(`input[name="${name}"]`)).toHaveValue(String(value));
  }
  await apply(page, { maxWidth: 280, 'viewBox.x': 0, 'viewBox.y': 0, 'viewBox.width': 1200, 'viewBox.height': 900 });
  const compact = await checkLayout(page);
  await page.getByRole('button', { name: '960px', exact: true }).click();
  await apply(page, {});
  const wide = await checkLayout(page);
  expect(wide.art.width).toBeGreaterThan(compact.art.width);
  await apply(page, { 'viewBox.x': -100, 'viewBox.y': -100, 'viewBox.width': 1200, 'viewBox.height': 1500, 'movement.x': 230, 'movement.y': 190, 'movement.labelSpread': 130 });
  const tall = await checkLayout(page);
  expect(tall.art.height).toBeGreaterThan(wide.art.height);
  expect(tall.work.top).toBeGreaterThan(wide.work.top);
  const svg = page.locator('.hero-artwork__svg');
  await expect(svg).toHaveAttribute('viewBox', '-100 -100 1200 1500');
  const movement = await svg.evaluate(element => {
    element.pauseAnimations();
    element.setCurrentTime(0);
    for (const animation of element.getAnimations({ subtree: true })) { animation.pause(); animation.currentTime = 0; }
    const transform = new DOMMatrix(getComputedStyle(element.querySelector('.r1')).transform);
    return { x: transform.e, y: transform.f, labelX: getComputedStyle(element.querySelector('.pill')).getPropertyValue('--px') };
  });
  expect(movement.x).toBe(-230);
  expect(movement.y).toBe(-190);
  expect(movement.labelX.trim()).toBe('-65px');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download settings', exact: true }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe('heroArtwork.json');
  const settings = JSON.parse(await readFile(await download.path(), 'utf8'));
  expect(settings.maxWidth).toBe(960);
  expect(settings.viewBox.height).toBe(1500);
  expect(settings.movement).toEqual({ x: 230, y: 190, labelSpread: 130 });
  await page.reload();
  await expect(page.locator('.hero-artwork__svg')).toHaveAttribute('viewBox', '-100 -100 1200 1500');
  await checkLayout(page);
  await page.getByText('Adjust hero artwork', { exact: false }).click();
  await page.getByRole('button', { name: 'Reset to saved', exact: true }).click();
  await expect(page.locator('.hero-artwork__svg')).toHaveAttribute('viewBox', `${defaults.viewBox.x} ${defaults.viewBox.y} ${defaults.viewBox.width} ${defaults.viewBox.height}`);
  await expect(page.getByLabel('Maximum width (px)', { exact: true })).toHaveValue(String(defaults.maxWidth));
  await checkLayout(page);
});

test('small and large canvases fit phone, tablet, and desktop layouts', async ({ page }) => {
  test.skip(process.env.PORTFOLIO_TEST_TARGET !== 'production', 'Use the static production preview so this test does not change source defaults.');
  for (const width of [320, 393, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await checkLayout(page);
    await page.getByText('Adjust hero artwork', { exact: false }).click();
    for (const values of [
      { maxWidth: 280, 'viewBox.x': 0, 'viewBox.y': 0, 'viewBox.width': 2400, 'viewBox.height': 450, 'movement.x': 0, 'movement.y': 0, 'movement.labelSpread': 0 },
      { maxWidth: 1200, 'viewBox.x': -600, 'viewBox.y': -450, 'viewBox.width': 600, 'viewBox.height': 1800, 'movement.x': 300, 'movement.y': 300, 'movement.labelSpread': 150 },
    ]) {
      await apply(page, values);
      await checkLayout(page);
    }
  }
});

test('white tile frames and the replacement logo appear on all pages', async ({ page }) => {
  for (const path of ['/', '/projects/pointly/', '/projects/template/', '/projects/obayashi/', '/projects/project-03/', '/projects/project-04/']) {
    await page.goto(path);
    const logos = page.locator('.brand-logo');
    await expect(logos).toHaveCount(2);
    for (const logo of await logos.all()) {
      await expect(logo).toHaveAttribute('src', '/assets/brand/ki-logo.jpg');
      await expect(logo).toHaveJSProperty('complete', true);
      expect(await logo.evaluate(image => image.naturalWidth)).toBeGreaterThan(0);
      const size = await logo.boundingBox();
      expect(size.width).toBe(page.viewportSize().width < 768 ? 45 : 54);
      expect(size.height).toBe(page.viewportSize().width < 768 ? 30 : 36);
    }
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(252, 252, 248)');
    if (path === '/') for (const card of await page.locator('.project-card').all()) {
      await expect(card).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(card).toHaveCSS('border-top-color', 'rgb(255, 255, 255)');
    }
  }
});
