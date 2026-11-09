import { test, expect } from '@playwright/test';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const file=path=>readFile(new URL(`../${path}`,import.meta.url));
const archive='Assets/archived pages/video-v6-before-v8-2026-11-09/';
const archived=JSON.parse(await file(`${archive}archive-manifest.json`));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');

test('the previous Video page is archived intact and excluded from the production output',async({request})=>{
  expect(archived.files).toHaveLength(17);
  for(const item of archived.files){
    const bytes=await file(archive+item.file);
    expect(bytes.length,item.file).toBe(item.bytes);
    expect(sha(bytes),item.file).toBe(item.sha256);
  }
  expect(await stat(new URL('../dist/assets/video-figma/',import.meta.url)).catch(()=>null)).toBeNull();
  const response=await request.get('/video/');
  expect(response.ok()).toBe(true);
  const old=await request.get('/assets/video-figma/obayashi-culture.png');
  // Vite preview may return its HTML fallback for a removed asset URL.
  expect(old.headers()['content-type']).not.toContain('image/png');
  expect(sha(await old.body())).not.toBe(archived.files.find(f=>f.file==='runtime-assets/obayashi-culture.png').sha256);
});

test('Journalism, UX and all Video 2 section headings use 32px on desktop and phones',async({page})=>{
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:1000});
    for(const [path,selector]of[['/journalism/','#journalism-title'],['/ux/','#ux-title'],['/video/','.video-page h2']]){
      await page.goto(path);
      await expect(page.locator(selector).first()).toBeVisible();
      for(const heading of await page.locator(selector).all())await expect(heading).toHaveCSS('font-size','32px');
    }
  }
});

test('every linked tile uses the same subtle Apple-scale focus, hover and press feedback',async({page})=>{
  for(const path of ['/','/ux/','/journalism/','/video/']){
    await page.goto(path);
    await expect(page.locator('.project-card__link').first()).toBeVisible();
    const links=page.locator('.project-card__link');
    const samples=[links.first(),links.last()];
    for(const link of samples){
      await link.scrollIntoViewIfNeeded();
      const imageOnly=await link.evaluate(n=>n.classList.contains('project-card__link--image-only'));
      const surface=imageOnly?link.locator('.project-card__motion'):link;
      // Establish keyboard modality after the preceding pointer/press check.
      await page.keyboard.press('Tab');
      await link.focus();
      await expect.poll(()=>surface.evaluate(n=>Number(new DOMMatrix(getComputedStyle(n).transform).a.toFixed(3)))).toBe(1.01);
      await expect.poll(()=>surface.evaluate(n=>getComputedStyle(n).boxShadow)).toContain('2px 4px 16px');
      const style=await surface.evaluate(n=>{
        const s=getComputedStyle(n),m=new DOMMatrix(s.transform);
        return{b:m.b,c:m.c,e:m.e,f:m.f,timing:s.transitionTimingFunction,duration:s.transitionDuration,shadow:s.boxShadow};
      });
      for(const key of ['b','c','e','f'])expect(style[key]).toBeCloseTo(0,3);
      expect(style.timing).toContain('cubic-bezier(0, 0, 0.5, 1)');
      expect(style.duration).toContain('0.3s');
      expect(style.shadow).toContain('2px 4px 16px');
      await link.blur();
      if(await page.evaluate(()=>matchMedia('(hover:hover) and (pointer:fine)').matches)){
        await link.hover();
        await expect.poll(()=>surface.evaluate(n=>Number(new DOMMatrix(getComputedStyle(n).transform).a.toFixed(3)))).toBe(1.01);
      }
      await page.mouse.move(0,0);
      await expect.poll(()=>surface.evaluate(n=>Number(new DOMMatrix(getComputedStyle(n).transform).a.toFixed(3)))).toBe(1);
      // Cancel native focus's smooth scrolling before choosing a press target.
      await link.evaluate(async node=>{node.scrollIntoView({behavior:'instant',block:'center'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
      const point=await link.evaluate(node=>{
        const r=node.getBoundingClientRect(),header=document.querySelector('.site-header').getBoundingClientRect();
        const x=r.x+r.width/2,y=(Math.max(r.y,header.bottom)+Math.min(r.bottom,innerHeight))/2;
        return{x,y,hitsLink:node.contains(document.elementFromPoint(x,y))};
      });
      expect(point.hitsLink,`${path}: press reaches the visible link below the sticky header`).toBe(true);
      await page.mouse.move(point.x,point.y);
      await page.mouse.down();
      await expect.poll(()=>surface.evaluate(n=>Number(new DOMMatrix(getComputedStyle(n).transform).a.toFixed(3)))).toBe(1.01);
      await page.mouse.move(0,0);await page.mouse.up();
      await page.emulateMedia({reducedMotion:'reduce'});
      await link.focus();
      await expect(surface).toHaveCSS('transform','none');
      expect(await surface.evaluate(n=>parseFloat(getComputedStyle(n).transitionDuration))).toBeLessThanOrEqual(.001);
      await link.blur();await page.emulateMedia({reducedMotion:'no-preference'});
    }
  }
});
