import { FiArrowUpRight, FiCode, FiCrosshair } from "react-icons/fi";

export default function LabExperimentCard({ experiment, language, completed, onNavigate }) {
  return (
    <article className={`lab-experiment-card is-${experiment.type}`} data-motion-region>
      <a href={experiment.href} onClick={(event) => onNavigate(event, experiment.href)}>
        <header><span>EXPERIMENT {experiment.number}</span><span>STATUS / AVAILABLE</span></header>
        <div className="lab-card-preview" aria-hidden="true">
          {experiment.type === "game" ? <div className="lab-dum-preview"><FiCrosshair /><i /><i /><i /></div> : <div className="lab-code-preview"><code><b>def</b> repair(code):</code><code>&nbsp;&nbsp;bug = inspect(code)</code><code>&nbsp;&nbsp;<em>return</em> resolve(bug)</code><FiCode /></div>}
        </div>
        <div className="lab-card-copy"><span>{experiment.meta}</span><h2>{experiment.title}</h2><strong>{experiment.eyebrow[language]}</strong><p>{experiment.description[language]}</p></div>
        <footer><span>{completed ? (language === "es" ? "COMPLETADO" : "COMPLETED") : experiment.type === "game" ? (language === "es" ? "ENTRAR" : "ENTER") : (language === "es" ? "INICIAR" : "START")}</span><FiArrowUpRight /></footer>
      </a>
    </article>
  );
}
