import { test, expect } from '@playwright/test';
import settings from '../Assets/heroArtwork-1.json' with { type: 'json' };

test('saved artwork settings are fixed and old browser overrides are ignored', async ({ page }) => {
  await page.addInitScript(values => localStorage.setItem('kiana-hero-artwork', JSON.stringify({
    defaults: JSON.stringify(values), settings: { ...values, viewBox: { x: -600, y: -450, width: 600, height: 1800 } },
  })), settings);
  await page.goto('/');
  await expect(page.locator('.hero-artwork__svg')).toHaveAttribute('viewBox', '50 0 1000 900');
  await expect(page.getByText('Adjust hero artwork')).toHaveCount(0);
  expect(await page.locator('.hero-artwork').evaluate(node => ({
    width: node.style.maxWidth,
    x: node.style.getPropertyValue('--hero-offset-x'),
    y: node.style.getPropertyValue('--hero-offset-y'),
    labelX: node.querySelector('.pill').style.getPropertyValue('--px'),
  }))).toEqual({ width: '960px', x: '200px', y: '200px', labelX: '-30px' });
  expect(await page.locator('.ring').evaluateAll(nodes => nodes.map(node => node.getAttribute('stroke'))))
    .toEqual(['#9cbabc', '#e5ef18', '#afddb1', '#5fd1d3']);
  await page.reload();
  await expect(page.locator('.hero-artwork__svg')).toHaveAttribute('viewBox', '50 0 1000 900');
});

test('artwork aligns with the desktop brand and stays clear on responsive layouts', async ({ page }) => {
  for (const width of [320, 393, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const bounds = await page.evaluate(() => {
      const rect = selector => document.querySelector(selector).getBoundingClientRect().toJSON();
      const descriptor = document.querySelector('.site-header .brand-name__descriptor');
      const text = [...descriptor.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
      const index = text.textContent.toUpperCase().indexOf('INSIGHTS') + 2;
      const range = document.createRange(); range.setStart(text, index); range.setEnd(text, index + 1);
      return { art: rect('.hero-artwork__svg'), title: rect('#hero-title'), paragraph: rect('.hero-section__copy p'), header: rect('.site-header'), work: rect('#work'), s: range.getBoundingClientRect().left, scrollWidth: document.documentElement.scrollWidth };
    });
    expect(bounds.art.top).toBeGreaterThan(bounds.header.bottom);
    expect(bounds.art.bottom).toBeLessThan(bounds.work.top);
    expect(bounds.art.left).toBeGreaterThanOrEqual(0);
    expect(bounds.art.right).toBeLessThanOrEqual(width);
    expect(bounds.scrollWidth).toBeLessThanOrEqual(width);
    if (width < 1024) {
      expect(bounds.art.top).toBeGreaterThan(bounds.paragraph.bottom);
    } else {
      expect(bounds.art.left).toBeCloseTo(bounds.s + settings.placement.x, 1);
      expect(bounds.art.top + bounds.art.height / 2).toBeCloseTo(bounds.title.top + bounds.title.height / 2, 1);
      // The requested viewBox extends into the copy column, but its transparent
      // area contains no artwork there. Check the actual visible shapes.
      for (const seconds of [0, 2.5, 5, 7.8, 10.2]) {
        const overlaps = await page.locator('.hero-artwork__svg').evaluate(async (svg, time) => {
          svg.pauseAnimations(); svg.setCurrentTime(time);
          for (const animation of svg.getAnimations({ subtree: true })) { animation.pause(); animation.currentTime = time * 1000; }
          await new Promise(resolve => requestAnimationFrame(resolve));
          // Text containers include empty space to the right of shorter lines.
          // Check the rendered text fragments so that only text collisions fail.
          const copy = ['#hero-title', '.hero-section__copy p'].flatMap(selector => {
            const walker = document.createTreeWalker(document.querySelector(selector), NodeFilter.SHOW_TEXT);
            const boxes = [];
            while (walker.nextNode()) {
              if (!walker.currentNode.textContent.trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(walker.currentNode);
              boxes.push(...range.getClientRects());
            }
            return boxes;
          });
          return [...svg.querySelectorAll('.threads ellipse,.ring,.pill,.end,.clarity')].some(node => {
            if (Number(getComputedStyle(node).opacity) < .01 || Number(getComputedStyle(node.parentElement).opacity) < .01) return false;
            const shape = node.getBoundingClientRect();
            return copy.some(text => shape.left < text.right && shape.right > text.left && shape.top < text.bottom && shape.bottom > text.top);
          });
        }, seconds);
        expect(overlaps, `visible artwork stays clear of copy at ${width}px / ${seconds}s`).toBe(false);
      }
      // A resize while scrolled must retain the initial-load placement.
      await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
      await page.setViewportSize({ width: width + 1, height: 1000 });
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await expect.poll(() => page.locator('.hero-artwork__svg').evaluate(svg => svg.getBoundingClientRect().top)).toBeCloseTo(bounds.art.top, 1);
    }
  }
});

test('white pages, dividing rules, and transparent logos appear throughout the site', async ({ page }) => {
  for (const path of ['/', '/projects/pointly/', '/projects/template/', '/projects/obayashi/', '/projects/project-03/', '/projects/project-04/']) {
    await page.goto(path);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    const logos = page.locator('.brand-logo');
    await expect(logos).toHaveCount(2);
    for (const logo of await logos.all()) {
      await expect(logo).toHaveAttribute('src', '/assets/brand/ki-logo.png');
      await logo.evaluate(image => image.decode());
      const size = await logo.boundingBox();
      expect(size.width).toBe(page.viewportSize().width < 768 ? 45 : 54);
      expect(size.height).toBe(page.viewportSize().width < 768 ? 30 : 36);
    }
    expect(await logos.first().evaluate(image => {
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
      return [[0, 0], [.5, .5], [0, .5]].map(([x, y]) => context.getImageData(Math.floor(x * canvas.width), Math.floor(y * canvas.height), 1, 1).data[3]);
    })).toEqual([0, 0, 0]);
    if (path === '/') {
      await expect(page.locator('.selected-work__grid')).toHaveCSS('gap', 'normal');
      for (const card of await page.locator('.project-card').all()) await expect(card).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(page.locator('.project-card').first()).toHaveCSS('border-bottom-color', 'rgb(223, 222, 219)');
    }
  }
});
