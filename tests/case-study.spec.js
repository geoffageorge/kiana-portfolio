import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('Pointly tile opens its project page and shared navigation returns home', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'View project 02: Point.ly', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/pointly\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  const about = page.getByRole('link', { name: 'About+Contact', exact: true });
  await about.click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Curious George, Literally');
  await page.goBack();
  await page.getByRole('link', { name: 'Back to selected work' }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ClarifyingChaos');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  await page.getByRole('link', { name: 'Kiana George home', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Select Work' })).toBeVisible();
});

test('direct Pointly links and reloads load the reference images and native dividers', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
  await page.goto('/projects/pointly/');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  await expect(page.locator('.pointly-section')).toHaveCount(4);
  const design = JSON.parse(await readFile(new URL('../public/assets/website-v4-figma/pointly-design.json', import.meta.url), 'utf8'));
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = 'eager';
    await Promise.all([...document.images].map(image => image.decode()));
  });
  for (const [name, asset] of Object.entries(design.images)) {
    const slot = page.locator(`[data-figma-asset="${name}"]`);
    await expect(slot).toHaveCount(1);
    const image = asset.path.endsWith('.svg') ? slot : slot.locator('img');
    await expect(image).toHaveAttribute('src', `/${asset.path}`);
    expect((await request.get(`/${asset.path}`)).ok()).toBe(true);
  }
  await expect(page.locator('.pointly-rule')).toHaveCount(5);
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
  await expect(dialog.getByRole('link', { name: 'Open full-size image' })).toHaveAttribute('href', /frame322\.png$/);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(image).toBeFocused();
  const mvpImage = page.getByRole('button', { name: 'Enlarge Mid-fidelity booking details wireframe', exact: true });
  await mvpImage.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toHaveText('Mid-fidelity booking details wireframe');
  await expect(dialog.getByRole('link', { name: 'Open full-size image' })).toHaveAttribute('href', /pointly-imgScreenshot20260916At10830Pm1\.png$/);
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
