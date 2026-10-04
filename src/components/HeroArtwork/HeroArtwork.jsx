import { useEffect, useState } from 'react';
import './HeroArtwork.css';

const labels = ['Insights', 'Research', 'Testing', 'Interviews', 'Prototyping'];

export default function HeroArtwork({ animationSrc, posterSrc }) {
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return (
    <figure className="hero-artwork" aria-label="Four blue and mint rings with orbiting lines representing the design process">
      <img className="hero-artwork__image" src={paused || reduceMotion ? posterSrc : animationSrc} alt="" width="660" height="560" fetchPriority="high" />
      {labels.map((label) => <span key={label} className={`hero-artwork__label hero-artwork__label--${label.toLowerCase()}`}>{label}</span>)}
      {!reduceMotion && <button type="button" className="hero-artwork__pause" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play hero animation' : 'Pause hero animation'} aria-pressed={paused}>{paused ? 'Play animation' : 'Pause animation'}</button>}
    </figure>
  );
}
