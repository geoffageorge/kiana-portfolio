import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(await readFile(new URL('../public/assets/pointly-figma/manifest.json', import.meta.url), 'utf8'));
const snapshot = JSON.parse(await readFile(new URL('../Assets/figma files/pointly-frame-90-18.json', import.meta.url), 'utf8'));
const geometry = Object.fromEntries([...snapshot.metadata.matchAll(/<[\w-]+ id="([^"]+)" name="[^"]*" x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"/g)].map(([, id, x, y, width, height]) => [id, { x: +x, y: +y, width: +width, height: +height }]));

async function ready(page) {
  await page.goto('/projects/pointly/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = 'eager';
    await Promise.all([...document.images].map(image => image.decode()));
    await document.fonts.ready;
  });
}

test('all 50 exported layer assets are unchanged, present, and used on the page', async ({ page }) => {
  await ready(page);
  const expected = Object.values(manifest.assets).map(asset => asset.file).sort();
  expect(expected).toHaveLength(50);
  for (const asset of Object.values(manifest.assets)) {
    const source = await readFile(new URL(`../${asset.source}`, import.meta.url));
    const served = await readFile(new URL(`../public/assets/pointly-figma/${asset.file}`, import.meta.url));
    expect(served.equals(source), `${asset.file} keeps its source bytes`).toBe(true);
    expect(createHash('sha256').update(served).digest('hex')).toBe(asset.sha256);
  }
  const actual = await page.locator('img[src*="/pointly-figma/"]').evaluateAll(images => images.map(image => image.src.split('/').at(-1)).sort());
  expect(actual).toEqual(expected);
  expect(await page.locator('img[src*="/pointly-figma/"]').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
});

test('desktop geometry and every image placement match the inspected Figma frame', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page);
  for (const [selector, nodeId] of [
    ['.pointly-mark', '187:8'], ['.pointly-intro h1', '123:3'],
    ['.pointly-showcase', '274:4'], ['.pointly-rewards-flow', '320:57'],
    ['#pointly-challenge-title', '90:20'], ['#pointly-interviews-title', '136:44'],
    ['.pointly-interview-wide', '136:70'], ['.pointly-feature-callout', '138:92'],
    ['#pointly-research-title', '143:17'], ['.pointly-insights h3', '145:134'],
    ['#pointly-design-title', '163:11'], ['.pointly-low-fi h3', '163:13'],
    ['.pointly-mid-fi h3', '187:3'], ['.pointly-identity h3', '174:3'],
    ['.pointly-visual-system', '314:30'], ['.pointly-mvp h3', '316:42'],
    ['#pointly-retrospective-title', '314:37'], ['.pointly-reflection', '314:34'],
  ]) {
    const actual = await page.locator(selector).first().boundingBox();
    const expected = geometry[nodeId];
    // Text boxes may hug their HTML content; their type and position must match.
    expect(Math.abs(actual.x - expected.x), `${selector} x`).toBeLessThanOrEqual(2);
    expect(Math.abs(actual.y - expected.y), `${selector} y`).toBeLessThan(1);
  }
  const renderedExports = {
    // The hero PNGs already contain the masked bounds and shadow padding.
    '175:5': { x: 796, y: 667 }, '320:52': { x: 170, y: 751 },
  };
  for (const asset of Object.values(manifest.assets).filter(asset => asset.file.endsWith('.png'))) {
    const image = page.locator(`img[data-figma-asset="${asset.file.slice(0, -4)}"]`);
    const actual = await image.boundingBox();
    const expected = renderedExports[asset.figmaNodeId] ?? asset.slot;
    for (const key of ['x', 'y']) expect(Math.abs(actual[key] - expected[key]), `${asset.file} ${key}`).toBeLessThan(1);
    for (const key of ['width', 'height']) expect(Math.abs(actual[key] - asset[key]), `${asset.file} ${key}`).toBeLessThan(1);
  }
  await expect(page.locator('.pointly-reflection')).toHaveCSS('height', '468px');
  for (const asset of Object.values(manifest.assets).filter(asset => asset.file.endsWith('.svg') && !asset.file.startsWith('vector-'))) {
    const image = page.locator(`img[data-figma-asset="${asset.file.slice(0, -4)}"]`);
    const actual = await image.boundingBox();
    for (const key of ['x', 'y']) expect(Math.abs(actual[key] - asset.slot[key]), `${asset.file} ${key}`).toBeLessThanOrEqual(1);
    for (const key of ['width', 'height']) expect(actual[key], `${asset.file} native ${key}`).toBe(asset[key]);
  }
  await expect(page.locator('.pointly-showcase')).toHaveCSS('background-color', 'rgb(136, 207, 253)');
  await expect(page.locator('.pointly-feature-callout').first()).toHaveCSS('background-color', 'rgb(231, 239, 82)');
  await expect(page.locator('.pointly-insight')).toHaveCount(4);
  await expect(page.locator('.pointly-insights > div')).toHaveCSS('grid-template-columns', '439px 439px');
});

test('exact local fonts and mixed text styles load without external requests', async ({ page }) => {
  const external = [];
  page.on('request', request => { if (new URL(request.url()).origin !== new URL(test.info().project.use.baseURL).origin) external.push(request.url()); });
  await ready(page);
  await expect(page.locator('.pointly-case')).toHaveCSS('font-family', 'Inter, sans-serif');
  await expect(page.locator('.pointly-case')).toHaveCSS('font-size', '16px');
  await expect(page.locator('.pointly-index')).toHaveCSS('font-family', '"Fira Mono", monospace');
  await expect(page.locator('.pointly-challenge h3').first()).toHaveCSS('font-weight', '700');
  await expect(page.locator('.pointly-challenge h3 + p').first()).toHaveCSS('font-weight', '400');
  await expect(page.locator('.pointly-poppins-bold')).toHaveCSS('font-family', 'Poppins, sans-serif');
  await expect(page.locator('.pointly-visual-system h4').first()).toHaveCSS('font-family', '"Instrument Sans", sans-serif');
  await expect(page.locator('.pointly-type-body em').first()).toHaveCSS('font-style', 'italic');
  const fonts = await page.evaluate(() => [...document.fonts].filter(font => ['Inter', 'Fira Mono', 'Instrument Sans', 'Poppins'].includes(font.family)).map(font => ({ family: font.family, status: font.status })));
  expect(fonts).toHaveLength(7);
  expect(fonts.every(font => font.status === 'loaded')).toBe(true);
  expect(external).toEqual([]);
});

test('the rebuilt page reflows without overflow and collapses the desktop blank area', async ({ page }) => {
  for (const width of [320, 393, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await ready(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const header = await page.locator('.site-header').boundingBox();
    const title = await page.locator('h1').boundingBox();
    expect(title.y).toBeGreaterThanOrEqual(header.y + header.height);
    if (width >= 768 && width <= 1100) {
      for (const card of await page.locator('.pointly-interview-card').all()) {
        const quote = await card.locator('blockquote').boundingBox();
        const illustration = await card.locator('img').boundingBox();
        expect(quote.y + quote.height).toBeLessThanOrEqual(illustration.y);
      }
    }
    if (width < 1024) {
      const introduction = await page.locator('.pointly-mvp').boundingBox();
      const reflection = await page.locator('#retrospective').boundingBox();
      expect(reflection.y - introduction.y - introduction.height).toBeCloseTo(80, 0);
    }
  }
});
