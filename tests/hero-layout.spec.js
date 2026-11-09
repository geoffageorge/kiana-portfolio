import { test, expect } from '@playwright/test';

test('the new supplied hero replaces the old artwork and ignores saved legacy overrides', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('kiana-hero-artwork', JSON.stringify({ settings: { viewBox: { x: -600, y: -450, width: 600, height: 1800 } } })));
  await page.goto('/');
  await expect(page.locator('.hero-section__animation')).toHaveAttribute('src', '/assets/hero-v9/animation.html');
  await expect(page.locator('.hero-artwork,.hero-section__copy')).toHaveCount(0);
  await expect(page.getByText('Clarifying Chaos', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Featured', exact: true })).toBeVisible();
  await expect(page.locator('.selected-work .eyebrow')).toHaveText('Case studies');
  await expect(page.locator('.selected-work .eyebrow')).toHaveCSS('text-transform', 'uppercase');
  await page.reload();
  await expect(page.locator('.hero-section__animation')).toHaveAttribute('src', '/assets/hero-v9/animation.html');
});

test('the supplied hero sits directly below the header and fits phone, tablet and desktop containers', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const frame = page.frameLocator('.hero-section__animation');
    await expect(frame.locator('.subhead')).toHaveCSS('opacity', '1');
    const boxes = await page.evaluate(() => {
      const rect = s => document.querySelector(s).getBoundingClientRect().toJSON();
      return { hero: rect('.hero-section__animation'), header: rect('.site-header'), work: rect('#work'), main: rect('#main'), scrollWidth: document.documentElement.scrollWidth };
    });
    expect(boxes.hero.top).toBeCloseTo(boxes.header.bottom, 1);
    expect(boxes.hero.height).toBe(width <= 480 ? 460 : 560);
    expect(boxes.hero.x).toBeCloseTo(boxes.main.x, 1);
    expect(boxes.hero.width).toBeCloseTo(boxes.main.width, 1);
    expect(boxes.work.top - boxes.hero.bottom).toBeCloseTo(32, 1);
    expect(boxes.scrollWidth).toBeLessThanOrEqual(width);
    expect(await frame.locator('html').evaluate(n => n.scrollWidth <= innerWidth && n.scrollHeight <= innerHeight)).toBe(true);
    expect(await frame.locator('h1').evaluate(n => {
      const r=n.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth;
    })).toBe(true);
  }
});

test('white pages, dividing rules, and transparent logos appear throughout the site', async ({ page }) => {
  for (const path of ['/', '/projects/pointly/', '/projects/template/', '/projects/obayashi/', '/projects/project-03/', '/projects/project-04/']) {
    await page.goto(path);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    const logos = page.locator('.brand-logo');
    const figmaCaseStudy = ['/projects/pointly/', '/projects/obayashi/'].includes(path);
    await expect(logos).toHaveCount(figmaCaseStudy ? 0 : 1);
    const footerLogo = page.locator('.site-footer__brand > img');
    await expect(footerLogo).toHaveAttribute('src', '/assets/brand/ki-logo-v4.svg');
    await expect(footerLogo).toHaveAttribute('width', '57');
    await expect(footerLogo).toHaveAttribute('height', '38');
    if (path === '/projects/pointly/') {
      await expect(page.locator('.pointly-mark img')).toHaveCount(1);
    } else if (path === '/projects/obayashi/') {
      await expect(page.locator('.obayashi-mark')).toHaveAttribute('src', '/assets/brand/ki-logo-v4.svg');
      const mark = await page.locator('.obayashi-mark').boundingBox();
      expect(mark.width).toBe(57);
      expect(mark.height).toBe(38);
    }
    for (const logo of await logos.all()) {
      await expect(logo).toHaveAttribute('src', '/assets/brand/ki-logo-v4.svg');
      await logo.evaluate(image => image.decode());
      const size = await logo.boundingBox();
      expect(size.width).toBe(page.viewportSize().width < 768 ? 45 : 54);
      expect(size.height).toBe(page.viewportSize().width < 768 ? 30 : 36);
    }
    if (!figmaCaseStudy) expect(await logos.first().evaluate(image => {
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
      return [[0, 0], [0, 1], [0, .5]].map(([x, y]) => context.getImageData(Math.floor(x * canvas.width), Math.min(canvas.height - 1, Math.floor(y * canvas.height)), 1, 1).data[3]);
    })).toEqual([0, 0, 0]);
    if (path === '/') {
      await expect(page.locator('.selected-work__grid')).toHaveCSS('gap', page.viewportSize().width < 768 ? '24px' : '27px');
      for (const card of await page.locator('.project-card').all()) await expect(card).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(page.locator('.project-card').first()).toHaveCSS('border-bottom-width', '0px');
    }
  }
});

test('the final hero remains contained when the browser resizes after the animation has settled',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:1440,height:1000});await page.goto('/');
  const frame=page.frameLocator('.hero-section__animation');
  await expect(frame.locator('.subhead')).toHaveCSS('opacity','1');
  for(const width of [390,320,768,1920]){
    await page.setViewportSize({width,height:1000});
    await expect.poll(()=>frame.locator('.headline-row').evaluateAll(nodes=>nodes.every(n=>n.scrollWidth<=n.clientWidth+1))).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect(frame.getByRole('button')).toHaveCount(0);
  }
});
