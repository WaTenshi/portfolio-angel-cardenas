import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const contentRoot = fileURLToPath(new URL('../src/content/blog/', import.meta.url));
export const registryPath = resolve(contentRoot, 'articles.json');

export function readingTime(markdown) {
  const text = markdown.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  return Math.max(1, Math.ceil((text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length / 200));
}

export function readArticles() {
  const records = JSON.parse(readFileSync(registryPath, 'utf8'));
  const slugs = new Set();
  return records.map((article) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || slugs.has(article.slug)) throw new Error(`Slug inválido o duplicado: ${article.slug}`);
    slugs.add(article.slug);
    for (const field of ['title', 'description', 'author', 'category', 'language']) {
      if (typeof article[field] !== 'string' || !article[field].trim()) throw new Error(`Falta ${field} en ${article.slug}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(article.date) || new Date(`${article.date}T12:00:00Z`).toISOString().slice(0, 10) !== article.date) throw new Error(`Fecha inválida: ${article.slug}`);
    if (article.contentFile !== `${article.slug}.md`) throw new Error(`El Markdown debe llamarse ${article.slug}.md`);
    const content = readFileSync(resolve(contentRoot, article.contentFile), 'utf8');
    const coverImage = article.coverImage || { src: 'blog/assets/editorial-placeholder.svg', alt: 'Código, producto y personas.', width: 1200, height: 780 };
    if (!existsSync(fileURLToPath(new URL(`../public/${coverImage.src}`, import.meta.url)))) throw new Error(`Portada ausente: ${coverImage.src}`);
    return { ...article, coverImage, readingTime: readingTime(content) };
  }).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
