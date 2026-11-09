import { useEffect } from 'react';
import { journalism } from '../data/journalism.js';
import manifest from '../../public/assets/journalism-figma/manifest.json';
import { assetUrl } from '../lib/urls.js';
import '../components/ProjectCard/ProjectCard.css';
import './PortfolioSectionPages.css';

const assets = Object.fromEntries(manifest.assets.map(asset => [asset.file, asset]));
const source = file => assetUrl(`journalism-figma/${file}`);

function Feature({ feature }) {
  const { imageSlot: slot, caption } = feature;
  const image = assets[feature.image];
  const mask = assets[feature.imageMask];
  const layer = {
    left: `${slot.x / 498 * 100}%`, top: `${slot.y / feature.imageHeight * 100}%`,
    width: `${slot.width / 498 * 100}%`, height: `${slot.height / feature.imageHeight * 100}%`,
    ...(mask && { maskImage: `url("${source(feature.imageMask)}")`, maskSize: `${mask.width / slot.width * 100}% ${mask.height / slot.height * 100}%` }),
  };
  return <article className={`project-card journalism-card journalism-card--${feature.id}`} data-figma-node={feature.nodeId}>
    <a className="project-card__link" href={feature.href} target="_blank" rel="noopener noreferrer" aria-label={`Read ${feature.title} — ${feature.publication} (opens in a new tab)`}>
      <div className="journalism-card__surface" style={{ maskImage: `url("${source(feature.mask)}")` }}>
        <div className="journalism-card__image" style={{ aspectRatio: `498 / ${feature.imageHeight}` }}>
          <span className="journalism-card__image-layer" style={layer} data-figma-node={feature.imageNodeId}>
            <img src={source(feature.image)} alt={feature.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
          </span>
        </div>
        <div className="journalism-card__caption" style={{ '--caption-height': `${caption.height}px`, '--caption-top': `${caption.top}px`, '--caption-left': `${caption.left}px`, '--title-width': `${caption.titleWidth}px`, '--publication-width': `${caption.publicationWidth ?? caption.titleWidth}px`, '--title-gap': `${caption.titleGap}px` }}>
          <p data-figma-node={feature.publicationNodeId}>{feature.publication}</p>
          <h2 data-figma-node={feature.titleNodeId}>{feature.title}</h2>
        </div>
      </div>
    </a>
  </article>;
}

export default function JournalismPage() {
  useEffect(() => { document.title = 'Journalism / Kiana George'; }, []);
  return <section className="journalism-page" aria-labelledby="journalism-title" data-figma-node="607:7">
    <header className="journalism-intro">
      <p className="journalism-label" data-figma-node="607:22">{journalism.label}</p>
      <h1 id="journalism-title" data-figma-node="607:16">{journalism.title}</h1>
      <p className="journalism-description" data-figma-node="607:14">{journalism.description}</p>
    </header>
    <div className="journalism-grid">{journalism.features.map(feature => <Feature key={feature.id} feature={feature} />)}</div>
  </section>;
}
