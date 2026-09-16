import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { blogPath, routeFromPath } from './paths';
import { BlogNavigationContext } from './blogNavigationContext';

function isPlainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function scrollToCurrentHash() {
  if (!window.location.hash) return;
  try {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    target?.scrollIntoView({ behavior: 'instant' });
  } catch { /* Invalid fragments should not break navigation. */ }
}

export function BlogRouter({ initialRoute, children }) {
  const [route, setRoute] = useState(initialRoute);

  const navigate = useCallback((href, { replace = false } = {}) => {
    const url = new URL(href, window.location.href);
    const nextRoute = routeFromPath(url.pathname);
    const staysInBlog = url.origin === window.location.origin
      && url.pathname.startsWith(blogPath)
      && (nextRoute.type === 'blog' || nextRoute.type === 'article');

    if (!staysInBlog) {
      window.location.assign(url.href);
      return;
    }

    window.history[replace ? 'replaceState' : 'pushState']({}, '', url.href);
    setRoute(nextRoute);
    if (!url.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(routeFromPath(window.location.pathname));
      window.requestAnimationFrame(scrollToCurrentHash);
    };
    const handleHashChange = () => window.requestAnimationFrame(scrollToCurrentHash);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const value = useMemo(() => ({ route, navigate }), [navigate, route]);
  return <BlogNavigationContext.Provider value={value}>{children}</BlogNavigationContext.Provider>;
}

export function BlogLink({ href, onClick, target, children, ...props }) {
  const navigation = useContext(BlogNavigationContext);
  const handleClick = (event) => {
    onClick?.(event);
    if (!navigation || event.defaultPrevented || target || !isPlainClick(event)) return;
    event.preventDefault();
    navigation.navigate(href);
  };

  return <a {...props} href={href} target={target} onClick={handleClick}>{children}</a>;
}
