import HeroArtwork from '../HeroArtwork/HeroArtwork.jsx';
import './HeroSection.css';

export default function HeroSection({ site }) {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__copy">
        <h1 id="hero-title">{site.heroTitle.map((line) => <span className="block" key={line}>{line}</span>)}</h1>
        <p>{site.heroDescription}</p>
      </div>
      <HeroArtwork />
    </section>
  );
}
