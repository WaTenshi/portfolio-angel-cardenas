export function plainText(node) {
  if (typeof node === 'string') return node;
  if (node.value) return node.value;
  return (node.children || []).map(plainText).join('');
}
export function headingSlug(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'seccion';
}
export function uniqueHeading(text, seen) {
  const slug = headingSlug(text);
  const count = (seen.get(slug) || 0) + 1;
  seen.set(slug, count);
  return count === 1 ? slug : `${slug}-${count}`;
}
export function articleHeadings(markdown) {
  const seen = new Map();
  let fence = null;
  const headings = [];
  for (const [index, line] of markdown.split('\n').entries()) {
    const delimiter = line.match(/^\s*(`{3,}|~{3,})/);
    if (delimiter) { fence = fence ? null : delimiter[1][0]; continue; }
    if (fence) continue;
    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*$/);
    if (match) {
      const title = match[2].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '');
      headings.push({ title, id: uniqueHeading(title, seen), level: match[1].length, line: index + 1 });
    }
  }
  return headings;
}
