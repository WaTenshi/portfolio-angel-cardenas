import { useEffect, useState } from 'react';
import { readPreference, savePreference } from './useMotion';

export function useSitePreferences() {
  const [language, setLanguage] = useState(() => readPreference('language', 'es') === 'en' ? 'en' : 'es');
  const [theme, setTheme] = useState(() => {
    const fallback = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const saved = readPreference('theme', fallback);
    return saved === 'light' ? 'light' : 'dark';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    savePreference('theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f4f1e9' : '#101310');
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = language;
    savePreference('language', language);
  }, [language]);
  return { language, setLanguage, theme, setTheme };
}
