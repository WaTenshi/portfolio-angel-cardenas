import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { resolveConfig } from 'vite';
import { readArticles } from './blog-content.mjs';

const config = await resolveConfig({}, 'build');
const output = resolve(config.root, config.build.outDir);
const template = await readFile(resolve(output, 'index.html'), 'utf8');
const base = config.base;
const origin = 'https://watenshi.github.io';
const escape = (text) => text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
async function page(relative, title, description, canonical) {
  const html = template.replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/, `<meta name="description" content="${escape(description)}" />`)
    .replace('</head>', `${canonical ? `<link rel="canonical" href="${origin}${base}${canonical}" />` : '<meta name="robots" content="noindex" />'}\n</head>`);
  const target = resolve(output, relative);
  await mkdir(resolve(target, '..'), { recursive: true });
  await writeFile(target, html);
}
const articles = readArticles();
await page('blog/index.html', 'Blog — Ángel Cárdenas', 'Notas desde la práctica. Desarrollo, producto y experiencias con tecnología.', 'blog/');
for (const article of articles) await page(`blog/${article.slug}/index.html`, `${article.title} — Ángel Cárdenas`, article.description, `blog/${article.slug}/`);
await page('404.html', 'Página no encontrada — Ángel Cárdenas', 'Vuelve al portfolio o explora el blog de Ángel Cárdenas.', null);
console.log(`Blog: ${articles.length} artículo(s), índice y página 404 generados.`);
