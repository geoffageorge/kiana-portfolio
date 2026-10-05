import { useState } from 'react';
import HeroArtwork from '../HeroArtwork/HeroArtwork.jsx';
import HeroArtworkControls from '../HeroArtworkControls/HeroArtworkControls.jsx';
import defaults from '../../data/heroArtwork.json';
import { validateHeroSettings } from '../../lib/heroArtworkSettings.js';
import './HeroSection.css';

export default function HeroSection({ site }) {
  const storageKey = 'kiana-hero-artwork';
  const [settings, setSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved?.defaults === JSON.stringify(defaults)) return validateHeroSettings(saved.settings);
    } catch { /* Unavailable or outdated browser settings use the site defaults. */ }
    return defaults;
  });
  const updateSettings = (next) => {
    setSettings(next);
    try { localStorage.setItem(storageKey, JSON.stringify({ defaults: JSON.stringify(defaults), settings: next })); }
    catch { /* Live controls still work when browser storage is unavailable. */ }
  };
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__copy">
        <h1 id="hero-title">{site.heroTitle.map((line) => <span className="block" key={line}>{line}</span>)}</h1>
        <p>{site.heroDescription}</p>
      </div>
      <HeroArtwork settings={settings} />
      <HeroArtworkControls settings={settings} defaults={defaults} onChange={updateSettings} />
    </section>
  );
}
