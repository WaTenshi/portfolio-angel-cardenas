import { useState } from "react";
import { FiArrowRight, FiFastForward } from "react-icons/fi";
import LabPortrait from "./LabPortrait.jsx";

export default function LabDialogue({ subject, title, role, lines, language, finalLabel, onComplete, allowSkip = false }) {
  const [index, setIndex] = useState(0);
  const current = lines[index]?.[language] || "";
  const isLast = index === lines.length - 1;

  return (
    <section className="lab-dialogue" aria-labelledby="lab-dialogue-speaker">
      <LabPortrait subject={subject} state="speaking" />
      <div className="lab-dialogue-copy">
        <div className="lab-dialogue-meta"><span>INCOMING TRANSMISSION</span><span>{String(index + 1).padStart(2, "0")} / {String(lines.length).padStart(2, "0")}</span></div>
        <div className="lab-speaker"><span id="lab-dialogue-speaker">{title}</span><small>{role}</small></div>
        <p key={`${subject}-${index}`} aria-live="polite">{current}</p>
        <div className="lab-dialogue-actions">
          {allowSkip && !isLast && <button className="lab-button-secondary" type="button" onClick={onComplete}><FiFastForward />{language === "es" ? "Omitir intro" : "Skip intro"}</button>}
          <button className="lab-button-primary" type="button" onClick={() => isLast ? onComplete() : setIndex((value) => value + 1)}>
            {isLast ? finalLabel : language === "es" ? "Continuar" : "Continue"}<FiArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
