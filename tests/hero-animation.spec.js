import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

// Compare rendered motion to the supplied standalone animation, rather than a
// second copy of the component's keyframes. SVG SMIL has its own animation clock.
async function sample(svg, seconds) {
  return svg.evaluate(async (element, time) => {
    element.pauseAnimations();
    element.setCurrentTime(time);
    for (const animation of element.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = time * 1000;
    }
    await new Promise(resolve => requestAnimationFrame(resolve));
    const matrix = value => {
      const transform = new DOMMatrix(value);
      return [transform.a, transform.b, transform.c, transform.d, transform.e, transform.f];
    };
    return {
      shapes: [...element.querySelectorAll('.orbit,.ring,.threads,.data,.end,.pill,.clarity')].map(node => {
        const style = getComputedStyle(node);
        return { transform: matrix(style.transform), opacity: Number(style.opacity), duration: style.animationDuration, easing: style.animationTimingFunction };
      }),
      threads: [...element.querySelectorAll('.threads ellipse')].map(node => {
        const transform = node.transform.animVal.getItem(0).matrix;
        return [transform.a, transform.b, transform.c, transform.d, transform.e, transform.f];
      }),
    };
  }, seconds);
}

test('hero matches the original rings, labels, fades, and spirograph throughout the cycle', async ({ page }) => {
  const source = await readFile(new URL('../Assets/clarifying-chaos-solid-colors.html', import.meta.url), 'utf8');
  const reference = await page.context().newPage();
  try {
    await reference.setContent(source);
    await page.goto('/');
    const original = reference.locator('svg');
    const actual = page.locator('.hero-artwork__svg');
    for (const svg of [original, actual]) {
      await expect.poll(() => svg.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(15);
      await expect(svg.locator('.threads ellipse')).toHaveCount(25);
      await expect(svg.locator('.data text')).toHaveCount(32);
    }
    expect(await actual.locator('.ring').evaluateAll(nodes => nodes.map(node => node.getAttribute('stroke')))).toEqual(await original.locator('.ring').evaluateAll(nodes => nodes.map(node => node.getAttribute('stroke'))));
    await expect(actual.locator('.labels')).toHaveText(await original.locator('.labels').textContent());

    for (const seconds of [0, 1.2, 2.5, 4, 5.8, 6.7, 7.4, 8.2, 9.4, 9.7, 10, 12.5]) {
      const expected = await sample(original, seconds);
      const result = await sample(actual, seconds);
      expect(result.shapes.length).toBe(expected.shapes.length);
      for (let index = 0; index < expected.shapes.length; index++) {
        const shape = expected.shapes[index];
        expect(result.shapes[index].duration).toBe(shape.duration);
        expect(result.shapes[index].easing).toBe(shape.easing);
        expect(result.shapes[index].opacity, `opacity at ${seconds}s, shape ${index}`).toBeCloseTo(shape.opacity, 4);
        for (let part = 0; part < 6; part++) expect(result.shapes[index].transform[part], `transform at ${seconds}s, shape ${index}`).toBeCloseTo(shape.transform[part], 3);
      }
      for (let index = 0; index < expected.threads.length; index++) {
        for (let part = 0; part < 6; part++) expect(result.threads[index][part], `spirograph at ${seconds}s, thread ${index}`).toBeCloseTo(expected.threads[index][part], 3);
      }
    }
  } finally {
    await reference.close();
  }
});

test('page background and sticky header work on home and project pages', async ({ page }) => {
  for (const path of ['/', '/projects/pointly/', '/projects/template/', '/projects/obayashi/', '/projects/project-03/', '/projects/project-04/']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(251, 250, 247)');
    await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgb(251, 250, 247)');
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
    const header = await page.locator('.site-header').boundingBox();
    expect(header.y).toBeCloseTo(0);
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeInViewport();
    if (path === '/') {
      await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work', exact: true }).click();
      await expect.poll(() => page.locator('#work').evaluate(node => node.getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom)).toBe(true);
      await page.getByRole('link', { name: 'Kiana George home', exact: true }).click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(1);
    } else {
      await page.getByRole('navigation', { name: 'Project sections' }).getByRole('link', { name: /Research/ }).click();
      await expect.poll(() => page.locator('#research').evaluate(node => node.getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom)).toBe(true);
      if (page.viewportSize().width >= 1024) {
        const navigation = await page.locator('.case-navigation').boundingBox();
        expect(navigation.y).toBeGreaterThan(header.height);
      }
    }
  }
});
