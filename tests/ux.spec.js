import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const file = path => readFile(new URL(`../${path}`, import.meta.url));
const archive = 'Assets/figma files/ux-v7-2026-11-08/';
const geometry = JSON.parse(await file(`${archive}geometry.json`));
const typography = JSON.parse(await file(`${archive}text-inspection.json`));
const reuse = JSON.parse(await file(`${archive}asset-reuse.json`));
const copy = text => text.replace(/\u2028/g, '\n').trim();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

async function ready(page, path='/ux/') {
  await page.goto(path);
  await expect(page.getByRole('heading', {level:1})).toHaveText('Selected Case Studies');
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading='eager';
    await Promise.all([...document.images].map(image=>image.decode()));
  });
}

test('UX opens its own page from every shared menu and the brand still returns home', async ({ page }) => {
  for (const path of ['/', '/video/', '/journalism/', '/about/', '/projects/obayashi/', '/projects/pointly/']) {
    await page.goto(path);
    const nav=page.getByRole('navigation', {name:'Main navigation'});
    await expect(nav.getByRole('link')).toHaveText(['UX','VIDEO','JOURNALISM','ABOUT+CONTACT']);
    await expect(nav.getByRole('link',{name:'UX',exact:true})).toHaveAttribute('href','/ux/');
    await nav.getByRole('link',{name:'UX',exact:true}).click();
    await expect(page).toHaveURL(/\/ux\/$/);
    await expect(page.getByRole('heading',{level:1})).toHaveText('Selected Case Studies');
    await expect(nav.getByRole('link',{name:'UX',exact:true})).toHaveAttribute('aria-current','page');
    await expect(page.locator('.site-footer__connect')).toHaveAttribute('href','/about/');
    await expect(page.locator('.hero-section')).toHaveCount(0);
  }
  await page.getByRole('link',{name:'Kiana George home',exact:true}).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading',{name:'Featured',exact:true})).toBeVisible();
  await expect(page.locator('.site-nav [aria-current="page"]')).toHaveCount(0);
});

test('UX uses the exact Figma introduction, typography, tile wording and desktop positions', async ({ page }) => {
  await ready(page);
  const textSlots=[
    ['619:61','.ux-page__label'],['619:60','#ux-title'],['619:59','.ux-page__description'],
    ['619:123','.project-card--obayashi h3'],['619:124','.project-card--obayashi .project-card__number'],
    ['619:125','.project-card--obayashi .project-card__summary'],['619:136','.project-card--obayashi .project-card__roles'],
    ['619:126','.project-card--pointly h3'],['619:127','.project-card--pointly .project-card__number'],
    ['619:128','.project-card--pointly .project-card__summary'],['619:137','.project-card--pointly .project-card__roles'],
  ];
  for (const [id,selector] of textSlots) {
    const source=typography.nodes.find(n=>n.id===id);
    const slot=page.locator(selector);
    expect(await slot.evaluate(n=>[...n.childNodes].map(child=>child.textContent).join('\n').replace(/\s+/g,' ').trim())).toBe(copy(source.characters).replace(/\s+/g,' '));
    if (page.viewportSize().width===1440) {
      // WebKit retains tiny floating-point differences for container units.
      expect(await slot.evaluate(n=>parseFloat(getComputedStyle(n).fontSize))).toBeCloseTo(id==='619:60'?32:source.fontSize,3);
      await expect(slot).toHaveCSS('font-weight',source.fontName.style==='Bold'?'700':'400');
      const expected=geometry.nodes.find(n=>n.id===id), actual=await slot.boundingBox();
      for (const key of ['x','y']) expect(Math.abs(actual[key]-expected[key]),`${id} ${key}`).toBeLessThan(.6);
      if (['619:59','619:60','619:61'].includes(id)) for (const key of ['width','height']) expect(Math.abs(actual[key]-expected[key]),`${id} ${key}`).toBeLessThan(.6);
    }
  }
  await expect(page.locator('.project-card')).toHaveCount(2);
  if (page.viewportSize().width===1440) {
    for (const [id,selector] of [
      ['619:117','.project-card--obayashi .project-card__link'],['619:122','.project-card--pointly .project-card__link'],
      ['619:118','.project-artwork__staircase'],['619:129','.project-artwork__laptop-crop'],
      ['619:132','.project-artwork__laptop'],['619:134','.project-artwork__screen-crop'],['619:135','.project-artwork__screen'],
    ]) {
      const source=geometry.nodes.find(n=>n.id===id), actual=await page.locator(selector).boundingBox();
      for (const key of ['x','y','width','height']) expect(Math.abs(actual[key]-source[key]),`${id} ${key}`).toBeLessThan(.6);
    }
    expect((await page.locator('.site-footer').boundingBox()).y).toBeCloseTo(geometry.height,1);
    await expect(page.locator('.ux-page__grid')).toHaveCSS('column-gap','46px');
  }
  await expect(page.locator('.project-artwork--pointly')).toHaveCSS('background-color','rgb(136, 207, 253)');
});

test('all six reused image and mask files are exact matches for the current Figma exports', async ({ page, request }) => {
  await ready(page);
  for (const asset of reuse.assets) {
    const original=await file(`${archive}source-assets/${asset.source}`);
    const reused=await file(asset.reusedFile);
    expect(original.length).toBe(asset.bytes);
    expect(hash(original)).toBe(asset.sha256);
    expect(hash(reused)).toBe(asset.sha256);
    const path=asset.reusedFile.replace(/^public/,'');
    const response=await request.get(path);
    expect(response.ok()).toBe(true);
    expect(hash(await response.body())).toBe(asset.sha256);
    if (asset.source.endsWith('.png')) {
      const image=page.locator(`.ux-page img[src="${path}"]`);
      await expect(image).toHaveCount(1);
      expect(await image.evaluate(n=>({width:n.naturalWidth,height:n.naturalHeight}))).toEqual({width:asset.width,height:asset.height});
    } else {
      expect(await page.locator('.ux-page [style*="mask"]').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).maskImage).join(' '))).toContain(path);
    }
  }
});

test('both UX cards open the correct case study by click and keyboard', async ({ page }) => {
  for (const [index,slug,title] of [[0,'obayashi','Obayashi'],[1,'pointly','Point.ly']]) {
    await ready(page);
    const link=page.locator('.ux-page .project-card__link').nth(index);
    await expect(link).toHaveAttribute('href',`/projects/${slug}/`);
    if (index===0) await link.click();
    else { await link.focus(); await page.keyboard.press('Enter'); }
    await expect(page).toHaveURL(new RegExp(`/projects/${slug}/$`));
    await expect(page.getByRole('heading',{level:1})).toHaveText(title);
    await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'UX',exact:true}).click();
    await expect(page.getByRole('heading',{level:1})).toHaveText('Selected Case Studies');
  }
});

test('UX cards share the home 3D focus and hover effects with reduced-motion support', async ({ page }) => {
  const styles=[];
  for (const path of ['/', '/ux/']) {
    await page.goto(path);
    const link=page.locator('.project-card__link').first();
    await link.focus();
    await expect.poll(()=>link.evaluate(n=>getComputedStyle(n).transform)).not.toBe('none');
    styles.push(await link.evaluate(n=>({pop:getComputedStyle(n).getPropertyValue('--project-card-pop'),shadow:getComputedStyle(n).getPropertyValue('--project-card-shadow')})));
    if (await page.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches)) {
      await link.evaluate(n=>n.blur());
      await link.hover();
      await expect.poll(()=>link.evaluate(n=>getComputedStyle(n).transform)).not.toBe('none');
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(link).toHaveCSS('transform','none');
    await page.emulateMedia({reducedMotion:'no-preference'});
  }
  expect(styles[0]).toEqual(styles[1]);
});

test('UX reflows across phone, tablet and desktop widths without broken media or overflow', async ({ page }) => {
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`);});
  for (const width of [320,390,768,1024,1440,1920]) {
    await page.setViewportSize({width,height:1000});
    await ready(page);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const cards=await page.locator('.project-card__link').all();
    for (const card of cards) {
      const bounds=await card.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x+bounds.width).toBeLessThanOrEqual(width);
      expect(bounds.width).toBeCloseTo(bounds.height,1);
      await expect(card).toHaveCSS('border-radius','16px');
    }
    const first=await cards[0].boundingBox(),second=await cards[1].boundingBox();
    if(width<768) expect(second.y).toBeGreaterThan(first.y+first.height);
    else expect(second.y).toBeCloseTo(first.y,1);
    for(const image of await page.locator('.ux-page img').all()) expect(await image.evaluate(n=>n.complete&&n.naturalWidth>0)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('UX supports direct loads, reloads, index URLs and deployments below a subdirectory', async ({ page,request,baseURL }) => {
  for(const path of ['/ux/','/ux/index.html']) {
    await ready(page,path);
    await page.reload();
    await expect(page).toHaveTitle('UX / Kiana George');
    expect((await request.get(path)).ok()).toBe(true);
  }
  await page.route('**/portfolio/**',async route=>{
    const url=new URL(route.request().url());
    const response=await request.get(`${baseURL}${url.pathname.replace('/portfolio/','/')}${url.search}`);
    await route.fulfill({response});
  });
  await ready(page,'/portfolio/ux/');
  await expect(page.locator('.ux-page .project-card__link').first()).toHaveAttribute('href','/portfolio/projects/obayashi/');
  await expect(page.locator('.ux-page .project-card__link').last()).toHaveAttribute('href','/portfolio/projects/pointly/');
  await expect(page.locator('.site-nav').getByRole('link',{name:'UX',exact:true})).toHaveAttribute('href','/portfolio/ux/');
  await page.getByRole('link',{name:'Kiana George home',exact:true}).click();
  await expect(page).toHaveURL(/\/portfolio\/$/);
  await expect(page.locator('.hero-section__animation')).toHaveAttribute('src','/portfolio/assets/hero-v11/animation.html');
  await expect(page.frameLocator('.hero-section__animation').locator('.orbit-donut')).toHaveCount(4);
  await expect(page.frameLocator('.hero-section__animation').getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Featured',exact:true})).toBeVisible();
});
