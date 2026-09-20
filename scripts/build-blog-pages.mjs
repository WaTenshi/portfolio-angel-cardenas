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
await page('lab/index.html', 'Tenshi Lab — Ángel Cárdenas', 'Laboratorio experimental de software: minijuegos, desafíos de programación y experiencias interactivas.', 'lab/');
await page('lab/dum/index.html', 'DUM — Tenshi Lab', 'Experimental FPS · Sector 01.', 'lab/dum/');
await page('lab/debug/index.html', 'Debug Challenge — Tenshi Lab', 'Elige una cámara de debugging y repara un programa bajo evaluación de Chimuelo.', 'lab/debug/');
await page('lab/debug/python/basic/index.html', 'Python Debug Challenge — Tenshi Lab', 'Encuentra el bug, corrige el código y completa Test Chamber 01.', 'lab/debug/python/basic/');
await page('lab/debug/python/intermediate/index.html', 'Python Intermediate Challenge — Tenshi Lab', 'Corrige la lógica de sesiones y completa Test Chamber 03.', 'lab/debug/python/intermediate/');
await page('lab/debug/python/hard/index.html', 'Python Advanced Challenge — Tenshi Lab', 'Aísla dos fallos encadenados y completa Test Chamber 05.', 'lab/debug/python/hard/');
await page('lab/debug/javascript/basic/index.html', 'JavaScript Debug Challenge — Tenshi Lab', 'Corrige la lógica y completa Test Chamber 02.', 'lab/debug/javascript/basic/');
await page('lab/debug/javascript/intermediate/index.html', 'JavaScript Intermediate Challenge — Tenshi Lab', 'Repara la validación de despliegue y completa Test Chamber 04.', 'lab/debug/javascript/intermediate/');
await page('lab/debug/javascript/hard/index.html', 'JavaScript Advanced Challenge — Tenshi Lab', 'Rastrea dos operaciones defectuosas y completa Test Chamber 06.', 'lab/debug/javascript/hard/');
await page('404.html', 'Página no encontrada — Ángel Cárdenas', 'Vuelve al portfolio o explora el blog de Ángel Cárdenas.', null);
console.log(`Blog: ${articles.length} artículo(s), rutas Lab y página 404 generados.`);
