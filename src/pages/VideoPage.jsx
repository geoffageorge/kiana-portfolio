import { useEffect } from 'react';
import content from '../../public/assets/video-v8-figma/content.json';
import manifest from '../../public/assets/video-v8-figma/manifest.json';
import { assetUrl } from '../lib/urls.js';
import '../components/ProjectCard/ProjectCard.css';
import './VideoPage.css';

const assets = Object.fromEntries(manifest.assets.map(asset => [asset.file, asset]));
const source = file => assetUrl(`video-v8-figma/${file}`);

function VideoRule({ rule }) {
  return <div className="video-rule" aria-hidden="true" data-figma-node={rule.id} style={{ '--rule-offset': `${rule.offset}px`, '--rule-weight': `${rule.strokeWeight}px` }} />;
}

function FeaturedVideo({ feature }) {
  const asset = assets[feature.image.file];
  return <section className={`video-feature video-feature--${feature.key}`} aria-labelledby={`video-${feature.key}-title`}>
    <div className="video-feature__copy">
      <h2 id={`video-${feature.key}-title`} data-figma-node={feature.heading.id}>{feature.heading.text}</h2>
      <div className="video-feature__description" data-figma-node={feature.body.id} style={{ maxWidth: `${feature.body.width}px` }}>{feature.body.text}</div>
      <a className="video-feature__button" href={feature.href} target="_blank" rel="noopener noreferrer" data-figma-node={feature.button.id} style={{ width: `${feature.button.width}px`, height: `${feature.button.height}px`, marginTop: `${feature.button.gap}px` }} aria-label={`${feature.button.label.text} (opens in a new tab)`}>
        <span data-figma-node={feature.button.label.id} style={{ width: `${feature.button.labelWidth}px` }}>{feature.button.label.text}</span>
      </a>
    </div>
    <article className="project-card video-feature__preview">
      <a className="project-card__link project-card__link--image-only" href={feature.href} target="_blank" rel="noopener noreferrer" data-prototype-node={feature.prototypeId} aria-label={`Open ${feature.title.text} (opens in a new tab)`}>
        <div className="video-feature__poster project-card__motion" style={{ width: `calc(100% + ${feature.image.width - 588}px)`, aspectRatio: `${feature.image.width} / ${feature.image.height}` }}>
          <img className="video-feature__thumbnail" data-figma-node={feature.image.id} src={source(feature.image.file)} alt={feature.title.text} width={asset.width} height={asset.height} decoding="async" />
          <img className="video-feature__play" data-figma-node={feature.play.id} src={source('play-button.svg')} alt="" aria-hidden="true" width={feature.play.width} height={feature.play.height} style={{ left: `${feature.play.x / feature.image.width * 100}%`, top: `${feature.play.y / feature.image.height * 100}%`, width: `${feature.play.width / feature.image.width * 100}%` }} />
        </div>
        <h3 className="video-feature__title" data-figma-node={feature.title.id} style={{ maxWidth: `${feature.title.width}px`, minHeight: `${feature.title.minHeight}px`, marginTop: `${feature.title.gap}px`, marginLeft: `${feature.title.left}px` }}>{feature.title.text}</h3>
      </a>
    </article>
  </section>;
}

function BroadcastVideo({ story }) {
  const { image, caption, background } = story;
  const asset = assets[image.file];
  return <article className={`project-card video-card video-card--${story.key}`} data-figma-node={story.id} style={{ '--card-shift': `${story.shift}px` }}>
    <a className="project-card__link" href={story.href} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${story.title.text.replace(/\n/g, ' ')} — ${story.publication.text} (opens in a new tab)`}>
      <div className="video-card__surface" style={{ maskImage: `url("${source(story.mask)}")` }}>
        <div className="video-card__image" style={{ aspectRatio: `382 / ${image.visibleHeight}`, background: image.background }}>
          <span className="video-card__image-layer" data-figma-node={image.id} style={{ left: `${image.x / 382 * 100}%`, top: `${image.y / image.visibleHeight * 100}%`, width: `${image.width / 382 * 100}%`, height: `${image.height / image.visibleHeight * 100}%` }}>
            <img src={source(image.file)} alt={story.title.text.replace(/\n/g, ' ')} width={asset.width} height={asset.height} loading="lazy" decoding="async" />
          </span>
          <img className="video-card__play" data-figma-node={story.play.id} src={source('play-button.svg')} alt="" aria-hidden="true" width={story.play.width} height={story.play.height} style={{ left: `${story.play.x / 382 * 100}%`, top: `${story.play.y / image.visibleHeight * 100}%`, width: `${story.play.width / 382 * 100}%` }} />
        </div>
        <div className="video-card__caption" style={{ minHeight: `${caption.minHeight}px`, paddingTop: `${caption.top}px`, paddingLeft: `${caption.left}px` }}>
          {background.file
            ? <img className="video-card__background" data-figma-node={background.id} aria-hidden="true" alt="" src={source(background.file)} width={background.width} height={background.height} style={{ left: `${background.x / 382 * 100}%`, width: `${background.width / 382 * 100}%`, minHeight: `${background.height}px` }} />
            : <span className="video-card__background" data-figma-node={background.id} aria-hidden="true" style={{ left: `${background.x / 382 * 100}%`, width: `${background.width / 382 * 100}%`, minHeight: `${background.height}px` }} />}
          <p data-figma-node={story.publication.id} style={{ maxWidth: `${story.publication.width}px`, height: `${story.publication.height}px`, left: `${caption.publicationShift}px` }}>{story.publication.text}</p>
          <h3 data-figma-node={story.title.id} style={{ maxWidth: `${story.title.width}px`, marginTop: `${caption.titleGap}px` }}>{story.title.text}</h3>
        </div>
      </div>
    </a>
  </article>;
}

export default function VideoPage() {
  useEffect(() => { document.title = 'Video / Kiana George'; }, []);
  return <article className="video-page" aria-labelledby="video-title" data-figma-node={content.frameId}>
    <h1 id="video-title" className="video-page__label" data-figma-node={content.label.id}>{content.label.text}</h1>
    <FeaturedVideo feature={content.features[0]} />
    <VideoRule rule={content.rules[0]} />
    <FeaturedVideo feature={content.features[1]} />
    <VideoRule rule={content.rules[1]} />
    <section className="video-broadcast" aria-labelledby="video-broadcast-title">
      <h2 id="video-broadcast-title" data-figma-node={content.broadcast.heading.id}>{content.broadcast.heading.text}</h2>
      <p className="video-broadcast__description" data-figma-node={content.broadcast.description.id}>{content.broadcast.description.text}</p>
      <div className="video-grid">{content.broadcast.stories.map(story => <BroadcastVideo key={story.key} story={story} />)}</div>
    </section>
  </article>;
}
