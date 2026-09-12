import { useEffect, useState } from "react";

export function readPreference(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

export function savePreference(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Private browsing can disable storage. */ }
}

export function useMotion(contentKey = "") {
  const [paused, setPaused] = useState(() => readPreference("motion-paused", "false") === "true");
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const enabled = !paused && !reduced;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = enabled ? "on" : "off";
    savePreference("motion-paused", String(paused));
    const updateVisibility = () => { root.dataset.pageVisible = String(!document.hidden); };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    const targets = [...document.querySelectorAll("[data-reveal], [data-motion-region]")];
    if (!enabled || !("IntersectionObserver" in window)) {
      targets.forEach((element) => {
        element.classList.add("is-revealed");
        element.dataset.inView = "true";
      });
      return () => document.removeEventListener("visibilitychange", updateVisibility);
    }

    // A single observer serves every reveal and local ambient animation.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        target.dataset.inView = String(isIntersecting);
        if (isIntersecting) {
          target.classList.add("is-revealed");
          if (!target.hasAttribute("data-motion-region")) observer.unobserve(target);
        }
      });
    }, { threshold: 0, rootMargin: "0px" });
    targets.forEach((element) => {
      element.classList.add("motion-ready");
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [enabled, paused, contentKey]);

  return { enabled, reduced, toggleMotion: () => setPaused((value) => !value), scrollBehavior: enabled ? "smooth" : "instant" };
}
