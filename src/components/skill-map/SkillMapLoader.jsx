import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "./skillMap.css";

const SkillMap = lazy(() => import("./SkillMap.jsx"));

export default function SkillMapLoader(props) {
  const ref = useRef(null);
  const [ready, setReady] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return !("IntersectionObserver" in window) || window.location.hash === "#stack" || ["skill", "skillProject", "role"].some((key) => params.has(key));
  });

  useEffect(() => {
    if (ready) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: "500px 0px" });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div ref={ref} className="skill-map-loader" data-ready={ready}>
      {ready ? <Suspense fallback={<div className="skill-map-skeleton" role="status">GRAPH / LOADING</div>}><SkillMap {...props} /></Suspense> : <div className="skill-map-skeleton" aria-hidden="true"><i /><span>TECH GRAPH / 2026</span></div>}
    </div>
  );
}
