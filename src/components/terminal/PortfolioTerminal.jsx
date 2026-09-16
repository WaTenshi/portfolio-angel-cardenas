import { useCallback, useEffect, useRef, useState } from "react";
import TerminalButton from "./TerminalButton";
import TerminalWindow from "./TerminalWindow";
import DomGame from "./DomGame";
import "./terminal.css";

export default function PortfolioTerminal({ context, setLanguage, setTheme, navigateTo }) {
  const [open, setOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const buttonRef = useRef(null);
  const featureRef = useRef(null);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => featureRef.current?.style.setProperty(
      "--keyboard-inset",
      `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`,
    );
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus({ preventScroll: true }));
  }, []);

  const handleAction = useCallback((action) => {
    if (action.type === "theme") setTheme(action.value);
    if (action.type === "language") setLanguage(action.value);
    if (action.type === "open") window.open(action.url, "_blank", "noopener,noreferrer");
    if (action.type === "same-tab") window.location.assign(action.url);
    if (action.type === "goto") window.setTimeout(() => navigateTo(action.target), action.delay || 0);
    if (action.type === "game") {
      setOpen(false);
      setGameOpen(true);
    }
  }, [navigateTo, setLanguage, setTheme]);

  const closeGame = useCallback(() => {
    if (document.pointerLockElement) document.exitPointerLock?.();
    if (document.fullscreenElement) document.exitFullscreen?.();
    setGameOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <div className="terminal-feature" ref={featureRef}>
      <TerminalButton ref={buttonRef} language={context.language} onClick={() => setOpen(true)} expanded={open} />
      {open && <TerminalWindow context={context} onClose={close} onAction={handleAction} />}
      {gameOpen && <DomGame language={context.language} onClose={closeGame} />}
    </div>
  );
}
