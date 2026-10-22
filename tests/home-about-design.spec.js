import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const file = path => readFile(new URL(`../${path}`, import.meta.url));
const sourceFrame = async name => JSON.parse(await file(`Assets/figma files/home-about-2026-10-19/${name}/inspection.json`));
const flatten = n => [n, ...(n.children ?? []).flatMap(flatten)];

test('all 11 Figma exports and the supplied resume are served unchanged', async ({ request }) => {
  for (const folder of ['home-figma', 'about-figma']) {
    const manifest = JSON.parse(await file(`public/assets/${folder}/manifest.json`));
    for (const asset of manifest.assets) {
      const bytes = await file(`public/assets/${folder}/${asset.file}`);
      expect(bytes.byteLength, asset.file).toBe(asset.bytes);
      expect(hash(bytes), asset.file).toBe(asset.sha256);
      const response = await request.get(`/assets/${folder}/${asset.file}`);
      expect(response.ok(), asset.file).toBe(true);
      expect(hash(await response.body()), asset.file).toBe(asset.sha256);
    }
  }
  const resume = await request.get('/assets/kiana-george-resume.pdf');
  expect(resume.ok()).toBe(true);
  expect(resume.headers()['content-type']).toMatch(/^application\/pdf/);
  expect(hash(await resume.body())).toBe(hash(await file('Assets/Kiana George Resume.pdf')));
});

test('Select Work uses the Figma tile text, artwork geometry and Safari-compatible divider', async ({ page }) => {
  await page.goto('/');
  const nodes = JSON.parse(await file('Assets/figma files/overall-website-v4-2026-10-22/tiles-inspection.json')).nodes;
  const rule = await page.locator('.selected-work__grid').evaluate(n => {
    const style = getComputedStyle(n, '::before');
    return { color: style.borderTopColor, weight: parseFloat(style.borderTopWidth), image: style.backgroundImage, dpr: devicePixelRatio };
  });
  expect(rule.color).toBe('rgb(0, 0, 0)');
  expect(rule.weight * rule.dpr).toBeGreaterThanOrEqual(.999);
  expect(rule.weight).toBeLessThanOrEqual(1);
  expect(rule.image).toBe('none');
  await expect(page.locator('.project-card h3')).toHaveText(['Obayashi', 'Point.ly']);
  await expect(page.locator('.project-card__number')).toHaveText(['01 /', '02 /']);
  await expect(page.locator('.project-card__summary')).toHaveText(['NORTH AMERICANWEBSITE', 'HIGH-FIDELITYPROTOTYPE']);
  const cards = page.locator('.project-card__link');
  for (const [index, slug] of [[0, 'obayashi'], [1, 'pointly']]) {
    const card = cards.nth(index);
    await expect(card).toHaveAttribute('href', `/projects/${slug}/`);
    await card.scrollIntoViewIfNeeded();
    const bounds = await card.boundingBox();
    expect(bounds.width).toBeCloseTo(bounds.height, 1);
    await expect(card).toHaveCSS('border-radius', '16px');
    for (const img of await card.locator('img').all()) await img.evaluate(i => i.decode());
    // Compare actual layers with source coordinates, independent of CSS values.
    const originX = index === 0 ? 129 : 733;
    for (const id of index === 0 ? ['123:3', '123:6', '499:37'] : ['499:51', '499:52', '499:53', '499:43', '499:42']) {
      const expected = nodes.find(n => n.id === id);
      const actual = await card.locator(`[data-figma-node="${id}"]`).boundingBox();
      const scale = bounds.width / 577;
      expect(Math.abs(actual.x - bounds.x - (expected.x - originX) * scale), id).toBeLessThan(.6);
      expect(Math.abs(actual.y - bounds.y - (expected.y - 881) * scale), id).toBeLessThan(.6);
      if (expected.type !== 'TEXT') {
        expect(Math.abs(actual.width - expected.width * scale), id).toBeLessThan(.6);
        expect(Math.abs(actual.height - expected.height * scale), id).toBeLessThan(.6);
      }
    }
  }
  await expect(page.locator('.project-artwork--pointly')).toHaveCSS('background-color', 'rgb(136, 207, 253)');
  await expect(page.locator('.selected-work .section-heading p')).toHaveCSS('font-size', '18px');
});

const version2Frame = async name => JSON.parse(await file(`Assets/figma files/overall-website-v2-2026-10-21/${name}-inspection.json`));

test('version 2 source assets remain archived unchanged', async ({ request }) => {
  const manifest = JSON.parse(await file('public/assets/website-v2-figma/manifest.json'));
  for (const asset of manifest.assets) {
    expect(hash(await file(`public/assets/website-v2-figma/${asset.file}`))).toBe(asset.sha256);
    const response = await request.get(`/assets/website-v2-figma/${asset.file}`);
    expect(response.ok()).toBe(true);
    expect(hash(await response.body())).toBe(asset.sha256);
  }
});

test('About+Contact is a full page with the revised Figma biography, contact details and desktop geometry', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'About+Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await page.reload();
  await expect(page).toHaveTitle('About + Contact / Kiana George');
  await page.evaluate(() => document.fonts.ready);
  const frame = JSON.parse(await file('Assets/figma files/overall-website-v4-2026-10-22/about-inspection.json'));
  const nodes = frame.nodes;
  const source = nodes.find(n => n.id === '522:266').text;
  await expect(page.locator('.about-page__copy p')).toHaveText(source.split(/[\n\u2028]+/).map(p => p.trim()).filter(Boolean));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Curious George, Literally');
  await expect(page.locator('.about-page__copy')).toHaveCSS('font-size', '16px');
  await expect(page.locator('.about-page__copy')).toHaveCSS('line-height', '26px');
  await expect(page.getByRole('link', { name: 'kikig6204@gmail.com', exact: true })).toHaveAttribute('href', 'mailto:kikig6204@gmail.com');
  await expect(page.getByRole('link', { name: '650-817-5454' })).toHaveAttribute('href', 'tel:+16508175454');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  if (page.viewportSize().width === 1440) {
    for (const id of ['522:268','522:266','522:270','522:271']) {
      const expected = nodes.find(n => n.id === id);
      const actual = await page.locator(`[data-figma-node="${id}"]`).boundingBox();
      for (const key of ['x','y','width']) expect(Math.abs(actual[key] - expected[key]), `${id} ${key}`).toBeLessThan(1);
    }
    for (const id of ['522:269','522:267','560:19','560:16','560:21','557:10']) {
      const expected = nodes.find(n => n.id === id);
      const actual = await page.locator(`[data-figma-node="${id}"]`).boundingBox();
      for (const key of ['x','y']) expect(Math.abs(actual[key] - expected[key]), `${id} ${key}`).toBeLessThan(1);
    }
  }
});

test('Resume and LinkedIn retain real PDF delivery and new-tab destinations', async ({ page, context }) => {
  await page.goto('/about/');
  const resume = page.getByRole('link', { name: /Resume/ });
  await expect(resume).toHaveAttribute('target', '_blank');
  const resumeTab = page.waitForEvent('popup');
  const resumeResponse = context.waitForEvent('response', r => r.url().endsWith('/assets/kiana-george-resume.pdf'));
  await resume.click();
  const pdf = await resumeTab;
  expect((await resumeResponse).headers()['content-type']).toMatch(/^application\/pdf/);
  if (!pdf.isClosed()) await pdf.close();
  const url = 'https://www.linkedin.com/in/kiana-george-75b061209/';
  await context.route(url, route => route.fulfill({ contentType: 'text/html', body: '<title>LinkedIn destination</title>' }));
  const linkedInTab = page.waitForEvent('popup');
  await page.getByRole('link', { name: /LinkedIn/ }).click();
  const linkedIn = await linkedInTab;
  await expect(linkedIn).toHaveURL(url);
  expect(await linkedIn.evaluate(() => window.opener)).toBeNull();
  await linkedIn.close();
});

test('profile button rollovers use the requested grey and footer rollover uses the version 4 grey', async ({ page }) => {
  await page.goto('/about/');
  for (const button of await page.locator('.about-page__button').all()) {
    await button.hover();
    await expect(button).toHaveCSS('background-color', 'rgb(130, 138, 139)');
    const image = button.locator('img');
    if (await image.count()) await expect(image).toHaveCSS('opacity', '0');
  }
  const connect = page.locator('.site-footer__connect');
  await connect.hover();
  await expect(connect).toHaveCSS('color', 'rgb(197, 205, 206)');
  await expect(connect).toHaveAttribute('href', '/about/');
});

test('the revised footer and two-link navigation appear on every active page', async ({ page }) => {
  const frame = await version2Frame('footer');
  const source = flatten(frame);
  for (const path of ['/', '/about/', '/projects/obayashi/', '/projects/pointly/', '/projects/template/']) {
    await page.goto(path);
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav.getByRole('link')).toHaveText(['Work','About+Contact']);
    await expect(nav.getByRole('button')).toHaveCount(0);
    await expect(page.locator('.site-footer')).toHaveCSS('background-color', 'rgb(60, 68, 75)');
    if (page.viewportSize().width === 1440) {
      const footer = await page.locator('.site-footer').boundingBox();
      expect(footer.height).toBe(frame.height);
      for (const id of ['523:41', '523:39']) {
        const target = source.find(n => n.id === id);
        const actual = await page.locator(`[data-figma-node="${id}"]`).boundingBox();
        for (const key of ['x','width','height']) expect(Math.abs(actual[key] - target[key]), `${id} ${key}`).toBeLessThan(1);
        expect(Math.abs(actual.y - footer.y - target.y)).toBeLessThan(1);
      }
    }
    await page.locator('.site-footer__connect').click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Curious George, Literally');
  }
});

test('navigation rollover underlines stay below the text in all header variants', async ({ page }) => {
  for (const path of ['/', '/about/', '/projects/obayashi/', '/projects/pointly/']) {
    await page.goto(path);
    const links = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link');
    for (const link of await links.all()) {
      await link.hover();
      const label = link.locator('.site-nav__label');
      await expect.poll(() => label.evaluate(n => getComputedStyle(n,'::after').transform)).toBe('matrix(1, 0, 0, 1, 0, 0)');
      const rule = await label.evaluate(n => {
        const range = document.createRange(); range.selectNodeContents(n);
        const style = getComputedStyle(n,'::after');
        return { y: n.getBoundingClientRect().top + parseFloat(style.top), textBottom: range.getBoundingClientRect().bottom, height: parseFloat(style.height) };
      });
      expect(rule.y, path).toBeGreaterThan(rule.textBottom);
      expect(rule.height).toBe(1);
    }
  }
});

test('About page and footer reflow without overlap or horizontal scrolling', async ({ page }) => {
  for (const width of [320,393,768,1024,1440,1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/about/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const story = await page.locator('.about-page__copy').boundingBox();
    const portrait = await page.locator('.about-page__portrait').boundingBox();
    expect(story.x + story.width <= portrait.x || story.y >= portrait.y + portrait.height).toBe(true);
    expect(portrait.x).toBeGreaterThanOrEqual(0);
    expect(portrait.x + portrait.width).toBeLessThanOrEqual(width);
    const contact = await page.locator('.about-page__contact').boundingBox();
    const footer = await page.locator('.site-footer').boundingBox();
    expect(footer.y).toBeGreaterThanOrEqual(contact.y + contact.height);
  }
});

test('About URLs and assets resolve correctly under a deployment subdirectory', async ({ page, request, baseURL }) => {
  await page.route('**/portfolio/**', async route => {
    const url = new URL(route.request().url());
    const response = await request.get(`${baseURL}${url.pathname.replace('/portfolio/', '/')}${url.search}`);
    await route.fulfill({ response });
  });
  await page.goto('/portfolio/about/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Curious George, Literally');
  await expect(page.getByRole('link', { name: /Resume/ })).toHaveAttribute('href', '/portfolio/assets/kiana-george-resume.pdf');
  await expect(page.locator('.site-footer__connect')).toHaveAttribute('href', '/portfolio/about/');
  await expect(page.locator('.about-page__portrait img').last()).toHaveAttribute('src', '/portfolio/assets/website-v4-figma/about-imgPortrait2.png');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/\/portfolio\/#work$/);
  await expect(page.getByRole('heading', { name: 'Select Work' })).toBeInViewport();
});
