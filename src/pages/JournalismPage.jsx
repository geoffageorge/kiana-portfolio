import { useEffect } from 'react';
import { journalism } from '../data/journalism.js';
import content from '../../public/assets/journalism-v10-figma/content.json';
import manifest from '../../public/assets/journalism-figma/manifest.json';
import { VideoPreview, BroadcastVideo } from '../components/VideoMedia/VideoMedia.jsx';
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
          <h3 data-figma-node={feature.titleNodeId}>{feature.title}</h3>
        </div>
      </div>
    </a>
  </article>;
}

export default function JournalismPage() {
  useEffect(() => { document.title = 'Journalism / Kiana George'; }, []);
  const feature = content.multimedia;
  const rule = index => <div className="journalism-rule" aria-hidden="true" data-figma-node={content.rules[index].id} style={{ '--rule-offset': `${content.rules[index].offset}px`, '--rule-weight': `${content.rules[index].strokeWeight}px` }} />;
  return <article className="journalism-page" aria-labelledby="journalism-title" data-figma-node={content.frameId}>
    <h1 id="journalism-title" className="journalism-label" data-figma-node={content.label.id}>{content.label.text}</h1>
    <section className="journalism-written" aria-labelledby="written-articles-title">
      <header className="journalism-intro">
        <h2 id="written-articles-title" data-figma-node={content.written.heading.id}>{content.written.heading.text}</h2>
        <p className="journalism-description" data-figma-node={content.written.description.id}>{content.written.description.text}</p>
      </header>
      <div className="journalism-grid">{journalism.features.map(feature => <Feature key={feature.id} feature={feature} />)}</div>
    </section>
    {rule(0)}
    <section className="journalism-multimedia" aria-labelledby="multimedia-journalism-title">
      <div className="journalism-multimedia__copy">
        <h2 id="multimedia-journalism-title" data-figma-node={feature.heading.id}>{feature.heading.text}</h2>
        <div className="journalism-multimedia__description" data-figma-node={feature.body.id}>{feature.body.text}</div>
        <a className="journalism-multimedia__button" href={feature.href} target="_blank" rel="noopener noreferrer" data-figma-node={feature.button.id} aria-label={`${feature.button.label.text} (opens in a new tab)`}>
          <span data-figma-node={feature.button.label.id}>{feature.button.label.text}</span>
        </a>
      </div>
      <VideoPreview feature={feature} referenceWidth={508} />
    </section>
    {rule(1)}
    <section className="journalism-broadcast" aria-labelledby="broadcast-journalism-title">
      <h2 id="broadcast-journalism-title" data-figma-node={content.broadcast.heading.id}>{content.broadcast.heading.text}</h2>
      <p className="journalism-broadcast__description" data-figma-node={content.broadcast.description.id}>{content.broadcast.description.text}</p>
      <div className="journalism-broadcast__grid">{content.broadcast.stories.map(story => <BroadcastVideo key={story.key} story={story} />)}</div>
    </section>
  </article>;
}
