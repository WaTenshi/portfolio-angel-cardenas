import BlogLayout from './BlogLayout';
import { useSitePreferences } from '../hooks/useSitePreferences';
import { useMotion } from '../hooks/useMotion';
import { blogCopy } from './copy';
import { blogPath, siteBase } from './paths';

export default function NotFound() {
  const preferences = useSitePreferences();
  const motion = useMotion();
  const t = blogCopy[preferences.language];
  return <BlogLayout preferences={preferences} motion={motion}><section className="blog-not-found"><span className="blog-eyebrow">ERROR / 404</span><h1>{t.notFound}</h1><p>{t.notFoundText}</p><div><a className="blog-read-link" href={blogPath}>{t.back} ↗</a><a className="blog-read-link" href={siteBase}>{t.portfolio} ↗</a></div></section></BlogLayout>;
}
