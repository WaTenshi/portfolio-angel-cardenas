import { FiArrowUpRight, FiArrowRight } from 'react-icons/fi';
import { articlePath, assetPath } from './paths';
import Reveal from '../components/Reveal';
import { blogCopy } from './copy';

export function ArticleMeta({ article, language }) {
  const t = blogCopy[language];
  return <div className="post-meta"><time dateTime={article.date}>{new Intl.DateTimeFormat(language === 'es' ? 'es-CL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${article.date}T12:00:00Z`))}</time><span>{article.readingTime} {t.reading}</span><span>{t.spanish}</span></div>;
}

export default function ArticleCard({ article, language, featured = false, index = 0 }) {
  const t = blogCopy[language];
  return (
    <Reveal delay={index * 80} className={featured ? 'featured-story' : 'archive-story'}>
      <article className="story-card">
        <a className="story-art" href={articlePath(article.slug)} aria-label={`${t.read}: ${article.title}`}>
          <img src={assetPath(article.coverImage.src)} alt={article.coverImage.alt} width={article.coverImage.width} height={article.coverImage.height} loading={featured ? 'eager' : 'lazy'} fetchPriority={featured ? 'high' : 'auto'} decoding="async" />
          <span className="art-corner" aria-hidden="true"><FiArrowUpRight /></span>
        </a>
        <div className="story-copy">
          <div className="story-eyebrow"><span>{featured ? t.featured : String(index + 1).padStart(2, '0')}</span><span lang={article.language}>{article.category}</span></div>
          <h2 lang={article.language}><a href={articlePath(article.slug)}>{article.title}</a></h2>
          <p lang={article.language}>{article.description}</p>
          <ArticleMeta article={article} language={language} />
          <a className="blog-read-link" href={articlePath(article.slug)}>{t.read}<FiArrowRight /></a>
        </div>
      </article>
    </Reveal>
  );
}
