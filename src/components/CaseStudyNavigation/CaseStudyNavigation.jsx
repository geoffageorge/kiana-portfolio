import { useEffect, useState } from 'react';
import './CaseStudyNavigation.css';

export default function CaseStudyNavigation({ sections }) {
  const [active, setActive] = useState(sections[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-5% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => { const element = document.getElementById(section.id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [sections]);
  return (
    <nav className="case-navigation" aria-label="Project sections">
      <p className="eyebrow">In this project</p>
      <ol>{sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a>
          {section.links?.map(link => <a key={link.id} className="case-navigation__child" href={`#${link.id}`}>{link.title}</a>)}
        </li>
      ))}</ol>
    </nav>
  );
}
