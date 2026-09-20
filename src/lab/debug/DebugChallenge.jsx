import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiPlay } from "react-icons/fi";
import LabDialogue from "../components/LabDialogue.jsx";
import LabTransmission from "../components/LabTransmission.jsx";
import { evaluateDebugChallenge } from "../engine/index.js";
import DebugEditor from "./DebugEditor.jsx";
import DebugConsole from "./DebugConsole.jsx";
import DebugExaminer from "./DebugExaminer.jsx";
import DebugResults from "./DebugResults.jsx";
import "./debugChallenge.css";

const successMessages = ["RUNNING TESTS...", "", "ENVIRONMENT STABLE", "DEBUG COMPLETE"];

function scoreEvaluation(score, language, challenge) {
  const sets = score >= 95
    ? { es: ["Sin asistencia significativa.", "Sin daños colaterales.", "Aceptable para un humano."], en: ["No significant assistance.", "No collateral damage.", "Acceptable for a human."] }
    : score >= 80
      ? { es: ["Necesitaste algo de orientación.", "Pero encontraste el bug.", "El laboratorio considera el resultado satisfactorio."], en: ["You needed some guidance.", "But you found the bug.", "The laboratory considers the result satisfactory."] }
      : score >= 60
        ? { es: ["He tenido que intervenir más de lo previsto.", "Aun así: el bug está muerto."], en: ["I had to intervene more than expected.", "Even so: the bug is dead."] }
        : { es: ["La investigación fue... extensa.", "Pero finalmente llegaste a la solución."], en: ["The investigation was... extensive.", "But you eventually reached the solution."] };
  return [{ [language]: challenge.narrative.completion[language] }, ...sets[language].map((text) => ({ [language]: text })),
    { [language]: language === "es" ? "Evaluación terminada." : "Evaluation complete." },
    { [language]: language === "es" ? "Ángel insiste en que los participantes aprobados reciban una condecoración." : "Ángel insists that successful participants receive a decoration." },
    { [language]: language === "es" ? "Personalmente considero suficiente no haber roto nada más." : "Personally, I consider not breaking anything else sufficient." },
    { [language]: language === "es" ? "En cualquier caso... felicitaciones." : "In any case... congratulations." },
  ];
}

function SuccessSequence({ language, motionEnabled, chamber, onComplete }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => index === successMessages.length - 1 ? onComplete() : setIndex((value) => value + 1), motionEnabled ? 520 : 10);
    return () => window.clearTimeout(timer);
  }, [index, motionEnabled, onComplete]);
  const message = index === 1 ? `TEST ${chamber} / PASSED` : successMessages[index];
  return <section className="debug-success-sequence" role="status" aria-live="polite"><span>TENSHI LAB / TEST CHAMBER {chamber}</span><div aria-hidden="true"><i /><i /><i /></div><h1 key={message}>{message}</h1><p>{language === "es" ? "Validando comportamiento y salida..." : "Validating behavior and output..."}</p></section>;
}

function certificateId(score, prefix) {
  const values = new Uint16Array(2);
  crypto.getRandomValues(values);
  return `${prefix}-${score}-${[...values].map((value) => value.toString(16).padStart(4, "0")).join("").slice(0, 4).toUpperCase()}`;
}

export default function DebugChallenge({ challenge, language, motionEnabled, onBack }) {
  const [phase, setPhase] = useState("angel");
  const [code, setCode] = useState(challenge.initialCode);
  const [score, setScore] = useState(challenge.score.initial);
  const [hintIndex, setHintIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [scoreDelta, setScoreDelta] = useState(null);
  const [examinerState, setExaminerState] = useState("idle");
  const [examinerMessage, setExaminerMessage] = useState(challenge.narrative.examiner[0][language]);
  const [achievementId, setAchievementId] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const runTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(runTimer.current), []);
  const transitionTo = useCallback((next) => {
    if (motionEnabled && document.startViewTransition) document.startViewTransition(() => setPhase(next));
    else setPhase(next);
  }, [motionEnabled]);
  const goToExaminer = useCallback(() => transitionTo("chimuelo"), [transitionTo]);
  const finishSequence = useCallback(() => transitionTo("evaluation"), [transitionTo]);
  const evaluationLines = useMemo(() => scoreEvaluation(score, language, challenge), [challenge, language, score]);

  const flashDelta = (value) => {
    setScoreDelta(value);
    window.setTimeout(() => setScoreDelta(null), 900);
  };
  const requestHint = () => {
    const hint = challenge.hints[hintIndex];
    if (!hint || running) return;
    setScore((value) => Math.max(0, value - hint.cost));
    setHintIndex((value) => value + 1);
    setExaminerState("hint");
    setExaminerMessage(`${hint.text[language]} ${language === "es" ? "Pista registrada. Tu puntuación ha sido actualizada." : "Hint registered. Your score has been updated."}`);
    flashDelta(-hint.cost);
  };
  const runCode = () => {
    if (running) return;
    setRunning(true); setResult(null); setExaminerState("running");
    runTimer.current = window.setTimeout(() => {
      const nextResult = evaluateDebugChallenge(code, challenge);
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts); setRunning(false); setResult(nextResult);
      if (nextResult.passed) {
        const finalScore = score;
        const id = certificateId(finalScore, challenge.certificatePrefix);
        const date = new Intl.DateTimeFormat(language === "es" ? "es-CL" : "en-US", { dateStyle: "long" }).format(new Date());
        setAchievementId(id); setCompletedDate(date); setExaminerState("passed");
        try { localStorage.setItem(`tenshi-lab:${challenge.id}`, JSON.stringify({ completed: true, bestScore: Math.max(finalScore, Number(JSON.parse(localStorage.getItem(`tenshi-lab:${challenge.id}`) || "null")?.bestScore || 0)) })); } catch { /* Completion storage is optional. */ }
        transitionTo("success");
      } else {
        const cost = nextAttempts > challenge.score.freeFailedAttempts ? challenge.score.failedAttemptCost : 0;
        if (cost) { setScore((value) => Math.max(0, value - cost)); flashDelta(-cost); }
        setExaminerState("failed");
        setExaminerMessage(challenge.narrative.failures[language][(nextAttempts - 1) % challenge.narrative.failures[language].length]);
      }
    }, motionEnabled ? 650 : 10);
  };
  const reset = () => {
    window.clearTimeout(runTimer.current);
    transitionTo("challenge"); setCode(challenge.initialCode); setScore(challenge.score.initial); setHintIndex(0); setAttempts(0); setRunning(false); setResult(null); setScoreDelta(null); setExaminerState("idle"); setAchievementId(""); setCompletedDate("");
    setExaminerMessage(language === "es" ? "La cámara ha sido reiniciada. Intenta no decepcionarme dos veces de la misma forma." : "The chamber has been reset. Try not to disappoint me twice in the same way.");
  };

  if (phase === "angel") return <LabDialogue subject="angel" title="ÁNGEL" role="LAB DIRECTOR" lines={challenge.narrative.angel} language={language} finalLabel={language === "es" ? "Transferir sesión" : "Transfer session"} onComplete={() => transitionTo("transfer")} allowSkip />;
  if (phase === "transfer") return <LabTransmission motionEnabled={motionEnabled} onComplete={goToExaminer} />;
  if (phase === "chimuelo") return <LabDialogue subject="chimuelo" title="CHIMUELO" role="SENIOR DEBUG EXAMINER" lines={challenge.narrative.examiner} language={language} finalLabel="BEGIN EXAM" onComplete={() => transitionTo("challenge")} />;
  if (phase === "success") return <SuccessSequence language={language} motionEnabled={motionEnabled} chamber={challenge.chamber} onComplete={finishSequence} />;
  if (phase === "evaluation") return <LabDialogue subject="chimuelo" title="CHIMUELO" role="FINAL EVALUATION" lines={evaluationLines} language={language} finalLabel={language === "es" ? "Recibir medalla" : "Receive medal"} onComplete={() => transitionTo("results")} />;
  if (phase === "results") return <DebugResults challenge={challenge} language={language} score={score} hints={hintIndex} attempts={attempts} certificateId={achievementId} completedDate={completedDate} onRetry={reset} onBack={onBack} />;

  return (
    <main className="debug-challenge" id="lab-main" tabIndex={-1}>
      <div className="debug-ambient-code" aria-hidden="true"><span>{challenge.medalMark}</span><i /><i /><i /><i /></div>
      <header className="debug-header"><button type="button" onClick={onBack}><FiArrowLeft />CHAMBERS</button><div><span>TENSHI LAB</span><strong>TEST CHAMBER {challenge.chamber}</strong></div><b>{challenge.language.toUpperCase()} / {challenge.difficulty.toUpperCase()}</b></header>
      <section className="debug-stats" aria-label={language === "es" ? "Estado de la prueba" : "Test status"}>
        <div><span>SCORE</span><strong>{score}</strong>{scoreDelta && <em key={`${scoreDelta}-${score}`}>{scoreDelta}</em>}</div>
        <div><span>HINTS</span><strong>{String(hintIndex).padStart(2, "0")}</strong></div>
        <div><span>ATTEMPTS</span><strong>{String(attempts).padStart(2, "0")}</strong></div>
        <div><span>STATUS</span><strong>{running ? "RUNNING" : result ? result.passed ? "PASSED" : "FAILED" : "READY"}</strong></div>
      </section>
      <div className="debug-workspace">
        <section className="debug-main-column">
          <div className="debug-mission"><span>MISSION</span><p>{challenge.mission[language]}</p><small>EXPECTED OUTPUT <code>{challenge.expectedOutput}</code></small></div>
          <DebugEditor code={code} onChange={(value) => { setCode(value); setResult(null); }} language={language} mode={challenge.language} fileName={challenge.editorFile} disabled={running} />
          <button className="debug-run" type="button" onClick={runCode} disabled={running}><FiPlay />{running ? "RUNNING..." : "RUN CODE"}<span>CTRL / CMD {language === "es" ? "libre" : "unrestricted"}</span></button>
          <DebugConsole result={result} running={running} challenge={challenge} language={language} />
        </section>
        <DebugExaminer language={language} message={examinerMessage} state={examinerState} challenge={challenge} hintIndex={hintIndex} onHint={requestHint} disabled={running} />
      </div>
    </main>
  );
}
