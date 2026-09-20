import { useEffect, useState } from "react";
import { FiActivity, FiArrowDown } from "react-icons/fi";
import LabExperimentCard from "./components/LabExperimentCard.jsx";
import { experiments } from "./labData.js";

export default function LabIndex({ language, motionEnabled, onNavigate }) {
  const [initialized, setInitialized] = useState(!motionEnabled);
  const [completed] = useState(() => {
    try { return Boolean(JSON.parse(localStorage.getItem("tenshi-lab:python-basic-01") || "null")?.completed); } catch { return false; }
  });
  useEffect(() => {
    const timer = window.setTimeout(() => setInitialized(true), motionEnabled ? 720 : 0);
    return () => window.clearTimeout(timer);
  }, [motionEnabled]);
  return (
    <main id="lab-main" className="lab-index" tabIndex={-1}>
      {!initialized && <div className="lab-initializing" role="status"><span>INITIALIZING TENSHI LAB...</span><i /></div>}
      <section className="lab-hero">
        <div className="lab-hero-grid" aria-hidden="true" />
        <div className="lab-data-streams" aria-hidden="true"><span>0101 / EXP</span><span>CHAMBER_02</span><span>SYS.OK</span><span>RUN / OBSERVE / ITERATE</span></div>
        <div className="lab-hero-copy"><span>DIVISION / 01 · CONCEPCIÓN, CL</span><h1>TENSHI <em>LAB</em></h1><p>{language === "es" ? "Laboratorio experimental de software." : "Experimental software division."}</p></div>
        <div className="lab-hero-console" aria-label="Lab system status"><header><i /><i /><i /><span>lab/status.log</span></header><code>&gt; boot experimental_division</code><code>&gt; chambers: 02</code><code>&gt; examiner: online</code><strong><FiActivity /> SYSTEM STABLE</strong></div>
        <a className="lab-scroll-cue" href="#experiments">{language === "es" ? "EXPLORAR EXPERIMENTOS" : "EXPLORE EXPERIMENTS"}<FiArrowDown /></a>
      </section>
      <section className="lab-experiments" id="experiments" aria-labelledby="lab-experiments-title">
        <header><div><span>AVAILABLE / 02</span><h2 id="lab-experiments-title">{language === "es" ? "Cámaras activas." : "Active chambers."}</h2></div><p>{language === "es" ? "Software pequeño, ideas grandes y algunas decisiones cuestionables bajo condiciones controladas." : "Small software, large ideas, and a few questionable decisions under controlled conditions."}</p></header>
        <div className="lab-experiment-grid">{experiments.map((experiment) => <LabExperimentCard key={experiment.id} experiment={experiment} language={language} completed={experiment.type === "debug" && completed} onNavigate={onNavigate} />)}</div>
      </section>
      <section className="lab-manifest"><span>LAB MANIFEST / 001</span><blockquote>{language === "es" ? "Construir para entender. Romper para aprender. Documentar para no repetirlo accidentalmente." : "Build to understand. Break to learn. Document it so we do not repeat it accidentally."}</blockquote></section>
    </main>
  );
}
