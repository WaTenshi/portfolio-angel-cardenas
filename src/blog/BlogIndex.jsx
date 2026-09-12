import articles from 'virtual:blog-articles';
import { useSitePreferences } from '../hooks/useSitePreferences';
import { useMotion } from '../hooks/useMotion';
import BlogLayout from './BlogLayout';
import ArticleCard from './ArticleCard';
import Reveal from '../components/Reveal';
import { blogCopy } from './copy';

export default function BlogIndex() {
  const preferences = useSitePreferences();
  const motion = useMotion();
  const t = blogCopy[preferences.language];
  const featured = articles.find((article) => article.featured) || articles[0];
  return (
    <BlogLayout preferences={preferences} motion={motion}>
      <section className="blog-hero">
        <div className="blog-overline"><span><i />{t.heroLabel}</span><span>{String(articles.length).padStart(2, '0')} {articles.length === 1 ? t.article : t.articles}</span></div>
        <div className="blog-hero-grid"><h1>{t.heroStart}<br /><em>{t.heroEnd}</em><span className="editorial-period">.</span></h1><Reveal delay={80} className="blog-hero-note"><span className="editorial-mark" aria-hidden="true">↳</span><p>{t.intro}</p><span>{t.issue}</span></Reveal></div>
      </section>
      {featured && <ArticleCard article={featured} language={preferences.language} featured />}
      <section className="blog-archive" aria-labelledby="archive-title">
        <Reveal className="archive-heading"><div><span className="blog-eyebrow">INDEX / {String(articles.length).padStart(2, '0')}</span><h2 id="archive-title">{t.archive}<span>↘</span></h2></div><p>{t.archiveIntro}</p></Reveal>
        <div className="archive-grid">{articles.map((article, index) => <ArticleCard key={article.slug} article={article} language={preferences.language} index={index} />)}</div>
        {!articles.length && <p>{t.empty}</p>}
      </section>
    </BlogLayout>
  );
}
