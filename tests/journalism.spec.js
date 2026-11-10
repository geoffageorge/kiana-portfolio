import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const file = path => readFile(new URL(`../${path}`, import.meta.url));
const inspection = 'Assets/figma files/journalism-v5-2026-11-08/';
const currentInspection = 'Assets/figma files/journalism-v10-2026-11-09/';
const design = JSON.parse(await file(`${currentInspection}design-inspection.json`));
const text = JSON.parse(await file(`${currentInspection}text-inspection.json`));
const geometry = JSON.parse(await file(`${currentInspection}geometry.json`));
const manifest = JSON.parse(await file('public/assets/journalism-figma/manifest.json'));
const sources = ['609:65', '609:64', '609:58', '609:62'].map(id => design.nodes.find(n => n.id === id));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

async function ready(page, path = '/journalism/') {
  await page.goto(path);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = 'eager';
    await Promise.all([...document.images].map(image => image.decode()));
  });
}

test('version 5 shares the four Figma navigation options, preserved branding, and working page destinations', async ({ page }) => {
  for (const path of ['/', '/journalism/', '/video/', '/about/', '/projects/obayashi/', '/projects/pointly/']) {
    await ready(page, path);
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav.getByRole('link')).toHaveText(['UX', 'VIDEO', 'JOURNALISM', 'ABOUT+CONTACT']);
    for (const [index, href] of ['/ux/', '/video/', '/journalism/', '/about/'].entries()) await expect(nav.getByRole('link').nth(index)).toHaveAttribute('href', href);
    await expect(page.locator('.site-header .brand-name')).toHaveText('Kiana George');
    await expect(page.locator('.site-header .brand-name__descriptor')).toHaveCount(0);
    await expect(page.locator('.site-header').getByText('SOCIAL MEDIA', { exact: true })).toHaveCount(0);
    await expect(page.locator('.site-header__brand img')).toHaveAttribute('src', '/assets/brand/ki-logo-v4.svg');
  }
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await nav.getByRole('link', { name: 'JOURNALISM', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SELECTED JOURNALISM WORK');
  await expect(nav.getByRole('link', { name: 'JOURNALISM', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.reload();
  await expect(page).toHaveTitle('Journalism / Kiana George');
  await nav.getByRole('link', { name: 'VIDEO', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SELECTED VIDEO WORK');
  await page.reload();
  await expect(page).toHaveTitle('Video / Kiana George');
  await expect(page.locator('.site-footer__connect')).toHaveAttribute('href', '/about/');
  await nav.getByRole('link', { name: 'ABOUT+CONTACT', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Curious George, Literally');
  await nav.getByRole('link', { name: 'UX', exact: true }).click();
  await expect(page).toHaveURL(/\/ux\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Selected Case Studies');
});

test('all eight Journalism image and mask exports are nonempty and served without changing their bytes', async ({ request }) => {
  for (const asset of manifest.assets) {
    const bytes = await file(`public/assets/journalism-figma/${asset.file}`);
    expect(bytes.length, asset.file).toBe(asset.bytes);
    expect(bytes.length).toBeGreaterThan(0);
    expect(sha(bytes), asset.file).toBe(asset.sha256);
    expect(sha(await file(`${inspection}source-assets/${asset.file}`)), asset.file).toBe(asset.sha256);
    const response = await request.get(`/assets/journalism-figma/${asset.file}`);
    expect(response.ok(), asset.file).toBe(true);
    expect(sha(await response.body()), asset.file).toBe(asset.sha256);
  }
});

test('Journalism 2 retains four written articles with the inspected Figma content, fonts, image slots and masks', async ({ page }) => {
  await ready(page);
  await expect(page.locator('.journalism-card')).toHaveCount(4);
  for (const source of text.nodes.filter(n => ['689:117', '607:16', '607:14', '609:25', '609:26', '609:19', '609:20', '609:28', '609:29', '609:32', '609:33'].includes(n.id))) {
    const node = page.locator(`.journalism-page [data-figma-node="${source.id}"]`);
    await expect(node).toHaveText(source.characters);
    await expect(node).toHaveCSS('font-weight', String(source.segments[0].fontWeight));
    if (page.viewportSize().width === 1440) {
      await expect(node).toHaveCSS('font-size', `${source.id === '607:16' ? 32 : source.segments[0].fontSize}px`);
      await expect(node).toHaveCSS('line-height', `${source.segments[0].lineHeight.value}px`);
      const expected = geometry.nodes.find(n => n.id === source.id);
      const actual = await node.boundingBox();
      for (const key of ['x', 'y', 'width', 'height']) expect(Math.abs(actual[key] - expected[key]), `${source.id} ${key}`).toBeLessThan(1);
    }
  }
  for (const image of await page.locator('.journalism-card img').all()) expect(await image.evaluate(n => n.complete && n.naturalWidth > 0)).toBe(true);
  const masks = await page.locator('.journalism-card__surface,.journalism-card__image-layer').evaluateAll(nodes => nodes.map(n => getComputedStyle(n).maskImage).join(' '));
  for (const asset of manifest.assets.filter(a => a.file.endsWith('.svg'))) expect(masks).toContain(`/assets/journalism-figma/${asset.file}`);
  if (page.viewportSize().width === 1440) {
    for (const id of [...sources.map(n => n.id), '609:16', '609:15', '609:14', '609:11']) {
      const actual = await page.locator(`.journalism-page [data-figma-node="${id}"]`).boundingBox();
      const expected = geometry.nodes.find(n => n.id === id);
      for (const key of ['x', 'y', 'width', 'height']) expect(Math.abs(actual[key] - expected[key]), `${id} ${key}`).toBeLessThan(1);
    }
    expect((await page.locator('.site-footer').boundingBox()).y).toBe(geometry.height);
  }
});

test('each feature opens its exact Figma prototype destination in a separate tab without an opener', async ({ page, context }) => {
  await ready(page);
  for (const source of sources) {
    const action = source.reactions[0].actions[0];
    expect(source.reactions[0].trigger.type).toBe('ON_CLICK');
    expect(action.openInNewTab).toBe(true);
    const link = page.locator(`.journalism-card[data-figma-node="${source.id}"] > a`);
    await expect(link).toHaveAttribute('href', action.url);
    await context.route(action.url, route => route.fulfill({ contentType: 'text/html', body: '<title>Figma prototype destination</title>' }));
    const popupPromise = page.waitForEvent('popup');
    await link.focus();
    await page.keyboard.press('Enter');
    const popup = await popupPromise;
    await expect(popup).toHaveURL(action.url);
    expect(await popup.evaluate(() => window.opener)).toBeNull();
    await popup.close();
    await expect(page).toHaveURL(/\/journalism\/$/);
  }
});

test('Journalism tiles reuse the home 3D hover and keyboard effects and respect reduced motion', async ({ page }) => {
  await ready(page, '/');
  const homeEffect = await page.locator('.project-card').first().evaluate(n => getComputedStyle(n).getPropertyValue('--project-card-pop'));
  await ready(page);
  const card = page.locator('.journalism-card').first();
  const link = card.locator('a');
  expect(await card.evaluate(n => getComputedStyle(n).getPropertyValue('--project-card-pop'))).toBe(homeEffect);
  await link.focus();
  await expect(link).toBeFocused();
  await expect.poll(() => link.evaluate(n => getComputedStyle(n).transform)).not.toBe('none');
  if (await page.evaluate(() => matchMedia('(hover:hover) and (pointer:fine)').matches)) {
    await link.blur();
    await link.hover();
    await expect.poll(() => link.evaluate(n => getComputedStyle(n).transform)).not.toBe('none');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(link).toHaveCSS('transform', 'none');
});

test('new pages fit phone, tablet and desktop widths without broken media, overlaps or runtime errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/journalism/', '/video/']) {
      await ready(page, path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} at ${width}`).toBe(true);
      const header = await page.locator('.site-header').boundingBox();
      const heading = await page.getByRole('heading', { level: 1 }).boundingBox();
      expect(heading.y).toBeGreaterThan(header.y + header.height);
      for (const card of await page.locator('.journalism-card').all()) {
        const bounds = await card.boundingBox();
        const title = await card.locator('h3').boundingBox();
        expect(title.y + title.height).toBeLessThanOrEqual(bounds.y + bounds.height);
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      }
    }
  }
  expect(errors).toEqual([]);
});

test('Journalism and Video support direct index URLs and deployment below a subdirectory', async ({ page, request, baseURL }) => {
  for (const [path, heading] of [['journalism', 'SELECTED JOURNALISM WORK'], ['video', 'SELECTED VIDEO WORK']]) {
    await ready(page, `/${path}/index.html`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
  }
  await page.route('**/portfolio/**', async route => {
    const url = new URL(route.request().url());
    const response = await request.get(`${baseURL}${url.pathname.replace('/portfolio/', '/')}${url.search}`);
    await route.fulfill({ response });
  });
  await ready(page, '/portfolio/journalism/');
  await expect(page.locator('.journalism-card img').first()).toHaveAttribute('src', '/portfolio/assets/journalism-figma/food-culture.png');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  for (const [index, href] of ['/portfolio/ux/', '/portfolio/video/', '/portfolio/journalism/', '/portfolio/about/'].entries()) await expect(nav.getByRole('link').nth(index)).toHaveAttribute('href', href);
  await nav.getByRole('link', { name: 'VIDEO', exact: true }).click();
  await expect(page).toHaveURL(/\/portfolio\/video\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SELECTED VIDEO WORK');
  await nav.getByRole('link', { name: 'UX', exact: true }).click();
  await expect(page).toHaveURL(/\/portfolio\/ux\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Selected Case Studies');
});

test('Journalism 2 reuses all 19 original assets without duplicate runtime images', async ({ request }) => {
  const current = JSON.parse(await file('public/assets/journalism-v10-figma/manifest.json'));
  expect(current.assets).toHaveLength(19);
  for (const asset of current.assets) {
    expect(asset.reused, asset.file).toBe(true);
    const bytes = await file(`public/${asset.path}`);
    expect(sha(bytes), asset.file).toBe(asset.sha256);
    expect(sha(await file(asset.sourcePath)), asset.file).toBe(asset.sha256);
    const response = await request.get(`/${asset.path}`);
    expect(response.ok()).toBe(true);
    expect(sha(await response.body()), asset.file).toBe(asset.sha256);
  }
});

test('Journalism 2 matches its three sections, dividers, media crops and desktop geometry', async ({ page }) => {
  await ready(page);
  await expect(page.locator('.journalism-page > section')).toHaveCount(3);
  await expect(page.locator('.journalism-page h2')).toHaveText(['Written Articles', 'Multimedia Journalism', 'Broadcast Journalism']);
  await expect(page.locator('.journalism-page .video-card')).toHaveCount(6);
  await expect(page.locator('.journalism-page .video-feature__preview')).toHaveCount(1);
  for (const rule of await page.locator('.journalism-rule').all()) {
    await expect(rule).toHaveCSS('border-top-color', 'rgb(0, 0, 0)');
    const pixels = await rule.evaluate(n => parseFloat(getComputedStyle(n).borderTopWidth) * devicePixelRatio);
    expect(pixels).toBeGreaterThanOrEqual(.999);
  }
  const ids = ['689:117','607:16','607:14','689:8','689:7','689:9','689:11','689:12','689:13','689:68','689:90','689:87',
    '689:14','689:22','689:31','689:56','689:47','689:40','689:18','689:27','689:35','689:60','689:51','689:43','689:97','689:91',
    '689:20','689:21','689:29','689:30','689:38','689:39','689:63','689:64','689:54','689:55','689:45','689:46'];
  for (const id of ids) {
    const node = page.locator(`.journalism-page [data-figma-node="${id}"]`);
    await expect(node).toBeAttached();
    const sourceText = text.nodes.find(n => n.id === id);
    if (sourceText) {
      await expect(node).toHaveText(sourceText.characters.replace(/\u2028/g, '\n').trim());
      await expect(node).toHaveCSS('font-size', `${sourceText.segments[0].fontSize}px`);
      await expect(node).toHaveCSS('font-weight', `${sourceText.segments[0].fontWeight}`);
    }
    if (page.viewportSize().width === 1440) {
      const actual = await node.boundingBox();
      const expected = geometry.nodes.find(n => n.id === id);
      // Figma text boxes can contain unused empty height; visible text is normal flow.
      for (const key of ['x','y','width']) expect(Math.abs(actual[key] - expected[key]), `${id} ${key}`).toBeLessThan(1);
      if (!sourceText && !['689:97','689:91'].includes(id)) expect(Math.abs(actual.height - expected.height), `${id} height`).toBeLessThan(1);
    }
  }
});

test('Journalism multimedia and broadcast images, titles and play icons open their matching destinations safely', async ({ page, context }) => {
  const content = JSON.parse(await file('public/assets/journalism-v10-figma/content.json'));
  await ready(page);
  const links = [
    [page.locator('.journalism-multimedia__button'), content.multimedia.href],
    [page.locator('.journalism-multimedia .project-card__link'), content.multimedia.href],
    ...content.broadcast.stories.map(story => [page.locator(`.video-card[data-figma-node="${story.id}"] > a`),story.href]),
  ];
  for (const [link,href] of links) {
    await expect(link).toHaveAttribute('href',href);
    await expect(link).toHaveAttribute('target','_blank');
    await context.route(href,route=>route.fulfill({contentType:'text/html',body:'<title>Journalism destination</title>'}));
    const hasPlay=await link.locator('.video-card__play,.video-feature__play').count();
    for (const mode of hasPlay ? ['keyboard','play'] : ['keyboard']) {
      const opened=page.waitForEvent('popup');
      if(mode==='keyboard'){await link.focus();await page.keyboard.press('Enter');}
      else await link.locator('.video-card__play,.video-feature__play').click();
      const popup=await opened;
      await expect(popup).toHaveURL(href);
      expect(await popup.evaluate(()=>window.opener)).toBeNull();
      await popup.close();
    }
  }
});
