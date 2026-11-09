import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectRoutes } from '../src/data/projectRoutes.js';
import { pageRoutes } from '../src/data/pageRoutes.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const escapeHtml = (value) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

const routes = [...projectRoutes.map(project => ({ ...project, path: `projects/${project.slug}` })), ...pageRoutes.map(page => ({ ...page, path: page.slug }))];
for (const project of routes) {
  if (!/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(project.slug)) throw new Error(`Invalid project slug: ${project.slug}`);
  const folder = resolve(root, project.path);
  const destination = resolve(folder, 'index.html');
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="description" content="${escapeHtml(project.description)}" />
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <title>${escapeHtml(project.title)} / Kiana George</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
  await mkdir(folder, { recursive: true });
  const previous = await readFile(destination, 'utf8').catch(() => '');
  if (previous !== html) await writeFile(destination, html);
}
console.log(`Prepared ${routes.length} static portfolio page entries.`);
