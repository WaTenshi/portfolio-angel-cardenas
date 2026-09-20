export const siteBase = import.meta.env?.BASE_URL ?? '/';
export const blogPath = `${siteBase}blog/`;
export const articlePath = (slug) => `${blogPath}${slug}/`;
export const assetPath = (src) => /^(https?:\/\/|data:)/.test(src) ? src : `${siteBase}${src.replace(/^\//, '')}`;

export function routeFromPath(pathname, base = siteBase) {
  if (!pathname.startsWith(base)) return { type: 'not-found' };
  const path = pathname.slice(base.length).replace(/\/index\.html$/, '').replace(/\/$/, '');
  if (path === '' || path === 'index.html') return { type: 'portfolio' };
  if (path === 'blog') return { type: 'blog' };
  if (path === 'lab') return { type: 'lab' };
  if (path === 'lab/dum') return { type: 'lab-dum' };
  if (path === 'lab/debug') return { type: 'lab-debug-index' };
  if (path === 'lab/debug/python/basic') return { type: 'lab-debug', challenge: 'python-basic-01' };
  if (path === 'lab/debug/javascript/basic') return { type: 'lab-debug', challenge: 'javascript-basic-01' };
  const match = path.match(/^blog\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  return match ? { type: 'article', slug: match[1] } : { type: 'not-found' };
}
