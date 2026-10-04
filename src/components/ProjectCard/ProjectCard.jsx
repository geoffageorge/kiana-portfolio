import './ProjectCard.css';

export default function ProjectCard({ project, onSelect }) {
  const accessibleLabel = `View project ${project.number}: ${project.title}`;
  const contents = (
    <>
      <div className="project-card__image-wrap"><img src={project.image} alt={project.imageAlt} style={{ objectPosition: project.imagePosition ?? 'center' }} width="640" height="640" loading="lazy" decoding="async" /></div>
      <div className="project-card__caption">
        <h3>{project.title}</h3>
        <div className="project-card__details">
          <p><span>Project {project.number}</span><span className="project-card__slash" aria-hidden="true">/</span><span>{project.category}</span><span className="project-card__slash" aria-hidden="true">/</span><span>{project.status}</span></p>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </>
  );
  return (
    <article className="project-card">
      {project.caseStudyUrl
        ? <a className="project-card__link" href={project.caseStudyUrl} aria-label={accessibleLabel}>{contents}</a>
        : <button className="project-card__link" type="button" onClick={() => onSelect(project)} aria-label={accessibleLabel}>{contents}</button>}
    </article>
  );
}
