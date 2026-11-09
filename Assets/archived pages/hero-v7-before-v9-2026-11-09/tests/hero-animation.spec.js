import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const hash = data => createHash('sha256').update(data).digest('hex');

test('the supplied standalone hero is served unchanged and embedded eagerly with an accessible title', async ({ page, request }) => {
  const source = await readFile(new URL('../Assets/new hero section/animation.html', import.meta.url));
  const deployed = await readFile(new URL('../public/assets/hero-v7/animation.html', import.meta.url));
  expect(hash(deployed)).toBe(hash(source));
  const response = await request.get('/assets/hero-v7/animation.html');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('text/html');
  expect(hash(await response.body())).toBe(hash(source));
  await page.goto('/');
  const embed = page.locator('.hero-section__animation');
  await expect(embed).toHaveAttribute('loading', 'eager');
  await expect(embed).toHaveAttribute('title', 'Kiana George portfolio animation');
  await expect(page.locator('#hero-title')).toHaveText('Understanding people. Shaping digital experiences.');
  await expect(page.frameLocator('.hero-section__animation').locator('h1')).toHaveText('Understanding people.Shaping digital experiences.');
});

test('the hero starts on page load, reveals its final headline, supports keyboard replay and restarts on reload', async ({ page }) => {
  test.setTimeout(30000);
  await page.goto('/');
  const frame=page.frameLocator('.hero-section__animation');
  const spiro=frame.locator('.spiro');
  await expect(spiro.locator('path')).toHaveCount(8);
  const start=await spiro.evaluate(n=>n.style.transform);
  await expect.poll(()=>spiro.evaluate(n=>n.style.transform)).not.toBe(start);
  await expect(frame.locator('.subhead')).toHaveCSS('opacity', '1', { timeout: 12000 });
  expect(await frame.locator('.headline-mask').evaluate(n=>getComputedStyle(n).clipPath.startsWith('inset(0%'))).toBe(true);
  await expect(spiro).toHaveCSS('opacity', '0');
  const replay=frame.getByRole('button', {name:'REPLAY ↗', exact:true});
  await replay.focus();
  await page.keyboard.press('Enter');
  await expect.poll(()=>spiro.evaluate(n=>Number(getComputedStyle(n).opacity))).toBeGreaterThan(.2);
  await expect(frame.locator('.subhead')).toHaveCSS('opacity', '0');
  await page.reload();
  await expect.poll(()=>spiro.evaluate(n=>Number(getComputedStyle(n).opacity))).toBeGreaterThan(.2);
  const before=await spiro.evaluate(n=>n.style.transform);
  await expect.poll(()=>spiro.evaluate(n=>n.style.transform)).not.toBe(before);
});

test('an initial reduced-motion preference displays the supplied final state without automatic movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('/');
  const frame=page.frameLocator('.hero-section__animation');
  await expect(frame.locator('.subhead')).toHaveCSS('opacity','1');
  await expect(frame.locator('.spiro')).toHaveCSS('opacity','0');
  await expect(frame.locator('.orbit-donut')).toHaveCount(4);
  expect(await frame.locator('.orbit-donut').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).opacity==='0'))).toBe(true);
  const before=await frame.locator('.headline-mask').evaluate(n=>n.style.clipPath);
  await page.waitForTimeout(200);
  expect(await frame.locator('.headline-mask').evaluate(n=>n.style.clipPath)).toBe(before);
  expect(before.startsWith('inset(0%')).toBe(true);
});

test('page background and sticky navigation work on home, UX and project pages', async ({ page }) => {
  for (const path of ['/', '/ux/', '/about/', '/projects/pointly/', '/projects/template/', '/projects/obayashi/', '/projects/obayashi_old/', '/projects/project-03/', '/projects/project-04/']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
    const header=await page.locator('.site-header').boundingBox();
    expect(header.y).toBeCloseTo(0);
    await expect(page.getByRole('navigation', { name:'Main navigation' })).toBeInViewport();
    if (path.startsWith('/projects/')) {
      const obayashi=path==='/projects/obayashi/';
      await page.getByRole('navigation', { name:'Project sections' }).getByRole('link', {name:obayashi?'Web Audit':/Research/}).click();
      await expect.poll(()=>page.locator(obayashi?'#web-audit':'#research').evaluate(n=>n.getBoundingClientRect().top>=document.querySelector('.site-header').getBoundingClientRect().bottom)).toBe(true);
    } else {
      await page.getByRole('navigation', {name:'Main navigation'}).getByRole('link', {name:'UX',exact:true}).click();
      await expect(page).toHaveURL(/\/ux\/$/);
      await expect(page.getByRole('heading',{level:1})).toHaveText('Selected Case Studies');
      await page.getByRole('link',{name:'Kiana George home',exact:true}).click();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByRole('heading',{name:'Featured',exact:true})).toBeVisible();
    }
  }
});
