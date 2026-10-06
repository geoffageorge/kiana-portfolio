import { useLayoutEffect, useRef } from 'react';
import HeroArtwork from '../HeroArtwork/HeroArtwork.jsx';
import settings from '../../data/heroArtwork.json';
import './HeroSection.css';

export default function HeroSection({ site }) {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = document.querySelector('.site-header');
    const descriptor = header.querySelector('.brand-name__descriptor');
    const updatePlacement = () => {
      // Relative coordinates keep the alignment stable while scrolling.
      const bounds = section.getBoundingClientRect();
      const title = section.querySelector('h1').getBoundingClientRect();
      const text = [...descriptor.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
      const index = text?.textContent.toUpperCase().indexOf('INSIGHTS');
      if (index >= 0) {
        const range = document.createRange();
        range.setStart(text, index + 2); // First S in INSIGHTS.
        range.setEnd(text, index + 3);
        section.style.setProperty('--hero-art-left', `${range.getBoundingClientRect().left - bounds.left + settings.placement.x}px`);
      }
      const artwork = section.querySelector('.hero-artwork').getBoundingClientRect();
      section.style.setProperty('--hero-copy-top', `${artwork.top - bounds.top + (artwork.height - title.height) / 2}px`);
    };
    updatePlacement();
    const observer = new ResizeObserver(updatePlacement);
    observer.observe(header);
    observer.observe(section.querySelector('.hero-artwork'));
    observer.observe(section.querySelector('.hero-section__copy'));
    window.addEventListener('resize', updatePlacement);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePlacement);
    };
  }, []);
  return (
    <section ref={sectionRef} className="hero-section" aria-labelledby="hero-title" style={{ '--hero-art-top-gap': `${settings.placement.y}px`, '--hero-copy-offset-y': `${settings.copyPlacement.y}px` }}>
      <div className="hero-section__copy">
        <h1 id="hero-title">{site.heroTitle.map((line) => <span className="block" key={line}>{line}</span>)}</h1>
        <p>{site.heroDescription}</p>
      </div>
      <HeroArtwork settings={settings} />
    </section>
  );
}
