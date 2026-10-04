import { useEffect } from 'react';
import { caseStudies } from '../data/caseStudies/index.js';
import { siteUrl } from '../lib/urls.js';
import CaseStudyHero from '../components/CaseStudyHero/CaseStudyHero.jsx';
import CaseStudyNavigation from '../components/CaseStudyNavigation/CaseStudyNavigation.jsx';
import CaseStudySection from '../components/CaseStudySection/CaseStudySection.jsx';
import AboutSection from '../components/CaseStudySections/AboutSection.jsx';
import DeliverableSection from '../components/CaseStudySections/DeliverableSection.jsx';
import CompletedSection from '../components/CaseStudySections/CompletedSection.jsx';
import UserPersonaSection from '../components/CaseStudySections/UserPersonaSection.jsx';
import ResearchSection from '../components/CaseStudySections/ResearchSection.jsx';
import DesignEvolutionSection from '../components/CaseStudySections/DesignEvolutionSection.jsx';
import './CaseStudyPage.css';

const sectionComponents = { about: AboutSection, deliverable: DeliverableSection, completed: CompletedSection, persona: UserPersonaSection, research: ResearchSection, evolution: DesignEvolutionSection };

export default function CaseStudyPage({ slug, onOpenImage }) {
  const project = caseStudies[slug];
  useEffect(() => { document.title = project ? `${project.title} / Kiana George` : 'Project not found / Kiana George'; }, [project]);
  if (!project) return <div className="case-not-found"><h1>Project not found</h1><a className="text-link" href={`${siteUrl()}#work`}>Back to selected work <span aria-hidden="true">↗</span></a></div>;
  return (
    <div className="case-study">
      <CaseStudyHero project={project} onOpenImage={onOpenImage} />
      <div className="case-layout">
        <CaseStudyNavigation sections={project.sections} />
        <div className="case-content">
          {project.sections.map((section, index) => {
            const Section = sectionComponents[section.type] ?? CaseStudySection;
            return <Section key={section.id} section={section} number={index + 1} onOpenImage={onOpenImage} />;
          })}
        </div>
      </div>
      <div className="case-end"><p className="eyebrow">More ideas. More possibilities.</p><a href={`${siteUrl()}#work`}>Back to selected work <span aria-hidden="true">↗</span></a></div>
    </div>
  );
}
