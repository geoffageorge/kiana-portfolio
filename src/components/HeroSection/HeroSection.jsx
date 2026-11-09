import { assetUrl } from '../../lib/urls.js';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">Understanding people. Shaping digital experiences.</h1>
      <iframe className="hero-section__animation" src={assetUrl('hero-v9/animation.html')} title="Kiana George: Understanding people. Shaping digital experiences." loading="eager" />
    </section>
  );
}
