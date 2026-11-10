// Deterministic state comparison only; real autoplay has its own independent test.
export function installSourceClock() {
  window.__heroTime = 0;
  // Firefox can replace the iframe's performance instance during navigation.
  // Override the prototype so both documents retain the same synthetic clock.
  Object.defineProperty(Performance.prototype, 'now', { configurable: true, value: () => window.__heroTime });
  window.requestAnimationFrame = callback => { window.__heroDraw = callback; return 1; };
  window.cancelAnimationFrame = () => {};
  window.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; }
    observe(target) { this.callback([{ isIntersecting: true, target }]); }
    disconnect() {}
  };
}

export function sampleSourceState(scene, seconds) {
  window.__heroTime = seconds * 1000;
  window.__heroDraw(window.__heroTime);
  const properties = ['transform', 'opacity', 'width', 'height', 'borderRadius', 'backgroundImage', 'fontSize', 'clipPath'];
  return [...scene.querySelectorAll('.orbit-donut,.label,.merged,.merge-hole,.headline-mask,.headline-row,h1,.subhead')].map(node => {
    const style = getComputedStyle(node);
    return { className: node.className, text: node.matches('.label,h1,.subhead') ? node.textContent : null, ...Object.fromEntries(properties.map(key => [key, style[key]])) };
  });
}
