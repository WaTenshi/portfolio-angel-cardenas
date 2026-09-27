import { useCallback, useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronLeft, FiChevronRight, FiCrosshair, FiRadio, FiVolume2, FiVolumeX, FiX } from "react-icons/fi";
import angelPortrait from "../../assets/dom/angel-dialogue-pixel.webp";
import chimueloPortrait from "../../assets/lab/chimuelo-debug-examiner.png";
import { clampSpotlightRect, positionTourCard, tacticalCopy, tacticalDialogue, tacticalTourSteps } from "./tourContent.js";
import "./tacticalTour.css";

function PortraitFeed({ subject, active, language }) {
  const angel = subject === "angel";
  const name = angel ? "ÁNGEL" : "CHIMUELO";
  return (
    <figure className={`codec-portrait codec-portrait-${subject}${active ? " is-active" : ""}`}>
      <div className="codec-portrait-image">
        <img
          src={angel ? angelPortrait : chimueloPortrait}
          alt={angel ? (language === "es" ? "Retrato pixel art de Ángel" : "Pixel-art portrait of Ángel") : (language === "es" ? "Retrato pixel art de Chimuelo" : "Pixel-art portrait of Chimuelo")}
          decoding="async"
        />
        <span className="codec-portrait-scan" aria-hidden="true" />
      </div>
      <figcaption><i aria-hidden="true" />{name}<small>{angel ? "DIRECTOR" : "EXAMINER"}</small></figcaption>
    </figure>
  );
}

function SignalCore({ ringing = false }) {
  return (
    <div className={`codec-signal-core${ringing ? " is-ringing" : ""}`} aria-hidden="true">
      <span>PTT</span>
      <div className="codec-bars">{Array.from({ length: 11 }, (_, index) => <i key={index} />)}</div>
      <strong>141.27</strong>
      <div className="codec-wave">{Array.from({ length: 18 }, (_, index) => <i key={index} />)}</div>
      <small>AC / SECURE CHANNEL</small>
    </div>
  );
}

function CodecControls({ copy, audio, muted, setMuted, onClose }) {
  const toggleSound = () => setMuted(audio.setMuted(!muted));
  return (
    <div className="codec-global-controls">
      <button type="button" onClick={toggleSound} aria-label={!audio.available ? copy.unavailable : muted ? copy.unmute : copy.mute} aria-pressed={muted} disabled={!audio.available}>
        {muted || !audio.available ? <FiVolumeX /> : <FiVolume2 />}<span>{!audio.available ? copy.unavailable : muted ? copy.soundOff : copy.soundOn}</span>
      </button>
      <button className="tactical-tour-close" type="button" onClick={onClose} aria-label={copy.close}><FiX /><span>{copy.close}</span></button>
    </div>
  );
}

export default function TacticalTour({ language, motionEnabled, audio, onClose }) {
  const copy = tacticalCopy[language];
  const dialogRef = useRef(null);
  const focusRef = useRef(null);
  const targetRef = useRef(null);
  const frameRequest = useRef(null);
  const [phase, setPhase] = useState("ringing");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState(null);
  const [cardPosition, setCardPosition] = useState({ left: 16, top: 16 });
  const [muted, setMuted] = useState(audio.muted);
  const currentDialogue = tacticalDialogue[dialogueIndex];
  const currentLine = currentDialogue.text[language];
  const currentStep = tacticalTourSteps[stepIndex];
  const visibleLength = motionEnabled ? typedLength : currentLine.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.classList.add("tactical-tour-active");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => focusRef.current?.focus({ preventScroll: true }));
    const visibility = () => { if (document.hidden) audio.suspend(); };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      document.body.classList.remove("tactical-tour-active");
      document.body.style.overflow = previousOverflow;
      if (dialog?.open) dialog.close();
    };
  }, [audio]);

  useEffect(() => {
    if (phase !== "ringing") return undefined;
    const timer = window.setTimeout(() => {
      setPhase("dialogue");
      if (!document.hidden) audio.blip("next");
    }, motionEnabled ? 1550 : 650);
    return () => window.clearTimeout(timer);
  }, [audio, motionEnabled, phase]);

  useEffect(() => {
    if (phase !== "dialogue" || !motionEnabled) return undefined;
    const timer = window.setInterval(() => {
      setTypedLength((length) => {
        if (length >= currentLine.length) { window.clearInterval(timer); return length; }
        return Math.min(currentLine.length, length + 2);
      });
    }, 22);
    return () => window.clearInterval(timer);
  }, [currentLine, motionEnabled, phase]);

  const measureTarget = useCallback(() => {
    if (!targetRef.current) return;
    window.cancelAnimationFrame(frameRequest.current);
    frameRequest.current = window.requestAnimationFrame(() => {
      const raw = targetRef.current?.getBoundingClientRect();
      if (!raw) return;
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const rect = clampSpotlightRect(raw, viewport, window.innerWidth < 600 ? 7 : 12);
      setSpotlight(rect);
      setCardPosition(positionTourCard(rect, viewport, { width: Math.min(390, viewport.width - 32), height: 270 }));
    });
  }, []);

  useEffect(() => {
    if (phase !== "tour") return undefined;
    const target = document.querySelector(`[data-tour-id="${currentStep.target}"]`);
    if (!target) return undefined;
    targetRef.current?.classList.remove("is-tactical-target");
    targetRef.current = target;
    target.classList.add("is-tactical-target");
    document.body.style.overflow = "";
    target.scrollIntoView({ behavior: motionEnabled ? "smooth" : "instant", block: currentStep.id === "lab" ? "start" : "center" });
    const timer = window.setTimeout(measureTarget, motionEnabled ? 520 : 20);
    const observer = new ResizeObserver(measureTarget);
    observer.observe(target);
    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frameRequest.current);
      observer.disconnect();
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget);
      target.classList.remove("is-tactical-target");
    };
  }, [currentStep, measureTarget, motionEnabled, phase]);

  useEffect(() => {
    requestAnimationFrame(() => focusRef.current?.focus({ preventScroll: true }));
  }, [phase, stepIndex]);

  const beginTour = () => {
    audio.blip("complete");
    setPhase("tour");
    setStepIndex(0);
    setSpotlight(null);
  };

  const advanceDialogue = () => {
    if (visibleLength < currentLine.length) { setTypedLength(currentLine.length); return; }
    if (dialogueIndex === tacticalDialogue.length - 1) { beginTour(); return; }
    audio.blip("next");
    setTypedLength(0);
    setDialogueIndex((index) => index + 1);
  };

  const changeStep = (direction) => {
    const next = stepIndex + direction;
    if (next < 0) return;
    if (next >= tacticalTourSteps.length) {
      audio.blip("complete");
      document.body.style.overflow = "hidden";
      setPhase("complete");
      setSpotlight(null);
      return;
    }
    audio.blip(direction < 0 ? "back" : "next");
    setSpotlight(null);
    setStepIndex(next);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      if (phase === "dialogue") { event.preventDefault(); advanceDialogue(); }
      if (phase === "tour") { event.preventDefault(); changeStep(1); }
    }
    if (event.key === "ArrowLeft" && phase === "tour") { event.preventDefault(); changeStep(-1); }
  };

  const ariaTitle = phase === "tour" ? copy.tourTitle : copy.dialogueTitle;
  const spotlightStyle = spotlight ? { left: spotlight.left, top: spotlight.top, width: spotlight.width, height: spotlight.height } : undefined;
  const tourCardStyle = { left: cardPosition.left, top: cardPosition.top };

  return (
    <dialog
      ref={dialogRef}
      className={`tactical-tour-dialog phase-${phase}${motionEnabled ? "" : " motion-off"}`}
      aria-labelledby="tactical-tour-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <h2 className="sr-only" id="tactical-tour-title">{ariaTitle}</h2>
      {(phase === "ringing" || phase === "dialogue") && (
        <div className={`codec-shell${phase === "ringing" ? " is-ringing" : " is-connected"}`}>
          <div className="codec-noise" aria-hidden="true" />
          <CodecControls copy={copy} audio={audio} muted={muted} setMuted={setMuted} onClose={onClose} />
          <header className="codec-header"><span>AC / TACTICAL PORTFOLIO LINK</span><b>{phase === "ringing" ? "CALLING" : "CONNECTED"}</b></header>
          <div className="codec-grid">
            <PortraitFeed subject="chimuelo" active={phase === "dialogue" && currentDialogue.speaker === "chimuelo"} language={language} />
            <SignalCore ringing={phase === "ringing"} />
            <PortraitFeed subject="angel" active={phase === "dialogue" && currentDialogue.speaker === "angel"} language={language} />
          </div>
          {phase === "ringing" ? (
            <section className="codec-incoming" aria-live="polite">
              <FiRadio aria-hidden="true" />
              <span>{copy.frequency}</span>
              <h3>{copy.incoming}</h3>
              <p>{copy.connecting}</p>
              <button ref={focusRef} type="button" onClick={beginTour}>{copy.skipCall}<FiChevronRight /></button>
            </section>
          ) : (
            <section className="codec-dialogue" aria-labelledby="codec-speaker">
              <header><span id="codec-speaker">{currentDialogue.speaker === "angel" ? "ÁNGEL" : "CHIMUELO"}</span><small>{String(dialogueIndex + 1).padStart(2, "0")} / {String(tacticalDialogue.length).padStart(2, "0")}</small></header>
              <p className="sr-only" role="status" aria-atomic="true">{currentLine}</p>
              <p className="codec-typed-line" aria-hidden="true">{currentLine.slice(0, visibleLength)}<i /></p>
              <div className="codec-dialogue-actions">
                <button type="button" onClick={beginTour}>{copy.skipCall}</button>
                <button ref={focusRef} className="codec-primary" type="button" onClick={advanceDialogue}>{dialogueIndex === tacticalDialogue.length - 1 && visibleLength >= currentLine.length ? copy.begin : copy.continue}<FiChevronRight /></button>
              </div>
            </section>
          )}
          <footer className="codec-footer"><span>MEM / ROUTE 14</span><span>PTT / STABLE</span><span>TENSHI SYSTEM / 2026</span></footer>
        </div>
      )}

      {phase === "tour" && (
        <div className="tactical-tour-stage">
          <div className="tactical-tour-interceptor" aria-hidden="true" />
          {spotlight && <div className="tactical-spotlight" style={spotlightStyle} aria-hidden="true"><i /><i /><i /><i /><span>{currentStep.code}</span></div>}
          <section ref={focusRef} tabIndex={-1} className="tactical-tour-card" style={tourCardStyle} aria-labelledby="tactical-step-title" aria-describedby="tactical-step-body">
            <p className="sr-only" role="status" aria-atomic="true">{copy.step} {stepIndex + 1} / {tacticalTourSteps.length}. {currentStep.title[language]}. {currentStep.body[language]}</p>
            <header><span><FiCrosshair />{currentStep.code}</span><button type="button" onClick={onClose} aria-label={copy.close}><FiX /></button></header>
            <div className="tactical-tour-progress"><i style={{ width: `${((stepIndex + 1) / tacticalTourSteps.length) * 100}%` }} /><span>{copy.step} {String(stepIndex + 1).padStart(2, "0")} / {String(tacticalTourSteps.length).padStart(2, "0")}</span></div>
            <h3 id="tactical-step-title">{currentStep.title[language]}</h3>
            <p id="tactical-step-body">{currentStep.body[language]}</p>
            <footer>
              <button type="button" onClick={() => changeStep(-1)} disabled={stepIndex === 0}><FiChevronLeft />{copy.previous}</button>
              <button className="codec-primary" type="button" onClick={() => changeStep(1)}>{stepIndex === tacticalTourSteps.length - 1 ? copy.finish : copy.next}{stepIndex === tacticalTourSteps.length - 1 ? <FiCheck /> : <FiChevronRight />}</button>
            </footer>
          </section>
        </div>
      )}

      {phase === "complete" && (
        <section className="tactical-tour-complete">
          <div className="complete-radar" aria-hidden="true"><i /><i /><FiCheck /></div>
          <span>{copy.completeEyebrow}</span>
          <h3>{copy.completeTitle}</h3>
          <p>{copy.completeBody}</p>
          <button ref={focusRef} className="codec-primary" type="button" onClick={onClose}>{copy.explore}<FiChevronRight /></button>
        </section>
      )}
    </dialog>
  );
}
