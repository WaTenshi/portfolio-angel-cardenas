import { FiArrowLeft, FiArrowUpRight, FiMoon, FiSun, FiPause, FiPlay } from 'react-icons/fi';
import { blogPath, siteBase } from './paths';
import { blogCopy } from './copy';
import './Blog.css';

export default function BlogLayout({ preferences, motion, children }) {
  const { language, setLanguage, theme, setTheme } = preferences;
  const { enabled, reduced, toggleMotion } = motion;
  const t = blogCopy[language];
  return (
    <div className="blog-shell">
      <a className="skip-link" href="#blog-main">{t.skip}</a>
      <header className="blog-header">
        <div className="blog-header-inner">
          <a className="blog-brand" href={blogPath}><span>Ángel Cárdenas</span><b>/ Blog</b></a>
          <a className="blog-portfolio-link" href={siteBase} aria-label={t.portfolio}><FiArrowLeft /><span>{t.portfolio}</span></a>
          <div className="blog-controls">
            <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a español'}>{language === 'es' ? 'EN' : 'ES'}</button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t.light : t.dark}>{theme === 'dark' ? <FiSun /> : <FiMoon />}</button>
            <button onClick={toggleMotion} aria-label={reduced ? t.reduced : enabled ? t.pause : t.play} aria-pressed={!enabled} disabled={reduced}>{enabled ? <FiPause /> : <FiPlay />}</button>
          </div>
        </div>
      </header>
      <main id="blog-main" tabIndex={-1}>{children}</main>
      <footer className="blog-footer"><a href={blogPath} className="blog-signature">Ángel Cárdenas<span> / Blog</span></a><div><span>© {new Date().getFullYear()} · {t.footer}</span><a href={siteBase}>{t.portfolio}<FiArrowUpRight /></a></div></footer>
    </div>
  );
}
