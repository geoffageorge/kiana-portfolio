import { useEffect } from 'react';
import content from '../../public/assets/video-v8-figma/content.json';
import { VideoPreview, BroadcastVideo } from '../components/VideoMedia/VideoMedia.jsx';
import '../components/ProjectCard/ProjectCard.css';
import './VideoPage.css';

function VideoRule({ rule }) {
  return <div className="video-rule" aria-hidden="true" data-figma-node={rule.id} style={{ '--rule-offset': `${rule.offset}px`, '--rule-weight': `${rule.strokeWeight}px` }} />;
}

function FeaturedVideo({ feature }) {
  return <section className={`video-feature video-feature--${feature.key}`} aria-labelledby={`video-${feature.key}-title`}>
    <div className="video-feature__copy">
      <h2 id={`video-${feature.key}-title`} data-figma-node={feature.heading.id}>{feature.heading.text}</h2>
      <div className="video-feature__description" data-figma-node={feature.body.id} style={{ maxWidth: `${feature.body.width}px` }}>{feature.body.text}</div>
      <a className="video-feature__button" href={feature.href} target="_blank" rel="noopener noreferrer" data-figma-node={feature.button.id} style={{ width: `${feature.button.width}px`, height: `${feature.button.height}px`, marginTop: `${feature.button.gap}px` }} aria-label={`${feature.button.label.text} (opens in a new tab)`}>
        <span data-figma-node={feature.button.label.id} style={{ width: `${feature.button.labelWidth}px` }}>{feature.button.label.text}</span>
      </a>
    </div>
    <VideoPreview feature={feature} />
  </section>;
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
