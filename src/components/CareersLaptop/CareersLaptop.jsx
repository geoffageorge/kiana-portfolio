import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../../lib/urls.js';

// Unchanged Figma PNGs; the display occupies (180,37,1604,1039) in the 1964×1196 laptop.
export default function CareersLaptop({ assets, caption }) {
  const figureRef = useRef(null);
  const viewportRef = useRef(null);
  const pageRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [ready, setReady] = useState(false);
  const laptop = assets.laptop;
  const careers = assets.careers;
  const source = name => assetUrl(`obayashi-figma/${assets[name].file}`);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(motion.matches);
    const updateVisibility = () => setTabVisible(!document.hidden);
    updateMotion();
    motion.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(figureRef.current);
    const measure = () => {
      const image = pageRef.current;
      const viewport = viewportRef.current;
      if (image.naturalWidth) {
        viewport.style.setProperty('--careers-travel', `${Math.max(0, image.getBoundingClientRect().height - viewport.clientHeight)}px`);
        setReady(true);
      }
    };
    const resize = new ResizeObserver(measure);
    resize.observe(viewportRef.current);
    resize.observe(pageRef.current);
    const image = pageRef.current;
    image.addEventListener('load', measure);
    measure();
    return () => { observer.disconnect(); resize.disconnect(); image.removeEventListener('load', measure); motion.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);

  return <figure ref={figureRef} className="obayashi-careers" aria-label="Obayashi Careers page scrolling on a laptop">
    <div className="obayashi-laptop" data-figma-node="466:28">
      <img className="obayashi-laptop__hardware" src={source('laptop')} width={laptop.width} height={laptop.height} alt="Laptop displaying Obayashi’s redesigned Careers webpage" loading="lazy" decoding="async" data-figma-asset="laptop" />
      <div className="obayashi-laptop__screen" aria-hidden="true">
        <div className="obayashi-laptop__toolbar"><span className="obayashi-laptop__dots"><i /><i /><i /></span><span className="obayashi-laptop__address">obayashi.com / careers</span></div>
        <div ref={viewportRef} className="obayashi-laptop__viewport">
          <img ref={pageRef} className="obayashi-laptop__webpage" src={source('careers')} width={careers.width} height={careers.height} alt="" loading="lazy" decoding="async" style={{ animationPlayState: visible && tabVisible && ready && !reduced ? 'running' : 'paused' }} data-figma-node="466:30" data-figma-asset="careers" />
        </div>
      </div>
    </div>
    <figcaption data-figma-node="478:34">{caption}</figcaption>
  </figure>;
}
