import { test, expect } from '@playwright/test';
test('temporary canvas boundaries and inspector controls are removed, including on old preview URLs', async ({ page }) => {
  for (const path of ['/', '/?heroDebug=1', '/?heroAlign=1']) {
    await page.goto(path);
    await expect(page.locator('.hero-artwork__boundary')).toHaveCount(0);
    await expect(page.locator('.hero-debug')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Hero canvas inspector' })).toHaveCount(0);
    await expect(page.locator('.hero-section__alignment-line,.hero-alignment')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Align Clarifying Chaos' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Center heading \+ text|Download alignment settings/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Show full animation|Reset to saved values|Download preview settings/ })).toHaveCount(0);
    await expect(page.locator('input[name="placement.x"]')).toHaveCount(0);
  }
});

test('saved framing contains moving rings, labels, and spirograph through the loop', async ({ page }) => {
  await page.goto('/');
  for (let seconds = 0; seconds <= 12; seconds += .25) {
    const outside = await page.locator('.hero-artwork__svg').evaluate(async (svg, time) => {
      svg.pauseAnimations(); svg.setCurrentTime(time);
      for (const animation of svg.getAnimations({ subtree: true })) { animation.pause(); animation.currentTime = time * 1000; }
      await new Promise(resolve => requestAnimationFrame(resolve));
      const frame = svg.getBoundingClientRect();
      const nodes = svg.querySelectorAll('.ring,.pill rect,.threads ellipse,.data text,.end');
      return [...nodes].flatMap(node => {
        const style = getComputedStyle(node), parent = getComputedStyle(node.parentElement);
        if (Number(style.opacity) < .01 || Number(parent.opacity) < .01) return [];
        const matrix = node.getScreenCTM();
        let box;
        if (['circle', 'ellipse'].includes(node.tagName)) {
          const center = new DOMPoint(Number(node.getAttribute('cx')), Number(node.getAttribute('cy'))).matrixTransform(matrix);
          const rx = Number(node.getAttribute('r') ?? node.getAttribute('rx'));
          const ry = Number(node.getAttribute('r') ?? node.getAttribute('ry'));
          const stroke = parseFloat(style.strokeWidth) / 2;
          const x = Math.hypot(rx * matrix.a, ry * matrix.c) + stroke * Math.hypot(matrix.a, matrix.c);
          const y = Math.hypot(rx * matrix.b, ry * matrix.d) + stroke * Math.hypot(matrix.b, matrix.d);
          box = { left: center.x - x, right: center.x + x, top: center.y - y, bottom: center.y + y };
        } else {
          box = node.getBoundingClientRect();
        }
        return box.left < frame.left - 1 || box.right > frame.right + 1 || box.top < frame.top - 1 || box.bottom > frame.bottom + 1
          ? [`${node.tagName}.${node.getAttribute('class') ?? ''} at ${time}s`] : [];
      });
    }, seconds);
    expect(outside).toEqual([]);
  }
});

test('the final glowing circle is native SVG, centered inside the clipped hero scene', async ({ page }) => {
  await page.goto('/');
  const svg = page.locator('.hero-artwork__svg');
  await expect(svg.locator('foreignObject')).toHaveCount(0);
  await expect(svg.locator('.end')).toHaveCount(2);
  await expect(page.locator('.hero-artwork')).toHaveCSS('overflow', 'hidden');
  await expect(svg.locator('.hero-artwork__scene')).toHaveAttribute('clip-path', /url\(.+\)/);
  const positions = await svg.evaluate(async element => {
    element.pauseAnimations(); element.setCurrentTime(8);
    for (const animation of element.getAnimations({ subtree: true })) { animation.pause(); animation.currentTime = 8000; }
    await new Promise(resolve => requestAnimationFrame(resolve));
    const canvas = element.getBoundingClientRect();
    const center = new DOMPoint(600, 450).matrixTransform(element.getScreenCTM());
    return [...element.querySelectorAll('.end')].map(node => {
      const box = node.getBoundingClientRect();
      return { centerX: (box.left + box.right) / 2, centerY: (box.top + box.bottom) / 2, expectedX: center.x, expectedY: center.y, inside: box.left >= canvas.left && box.right <= canvas.right && box.top >= canvas.top && box.bottom <= canvas.bottom };
    });
  });
  for (const ring of positions) {
    expect(ring.centerX).toBeCloseTo(ring.expectedX, 1);
    expect(ring.centerY).toBeCloseTo(ring.expectedY, 1);
    expect(ring.inside).toBe(true);
  }
});
