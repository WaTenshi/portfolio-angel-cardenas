import { useEffect, useRef } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { blogPath } from '../blog/paths';
import './BlogFab.css';

export default function BlogFab({ language }) {
  const ref = useRef(null);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => ref.current?.style.setProperty('--keyboard-inset', `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => { viewport.removeEventListener('resize', update); viewport.removeEventListener('scroll', update); };
  }, []);
  return (
    <div className="blog-fab-region" ref={ref} data-motion-region>
      <a className="blog-fab" href={blogPath} aria-label={language === 'es' ? 'Explorar el blog' : 'Explore the blog'}>
        <FiEdit3 className="ambient-loop" /><span>Blog</span><span className="blog-fab-arrow" aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
