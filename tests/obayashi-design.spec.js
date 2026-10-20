import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { projectRoutes } from '../src/data/projectRoutes.js';

const manifest = JSON.parse(await readFile(new URL('../public/assets/obayashi-figma/manifest.json', import.meta.url), 'utf8'));
const snapshot = JSON.parse(await readFile(new URL('../Assets/figma files/obayashi-inspection-2026-10-19/inspection.json', import.meta.url), 'utf8'));
const geometry = Object.fromEntries(snapshot.nodes.map(n => [n.id, { x: n.absoluteBoundingBox.x - 4880, y: n.absoluteBoundingBox.y + 16214, width: n.width, height: n.height }]));
const labels = ['Competitive Analysis', 'Web Audit', 'Priorities', 'Brand Narrative', 'Site Design', 'Retrospective'];

async function ready(page) {
  await page.goto('/projects/obayashi/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Obayashi');
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = 'eager';
    await Promise.all([...document.images].map(image => image.decode()));
    await document.fonts.ready;
  });
}

test('home tile opens the complete Figma case study, with working reloads and image dialogs', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
  await page.goto('/');
  await page.getByRole('link', { name: 'View project 01: Obayashi North America', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/obayashi\/$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Obayashi');
  await expect(page.locator('.obayashi-index')).toHaveText('01 /');
  await expect(page.locator('.obayashi-facts')).toContainText('10 months');
  await expect(page.locator('.obayashi-principles h3')).toHaveText(['Clarify', 'Humanize', 'Prioritize', 'Simplify']);
  await expect(page.locator('.obayashi-audit-row')).toHaveCount(4);
  await expect(page.locator('.obayashi-methodology > p')).toHaveCount(1);
  await expect(page.locator('.obayashi-final-designs figcaption').last()).toContainText('relevant North American projects.');
  const image = page.getByRole('button', { name: 'Enlarge Obayashi website strategy mind map', exact: true });
  await image.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Open full-size image' })).toHaveAttribute('href', /mind-map\.png$/);
  await expect(dialog.locator('.modal-image-caption')).toContainText('navigation, visual design, and measurement');
  await page.keyboard.press('Escape');
  await expect(image).toBeFocused();
  await page.getByRole('button', { name: 'View full Careers page' }).click();
  await expect(dialog.locator('img')).toHaveAttribute('src', /careers\.png$/);
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'Next project: Point.ly' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  await page.goto('/projects/obayashi_old/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Obayashi North America');
  await expect(page.locator('.case-section')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('all 40 original Figma assets keep their bytes and are used in their intended image or mask slots', async ({ page, request }) => {
  const external = [];
  page.on('request', request => { if (!request.url().startsWith(test.info().project.use.baseURL)) external.push(request.url()); });
  await ready(page);
  expect(Object.keys(manifest.assets)).toHaveLength(40);
  for (const asset of Object.values(manifest.assets)) {
    const source = await readFile(new URL(`../${asset.source}`, import.meta.url));
    const local = await readFile(new URL(`../public/assets/obayashi-figma/${asset.file}`, import.meta.url));
    expect(local.equals(source), asset.file).toBe(true);
    expect(createHash('sha256').update(local).digest('hex')).toBe(asset.sha256);
    const response = await request.get(`/assets/obayashi-figma/${asset.file}`);
    expect(response.ok(), asset.file).toBe(true);
    expect(response.headers()['content-type']).toMatch(/^image\//);
  }
  const used = await page.locator('img, .obayashi-image-viewport, .obayashi-image-clip').evaluateAll(nodes => [...new Set(nodes.flatMap(n => [n.getAttribute('src'), getComputedStyle(n).maskImage]).filter(s => s?.includes('/obayashi-figma/')).map(s => /obayashi-figma\/([^")]+)/.exec(s)[1]))].sort());
  expect(used).toEqual(Object.values(manifest.assets).map(a => a.file).sort());
  expect(await page.locator('.obayashi-case img').evaluateAll(images => images.every(i => i.complete && i.naturalWidth > 0))).toBe(true);
  await expect(page.locator('.obayashi-case')).toHaveCSS('font-family', '"Obayashi Inter", sans-serif');
  await expect(page.locator('.obayashi-index')).toHaveCSS('font-family', '"Obayashi Fira Mono", monospace');
  await expect(page.locator('.obayashi-quote')).toHaveCSS('background-color', 'rgb(231, 239, 82)');
  expect(external).toEqual([]);
});

test('desktop image geometry matches the inspected frame, including every crop and repeated Markets image', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'The Figma reference is a desktop frame.');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page);
  for (const layer of await page.locator('.obayashi-exhibit .obayashi-image-layer[data-figma-node]').all()) {
    const id = await layer.getAttribute('data-figma-node');
    const actual = await layer.boundingBox();
    for (const key of ['x', 'y', 'width', 'height']) {
      expect(Math.abs(actual[key] - geometry[id][key]), `${id} ${key}`).toBeLessThan(1);
    }
    const paint = snapshot.nodes.find(n => n.id === id).fills.find(fill => fill.type === 'IMAGE');
    if (paint.scaleMode === 'CROP') {
      const [[a, , x], [, d, y]] = paint.imageTransform;
      const rendered = await layer.locator('img').boundingBox();
      expect(rendered.width).toBeCloseTo(actual.width / a, 1);
      expect(rendered.height).toBeCloseTo(actual.height / d, 1);
      expect(rendered.x).toBeCloseTo(actual.x - x * actual.width / a, 1);
      expect(rendered.y).toBeCloseTo(actual.y - y * actual.height / d, 1);
    }
  }
  for (const [selector, nodeId] of [['h1', '420:273'], ['.obayashi-project-details', '420:253'], ['#obayashi-competitive-title', '420:306'], ['#obayashi-audit-title', '420:336'], ['#obayashi-priorities-title', '429:75'], ['#obayashi-brand-title', '424:17'], ['#obayashi-design-title', '429:97'], ['#obayashi-retrospective-title', '478:22']]) {
    const actual = await page.locator(selector).boundingBox();
    for (const key of ['x', 'y']) expect(Math.abs(actual[key] - geometry[nodeId][key]), `${selector} ${key}`).toBeLessThan(1.1);
  }
  const laptop = await page.locator('.obayashi-laptop').boundingBox();
  for (const key of ['x','y','width','height']) expect(Math.abs(laptop[key] - geometry['466:28'][key]), `laptop ${key}`).toBeLessThan(1);
});

test('section anchors survive reload and desktop navigation stays below the glass header', async ({ page }) => {
  await ready(page);
  const nav = page.getByRole('navigation', { name: 'Project sections' });
  await expect(nav.getByRole('link')).toHaveText(labels);
  for (const label of labels) {
    const link = nav.getByRole('link', { name: label, exact: true });
    await link.click();
    const id = (await link.getAttribute('href')).slice(1);
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id} > h2`)).toBeInViewport();
    await expect(link).toHaveAttribute('aria-current', 'location');
    if (page.viewportSize().width >= 1024) {
      const header = await page.locator('.site-header').boundingBox();
      const sidebar = await nav.boundingBox();
      const content = await page.locator('.obayashi-content').boundingBox();
      await expect.poll(async () => (await nav.boundingBox()).y).toBeCloseTo(header.height + 24, 1);
      expect(sidebar.x + sidebar.width).toBeLessThan(content.x);
    }
  }
  await page.reload();
  await expect(page.getByRole('heading', { name: 'What I Learned', exact: true })).toBeInViewport();
});

test('Careers autoplays, scrolls upward inside the screen, repeats, pauses, and respects reduced motion', async ({ page }) => {
  await ready(page);
  const image = page.locator('.obayashi-laptop__webpage');
  await expect(image).toHaveCSS('animation-play-state', 'paused');
  await page.locator('.obayashi-careers').scrollIntoViewIfNeeded();
  await expect(image).toHaveCSS('animation-play-state', 'running');
  await expect.poll(() => image.evaluate(n => n.getAnimations()[0]?.currentTime ?? 0)).toBeGreaterThan(100);
  const screen = await page.locator('.obayashi-laptop__screen').boundingBox();
  const hardware = await page.locator('.obayashi-laptop__hardware').boundingBox();
  expect(screen.x).toBeGreaterThan(hardware.x);
  expect(screen.y).toBeGreaterThan(hardware.y);
  expect(screen.x + screen.width).toBeLessThan(hardware.x + hardware.width);
  expect(screen.y + screen.height).toBeLessThan(hardware.y + hardware.height);
  await expect(page.locator('.obayashi-laptop__viewport')).toHaveCSS('overflow', 'hidden');
  const samples = await image.evaluate(async n => {
    const a = n.getAnimations()[0];
    a.pause();
    const positions = [];
    for (const ms of [0, 24000, 44000, 48000, 72000]) {
      a.currentTime = ms;
      await new Promise(requestAnimationFrame);
      positions.push(new DOMMatrix(getComputedStyle(n).transform).m42);
    }
    const travel = parseFloat(getComputedStyle(n.parentElement).getPropertyValue('--careers-travel'));
    a.play();
    return { positions, travel };
  });
  expect(samples.travel).toBeGreaterThan(300);
  expect(samples.positions[0]).toBeCloseTo(0);
  expect(samples.positions[1]).toBeLessThan(-100);
  expect(samples.positions[2]).toBeCloseTo(-samples.travel, 1);
  expect(samples.positions[3]).toBeCloseTo(0);
  expect(samples.positions[4]).toBeCloseTo(samples.positions[1], 1);
  await page.getByRole('button', { name: 'Pause Careers page animation', exact: true }).click();
  await expect(image).toHaveCSS('animation-play-state', 'paused');
  await page.getByRole('button', { name: 'Play Careers page animation', exact: true }).click();
  await expect(image).toHaveCSS('animation-play-state', 'running');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(image).toHaveCSS('animation-play-state', 'paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.obayashi-careers').scrollIntoViewIfNeeded();
  await expect(image).toHaveCSS('animation-name', 'none');
  await expect(image).toHaveCSS('transform', 'none');
  await expect(page.getByRole('button', { name: /Careers page animation/ })).toHaveCount(0);
});

test('page and laptop reflow from narrow phones through wide desktop without overlap', async ({ page }) => {
  await ready(page);
  for (const width of [320,393,768,1024,1280,1440,1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const header = await page.locator('.site-header').boundingBox();
    const title = await page.locator('h1').boundingBox();
    expect(title.y).toBeGreaterThanOrEqual(header.height);
    const laptop = await page.locator('.obayashi-laptop').boundingBox();
    const caption = await page.locator('.obayashi-careers > figcaption').boundingBox();
    const controls = await page.locator('.obayashi-laptop-controls').boundingBox();
    const gallery = await page.locator('.obayashi-final-designs').boundingBox();
    expect(caption.y).toBeGreaterThanOrEqual(laptop.y + laptop.height);
    expect(controls.y).toBeGreaterThanOrEqual(caption.y + caption.height);
    expect(gallery.y).toBeGreaterThanOrEqual(controls.y + controls.height);
    if (width < 1024) {
      expect(await page.locator('.obayashi-methodology').evaluate(n => getComputedStyle(n).position)).toBe('static');
    }
  }
});

test('shared pages retain navigation and both Figma case studies return to selected work', async ({ page }) => {
  for (const path of ['/', ...projectRoutes.map(project => `/projects/${project.slug}/`)]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    if (['/projects/pointly/', '/projects/obayashi/'].includes(path)) {
      await expect(navigation.locator(':scope > a, :scope > button')).toHaveText(['About', 'Resume', 'Contact']);
      await page.getByRole('link', { name: 'Back to selected work' }).click();
    } else {
      await expect(navigation.locator(':scope > a, :scope > button')).toHaveText(['Work', 'About', 'Resume', 'Contact']);
      await navigation.getByRole('link', { name: 'Work', exact: true }).click();
    }
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.getByRole('heading', { name: 'Select Work' })).toBeInViewport();
  }
});
