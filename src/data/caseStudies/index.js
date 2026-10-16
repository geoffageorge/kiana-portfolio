import { projects } from '../projects.js';
import { pointly } from './pointly.js';
import { createProjectTemplate } from './template.js';
import { obayashiOld } from './obayashi_old.js';

export const caseStudies = Object.fromEntries(projects.map(project => [
  project.slug,
  project.slug === 'pointly' ? pointly : createProjectTemplate({
    slug: project.slug,
    title: project.number === '01' ? project.title : `Project ${project.number}`,
    number: project.number,
    image: project.image,
    imageAlt: project.imageAlt,
  }),
]));

caseStudies.template = createProjectTemplate({ isTemplate: true });
caseStudies.obayashi_old = obayashiOld;
