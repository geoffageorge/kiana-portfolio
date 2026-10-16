import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('Pointly uses the reference artwork without changing its pixels', async ({ page }) => {
  const manifest = JSON.parse(await readFile(new URL('../public/assets/pointly-2/manifest.json', import.meta.url), 'utf8'));
  const reference = (await readFile(new URL('../Assets/pointly_2/Pointly Case Study 2.png', import.meta.url))).toString('base64');
  const sources = Object.fromEntries(await Promise.all(Object.entries(manifest.assets).filter(([, asset]) => asset.sourceFile).map(async ([name, asset]) => [name, (await readFile(new URL(`../${asset.sourceFile}`, import.meta.url))).toString('base64')])));
  await page.goto('/projects/pointly/');
  await expect(page.locator('.pointly-case')).toBeVisible();
  await expect(page.locator('.pointly-index')).toHaveText('02 /');
  const differences = await page.evaluate(async ({ reference, sources, assets }) => {
    const original = new Image();
    original.src = `data:image/png;base64,${reference}`;
    await original.decode();
    const differences = [];
    for (const [name, asset] of Object.entries(assets)) {
      const actual = new Image();
      actual.src = new URL(`assets/pointly-2/${asset.file}`, new URL('../../', location.href)).href;
      await actual.decode();
      const canvas = document.createElement('canvas');
      canvas.width = asset.width; canvas.height = asset.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (asset.sourceRect) {
        const [x, y, right, bottom] = asset.sourceRect;
        context.drawImage(original, x, y, right - x, bottom - y, 0, 0, asset.width, asset.height);
      } else {
        const source = new Image();
        source.src = `data:image/png;base64,${sources[name]}`;
        await source.decode();
        context.drawImage(source, 0, 0);
      }
      const expected = context.getImageData(0, 0, asset.width, asset.height).data;
      context.clearRect(0, 0, asset.width, asset.height);
      context.drawImage(actual, 0, 0);
      const pixels = context.getImageData(0, 0, asset.width, asset.height).data;
      let changed = 0;
      for (let i = 0; i < pixels.length; i++) if (pixels[i] !== expected[i]) changed++;
      if (changed) differences.push({ name, changed });
    }
    return differences;
  }, { reference, sources, assets: manifest.assets });
  expect(differences).toEqual([]);
});

test('desktop layout, typography and color match measured reference landmarks', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/projects/pointly/');
  await expect(page.locator('.pointly-case')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const hero = await page.locator('.pointly-showcase').boundingBox();
  expect(hero).toEqual({ x: 120, y: 558, width: 1200, height: 655 });
  // Section-rule positions measured directly from the supplied 1440px PNG.
  // The supplied MVP screenshots fill the area before Retrospective.
  for (const [id, referenceTop] of [['interviews', 2472], ['research', 4169], ['design', 6201]]) {
    const bounds = await page.locator(`#${id}`).boundingBox();
    expect(Math.abs(bounds.y - referenceTop), `${id} aligns with the reference`).toBeLessThan(4);
    expect(bounds.x).toBe(428);
    expect(bounds.width).toBe(892);
  }
  await expect(page.locator('.pointly-case')).toHaveCSS('font-family', '"Pointly Roboto", Arial, sans-serif');
  await expect(page.locator('.pointly-case')).toHaveCSS('font-size', '18px');
  await expect(page.locator('.pointly-index')).toHaveCSS('font-family', '"Pointly Roboto Mono", monospace');
  await expect(page.locator('.pointly-feature-callout').first()).toHaveCSS('background-color', 'rgb(231, 239, 82)');
  await expect(page.locator('.pointly-interview-card').first()).toHaveCSS('background-color', 'rgb(247, 247, 247)');
  await expect(page.locator('.pointly-case h1')).toHaveCSS('font-family', '"Pointly Inter", Arial, sans-serif');
  expect(await page.evaluate(() => document.fonts.check('750 44px "Pointly Inter"'))).toBe(true);
  const navigation = page.getByRole('navigation', { name: 'Project sections' });
  await expect(navigation.getByRole('link')).toHaveText(['Interviews', 'Research', 'Design', 'Retrospective']);
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work', exact: true })).toHaveAttribute('href', '/#work');
  const retrospective = await page.locator('#retrospective').boundingBox();
  const gallery = await page.locator('.pointly-mvp-gallery').boundingBox();
  expect(retrospective.y - gallery.y - gallery.height).toBeCloseTo(96, 1);
  await expect(page.locator('.pointly-mvp-feature h4')).toHaveText(['Rewards Dashboard', 'Personalized Recommendations', 'Property Detail']);
  await expect(page.locator('.pointly-mvp-feature figcaption p')).toHaveText([
    'View balances across rewards programs in one place.',
    'Explore stays based on available points and preferences.',
    'Compare points, cash price, and redemption value before booking.',
  ]);
  await expect(page.locator('.pointly-mvp-gallery')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  for (const [index, filename] of ['connected-wallet.png', 'recommended-stays.png', 'stay-details.png'].entries()) {
    const row = page.locator('.pointly-mvp-feature').nth(index);
    await expect(row.locator('img')).toHaveAttribute('src', new RegExp(`/${filename.replace('.', '\\.')}$`));
    const image = await row.locator('img').boundingBox();
    const caption = await row.locator('figcaption').boundingBox();
    expect(caption.x).toBeGreaterThan(image.x + image.width);
    expect(Math.abs(caption.y + caption.height / 2 - image.y - image.height / 2)).toBeLessThan(1);
  }
});

test('the redesigned case study reflows on phones, tablets and desktops without horizontal scrolling', async ({ page }) => {
  for (const width of [320, 393, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/projects/pointly/');
    await expect(page.getByRole('heading', { name: 'What I Learned' })).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const header = await page.locator('.site-header').boundingBox();
    const title = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(title.y).toBeGreaterThanOrEqual(header.y + header.height);
    if (width < 768) {
      for (const row of await page.locator('.pointly-mvp-feature').all()) {
        const image = await row.locator('img').boundingBox();
        const caption = await row.locator('figcaption').boundingBox();
        expect(caption.y).toBeGreaterThanOrEqual(image.y + image.height);
      }
    }
  }
});
