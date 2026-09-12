import { resolve } from 'node:path';
import { readArticles, registryPath, contentRoot } from './blog-content.mjs';

export default function blogPlugin() {
  const id = '\0virtual:blog-articles';
  return {
    name: 'blog-article-metadata',
    resolveId(source) { if (source === 'virtual:blog-articles') return id; },
    load(source) {
      if (source !== id) return;
      const articles = readArticles();
      this.addWatchFile(registryPath);
      articles.forEach((article) => this.addWatchFile(resolve(contentRoot, article.contentFile)));
      return `export default ${JSON.stringify(articles)}`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(contentRoot)) return;
      const module = server.moduleGraph.getModuleById(id);
      if (module) server.moduleGraph.invalidateModule(module);
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}
