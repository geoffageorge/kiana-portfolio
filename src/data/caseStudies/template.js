import { assetUrl } from '../../lib/urls.js';

export const requiredSections = [
  { id: 'about', type: 'about', title: 'About', headline: 'About the company', prompt: 'Introduce the company, what it does, who it serves, and the context that led to this project.', image: 'Company or product image' },
  { id: 'deliverable', type: 'deliverable', title: 'Deliverable', headline: 'The brief & my role', prompt: 'Describe the requested deliverable, the project goals, your responsibilities, and how you worked with the team.', image: 'Project brief or deliverable image' },
  { id: 'completed', type: 'completed', title: 'Completed', headline: 'The completed experience', prompt: 'Show the final work. Explain what was implemented, which features were delivered, and how they address the original brief.', image: 'Final product or completed deliverable' },
  { id: 'user-persona', type: 'persona', title: 'User Persona', headline: 'The people behind the problem', prompt: 'Describe who you interviewed, their context and needs, and the problem statement. Add research-based personas and representative quotes.', image: 'Persona or user journey image' },
  { id: 'research', type: 'research', title: 'Research', headline: 'From questions to insights', prompt: 'Explain your research methods, interview approach, alternatives reviewed, and the findings that informed the product direction.', image: 'Research synthesis or findings image' },
  { id: 'design-evolution', type: 'evolution', title: 'Design Evolution', headline: 'How the design evolved', prompt: 'Show early ideas, sketches, prototypes, usability feedback, and the decisions that shaped the final implementation.', image: 'Before-and-after design or prototype image' },
];

export function createProjectTemplate({ slug = 'template', title = 'Project title', number = '00', image = assetUrl('projects/case-study-placeholder.svg'), imageAlt = 'Project image placeholder', isTemplate = false } = {}) {
  return {
    slug,
    title,
    number,
    isPlaceholder: true,
    isTemplate,
    eyebrow: isTemplate ? 'Reusable project template' : 'Case study coming soon',
    subtitle: isTemplate ? 'A clear structure for the story behind the design.' : 'The story behind this project is on its way.',
    summary: isTemplate ? 'Use this layout to connect the brief, the people, the research, and the final experience.' : 'This page is ready for the project brief, research, design process, and completed work.',
    heroImage: { src: image, alt: imageAlt },
    metadata: [{ label: 'Deliverable', value: 'To be added' }, { label: 'Team', value: 'To be added' }, { label: 'Timeline', value: 'To be added' }, { label: 'My role', value: 'To be added' }],
    sections: requiredSections.map(section => ({
      ...section,
      intro: section.prompt,
      blocks: [{ type: 'gallery', images: [{ src: assetUrl('projects/case-study-placeholder.svg'), alt: section.image, caption: section.image, stage: 'Placeholder' }] }],
    })),
  };
}
