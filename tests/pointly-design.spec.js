import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const design = JSON.parse(await readFile(new URL('../public/assets/website-v4-figma/pointly-design.json', import.meta.url), 'utf8'));
const geometry = design.geometry;

async function ready(page) {
  await page.goto('/projects/pointly/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Point.ly');
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = 'eager';
    await Promise.all([...document.images].map(image => image.decode()));
    await document.fonts.ready;
  });
}

// Validate the complete new frame against the independent Figma inspection.
test('every Pointly source asset keeps its bytes and renders in its inspected slot', async ({ page }) => {
  await ready(page);
  for (const [name, asset] of Object.entries(design.images)) {
    const bytes = await readFile(new URL(`../public/${asset.path}`, import.meta.url));
    expect(createHash('sha256').update(bytes).digest('hex'), name).toBe(asset.sha256);
    const slot = page.locator(`[data-figma-asset="${name}"]`);
    await expect(slot).toHaveCount(1);
    const image = asset.path.endsWith('.svg') ? slot : slot.locator('img');
    await expect(image).toHaveAttribute('src', `/${asset.path}`);
    expect(await image.evaluate(n => n.complete && n.naturalWidth > 0), name).toBe(true);
    const actual = await slot.boundingBox();
    if (name.startsWith('line-') && page.viewportSize().width < 1024) { expect(actual).toBeNull(); continue; }
    expect(actual.width, name).toBeGreaterThan(0);
    expect(actual.height, name).toBeGreaterThan(0);
    if (page.viewportSize().width === 1440) {
      const expected = asset.mask ?? geometry[asset.figmaNodeId];
      for (const key of ['x','y','width','height']) {
        if (key === 'height' && ['line-65-62','line-66-63'].includes(name)) continue;
        // The requested shadow clearance intentionally raises this source slot.
        if (name === 'frame-3-2-1-186' && key === 'y') continue;
        expect(Math.abs(actual[key] - expected[key]), `${name} ${key}`).toBeLessThan(1);
      }
      if (asset.paint?.scaleMode === 'CROP') {
        const [[a,,x],[,d,y]] = asset.paint.imageTransform;
        const crop = await image.boundingBox();
        expect(crop.x).toBeCloseTo(actual.x - x * actual.width / a, 1);
        expect(crop.y).toBeCloseTo(actual.y - y * actual.height / d, 1);
        expect(crop.width).toBeCloseTo(actual.width / a, 1);
        expect(crop.height).toBeCloseTo(actual.height / d, 1);
      }
    }
  }
});

test('updated desktop sections and image masks match Pointly Case Study 2', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page);
  for (const [selector, id] of [
    ['.pointly-intro h1','499:60'], ['.pointly-intro__summary > p','499:59'],
    ['.pointly-project-details','413:53'], ['.pointly-showcase','274:4'], ['.pointly-rewards-flow','320:51'],
    ['#pointly-challenge-title','90:20'], ['#pointly-interviews-title','136:44'], ['#pointly-research-title','143:17'],
    ['.pointly-competitors h3','145:125'], ['.pointly-opportunity-map h3','163:10'], ['.pointly-insights h3','145:134'],
    ['#pointly-design-title','163:11'], ['.pointly-low-fi h3','163:13'], ['.pointly-mid-fi h3','187:3'],
    ['.pointly-identity h3','413:21'], ['.pointly-visual-system','413:23'], ['.pointly-mvp h3','413:14'],
    ['.pointly-mvp > p','413:15'], ['#pointly-retrospective-title','413:8'], ['.pointly-reflection','413:9'],
  ]) {
    const actual = await page.locator(selector).first().boundingBox();
    for (const key of ['x','y']) expect(Math.abs(actual[key]-geometry[id][key]), `${selector} ${key}`).toBeLessThan(1);
  }
  for (const image of ['frame-3-2-159','frame-3-2-1-186']) {
    const slot = page.locator(`[data-figma-asset="${image}"]`);
    expect(await slot.evaluate(n => getComputedStyle(n).maskImage)).toContain(design.images[image].mask.path);
    await expect(slot).toHaveCSS('overflow', 'hidden');
  }
  expect((await page.locator('.site-footer').boundingBox()).y).toBe(design.frame.height);
});

test('five native section dividers retain Figma positions and visible strokes', async ({ page }) => {
  await ready(page);
  await expect(page.locator('.pointly-rule')).toHaveCount(5);
  for (const id of ['101:3','143:16','143:18','163:12','413:11']) {
    const rule=page.locator(`.pointly-rule[data-figma-node="${id}"]`);
    await expect(rule).toHaveCSS('border-top-style','solid');
    await expect(rule).toHaveCSS('border-top-color','rgb(0, 0, 0)');
    expect(await rule.evaluate(n=>parseFloat(getComputedStyle(n).borderTopWidth))).toBeGreaterThanOrEqual(.5);
    if (page.viewportSize().width===1440) {
      const actual=await rule.boundingBox();
      for (const key of ['x','y','width']) expect(Math.abs(actual[key]-geometry[id][key]),`${id} ${key}`).toBeLessThan(1);
    }
  }
});

test('new research copy, logo grid, project details, and prototype wording are complete', async ({ page }) => {
  await ready(page);
  await expect(page.locator('.pointly-index')).toHaveText('02 /');
  await expect(page.locator('.pointly-facts dd').first()).toHaveText('High-Fidelity Prototype');
  await expect(page.locator('.pointly-facts dd').nth(2).locator('span')).toHaveText(['Project Lead','UX research','Product Strategy','Interface Design','Visual Identity']);
  await expect(page.locator('.pointly-facts dt',{hasText:/^Methods$/})).toHaveCount(1);
  await expect(page.locator('.pointly-competitors ul img')).toHaveCount(8);
  for (const id of ['145:125','143:74','163:9','348:8','348:7','348:5','145:138','348:16','348:15','348:12','348:11']) {
    await expect(page.locator(`[data-figma-node="${id}"]`)).toHaveText(design.texts[id].trim().replace(/[\n\u2028]+/g,' '));
  }
  await expect(page.locator('.pointly-mvp h3')).toHaveText('From Research to High-Fidelity Prototype');
  await expect(page.locator('.pointly-mvp > p')).toContainText('Our high-fidelity prototype brought');
  await expect(page.locator('.pointly-mvp > p')).not.toContainText('MVP');
  await expect(page.locator('.pointly-mvp-gallery h4')).toHaveText(['Rewards Dashboard','Personalized Recommendations','Property Detail']);
  await expect(page.locator('.pointly-reflection p')).toHaveCount(3);
});

test('Pointly reflows without overflow, missing illustrations, or overlapping captions', async ({ page }) => {
  await ready(page);
  for (const width of [320,393,768,1024,1440,1920]) {
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),String(width)).toBe(true);
    for (const card of await page.locator('.pointly-interview-card').all()) {
      const image=await card.locator('.pointly-picture').boundingBox();
      expect(image.width).toBeGreaterThan(100);
      expect(image.height).toBeGreaterThan(100);
    }
    for (const row of await page.locator('.pointly-mvp-feature').all()) {
      const image=await row.locator('button').boundingBox();
      const caption=await row.locator('figcaption').boundingBox();
      if(width<768) expect(caption.y).toBeGreaterThanOrEqual(image.y+image.height);
      else expect(caption.x).toBeGreaterThan(image.x+image.width);
    }
  }
});
