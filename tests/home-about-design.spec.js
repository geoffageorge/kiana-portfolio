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
  const nodes = flatten(await sourceFrame('case-studies'));
  const rule = await page.locator('.selected-work__grid').evaluate(n => {
    const style = getComputedStyle(n, '::before');
    return { color: style.borderTopColor, weight: parseFloat(style.borderTopWidth), image: style.backgroundImage };
  });
  expect(rule.color).toBe('rgb(0, 0, 0)');
  expect(rule.weight).toBeGreaterThanOrEqual(.5);
  expect(rule.weight).toBeLessThanOrEqual(1);
  expect(rule.image).toBe('none');
  await expect(page.locator('.project-card h3')).toHaveText(['Obayashi', 'Point.ly']);
  await expect(page.locator('.project-card__number')).toHaveText(['01 /', '02 /']);
  await expect(page.locator('.project-card__summary')).toHaveText(['NORTH AMERICANWEBSITE', 'WORKINGMVP']);
  const cards = page.locator('.project-card__link');
  for (const [index, slug] of [[0, 'obayashi'], [1, 'pointly']]) {
    const card = cards.nth(index);
    await expect(card).toHaveAttribute('href', `/projects/${slug}/`);
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
});

test('About reproduces the biography and both profile popups share the approved size', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'About', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await page.evaluate(() => document.fonts.ready);
  const source = flatten(await sourceFrame('about')).find(n => n.id === '486:9').characters;
  const paragraphs = source.split(/[\n\u2028]+/).map(p => p.trim()).filter(Boolean);
  await expect(dialog.locator('.about-content__copy p')).toHaveText(paragraphs);
  await expect(dialog.getByRole('heading')).toHaveText('Curious George, Literally');
  await expect(dialog.locator('.about-content__copy p').first()).toHaveCSS('font-size', '16px');
  await expect(dialog.locator('.about-content__copy p').first()).toHaveCSS('line-height', '26px');
  await dialog.getByRole('img', { name: 'Kiana George', exact: true }).evaluate(i => i.decode());
  const before = await dialog.boundingBox();
  expect(before.width).toBe(Math.min(806, page.viewportSize().width - 40));
  expect(before.height).toBe(Math.min(885, page.viewportSize().height - 60));
  const portrait = await dialog.locator('.about-portrait').boundingBox();
  const heading = await dialog.getByRole('heading').boundingBox();
  expect(portrait.x).toBeGreaterThan(heading.x + heading.width);
  expect(portrait.y).toBeLessThan(heading.y + heading.height);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Contact', exact: true }).click();
  const after = await dialog.boundingBox();
  expect(after).toEqual(before);
  const phone = dialog.getByRole('link', { name: '650 787 1892' });
  await expect(phone).toHaveAttribute('href', 'tel:+16507871892');
  expect(await phone.evaluate(n => parseFloat(getComputedStyle(n).fontSize))).toBeCloseTo(14 * 96 / 72, 3);
  await expect(dialog.getByRole('link', { name: 'kikig6204@gmail.com' })).toHaveAttribute('href', 'mailto:kikig6204@gmail.com');
  await expect(dialog.locator('.contact-content__row svg')).toHaveCount(2);
  const email = await dialog.getByRole('link', { name: 'kikig6204@gmail.com' }).boundingBox();
  expect(email.y).toBeGreaterThan((await phone.boundingBox()).y);
});

test('Resume and LinkedIn open new tabs from About', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'About', exact: true }).click();
  const dialog = page.getByRole('dialog');
  const resume = dialog.getByRole('link', { name: /Resume/ });
  await expect(resume).toHaveAttribute('target', '_blank');
  const resumeTab = page.waitForEvent('popup');
  const resumeResponse = context.waitForEvent('response', r => r.url().endsWith('/assets/kiana-george-resume.pdf'));
  await resume.click();
  const pdf = await resumeTab;
  // Headless WebKit has no PDF viewer; verify the new target and real PDF response.
  expect((await resumeResponse).headers()['content-type']).toMatch(/^application\/pdf/);
  if (!pdf.isClosed()) await pdf.close();
  const url = 'https://www.linkedin.com/in/kiana-george-75b061209/';
  // Validate navigation without depending on LinkedIn's login/network behavior.
  await context.route(url, route => route.fulfill({ contentType: 'text/html', body: '<title>LinkedIn destination</title>' }));
  const linkedInTab = page.waitForEvent('popup');
  await dialog.getByRole('link', { name: /LinkedIn/ }).click();
  const linkedIn = await linkedInTab;
  await expect(linkedIn).toHaveURL(url);
  expect(await linkedIn.evaluate(() => window.opener)).toBeNull();
  await linkedIn.close();
  await expect(dialog).toBeVisible();
});

test('popups remain usable on narrow phones, tablets and desktop', async ({ page }) => {
  for (const width of [320, 393, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const name of ['About', 'Contact']) {
      const trigger = page.getByRole('button', { name, exact: true });
      await trigger.click();
      const dialog = page.getByRole('dialog');
      expect(await dialog.evaluate(n => n.scrollWidth <= n.clientWidth)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const close = dialog.getByRole('button', { name: 'Close dialog' });
      await expect(close).toBeInViewport();
      if (name === 'About') {
        await dialog.getByRole('link', { name: /LinkedIn/ }).scrollIntoViewIfNeeded();
        await expect(dialog.getByRole('link', { name: /LinkedIn/ })).toBeInViewport();
      }
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
    }
  }
});
