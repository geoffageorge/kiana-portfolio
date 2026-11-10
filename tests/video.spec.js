import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const file = path => readFile(new URL(`../${path}`, import.meta.url));
const archive = 'Assets/figma files/video-v8-2026-11-09/';
const geometry = JSON.parse(await file(`${archive}geometry.json`));
const design = JSON.parse(await file(`${archive}design-inspection.json`));
const typography = JSON.parse(await file(`${archive}text-inspection.json`));
const manifest = JSON.parse(await file('public/assets/video-v8-figma/manifest.json'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceUrl = id => design.nodes.find(n => n.id === id).reactions.flatMap(r => r.actions ?? []).find(a => a.type === 'URL').url;
const copy = value => value.replace(/\u2028/g, '\n').trim();

async function ready(page, path = '/video/') {
  await page.goto(path);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SELECTED VIDEO WORK');
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = 'eager';
    await Promise.all([...document.images].map(image => image.decode()));
  });
}

test('Video 2 replaces the archived Video page with all three Figma sections and retains the shared navigation and footer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'VIDEO', exact: true }).click();
  await expect(page).toHaveURL(/\/video\/$/);
  await page.reload();
  await expect(page).toHaveTitle('Video / Kiana George');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(['Corporate Video', 'Multimedia Journalism', 'Broadcast Journalism']);
  await expect(page.locator('.video-feature__preview')).toHaveCount(2);
  await expect(page.locator('.video-card')).toHaveCount(6);
  await expect(page.locator('.video-card__play')).toHaveCount(6);
  await expect(page.locator('.video-feature__play')).toHaveCount(2);
  for (const heading of await page.locator('.video-page h2').all()) await expect(heading).toHaveCSS('font-size', '32px');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(nav.getByRole('link')).toHaveText(['UX', 'VIDEO', 'JOURNALISM', 'ABOUT+CONTACT']);
  await expect(nav.getByRole('link', { name: 'VIDEO', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.site-header .brand-name')).toHaveText('Kiana George');
  await expect(page.locator('.site-header .brand-name__descriptor')).toHaveCount(0);
  await expect(page.locator('.site-footer__connect')).toHaveAttribute('href', '/about/');
  await nav.getByRole('link', { name: 'JOURNALISM', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SELECTED JOURNALISM WORK');
  await nav.getByRole('link', { name: 'UX', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Selected Case Studies');
});

test('all twelve original Video 2 image, mask and play assets are served unchanged', async ({ request }) => {
  await expect(manifest.assets).toHaveLength(12);
  for (const asset of manifest.assets) {
    const source = await file(`${archive}source-assets/${asset.file}`);
    const deployed = await file(`public/assets/video-v8-figma/${asset.file}`);
    expect(deployed.length).toBeGreaterThan(0);
    expect(deployed.length).toBe(asset.bytes);
    expect(hash(source), asset.file).toBe(asset.sha256);
    expect(hash(deployed), asset.file).toBe(asset.sha256);
    const response = await request.get(`/assets/video-v8-figma/${asset.file}`);
    expect(response.ok(), asset.file).toBe(true);
    expect(hash(await response.body()), asset.file).toBe(asset.sha256);
  }
});

test('Video content, image crops, play icons and desktop positions match the independent Figma inspection', async ({ page }) => {
  await ready(page);
  const textIds = ['657:12', '657:10', '657:8', '657:11', '657:9', '657:20', '657:19', '657:18', '657:15', '657:87', '657:86', '657:28', '657:29', '657:37', '657:38', '657:48', '657:49', '657:74', '657:75', '657:65', '657:66', '657:56', '657:57'];
  for (const id of textIds) {
    const source = typography.nodes.find(n => n.id === id);
    const node = page.locator(`.video-page [data-figma-node="${id}"]`);
    await expect(node).toHaveText(copy(source.characters));
    await expect(node).toHaveCSS('font-weight', String(/Bold/.test(source.fontName.style) ? (/Semi/.test(source.fontName.style) ? 600 : 700) : source.fontName.style === 'Medium' ? 500 : 400));
    if (page.viewportSize().width === 1440) {
      await expect(node).toHaveCSS('font-size', `${source.segments[0].fontSize}px`);
      const actual = await node.boundingBox(), expected = geometry.nodes.find(n => n.id === id);
      for (const key of ['x', 'y', 'width']) expect(Math.abs(actual[key] - expected[key]), `${id} ${key}`).toBeLessThan(1);
    }
  }
  const masks = await page.locator('.video-card__surface').evaluateAll(nodes => nodes.map(n => getComputedStyle(n).maskImage));
  expect(masks.filter(mask => mask.includes('/assets/video-v8-figma/broadcast-card-mask.svg'))).toHaveLength(5);
  expect(masks.filter(mask => mask.includes('/assets/video-v8-figma/colette-card-mask.svg'))).toHaveLength(1);
  for (const image of await page.locator('.video-page img').all()) expect(await image.evaluate(n => n.complete && n.naturalWidth > 0)).toBe(true);
  if (page.viewportSize().width === 1440) {
    const ids = ['657:16', '657:13', '657:39', '657:82', '666:15', '666:12', '657:21', '657:30', '657:40', '657:67', '657:58', '657:50', '657:26', '657:35', '657:45', '657:71', '657:62', '657:53', '657:55', '666:26', '666:29', '666:9', '663:23', '663:17', '663:20'];
    for (const id of ids) {
      const actual = await page.locator(`.video-page [data-figma-node="${id}"]`).boundingBox();
      const expected = geometry.nodes.find(n => n.id === id);
      for (const key of ['x', 'y', 'width', 'height']) expect(Math.abs(actual[key] - expected[key]), `${id} ${key}`).toBeLessThan(1);
    }
    expect((await page.locator('.site-footer').boundingBox()).y).toBe(geometry.height);
  }
});

test('buttons, previews and all eight play icons open the matching preview destination in new tabs', async ({ page, context }) => {
  await ready(page);
  const targets = [
    [page.locator('.video-feature__button').nth(0), '657:16'], [page.locator('.video-feature__button').nth(1), '657:13'],
    [page.locator('.video-feature__preview a').nth(0), '657:39'], [page.locator('.video-feature__preview a').nth(1), '666:12'],
    ...['657:21', '657:30', '657:40', '657:67', '657:58', '657:50'].map(id => [page.locator(`.video-card[data-figma-node="${id}"] > a`), id]),
    [page.locator('.video-feature__play').nth(0), '657:39'], [page.locator('.video-feature__play').nth(1), '657:13'],
    ...['657:21', '657:30', '657:40', '657:67', '657:58', '657:50'].map(id => [page.locator(`.video-card[data-figma-node="${id}"] .video-card__play`), id]),
  ];
  for (const [link, id] of targets) {
    const url = sourceUrl(id);
    const anchor=await link.evaluate(n=>n.tagName==='A');
    const control=anchor?link:link.locator('xpath=ancestor::a');
    await expect(control).toHaveAttribute('href', url);
    await expect(control).toHaveAttribute('target', '_blank');
    await context.route(url, route => route.fulfill({ contentType: 'text/html', body: '<title>Video prototype destination</title>' }));
    const popupPromise = page.waitForEvent('popup');
    if(anchor) {await control.focus();await page.keyboard.press('Enter');} else await link.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(url);
    expect(await popup.evaluate(() => window.opener)).toBeNull();
    await popup.close();
    await expect(page).toHaveURL(/\/video\/$/);
  }
});

test('featured image boxes use the subtle shared pop while their titles stay still', async ({ page }) => {
  await ready(page);
  const link=page.locator('.video-feature__preview .project-card__link').first();
  const poster=link.locator('.video-feature__poster');
  const title=link.locator('h3');
  // Mobile keyboard focus scrolls the viewport; compare document coordinates.
  const measure=()=>title.evaluate(n=>{const r=n.getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height};});
  const before=await measure();
  await link.focus();
  await expect.poll(()=>poster.evaluate(n=>Number(new DOMMatrix(getComputedStyle(n).transform).a.toFixed(3)))).toBe(1.01);
  await expect(link).toHaveCSS('transform','none');
  const after=await measure();
  for(const key of ['x','y','width','height']) expect(after[key]).toBeCloseTo(before[key],1);
  if(await page.evaluate(()=>matchMedia('(hover:hover) and (pointer:fine)').matches)) {
    await link.blur();await poster.hover();
    await expect.poll(()=>poster.evaluate(n=>Number(new DOMMatrix(getComputedStyle(n).transform).a.toFixed(3)))).toBe(1.01);
    await expect(link).toHaveCSS('transform','none');
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(poster).toHaveCSS('transform','none');
});

test('Video fits phones, tablets and desktops with visible native dividers and no clipped text or runtime errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await ready(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), String(width)).toBe(true);
    const header = await page.locator('.site-header').boundingBox();
    const title = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(title.y).toBeGreaterThan(header.height);
    await expect(page.locator('.video-rule')).toHaveCount(2);
    for (const rule of await page.locator('.video-rule').all()) {
      const stroke = await rule.evaluate(n => { const s = getComputedStyle(n); return { color: s.borderTopColor, width: parseFloat(s.borderTopWidth), dpr: devicePixelRatio, image: s.borderImageSource }; });
      expect(stroke.color).toBe('rgb(0, 0, 0)');
      expect(stroke.width * stroke.dpr).toBeGreaterThanOrEqual(.999);
      expect(stroke.width).toBeLessThanOrEqual(1);
      expect(stroke.image).toBe('none');
    }
    for (const card of await page.locator('.video-card').all()) {
      const bounds = await card.boundingBox(), text = await card.locator('h3').boundingBox();
      expect(text.y + text.height).toBeLessThanOrEqual(bounds.y + bounds.height);
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
    const footer = await page.locator('.site-footer').boundingBox();
    const cards = await page.locator('.video-grid').boundingBox();
    expect(footer.y).toBeGreaterThan(cards.y + cards.height);
  }
  expect(errors).toEqual([]);
});

test('the complete Video page supports direct index URLs and subdirectory deployment', async ({ page, request, baseURL }) => {
  await ready(page, '/video/index.html');
  await page.reload();
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(3);
  await page.route('**/portfolio/**', async route => {
    const url = new URL(route.request().url());
    const response = await request.get(`${baseURL}${url.pathname.replace('/portfolio/', '/')}${url.search}`);
    await route.fulfill({ response });
  });
  await ready(page, '/portfolio/video/');
  await expect(page.locator('.video-feature__thumbnail').first()).toHaveAttribute('src', '/portfolio/assets/video-v8-figma/obayashi-culture.png');
  await expect(page.locator('.video-feature__play').first()).toHaveAttribute('src', '/portfolio/assets/video-v8-figma/play-button.svg');
  await expect(page.locator('.site-footer__connect')).toHaveAttribute('href', '/portfolio/about/');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'JOURNALISM', exact: true }).click();
  await expect(page).toHaveURL(/\/portfolio\/journalism\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SELECTED JOURNALISM WORK');
});
