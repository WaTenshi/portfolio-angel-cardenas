import { FiArrowLeft, FiArrowUpRight, FiCheck, FiCode } from "react-icons/fi";
import { debugChallenges } from "../challenges/index.js";
import { labPath } from "../labData.js";

function completionFor(id) {
  try { return JSON.parse(localStorage.getItem(`tenshi-lab:${id}`) || "null"); } catch { return null; }
}

export default function ChallengeSelect({ language, onBack, onNavigate }) {
  return (
    <main className="challenge-select" id="lab-main" tabIndex={-1}>
      <div className="challenge-select-ambient" aria-hidden="true"><i>01</i><i>02</i><i>RUN</i><i>FIX</i><i>PASS</i></div>
      <header className="challenge-select-hero">
        <button type="button" onClick={onBack}><FiArrowLeft />{language === "es" ? "Volver al Lab" : "Back to Lab"}</button>
        <span>DEBUG PROGRAM / SELECT CHAMBER</span>
        <h1>{language === "es" ? "Elige tu prueba." : "Choose your test."}</h1>
        <p>{language === "es" ? "Cada cámara tiene código, narrativa y criterio de evaluación propios. Chimuelo ya está observando." : "Each chamber has its own code, narrative, and evaluation criteria. Chimuelo is already watching."}</p>
      </header>
      <section className="challenge-grid" aria-label={language === "es" ? "Desafíos disponibles" : "Available challenges"}>
        {debugChallenges.map((challenge, index) => {
          const completion = completionFor(challenge.id);
          return (
            <a className={`challenge-card is-${challenge.language}`} href={`${labPath}${challenge.route}/`} onClick={(event) => onNavigate(event, `${labPath}${challenge.route}/`)} key={challenge.id}>
              <div className="challenge-card-signal" aria-hidden="true"><span>{challenge.medalMark}</span><i /><i /><i /></div>
              <header><span>TEST CHAMBER {challenge.chamber}</span><span>{completion?.completed ? <><FiCheck />COMPLETE</> : "AVAILABLE"}</span></header>
              <div><small>0{index + 1} / {challenge.language.toUpperCase()}</small><h2>{challenge.title[language]}</h2><p>{challenge.mission[language]}</p></div>
              {completion?.bestScore && <strong>BEST SCORE / {completion.bestScore}</strong>}
              <footer><span>{language === "es" ? "INICIAR EVALUACIÓN" : "START EVALUATION"}</span><FiArrowUpRight /></footer>
              <FiCode className="challenge-card-code" aria-hidden="true" />
            </a>
          );
        })}
      </section>
    </main>
  );
}
