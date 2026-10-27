import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const manifest=JSON.parse(await readFile(new URL('../public/assets/website-v4-figma/manifest.json',import.meta.url),'utf8'));
const pointly=JSON.parse(await readFile(new URL('../public/assets/website-v4-figma/pointly-design.json',import.meta.url),'utf8'));
const captionInspection=JSON.parse(await readFile(new URL('../Assets/figma files/pointly-captions-2026-10-27/inspection.json',import.meta.url),'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');

async function ready(page,path) {
  await page.goto(path);
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.evaluate(async()=>{
    await document.fonts.ready;
    for(const image of document.images)image.loading='eager';
    await Promise.all([...document.images].map(image=>image.decode()));
  });
}

test('version 4 exports are served without modifying their downloaded bytes',async({request})=>{
  const sources=new Map(Object.values(manifest.assets).flatMap(group=>Object.values(group)).map(asset=>[asset.path,asset]));
  for(const asset of sources.values()) {
    const bytes=await readFile(new URL(`../public/${asset.path}`,import.meta.url));
    expect(sha(bytes),asset.path).toBe(asset.sha256);
    const response=await request.get(`/${asset.path}`);
    expect(response.ok(),asset.path).toBe(true);
    expect(sha(await response.body()),asset.path).toBe(asset.sha256);
  }
});

test('every header and footer uses the requested yellow half circle and footer hover grey',async({page})=>{
  for(const path of ['/','/about/','/projects/obayashi/','/projects/pointly/']) {
    await ready(page,path);
    const logos=page.locator('.site-header__brand img,.site-footer__brand > img');
    await expect(logos).toHaveCount(2);
    for(const logo of await logos.all()) {
      await expect(logo).toHaveAttribute('src','/assets/brand/ki-logo-v4.svg');
      expect(await logo.evaluate(image=>{
        const c=document.createElement('canvas');c.width=57;c.height=38;
        const ctx=c.getContext('2d');ctx.drawImage(image,0,0,57,38);
        return [...ctx.getImageData(46,13,1,1).data];
      })).toEqual([239,221,18,255]);
    }
    const connect=page.locator('.site-footer__connect');
    await connect.hover();
    await expect(connect).toHaveCSS('color','rgb(197, 205, 206)');
  }
});

test('updated tiles show the complete Figma roles and keep the first and second project destinations',async({page})=>{
  await ready(page,'/');
  const cards=page.locator('.project-card__link');
  await expect(cards.nth(0)).toHaveAttribute('href','/projects/obayashi/');
  await expect(cards.nth(1)).toHaveAttribute('href','/projects/pointly/');
  await expect(cards.nth(0).locator('.project-card__roles span')).toHaveText(['Project Lead','UX research','Product Strategy','Interface Design','Visual Identity']);
  await expect(cards.nth(1).locator('.project-card__roles span')).toHaveText(['UX research','Content Strategy','Information Architecture','Website Design']);
  await expect(cards.nth(1).locator('.project-card__summary')).toHaveText('HIGH-FIDELITYPROTOTYPE');
  for(const card of await cards.all()) {
    const summary=await card.locator('.project-card__summary').boundingBox();
    const roles=await card.locator('.project-card__roles').boundingBox();
    expect(roles.y).toBeGreaterThan(summary.y+summary.height);
    await expect(card.locator('.project-card__role-rule')).toHaveCSS('border-top-style','solid');
  }
});

test('Careers 2 scrolls automatically inside the laptop, loops, and respects reduced motion',async({page})=>{
  await ready(page,'/projects/obayashi/');
  const figure=page.locator('.obayashi-careers');
  const image=figure.locator('.obayashi-laptop__webpage');
  await expect(image).toHaveAttribute('src',`/${manifest.assets.careers.imgCareers1.path}`);
  await expect(image).toHaveAttribute('data-figma-node','555:30');
  await expect(figure.locator('button,a')).toHaveCount(0);
  await expect(page.locator('.obayashi-facts dd').last()).toHaveText('Figma\nClaude');
  await expect(page.locator('.obayashi-facts dd').nth(2)).toHaveText('Project Lead\nUX research\nProduct Strategy\nInterface Design\nVisual Identity');
  const facts = page.locator('.obayashi-facts dd');
  const typography = await facts.evaluateAll(nodes => nodes.map(node => {
    const style = getComputedStyle(node);
    return [style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight];
  }));
  for (const style of typography) expect(style).toEqual(typography[0]);
  const details = await page.locator('.obayashi-project-details').boundingBox();
  const showcase = await page.locator('.obayashi-showcase').boundingBox();
  expect(showcase.y - details.y - details.height).toBeGreaterThanOrEqual(29.9);
  await figure.scrollIntoViewIfNeeded();
  await expect(image).toHaveCSS('animation-play-state','running');
  const samples=await image.evaluate(async n=>{
    const a=n.getAnimations()[0];a.pause();const positions=[];
    for(const time of [0,24000,44000,48000]) {a.currentTime=time;await new Promise(requestAnimationFrame);positions.push(new DOMMatrix(getComputedStyle(n).transform).m42);}
    const travel=parseFloat(getComputedStyle(n.parentElement).getPropertyValue('--careers-travel'));a.play();return {positions,travel};
  });
  expect(samples.travel).toBeGreaterThan(300);
  expect(samples.positions[0]).toBeCloseTo(0);
  expect(samples.positions[1]).toBeLessThan(-100);
  expect(samples.positions[2]).toBeCloseTo(-samples.travel,1);
  expect(samples.positions[3]).toBeCloseTo(0);
  await expect(figure.locator('.obayashi-laptop__viewport')).toHaveCSS('overflow','hidden');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await expect(image).toHaveCSS('animation-play-state','paused');
  await figure.scrollIntoViewIfNeeded();
  await expect(image).toHaveCSS('animation-play-state','running');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(image).toHaveCSS('animation-name','none');
  await expect(image).toHaveCSS('transform','none');
});

test('both case studies paint all native dividers and the updated Pointly research assets',async({page})=>{
  for(const [slug,count] of [['obayashi',7],['pointly',5]]) {
    await ready(page,`/projects/${slug}/`);
    const rules=page.locator(`.${slug}-rule`);
    await expect(rules).toHaveCount(count);
    for(const rule of await rules.all()) {
      await expect(rule.locator('img')).toHaveCount(0);
      await expect(rule).toHaveCSS('border-top-style','solid');
      await expect(rule).toHaveCSS('border-top-color','rgb(0, 0, 0)');
      expect(await rule.evaluate(n=>parseFloat(getComputedStyle(n).borderTopWidth)*devicePixelRatio)).toBeGreaterThanOrEqual(.999);
    }
  }
  await expect(page.locator('.pointly-competitors li img')).toHaveCount(8);
  for(const [name,asset] of Object.entries(pointly.images)) {
    const slot=page.locator(`[data-figma-asset="${name}"]`);
    const bounds=await slot.boundingBox();
    if(name.startsWith('line-') && page.viewportSize().width<1024) {expect(bounds).toBeNull();continue;}
    expect(bounds.width,name).toBeGreaterThan(0);
    expect(bounds.height,name).toBeGreaterThan(0);
    await expect(asset.path.endsWith('.svg')?slot:slot.locator('img')).toHaveAttribute('src',`/${asset.path}`);
  }
});

test('updated pages fit phone, tablet, and desktop widths with no runtime errors or broken media',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  for(const width of [320,768,1024,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const path of ['/','/about/','/projects/obayashi/','/projects/pointly/']) {
      await ready(page,path);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${path} at ${width}`).toBe(true);
      for(const image of await page.locator('img').all())expect(await image.evaluate(n=>n.complete&&n.naturalWidth>0)).toBe(true);
      if(path==='/about/') {
        const contact=await page.locator('.about-page__contact').boundingBox();
        const banner=await page.locator('.about-page__banner').boundingBox();
        expect(banner.y).toBeGreaterThanOrEqual(contact.y+contact.height);
      }
    }
  }
  expect(errors).toEqual([]);
});

test('Pointly opening image meets the blue panel bottom with no shadow below it and all three Figma captions render below their images',async({page})=>{
  await ready(page,'/projects/pointly/');
  const frame=captionInspection.nodes.find(n=>n.id==='90:18');
  const sources=captionInspection.nodes.filter(n=>['462:22','462:23','462:24'].includes(n.id));
  for(const width of [page.viewportSize().width,320,768,1024]) {
    await page.setViewportSize({width,height:1000});
    const showcase=page.locator('.pointly-showcase');
    const panel=await showcase.boundingBox();
    const opening=page.locator('.pointly-showcase__home');
    const image=await opening.boundingBox();
    const clearance=panel.y+panel.height-image.y-image.height;
    expect(Math.abs(clearance)).toBeLessThan(0.1);
    expect(image.y).toBeGreaterThan(panel.y);
    expect(image.x).toBeGreaterThan(panel.x);
    expect(image.x+image.width).toBeLessThan(panel.x+panel.width);
    await expect(opening).toHaveCSS('filter',/drop-shadow/);
    // Preserve Figma's side shadow, clipping all painted overflow at the bottom.
    await expect(showcase).toHaveCSS('overflow','hidden');
    await expect(opening.locator('button')).toHaveCSS('border-bottom-width','0px');
    const picture=await opening.locator('.pointly-picture').boundingBox();
    expect(Math.abs(panel.y+panel.height-picture.y-picture.height)).toBeLessThan(0.1);
    const rewards=page.locator('.pointly-rewards-flow');
    const bounds=await rewards.boundingBox();
    const figures=rewards.locator('figure');
    await expect(figures).toHaveCount(3);
    for(const [index,source] of sources.entries()) {
      const figure=figures.nth(index);
      const caption=figure.locator('figcaption');
      await expect(caption).toHaveText(source.text.trim());
      await expect(caption).toHaveAttribute('data-figma-node',source.id);
      await expect(caption).toHaveCSS('font-family',/^"?Inter"?, sans-serif$/);
      await expect(caption).toHaveCSS('font-size',`${source.segments[0].fontSize}px`);
      await expect(caption).toHaveCSS('font-weight','600');
      await expect(caption).toHaveCSS('font-style','normal');
      await expect(caption).toHaveCSS('line-height',`${source.segments[0].lineHeight.value}px`);
      await expect(caption).toHaveCSS('color','rgb(0, 0, 0)');
      const picture=await figure.locator('button').boundingBox();
      const text=await caption.boundingBox();
      expect(text.y-picture.y-picture.height).toBeCloseTo(14,1);
      expect(text.x-picture.x).toBeCloseTo(4,1);
      expect(text.x+text.width).toBeLessThanOrEqual(bounds.x+bounds.width);
      expect(text.y+text.height).toBeLessThan(bounds.y+bounds.height);
      if(width===1440) {
        expect(Math.abs(text.x-(source.bounds.x-frame.bounds.x))).toBeLessThan(1);
        expect(Math.abs(text.y-(source.bounds.y-frame.bounds.y))).toBeLessThan(1);
      }
      if(width<768 && index>0) {
        const previous=await figures.nth(index-1).boundingBox();
        expect(picture.y).toBeGreaterThan(previous.y+previous.height);
      }
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  const screenshot=page.getByRole('button',{name:'Enlarge Point.ly points and transfer options',exact:true});
  await screenshot.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(screenshot).toBeFocused();
});
