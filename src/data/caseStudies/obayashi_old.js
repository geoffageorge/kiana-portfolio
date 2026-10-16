import { assetUrl } from '../../lib/urls.js';
import { createProjectTemplate } from './template.js';

// Preserve the original Obayashi placeholder independently of the live tile.
export const obayashiOld = createProjectTemplate({
  slug: 'obayashi_old',
  title: 'Obayashi North America',
  number: '01',
  image: assetUrl('projects/obayashi-placeholder.png'),
  imageAlt: 'Obayashi community and construction photographs arranged in a project collage',
});
