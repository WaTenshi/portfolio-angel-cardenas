import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { readArticles, readingTime, contentRoot } from '../scripts/blog-content.mjs';
import { routeFromPath } from '../src/blog/paths.js';
import { articleHeadings } from '../src/blog/markdown.js';

const base = '/portfolio-angel-cardenas/';
test('routes preserve the Pages base, direct article URLs and trailing slash variants', () => {
  for (const suffix of ['', 'index.html']) assert.deepEqual(routeFromPath(base + suffix, base), { type: 'portfolio' });
  for (const suffix of ['blog', 'blog/', 'blog/index.html']) assert.deepEqual(routeFromPath(base + suffix, base), { type: 'blog' });
  for (const suffix of ['blog/del-codigo-a-la-realidad', 'blog/del-codigo-a-la-realidad/', 'blog/del-codigo-a-la-realidad/index.html']) assert.deepEqual(routeFromPath(base + suffix, base), { type: 'article', slug: 'del-codigo-a-la-realidad' });
  for (const path of ['/blog/', base + 'blog/article/extra/', base + 'missing']) assert.deepEqual(routeFromPath(path, base), { type: 'not-found' });
});
test('first article preserves publication date, language and the five original sections', () => {
  const article = readArticles().find(({ slug }) => slug === 'del-codigo-a-la-realidad');
  assert.equal(article.date, '2026-07-14');
  assert.equal(article.language, 'es');
  const content = readFileSync(resolve(contentRoot, article.contentFile), 'utf8');
  assert.deepEqual(articleHeadings(content).map(({ title }) => title), [
    'Los detalles pequeños pueden afectar procesos completos', 'Los usuarios explican lo que observan',
    'Dar soporte al mismo sistema que desarrollo', 'La importancia de organizar lo pendiente', 'Más que escribir código',
  ]);
  assert.equal(article.readingTime, 5);
});
test('reading time rounds up and excludes image-only markup', () => {
  assert.equal(readingTime('palabra '.repeat(200)), 1);
  assert.equal(readingTime('palabra '.repeat(201)), 2);
  assert.equal(readingTime('![una descripción larga](image.svg)'), 1);
});
test('table of contents ignores code and gives repeated headings distinct anchors', () => {
  assert.deepEqual(articleHeadings('## Atención\n\n```js\n## Not a heading\n```\n\n## Atención\n### Otra sección').map(({ id }) => id), ['atencion', 'atencion-2', 'otra-seccion']);
});
test('build emits real HTML pages and canonical URLs for published articles', () => {
  assert(existsSync('dist/blog/index.html'));
  const html = readFileSync('dist/blog/del-codigo-a-la-realidad/index.html', 'utf8');
  assert.match(html, /<title>Del código a la realidad:/);
  assert.match(html, /rel="canonical" href="https:\/\/watenshi.github.io\/portfolio-angel-cardenas\/blog\/del-codigo-a-la-realidad\/"/);
  assert.match(readFileSync('dist/404.html', 'utf8'), /name="robots" content="noindex"/);
});
