import manifest from '../../../public/assets/video-v8-figma/manifest.json';
import { assetUrl } from '../../lib/urls.js';
import './VideoMedia.css';

const assets = Object.fromEntries(manifest.assets.map(asset => [asset.file, asset]));
const source = file => assetUrl(`video-v8-figma/${file}`);

export function VideoPreview({ feature, referenceWidth = 588 }) {
  const asset = assets[feature.image.file];
  return <article className="project-card video-feature__preview">
      <a className="project-card__link project-card__link--image-only" href={feature.href} target="_blank" rel="noopener noreferrer" data-prototype-node={feature.prototypeId} aria-label={`Open ${feature.title.text} (opens in a new tab)`}>
        <div className="video-feature__poster project-card__motion" style={{ width: `calc(100% + ${feature.image.width - referenceWidth}px)`, aspectRatio: `${feature.image.width} / ${feature.image.height}` }}>
          <img className="video-feature__thumbnail" data-figma-node={feature.image.id} src={source(feature.image.file)} alt={feature.title.text} width={asset.width} height={asset.height} decoding="async" />
          <img className="video-feature__play" data-figma-node={feature.play.id} src={source('play-button.svg')} alt="" aria-hidden="true" width={feature.play.width} height={feature.play.height} style={{ left: `${feature.play.x / feature.image.width * 100}%`, top: `${feature.play.y / feature.image.height * 100}%`, width: `${feature.play.width / feature.image.width * 100}%` }} />
        </div>
        <h3 className="video-feature__title" data-figma-node={feature.title.id} style={{ maxWidth: `${feature.title.width}px`, minHeight: `${feature.title.minHeight}px`, marginTop: `${feature.title.gap}px`, marginLeft: `${feature.title.left}px` }}>{feature.title.text}</h3>
      </a>
    </article>;
}

export function BroadcastVideo({ story }) {
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
