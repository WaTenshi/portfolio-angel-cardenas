import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useMotion } from "../hooks/useMotion.js";
import { useSitePreferences } from "../hooks/useSitePreferences.js";
import { routeFromPath } from "../blog/paths.js";
import LabLayout from "./LabLayout.jsx";
import LabIndex from "./LabIndex.jsx";
import { labPath } from "./labData.js";
import { getDebugChallenge } from "./challenges/index.js";
import "./lab.css";

const DomGame = lazy(() => import("../components/terminal/DomGame.jsx"));
const DebugChallenge = lazy(() => import("./debug/DebugChallenge.jsx"));
const ChallengeSelect = lazy(() => import("./debug/ChallengeSelect.jsx"));

export default function LabApp({ initialRoute }) {
  const preferences = useSitePreferences();
  const [route, setRoute] = useState(initialRoute);
  const motion = useMotion(`lab:${route.type}`);
  const navigateTo = useCallback((href, { replace = false } = {}) => {
    const url = new URL(href, window.location.href);
    const next = routeFromPath(url.pathname);
    if (!next.type.startsWith("lab")) { window.location.assign(url.href); return; }
    window.history[replace ? "replaceState" : "pushState"]({}, "", url.href);
    setRoute(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const navigate = (event, href) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); navigateTo(href);
  };
  const backToLab = useCallback(() => navigateTo(labPath), [navigateTo]);

  useEffect(() => {
    const pop = () => setRoute(routeFromPath(window.location.pathname));
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    const challenge = getDebugChallenge(route.challenge);
    document.title = challenge ? `${challenge.title[preferences.language]} — Tenshi Lab` : route.type === "lab-debug-index" ? "Debug Challenge — Tenshi Lab" : route.type === "lab-dum" ? "DUM — Tenshi Lab" : "Tenshi Lab — Ángel Cárdenas";
  }, [preferences.language, route.challenge, route.type]);

  const challenge = getDebugChallenge(route.challenge);

  return (
    <LabLayout preferences={preferences} motion={motion} onNavigate={navigate}>
      <Suspense fallback={<div className="lab-route-loading" role="status">LOADING CHAMBER...</div>}>
        {route.type === "lab-debug" && challenge ? <DebugChallenge challenge={challenge} language={preferences.language} motionEnabled={motion.enabled} onBack={() => navigateTo(`${labPath}debug/`)} /> : route.type === "lab-debug-index" ? <ChallengeSelect language={preferences.language} onBack={backToLab} onNavigate={navigate} /> : <LabIndex language={preferences.language} motionEnabled={motion.enabled} onNavigate={navigate} />}
        {route.type === "lab-dum" && <DomGame language={preferences.language} onClose={backToLab} />}
      </Suspense>
    </LabLayout>
  );
}
