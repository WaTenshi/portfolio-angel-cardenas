import { Suspense, lazy, useEffect } from 'react';
import articles from 'virtual:blog-articles';
import { useSitePreferences } from '../hooks/useSitePreferences';
import { useMotion } from '../hooks/useMotion';
import { BlogRouter } from './BlogRouter';
import { useBlogNavigation } from './blogNavigationContext';
import { MusicProvider } from './music/MusicProvider';

const BlogIndex = lazy(() => import('./BlogIndex'));
const ArticlePage = lazy(() => import('./ArticlePage'));

function BlogView() {
  const { route } = useBlogNavigation();
  const preferences = useSitePreferences();
  const motion = useMotion(`${route.type}:${route.slug ?? 'index'}`);

  useEffect(() => {
    const article = route.type === 'article' ? articles.find((entry) => entry.slug === route.slug) : null;
    document.title = article ? `${article.title} — Ángel Cárdenas` : 'Blog — Ángel Cárdenas';
  }, [route]);

  return (
    <MusicProvider language={preferences.language} motionEnabled={motion.enabled}>
      <Suspense fallback={<div className="page-loading" role="status" aria-label="Cargando / Loading"><span aria-hidden="true">ac /</span></div>}>
        {route.type === 'blog'
          ? <BlogIndex preferences={preferences} motion={motion} />
          : <ArticlePage key={route.slug} slug={route.slug} preferences={preferences} motion={motion} />}
      </Suspense>
    </MusicProvider>
  );
}

export default function BlogApp({ initialRoute }) {
  return <BlogRouter initialRoute={initialRoute}><BlogView /></BlogRouter>;
}
