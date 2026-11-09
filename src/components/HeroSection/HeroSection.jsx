import { useLayoutEffect, useRef } from 'react';
import HeroArtwork from '../HeroArtwork/HeroArtwork.jsx';
import settings from '../../data/heroArtwork.json';
import './HeroSection.css';

export default function HeroSection({ site }) {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = document.querySelector('.site-header');
    const updatePlacement = () => {
      // Relative coordinates keep the alignment stable while scrolling.
      const bounds = section.getBoundingClientRect();
      const title = section.querySelector('h1').getBoundingClientRect();
      // Preserve the existing desktop artwork position after removing the header descriptor.
      const headerLeft = header.querySelector('.site-header__inner').getBoundingClientRect().left;
      const anchorOffset = window.innerWidth <= 1100 ? 332 : 350;
      section.style.setProperty('--hero-art-left', `${headerLeft - bounds.left + anchorOffset + settings.placement.x}px`);
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
