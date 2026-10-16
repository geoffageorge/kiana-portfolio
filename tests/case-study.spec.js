import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('Pointly tile opens its project page and shared navigation returns home', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'View project 02: Point.ly', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/pointly\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  await expect(page.getByRole('link', { name: 'kianageo@uw.edu', exact: true })).toHaveAttribute('href', 'mailto:kianageo@uw.edu');
  const about = page.getByRole('button', { name: 'About', exact: true });
  await about.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(about).toBeFocused();
  await page.getByRole('link', { name: 'Back to selected work' }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ClarifyingChaos');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  await page.getByRole('link', { name: 'Kiana George home', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Select Work' })).toBeVisible();
});

test('direct Pointly links and reloads load every new reference image', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
  await page.goto('/projects/pointly/');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  await expect(page.locator('.pointly-section')).toHaveCount(4);
  const manifest = JSON.parse(await readFile(new URL('../public/assets/pointly-2/manifest.json', import.meta.url), 'utf8'));
  const expected = Object.values(manifest.assets).map(image => image.file).sort();
  await expect(page.locator('.pointly-mvp-gallery img')).toHaveCount(3);
  const actual = await page.locator('main img').evaluateAll(images => [...new Set(images.map(image => image.src.split('/').at(-1)))].sort());
  expect(actual).toEqual(expected);
  for (const image of Object.values(manifest.assets)) {
    const response = await request.get(`/assets/pointly-2/${image.file}`);
    expect(response.ok(), image.file).toBe(true);
    expect(response.headers()['content-type']).toMatch(/^image\//);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('section links and image enlargement work with keyboard focus', async ({ page }) => {
  await page.goto('/projects/pointly/');
  await page.getByRole('navigation', { name: 'Project sections' }).getByRole('link', { name: 'Research', exact: false }).click();
  await expect(page).toHaveURL(/#research$/);
  await expect(page.getByRole('heading', { name: 'Research Revealed Insights' })).toBeInViewport();
  const image = page.getByRole('button', { name: 'Enlarge Point.ly homepage final design and destination discovery', exact: true });
  await image.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toHaveText('Point.ly homepage final design and destination discovery');
  await expect(dialog.getByRole('link', { name: 'Open full-size image' })).toHaveAttribute('href', /hero-showcase\.webp$/);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(image).toBeFocused();
  const mvpImage = page.getByRole('button', { name: 'Enlarge Point.ly property detail comparing points, cash price, and redemption value', exact: true });
  await mvpImage.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toHaveText('Point.ly property detail comparing points, cash price, and redemption value');
  await expect(dialog.getByRole('link', { name: 'Open full-size image' })).toHaveAttribute('href', /stay-details\.png$/);
  await page.keyboard.press('Escape');
  await expect(mvpImage).toBeFocused();
});

test('template and upcoming projects share all six required sections', async ({ page }) => {
  for (const [slug, title] of [['template', 'Project title'], ['obayashi_old', 'Obayashi North America'], ['project-03', 'Project 03'], ['project-04', 'Project 04']]) {
    await page.goto(`/projects/${slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator('.case-section')).toHaveCount(6);
    await expect(page.locator('.case-gallery img')).toHaveCount(6);
    const navigation = page.getByRole('navigation', { name: 'Project sections' });
    for (const section of ['About', 'Deliverable', 'Completed', 'User Persona', 'Research', 'Design Evolution']) {
      await expect(navigation.getByRole('link', { name: new RegExp(section) })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
