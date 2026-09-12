import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { routeFromPath } from './blog/paths';

const route = routeFromPath(window.location.pathname);
const Page = route.type === 'portfolio'
  ? lazy(() => import('./App.jsx'))
  : route.type === 'blog'
    ? lazy(() => import('./blog/BlogIndex.jsx'))
    : route.type === 'article'
      ? lazy(() => import('./blog/ArticlePage.jsx'))
      : lazy(() => import('./blog/NotFound.jsx'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div className="page-loading" role="status" aria-label="Cargando / Loading"><span aria-hidden="true">ac /</span></div>}>
      <Page slug={route.slug} />
    </Suspense>
  </StrictMode>,
);
