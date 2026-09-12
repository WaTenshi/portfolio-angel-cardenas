import { useEffect } from 'react';

export function useReadingProgress(bodyRef, progressRef, contentKey) {
  useEffect(() => {
    const body = bodyRef.current;
    const bar = progressRef.current;
    if (!body || !bar) return;
    let frame = 0;
    let top = 0;
    let height = 1;
    let disposed = false;
    const paint = () => {
      frame = 0;
      const start = top - 100;
      const range = Math.max(1, height - window.innerHeight + 100);
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / range));
      bar.style.setProperty('--reading-progress', progress);
      bar.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const measure = () => {
      if (disposed) return;
      top = body.getBoundingClientRect().top + window.scrollY;
      height = body.offsetHeight;
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    body.addEventListener('load', measure, true);
    document.fonts.ready.then(measure);
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      body.removeEventListener('load', measure, true);
    };
  }, [bodyRef, progressRef, contentKey]);
}
