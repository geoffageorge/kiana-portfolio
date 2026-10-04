// Resolve assets and links from the portfolio root, including on nested pages.
// Relative Vite builds can also be served below a path such as /portfolio/.
export function portfolioBase() {
  const pathname = window.location.pathname;
  const projectStart = pathname.lastIndexOf('/projects/');
  const root = projectStart >= 0
    ? pathname.slice(0, projectStart + 1)
    : pathname.endsWith('/') ? pathname : pathname.slice(0, pathname.lastIndexOf('/') + 1);
  return new URL(root, window.location.origin);
}

export const siteUrl = (path = '') => new URL(path, portfolioBase()).pathname;
export const assetUrl = (path) => siteUrl(`assets/${path}`);
export const projectUrl = (slug) => siteUrl(`projects/${slug}/`);

export function currentProjectSlug() {
  const relativePath = window.location.pathname.slice(portfolioBase().pathname.length);
  return /^projects\/([^/]+)(?:\/(?:index\.html)?)?$/.exec(relativePath)?.[1] ?? null;
}
