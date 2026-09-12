export const siteBase = import.meta.env?.BASE_URL ?? '/';
export const blogPath = `${siteBase}blog/`;
export const articlePath = (slug) => `${blogPath}${slug}/`;
export const assetPath = (src) => /^(https?:\/\/|data:)/.test(src) ? src : `${siteBase}${src.replace(/^\//, '')}`;

export function routeFromPath(pathname, base = siteBase) {
  if (!pathname.startsWith(base)) return { type: 'not-found' };
  const path = pathname.slice(base.length).replace(/\/index\.html$/, '').replace(/\/$/, '');
  if (path === '' || path === 'index.html') return { type: 'portfolio' };
  if (path === 'blog') return { type: 'blog' };
  const match = path.match(/^blog\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  return match ? { type: 'article', slug: match[1] } : { type: 'not-found' };
}
