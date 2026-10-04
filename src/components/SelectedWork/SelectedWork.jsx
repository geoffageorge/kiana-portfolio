import SectionHeading from '../SectionHeading/SectionHeading.jsx';
import ProjectCard from '../ProjectCard/ProjectCard.jsx';
import './SelectedWork.css';

export default function SelectedWork({ projects, onSelect }) {
  return (
    <section className="selected-work" id="work" aria-labelledby="work-title">
      <SectionHeading id="work-title" title="Select Work" subtitle="Case studies" />
      <div className="selected-work__grid">{projects.map((project) => <ProjectCard key={project.id} project={project} onSelect={onSelect} />)}</div>
    </section>
  );
}
