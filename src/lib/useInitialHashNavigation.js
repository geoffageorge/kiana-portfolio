import { useEffect } from 'react';

// Initial fragments can be processed before React renders their target. This
// also covers anchors inside a lazy-loaded project page, after fonts settle.
export function useInitialHashNavigation() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    let cancelled = false;
    let observer;
    const scrollToTarget = () => {
      const target = document.getElementById(id);
      if (!target) return false;
      document.fonts.ready.then(() => requestAnimationFrame(() => {
        if (!cancelled && window.location.hash === hash) target.scrollIntoView({ behavior: 'instant', block: 'start' });
      }));
      return true;
    };
    if (!scrollToTarget()) {
      observer = new MutationObserver(() => { if (scrollToTarget()) observer.disconnect(); });
      observer.observe(document.getElementById('root'), { childList: true, subtree: true });
    }
    return () => { cancelled = true; observer?.disconnect(); };
  }, []);
}
