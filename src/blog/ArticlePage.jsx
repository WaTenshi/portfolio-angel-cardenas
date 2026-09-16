import { useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiChevronDown } from 'react-icons/fi';
import articles from 'virtual:blog-articles';
import BlogLayout from './BlogLayout';
import MarkdownBody from './MarkdownBody';
import { BlogNotFound } from './NotFound';
import { ArticleMeta } from './ArticleCard';
import { articlePath, assetPath, blogPath } from './paths';
import { articleHeadings } from './markdown';
import { useReadingProgress } from './useReadingProgress';
import { blogCopy } from './copy';
import { BlogLink } from './BlogRouter';

const contentFiles = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default' });

export default function ArticlePage({ slug, preferences, motion }) {
  const article = articles.find((entry) => entry.slug === slug);
  return article ? <ArticleReader key={slug} article={article} preferences={preferences} motion={motion} /> : <BlogNotFound preferences={preferences} motion={motion} />;
}

function ArticleReader({ article, preferences, motion }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(false);
  const contentKey = `${article.slug}:${Boolean(content)}`;
  const t = blogCopy[preferences.language];
  const bodyRef = useRef(null);
  const progressRef = useRef(null);
  useReadingProgress(bodyRef, progressRef, contentKey);
  const headings = articleHeadings(content);
  const currentIndex = articles.findIndex((entry) => entry.slug === article.slug);
  const previous = articles[currentIndex + 1];
  const next = articles[currentIndex - 1];
  const related = articles.filter((entry) => entry.slug !== article.slug && entry.tags.some((tag) => article.tags.includes(tag))).slice(0, 2);

  useEffect(() => {
    let cancelled = false;
    const load = contentFiles[`../content/blog/${article.contentFile}`];
    if (load) load().then((text) => { if (!cancelled) setContent(text); }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [article.contentFile]);

  useEffect(() => {
    if (!content || !window.location.hash) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) {
        try { document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }); } catch { /* An invalid fragment leaves the article readable. */ }
      }
    });
    return () => { cancelled = true; };
  }, [content]);

  const toc = <nav aria-label={t.contents}><ol>{headings.map((heading) => <li key={heading.id} className={heading.level === 3 ? 'toc-nested' : ''}><a href={`#${heading.id}`}>{heading.title}</a></li>)}</ol></nav>;

  return (
    <BlogLayout preferences={preferences} motion={motion}>
      <div className="reading-progress" ref={progressRef} role="progressbar" aria-label={t.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><span /></div>
      <article className="article-page" lang={article.language}>
        <header className="article-header">
          <BlogLink className="article-back" href={blogPath} lang={preferences.language}><FiArrowLeft />{t.index}</BlogLink>
          <div className="article-kicker"><span>{article.category}</span><span>NOTAS / {String(currentIndex + 1).padStart(2, '0')}</span></div>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.description}</p>
          <div className="article-byline"><div><span className="author-monogram" aria-hidden="true">ac</span><span><strong>{article.author}</strong><small lang={preferences.language}>{t.authorRole}</small></span></div><div lang={preferences.language}><ArticleMeta article={article} language={preferences.language} /></div></div>
          <figure className="article-cover"><img src={assetPath(article.coverImage.src)} alt={article.coverImage.alt} width={article.coverImage.width} height={article.coverImage.height} fetchPriority="high" /></figure>
        </header>
        {content ? (
          <div className="reader-grid">
            <aside className="desktop-toc"><div className="toc-inner"><span className="blog-eyebrow" lang={preferences.language}>{t.contents}</span>{toc}<span className="toc-signature" aria-hidden="true">AC /</span></div></aside>
            <div className="reader-column">
              <details className="mobile-toc"><summary><span lang={preferences.language}>{t.contents}</span><FiChevronDown /></summary>{toc}</details>
              <div className="article-body" ref={bodyRef}><MarkdownBody content={content} /></div>
              <div className="article-tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="article-ending" lang={preferences.language}><span className="blog-eyebrow">FIN / END</span><h2>{t.end}</h2><p>{t.endText}</p><BlogLink className="blog-read-link" href={blogPath}><FiArrowLeft />{t.back}</BlogLink></div>
            </div>
          </div>
        ) : <div className="article-loading" role="status" lang={preferences.language}>{error ? <><p>{t.error}</p><button onClick={() => window.location.reload()}>{t.retry}</button><BlogLink href={blogPath}>{t.back}</BlogLink></> : t.loading}</div>}
      </article>
      {(previous || next) && <nav className="article-pagination" aria-label={t.related}>{previous && <BlogLink href={articlePath(previous.slug)}><span>{t.previous}</span><strong lang={previous.language}>{previous.title}</strong><FiArrowLeft /></BlogLink>}{next && <BlogLink href={articlePath(next.slug)}><span>{t.next}</span><strong lang={next.language}>{next.title}</strong><FiArrowRight /></BlogLink>}</nav>}
      {related.length > 0 && <section className="related-articles"><h2>{t.related}</h2>{related.map((entry) => <BlogLink key={entry.slug} href={articlePath(entry.slug)} lang={entry.language}>{entry.title}<FiArrowRight /></BlogLink>)}</section>}
    </BlogLayout>
  );
}
