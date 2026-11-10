import { test, expect } from '@playwright/test';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const file=path=>readFile(new URL(`../${path}`,import.meta.url));
const hash=data=>createHash('sha256').update(data).digest('hex');
const manifest=JSON.parse(await file('public/assets/hero-v11/manifest.json'));

test('the reviewed Hero 3 files produce an eager accessible runtime with no playback controls',async({page,request})=>{
  expect(manifest.sourceFiles).toHaveLength(6);
  for(const asset of manifest.sourceFiles){
    const source=await file(`${manifest.sourceFolder}/${asset.file}`);
    expect(source.length).toBe(asset.bytes);expect(hash(source)).toBe(asset.sha256);
  }
  const runtime=await file('public/assets/hero-v11/animation.html');
  expect(hash(runtime)).toBe(manifest.runtime.sha256);
  const response=await request.get('/assets/hero-v11/animation.html');
  expect(response.ok()).toBe(true);expect(response.headers()['content-type']).toContain('text/html');
  expect(hash(await response.body())).toBe(manifest.runtime.sha256);
  await page.goto('/');
  await expect(page.locator('.hero-section__animation')).toHaveAttribute('loading','eager');
  await expect(page.locator('.hero-section__animation')).toHaveAttribute('title','Kiana George: Understanding people. Shaping digital experiences.');
  await expect(page.locator('#hero-title')).toHaveText('Understanding people. Shaping digital experiences.');
  const frame=page.frameLocator('.hero-section__animation');
  await expect(frame.locator('#kg-expanding-circles')).toHaveCount(1);
  await expect(frame.locator('.spiro,svg,.focus-word,.supporting-word')).toHaveCount(0);
  await expect(frame.getByRole('button')).toHaveCount(0);
  await expect(frame.locator('.replay,video,audio,input')).toHaveCount(0);
  await expect(frame.locator('.orbit-donut .label')).toHaveText(['GATHER','CONNECT','SYNTHESIZE','SHAPE']);
});

test('the hero autoplays on initial load, finishes without controls, rests on the message and restarts on reload',async({page})=>{
  test.setTimeout(40000);
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  const frame=page.frameLocator('.hero-section__animation');
  const ring=frame.locator('.orbit-donut').first();
  await expect(ring).toHaveCSS('opacity','1');
  const start=await ring.evaluate(n=>n.style.transform);
  await expect.poll(()=>ring.evaluate(n=>n.style.transform)).not.toBe(start);
  await expect(frame.locator('.subhead')).toHaveCSS('opacity','1',{timeout:12000});
  await expect(ring).toHaveCSS('opacity','0');
  expect(await frame.locator('.headline-mask').evaluate(n=>n.style.clipPath.startsWith('inset(0%'))).toBe(true);
  await expect(frame.locator('h1')).toHaveText('Understanding people.Shaping digital experiences.');
  await expect(frame.getByRole('button')).toHaveCount(0);
  await page.waitForTimeout(1000);
  const settled=await frame.locator('.merged').evaluate(n=>({width:n.style.width,height:n.style.height,opacity:n.style.opacity}));
  await page.waitForTimeout(200);
  expect(await frame.locator('.merged').evaluate(n=>({width:n.style.width,height:n.style.height,opacity:n.style.opacity}))).toEqual(settled);
  await page.reload();
  await expect(ring).toHaveCSS('opacity','1');
  const before=await ring.evaluate(n=>n.style.transform);
  await expect.poll(()=>ring.evaluate(n=>n.style.transform)).not.toBe(before);
  await expect(frame.locator('.subhead')).toHaveCSS('opacity','1',{timeout:12000});
  await expect(ring).toHaveCSS('opacity','0');
  await expect(frame.getByRole('button')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('reduced motion shows the final message immediately without movement or controls',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  const frame=page.frameLocator('.hero-section__animation');
  await expect(frame.locator('.subhead')).toHaveCSS('opacity','1');
  expect(await frame.locator('.orbit-donut').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).opacity==='0'))).toBe(true);
  const before=await frame.locator('.headline-mask').evaluate(n=>n.style.clipPath);
  await page.waitForTimeout(200);
  expect(await frame.locator('.headline-mask').evaluate(n=>n.style.clipPath)).toBe(before);
  expect(before.startsWith('inset(0%')).toBe(true);
  await expect(frame.getByRole('button')).toHaveCount(0);
});

test('the standalone no-JavaScript fallback keeps both headline lines and the subheading readable',async({browser,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  try{
    for(const width of [280,350,1180]){
      await page.setViewportSize({width,height:width<=480?460:560});
      await page.goto(`${baseURL}/assets/hero-v11/animation.html`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.subhead')).toHaveCSS('opacity','1');
      expect(await page.locator('.headline-row').evaluateAll(nodes=>nodes.every(n=>n.scrollWidth<=n.clientWidth+1))).toBe(true);
      await expect(page.getByRole('button')).toHaveCount(0);
    }
  }finally{await context.close();}
});

test('Hero section version 2 old and the earlier archive retain their original bytes outside the build',async()=>{
  const outgoing='Assets/archived pages/Hero section version 2 old/';
  const archive=JSON.parse(await file(outgoing+'archive-manifest.json'));
  expect(archive.name).toBe('Hero section version 2 old');
  expect(archive.files).toHaveLength(9);
  for(const item of archive.files){
    const bytes=await file(outgoing+item.file);
    expect(bytes.length).toBe(item.bytes);
    expect(hash(bytes)).toBe(item.sha256);
  }
  // On case-insensitive macOS, dist/Assets aliases the real dist/assets folder.
  for(const path of ['dist/assets/hero-v9/','public/assets/hero-v9/','dist/Assets/archived pages/','dist/Assets/Hero 3/']){
    expect(await stat(new URL(`../${path}`,import.meta.url)).catch(()=>null)).toBeNull();
  }
  const prefix='Assets/archived pages/hero-v7-before-v9-2026-11-09/';
  const record=JSON.parse(await file(prefix+'archive-manifest.json'));
  expect(record.files).toHaveLength(6);expect(record.renamedSourceFiles).toHaveLength(3);
  for(const item of record.files)expect(hash(await file(prefix+item.file))).toBe(item.sha256);
  for(const item of record.renamedSourceFiles)expect(hash(await file(item.file))).toBe(item.sha256);
  expect(await stat(new URL('../dist/assets/hero-v7/',import.meta.url)).catch(()=>null)).toBeNull();
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
