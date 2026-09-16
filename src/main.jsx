import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { routeFromPath } from './blog/paths';

const route = routeFromPath(window.location.pathname);
const Page = route.type === 'portfolio'
  ? lazy(() => import('./App.jsx'))
  : route.type === 'blog' || route.type === 'article'
    ? lazy(() => import('./blog/BlogApp.jsx'))
      : lazy(() => import('./blog/NotFound.jsx'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div className="page-loading" role="status" aria-label="Cargando / Loading"><span aria-hidden="true">ac /</span></div>}>
      <Page initialRoute={route} />
    </Suspense>
  </StrictMode>,
);
