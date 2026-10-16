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

test('the rebuilt page reflows without overflow and keeps MVP content in document flow', async ({ page }) => {
  for (const width of [320, 393, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await ready(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const header = await page.locator('.site-header').boundingBox();
    const title = await page.locator('h1').boundingBox();
    expect(title.y).toBeGreaterThanOrEqual(header.y + header.height);
    for (const row of await page.locator('.pointly-mvp-feature').all()) {
      const image = await row.locator('img').boundingBox();
      const caption = await row.locator('figcaption').boundingBox();
      if (width < 768) expect(caption.y).toBeGreaterThanOrEqual(image.y + image.height);
      else {
        expect(caption.x).toBeGreaterThan(image.x + image.width);
        expect(Math.abs(caption.y + caption.height / 2 - image.y - image.height / 2)).toBeLessThan(1);
      }
    }
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

test('MVP includes the three unchanged source images, exact template captions, and mixed Inter 15/24 styles', async ({ page }) => {
  await ready(page);
  const screens = [
    ['02-connected-wallet 1.png', 'connected-wallet.png', 'Rewards Dashboard', 'View balances across rewards programs in one place.'],
    ['06-recommended-stays 1.png', 'recommended-stays.png', 'Personalized Recommendations', 'Explore stays based on available points and preferences.'],
    ['07-stay-details 1.png', 'stay-details.png', 'Property Detail', 'Compare points, cash price, and redemption value before booking.'],
  ];
  const gallery = page.locator('.pointly-mvp-gallery');
  await expect(gallery.locator('figure')).toHaveCount(3);
  await expect(gallery.locator('h4')).toHaveText(screens.map(screen => screen[2]));
  await expect(gallery.locator('figcaption p')).toHaveText(screens.map(screen => screen[3]));
  for (const [index, [sourceName, publicName]] of screens.entries()) {
    const source = await readFile(new URL(`../Assets/pointly_2/${sourceName}`, import.meta.url));
    const publicImage = await readFile(new URL(`../public/assets/pointly-2/${publicName}`, import.meta.url));
    expect(publicImage.equals(source), `${publicName} preserves the supplied PNG`).toBe(true);
    const row = gallery.locator('figure').nth(index);
    await expect(row.locator('img')).toHaveAttribute('src', new RegExp(`/pointly-2/${publicName.replace('.', '\\.')}$`));
    for (const caption of [row.locator('h4'), row.locator('figcaption p')]) {
      await expect(caption).toHaveCSS('font-family', 'Inter, sans-serif');
      await expect(caption).toHaveCSS('font-size', '15px');
      await expect(caption).toHaveCSS('line-height', '24px');
      // Chromium can serialize zero letter spacing as "normal".
      await expect(caption).toHaveCSS('letter-spacing', /^(normal|0px)$/);
    }
    await expect(row.locator('h4')).toHaveCSS('font-weight', '700');
    await expect(row.locator('figcaption p')).toHaveCSS('font-weight', '400');
  }
  const galleryBounds = await gallery.boundingBox();
  const retrospective = await page.locator('#retrospective').boundingBox();
  const expectedGap = (await page.viewportSize()).width < 1024 ? 80 : 82;
  expect(retrospective.y - galleryBounds.y - galleryBounds.height).toBeCloseTo(expectedGap, 0);
  const imageButton = gallery.locator('button').last();
  await imageButton.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.modal-evidence-image')).toHaveAttribute('src', /\/pointly-2\/stay-details\.png$/);
  await page.keyboard.press('Escape');
  await expect(imageButton).toBeFocused();
});
