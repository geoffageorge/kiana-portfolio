import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(await readFile(new URL('../public/assets/pointly-figma/manifest.json', import.meta.url), 'utf8'));
const revision = JSON.parse(await readFile(new URL('../public/assets/pointly-figma-update/manifest.json', import.meta.url), 'utf8'));
const dividerInspection = JSON.parse(await readFile(new URL('../public/assets/pointly-figma-update/dividers.json', import.meta.url), 'utf8'));
const archivedDividers = ['line-69-49', 'line-70-50', 'line-71-51', 'line-72-183'];
const snapshot = JSON.parse(await readFile(new URL('../Assets/figma files/pointly-frame-90-18-2026-10-19.json', import.meta.url), 'utf8'));
const geometry = snapshot.geometry;

async function ready(page) {
  await page.goto('/projects/pointly/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = 'eager';
    await Promise.all([...document.images].map(image => image.decode()));
    await document.fonts.ready;
  });
}

test('all 50 Figma exports stay unchanged; non-divider image assets remain in use', async ({ page }) => {
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
  expect(actual).toEqual(Object.entries(manifest.assets).filter(([name]) => !archivedDividers.includes(name)).map(([, asset]) => asset.file).sort());
  expect(await page.locator('img[src*="/pointly-figma/"]').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
});

test('desktop geometry and every image placement match the October 19 Figma frame', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page);
  for (const [selector, nodeId] of [
    ['.pointly-intro h1', '123:3'], ['.pointly-project-details', '413:53'],
    ['.pointly-facts dt', '94:6'], ['.pointly-showcase', '274:4'], ['.pointly-rewards-flow', '320:51'],
    ['#pointly-challenge-title', '90:20'], ['#pointly-interviews-title', '136:44'],
    ['.pointly-interview-wide', '136:70'], ['.pointly-feature-callout', '138:92'],
    ['#pointly-research-title', '143:17'], ['.pointly-competitors h3', '145:125'],
    ['.pointly-opportunity-map h3', '163:10'], ['.pointly-insights h3', '145:134'],
    ['#pointly-design-title', '163:11'], ['.pointly-low-fi h3', '163:13'],
    ['.pointly-mid-fi h3', '187:3'], ['.pointly-identity h3', '413:21'],
    ['.pointly-identity > p', '413:22'], ['.pointly-visual-system', '413:23'],
    ['.pointly-mvp h3', '413:14'], ['.pointly-mvp > p', '413:15'],
    ['.pointly-retrospective > .pointly-rule', '413:11'], ['#pointly-retrospective-title', '413:8'],
    ['.pointly-reflection', '413:9'], ['.pointly-reflection > div', '413:12'],
  ]) {
    const actual = await page.locator(selector).first().boundingBox();
    const expected = geometry[nodeId];
    // Text boxes may hug their HTML content; their type and position must match.
    expect(Math.abs(actual.x - expected.x), `${selector} x`).toBeLessThan(1);
    expect(Math.abs(actual.y - expected.y), `${selector} y`).toBeLessThan(1);
  }
  for (const [name, asset] of Object.entries(manifest.assets).filter(([, asset]) => asset.file.endsWith('.png'))) {
    const image = page.locator(`img[data-figma-asset="${name}"]`);
    const actual = await image.boundingBox();
    // Reused exports include the original shadow/mask padding, unchanged in this revision.
    const expected = revision.reusedAssets[name].renderedBounds;
    for (const key of ['x', 'y']) expect(Math.abs(actual[key] - expected[key]), `${asset.file} ${key}`).toBeLessThan(1);
    for (const key of ['width', 'height']) expect(Math.abs(actual[key] - asset[key]), `${asset.file} ${key}`).toBeLessThan(1);
  }
  await expect(page.locator('.pointly-reflection')).toHaveCSS('height', '537px');
  for (const [name, asset] of Object.entries(manifest.assets).filter(([name, asset]) => asset.file.endsWith('.svg') && !asset.file.startsWith('vector-') && !archivedDividers.includes(name))) {
    const image = page.locator(`img[data-figma-asset="${name}"]`);
    const actual = await image.boundingBox();
    for (const key of ['x', 'y']) expect(Math.abs(actual[key] - revision.reusedAssets[name].renderedBounds[key]), `${asset.file} ${key}`).toBeLessThanOrEqual(1);
    for (const key of ['width', 'height']) expect(actual[key], `${asset.file} native ${key}`).toBe(asset[key]);
  }
  await expect(page.locator('.pointly-showcase')).toHaveCSS('background-color', 'rgb(136, 207, 253)');
  await expect(page.locator('.pointly-feature-callout').first()).toHaveCSS('background-color', 'rgb(231, 239, 82)');
  await expect(page.locator('.pointly-insight')).toHaveCount(4);
  await expect(page.locator('.pointly-insights > div')).toHaveCSS('grid-template-columns', '439px 439px');
  const divider = await page.locator('.pointly-project-details > .pointly-rule').boundingBox();
  expect(divider.x).toBe(geometry['101:3'].x);
  expect(divider.y).toBe(geometry['101:3'].y);
  expect(divider.width).toBe(geometry['101:3'].width);
});

test('all five section dividers use visible CSS borders matching Pointly Case Study 2', async ({ page }) => {
  await ready(page);
  await expect(page.locator('.pointly-rule')).toHaveCount(5);
  for (const divider of Object.values(dividerInspection.dividers)) {
    const rule = page.locator(`.pointly-rule[data-figma-node="${divider.id}"]`);
    await expect(rule.locator('img')).toHaveCount(0);
    await expect(rule).toHaveCSS('border-top-style', 'solid');
    await expect(rule).toHaveCSS('border-top-color', 'rgb(0, 0, 0)');
    const stroke = await rule.evaluate(n => parseFloat(getComputedStyle(n).borderTopWidth));
    expect(stroke).toBeGreaterThanOrEqual(divider.strokeWeight);
    expect(stroke).toBeLessThanOrEqual(1);
    const actual = await rule.boundingBox();
    expect(actual.x).toBeGreaterThanOrEqual(0);
    expect(actual.x + actual.width).toBeLessThanOrEqual(page.viewportSize().width);
    if (page.viewportSize().width === 1440) {
      for (const key of ['x','y','width']) expect(Math.abs(actual[key] - divider[key]), `${divider.id} ${key}`).toBeLessThan(1);
    }
  }
  await expect(page.locator('.pointly-goal-connector')).toHaveCount(2);
});

test('exact local fonts and mixed text styles load without external requests', async ({ page }) => {
  const external = [];
  page.on('request', request => { if (new URL(request.url()).origin !== new URL(test.info().project.use.baseURL).origin) external.push(request.url()); });
  await ready(page);
  await expect(page.locator('.pointly-case')).toHaveCSS('font-family', 'Inter, sans-serif');
  await expect(page.locator('.pointly-case')).toHaveCSS('font-size', '16px');
  await expect(page.locator('.pointly-index')).toHaveCSS('font-family', '"Fira Mono", monospace');
  await expect(page.locator('.pointly-index')).toHaveCSS('font-size', '18px');
  await expect(page.locator('.pointly-intro__summary > p').first()).toHaveCSS('line-height', page.viewportSize().width >= 1024 ? '34px' : '30px');
  if (page.viewportSize().width >= 768) {
    await expect(page.locator('#pointly-interviews-title')).toHaveCSS('font-size', '36px');
    await expect(page.locator('.pointly-mid-fi > h3')).toHaveCSS('font-size', '22px');
  }
  for (const selector of ['.pointly-competitors', '.pointly-opportunity-map', '.pointly-insights', '.pointly-low-fi', '.pointly-identity', '.pointly-mvp']) {
    await expect(page.locator(`${selector} > h3`)).toHaveCSS('font-size', '21px');
  }
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
        expect(caption.y).toBeGreaterThan(image.y);
        expect(caption.y + caption.height).toBeLessThan(image.y + image.height);
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

test('MVP includes all three original Figma images, exact captions, and mixed Inter 15/24 styles', async ({ page }) => {
  await ready(page);
  const screens = [
    ['connected-wallet', 'connected-wallet.png', 'Rewards Dashboard', 'View balances across rewards programs in one place.'],
    ['recommended-stays', 'recommended-stays.png', 'Personalized Recommendations', 'Explore stays based on available points and preferences.'],
    ['stay-details', 'stay-details.png', 'Property Detail', 'Compare points, cash price, and redemption value before booking.'],
  ];
  const gallery = page.locator('.pointly-mvp-gallery');
  await expect(gallery.locator('figure')).toHaveCount(3);
  await expect(gallery.locator('h4')).toHaveText(screens.map(screen => screen[2]));
  await expect(gallery.locator('figcaption p')).toHaveText(screens.map(screen => screen[3]));
  for (const asset of Object.values(revision.assets)) {
    const source = await readFile(new URL(`../public/assets/pointly-figma-update/${asset.file}`, import.meta.url));
    expect(createHash('sha256').update(source).digest('hex'), `${asset.file} keeps its downloaded Figma bytes`).toBe(asset.sha256);
    if (asset.figmaImageHash) expect(createHash('sha1').update(source).digest('hex')).toBe(asset.figmaImageHash);
  }
  for (const [index, [assetName, publicName]] of screens.entries()) {
    const row = gallery.locator('figure').nth(index);
    await expect(row.locator('img')).toHaveAttribute('src', new RegExp(`/pointly-figma-update/${publicName.replace('.', '\\.')}$`));
    expect(await row.locator('img').evaluate(image => image.naturalWidth)).toBe(revision.assets[assetName].width);
    expect(revision.assets[assetName].width).toBeGreaterThan(1400);
    for (const caption of [row.locator('h4'), row.locator('figcaption p')]) {
      await expect(caption).toHaveCSS('font-family', 'Inter, sans-serif');
      await expect(caption).toHaveCSS('font-size', '15px');
      await expect(caption).toHaveCSS('line-height', '24px');
      // Chromium can serialize zero letter spacing as "normal".
      await expect(caption).toHaveCSS('letter-spacing', /^(normal|0px)$/);
    }
    await expect(row.locator('h4')).toHaveCSS('font-weight', '700');
    await expect(row.locator('figcaption p')).toHaveCSS('font-weight', '400');
    if (page.viewportSize().width === 1440) {
      const actual = await row.locator('img').boundingBox();
      const expected = geometry[revision.assets[assetName].figmaNodeId];
      for (const key of ['x', 'y', 'width', 'height']) expect(Math.abs(actual[key] - expected[key]), `${publicName} ${key}`).toBeLessThan(1);
      const caption = await row.locator('figcaption').boundingBox();
      const captionPosition = geometry[['413:19', '413:20', '413:13'][index]];
      for (const key of ['x', 'y']) expect(Math.abs(caption[key] - captionPosition[key]), `${publicName} caption ${key}`).toBeLessThan(1);
      // Figma has trailing blank lines; validate the visible 3/4/3 lines of text.
      expect(caption.height).toBe([72, 96, 72][index]);
    }
  }
  const galleryBounds = await gallery.boundingBox();
  const retrospective = await page.locator('#retrospective').boundingBox();
  const expectedGap = (await page.viewportSize()).width < 1024 ? 80 : 91;
  expect(retrospective.y - galleryBounds.y - galleryBounds.height).toBeCloseTo(expectedGap, 0);
  const imageButton = gallery.locator('button').last();
  await imageButton.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.modal-evidence-image')).toHaveAttribute('src', /\/pointly-figma-update\/stay-details\.png$/);
  await page.keyboard.press('Escape');
  await expect(imageButton).toBeFocused();
});

test('updated narrative and mixed Reflection text remain complete', async ({ page }) => {
  await ready(page);
  await expect(page.locator('.pointly-facts dt', { hasText: /^Methods$/ })).toHaveCount(1);
  await expect(page.locator('.pointly-identity > h3')).toHaveText('Defining the Product’s Visual Language');
  await expect(page.locator('.pointly-identity > p')).toContainText('balancing warmth with financial credibility.');
  await expect(page.locator('.pointly-mvp > p')).toContainText('The project remained at the prototype stage.');
  const reflection = page.locator('.pointly-reflection');
  await expect(reflection.locator('p')).toHaveCount(3);
  await expect(reflection.locator('strong')).toHaveText([
    'Different experiences can reveal shared needs.',
    'AI helped me build faster, but I still had to decide what was worth building.',
    'The process reinforced two lessons:',
  ]);
  for (const paragraph of await reflection.locator('p').all()) {
    await expect(paragraph).toHaveCSS('font-size', '16px');
    await expect(paragraph).toHaveCSS('line-height', '26px');
    await expect(paragraph).toHaveCSS('font-weight', '400');
    await expect(paragraph.locator('strong')).toHaveCSS('font-weight', '700');
  }
  await expect(reflection.locator('p').last()).toContainText('one cohesive experience.');
});
