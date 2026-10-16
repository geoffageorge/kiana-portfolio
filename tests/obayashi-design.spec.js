import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { projectRoutes } from '../src/data/projectRoutes.js';

test('Obayashi opens from its tile, reloads, enlarges exhibits and links to Pointly', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
  await page.goto('/');
  await page.getByRole('link', { name: 'View project 01: Obayashi North America', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/obayashi\/$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Obayashi');
  await expect(page.locator('.obayashi-index')).toHaveText('01 /');
  await expect(page.locator('.obayashi-finding')).toHaveCount(5);
  await expect(page.locator('.obayashi-exhibit img')).toHaveCount(6);
  await page.getByRole('navigation', { name: 'Project sections' }).getByRole('link', { name: 'Research', exact: true }).click();
  await expect(page).toHaveURL(/#research$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: '17 stakeholder interviews' })).toBeInViewport();
  const image = page.getByRole('button', { name: 'Enlarge Obayashi website content mind map with a prioritized content opportunity', exact: true });
  await image.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Open full-size image' })).toHaveAttribute('href', /content-hierarchy\.webp$/);
  await expect(dialog.locator('.modal-image-caption')).toContainText('audience needs and business goals');
  await page.keyboard.press('Escape');
  await expect(image).toBeFocused();
  const manifest = JSON.parse(await readFile(new URL('../public/assets/obayashi/manifest.json', import.meta.url), 'utf8'));
  for (const asset of Object.values(manifest.assets)) {
    const response = await request.get(`/assets/obayashi/${asset.file}`);
    expect(response.ok(), asset.file).toBe(true);
    expect(response.headers()['content-type']).toMatch(/^image\//);
  }
  await page.getByRole('link', { name: 'Next project: Point.ly' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  await page.goto('/projects/obayashi_old/');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Obayashi North America');
  await expect(page.locator('.case-section')).toHaveCount(6);
  await expect(page.locator('.case-hero__visual img')).toHaveAttribute('src', '/assets/projects/obayashi-placeholder.png');
  expect(errors).toEqual([]);
});

test('Obayashi section navigation stays visible beside every desktop section', async ({ page }) => {
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/projects/obayashi/');
    await page.evaluate(() => document.fonts.ready);
    const navigation = page.getByRole('navigation', { name: 'Project sections' });
    for (const selector of ['#research', '.obayashi-finding:nth-child(3)']) {
      await page.locator(selector).evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
      const header = await page.locator('.site-header').boundingBox();
      const sidebar = await navigation.boundingBox();
      const content = await page.locator('.obayashi-content').boundingBox();
      expect(sidebar.y).toBeCloseTo(header.height + 24, 1);
      expect(sidebar.x + sidebar.width).toBeLessThan(content.x);
      await expect(navigation.getByRole('link')).toHaveText(['The Challenge', 'Research', 'Design', 'Reflection']);
      await expect(navigation).toBeInViewport();
    }
    for (const [id, label] of [['challenge', 'The Challenge'], ['research', 'Research'], ['design', 'Design'], ['reflection', 'Reflection']]) {
      const link = navigation.getByRole('link', { name: label, exact: true });
      await link.click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id} > h2, #${id} h2`).first()).toBeInViewport();
      await expect(link).toHaveAttribute('aria-current', 'location');
      const sidebar = await navigation.boundingBox();
      const header = await page.locator('.site-header').boundingBox();
      expect(sidebar.y).toBeGreaterThanOrEqual(header.height);
    }
  }
});

test('all extracted Obayashi exhibits retain the reference pixels', async ({ page }) => {
  const manifest = JSON.parse(await readFile(new URL('../public/assets/obayashi/manifest.json', import.meta.url), 'utf8'));
  const reference = (await readFile(new URL('../Assets/obayashi/Obayashi.png', import.meta.url))).toString('base64');
  await page.goto('/projects/obayashi/');
  await expect(page.locator('.obayashi-case')).toBeVisible();
  const differences = await page.evaluate(async ({ reference, assets }) => {
    const original = new Image();
    original.src = `data:image/png;base64,${reference}`;
    await original.decode();
    const changed = [];
    for (const [name, asset] of Object.entries(assets)) {
      const actual = new Image();
      actual.src = new URL(`assets/obayashi/${asset.file}`, new URL('../../', location.href)).href;
      await actual.decode();
      const canvas = document.createElement('canvas');
      canvas.width = asset.width; canvas.height = asset.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      const [x, y, right, bottom] = asset.sourceRect;
      context.drawImage(original, x, y, right - x, bottom - y, 0, 0, asset.width, asset.height);
      const expected = context.getImageData(0, 0, asset.width, asset.height).data;
      context.clearRect(0, 0, asset.width, asset.height);
      context.drawImage(actual, 0, 0);
      const pixels = context.getImageData(0, 0, asset.width, asset.height).data;
      let count = 0;
      for (let i = 0; i < expected.length; i++) if (expected[i] !== pixels[i]) count++;
      if (count) changed.push({ name, count });
    }
    return changed;
  }, { reference, assets: manifest.assets });
  expect(differences).toEqual([]);
});

test('Obayashi typography, source colors and responsive layout match the portfolio', async ({ page }) => {
  for (const width of [320, 393, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/projects/obayashi/');
    await expect(page.locator('.obayashi-findings')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const header = await page.locator('.site-header').boundingBox();
    const title = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(title.y).toBeGreaterThanOrEqual(header.y + header.height);
    if (width === 1440) {
      const facts = await page.locator('.obayashi-facts').boundingBox();
      expect(facts.x).toBe(120);
      expect(facts.y).toBe(347); // Measured from the supplied 1440px PNG.
      expect(facts.width).toBe(1200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-size', '82px');
    }
  }
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.obayashi-case')).toHaveCSS('font-family', '"Pointly Roboto", Arial, sans-serif');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-family', '"Pointly Inter", Arial, sans-serif');
  await expect(page.locator('.obayashi-quote')).toHaveCSS('background-color', 'rgb(227, 242, 231)');
  await expect(page.locator('.obayashi-facts dt').first()).toHaveCSS('font-family', '"Pointly Roboto Mono", monospace');
});

test('Work, About, Resume and Contact remain consistent on every page', async ({ page }) => {
  for (const path of ['/', ...projectRoutes.map(project => `/projects/${project.slug}/`)]) {
    await page.goto(path);
    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(navigation.locator(':scope > a, :scope > button')).toHaveText(['Work', 'About', 'Resume', 'Contact']);
    await expect(navigation).toHaveCSS('font-family', '"Pointly Roboto Mono", monospace');
    await expect(navigation.getByRole('link', { name: 'Work', exact: true })).toHaveAttribute('href', path === '/' ? '#work' : '/#work');
    await navigation.getByRole('link', { name: 'Work', exact: true }).click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.getByRole('heading', { name: 'Select Work' })).toBeInViewport();
  }
});
