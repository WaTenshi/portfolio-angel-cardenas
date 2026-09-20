import { FiMessageSquare } from "react-icons/fi";
import LabPortrait from "../components/LabPortrait.jsx";

export default function DebugExaminer({ language, message, state, challenge, hintIndex, onHint, disabled }) {
  const nextHint = challenge.hints[hintIndex];
  return (
    <aside className="debug-examiner" aria-labelledby="examiner-name">
      <LabPortrait subject="chimuelo" state={state} />
      <div className="debug-examiner-id"><span>EXAMINER / {challenge.chamber}</span><h2 id="examiner-name">CHIMUELO</h2><p>SENIOR DEBUG EXAMINER</p></div>
      <blockquote key={message}>{message}</blockquote>
      <div className="debug-hints">
        <header><span>{language === "es" ? "INTERVENCIONES" : "INTERVENTIONS"}</span><b>{String(hintIndex).padStart(2, "0")} / {String(challenge.hints.length).padStart(2, "0")}</b></header>
        {challenge.hints.slice(0, hintIndex).map((hint, index) => <p key={hint.cost}><span>HINT {index + 1} / -{hint.cost} PTS</span>{hint.text[language]}</p>)}
        {nextHint ? <button type="button" onClick={onHint} disabled={disabled}><FiMessageSquare />{language === "es" ? "PREGUNTAR A CHIMUELO" : "ASK CHIMUELO"}<small>{language === "es" ? "Costo de pista" : "Hint cost"}: -{nextHint.cost} pts</small></button> : <small>{language === "es" ? "No quedan intervenciones disponibles." : "No interventions remain."}</small>}
      </div>
    </aside>
  );
}
