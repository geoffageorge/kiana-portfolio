import { siteUrl } from '../../lib/urls.js';
import './CaseStudyHero.css';

export default function CaseStudyHero({ project, onOpenImage }) {
  return (
    <div className="case-hero">
      <a className="case-back eyebrow" href={`${siteUrl()}#work`}><span aria-hidden="true">←</span> Back to work</a>
      <div className="case-hero__heading">
        <div><p className="eyebrow case-hero__eyebrow">{project.number} / {project.eyebrow}</p><h1>{project.title}</h1></div>
        <div className="case-hero__intro"><p className="case-hero__subtitle">{project.subtitle}</p><p className="case-hero__summary">{project.summary}</p></div>
      </div>
      <dl className="case-hero__facts">
        {project.metadata.map(fact => <div key={fact.label}><dt className="eyebrow">{fact.label}</dt><dd>{fact.value}</dd></div>)}
      </dl>
      <figure className="case-hero__visual">
        <button type="button" onClick={() => onOpenImage(project.heroImage)} aria-label={`Enlarge ${project.heroImage.alt}`}>
          <img src={project.heroImage.src} alt={project.heroImage.alt} width={project.heroImage.width ?? 1200} height={project.heroImage.height ?? 750} fetchPriority="high" />
          <span className="case-hero__enlarge" aria-hidden="true">↗</span>
        </button>
        {project.heroImage.caption && <figcaption>{project.heroImage.caption}</figcaption>}
      </figure>
    </div>
  );
}
