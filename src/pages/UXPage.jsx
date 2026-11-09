import { useEffect } from 'react';
import ProjectCard from '../components/ProjectCard/ProjectCard.jsx';
import content from '../data/ux.json';
import './UXPage.css';

export default function UXPage({ projects }) {
  useEffect(() => { document.title = 'UX / Kiana George'; }, []);
  return <article className="ux-page" aria-labelledby="ux-title" data-figma-node="619:58">
    <p className="ux-page__label" data-figma-node="619:61">{content.label}</p>
    <h1 id="ux-title" data-figma-node="619:60">{content.title}</h1>
    <p className="ux-page__description" data-figma-node="619:59">{content.description}</p>
    <div className="ux-page__grid">{projects.filter(project => project.showOnHome !== false).map(project => <ProjectCard key={project.id} project={project} />)}</div>
  </article>;
}
