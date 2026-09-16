import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import TerminalInput from "./TerminalInput";
import { executeTerminalCommand } from "./terminalCommands";

const initialOutput = (language) => ({
  id: "welcome",
  type: "system",
  lines: [
    "Ángel Terminal v1.0",
    "",
    language === "es" ? "Bienvenido a la terminal de mi portfolio." : "Welcome to my portfolio terminal.",
    language === "es" ? 'Escribe "help" para explorar.' : 'Type "help" to explore.',
  ],
});

export default function TerminalWindow({ context, onClose, onAction }) {
  const { language } = context;
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const [entries, setEntries] = useState(() => [initialOutput(language)]);
  const [commandHistory, setCommandHistory] = useState([]);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
    const handleCancel = (event) => {
      event.preventDefault();
      onClose();
    };
    dialog?.addEventListener("cancel", handleCancel);
    return () => {
      dialog?.removeEventListener("cancel", handleCancel);
      if (dialog?.open) dialog.close();
    };
  }, [onClose]);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [entries]);

  const run = (rawInput) => {
    const input = rawInput.trim();
    if (!input) return;
    const result = executeTerminalCommand(input, context);
    setCommandHistory((history) => [...history, input]);

    if (result.clear) {
      setEntries([]);
    } else {
      setEntries((current) => [
        ...current,
        { id: `${Date.now()}-command`, type: "command", lines: [input] },
        ...(result.lines.length ? [{ id: `${Date.now()}-output`, type: "output", lines: result.lines }] : []),
      ]);
    }

    if (result.close) {
      const delay = result.action?.delay || 0;
      window.setTimeout(onClose, delay);
    }
    if (result.action) onAction(result.action);
  };

  const showSuggestions = (matches) => {
    setEntries((current) => [...current, { id: `${Date.now()}-suggestions`, type: "output", lines: [matches.join("    ")] }]);
  };

  return (
    <dialog ref={dialogRef} id="portfolio-terminal" className="terminal-dialog" aria-labelledby="terminal-title">
      <div className="terminal-window">
        <header className="terminal-titlebar">
          <div className="terminal-dots" aria-hidden="true"><i /><i /><i /></div>
          <div className="terminal-title">
            <span id="terminal-title">Ángel Terminal</span>
            <small>portfolio / shell</small>
          </div>
          <button type="button" onClick={onClose} aria-label={language === "es" ? "Cerrar terminal" : "Close terminal"}>
            <FiX aria-hidden="true" />
          </button>
        </header>
        <div ref={outputRef} className="terminal-output" onClick={() => inputRef.current?.focus()}>
          <div role="log" aria-live="polite" aria-relevant="additions text">
            {entries.map((entry) => (
              <div className={`terminal-entry terminal-entry-${entry.type}`} key={entry.id}>
                {entry.type === "command" && <span className="terminal-prompt" aria-hidden="true">portfolio@angel:~$</span>}
                <div>{entry.lines.map((line, index) => <div key={`${entry.id}-${index}`}>{line || "\u00a0"}</div>)}</div>
              </div>
            ))}
          </div>
          <TerminalInput inputRef={inputRef} onExecute={run} onSuggestions={showSuggestions} commandHistory={commandHistory} language={language} />
        </div>
        <footer className="terminal-statusbar">
          <span>{language.toUpperCase()}</span>
          <span>UTF-8</span>
          <span>{context.theme === "dark" ? "DARK" : "LIGHT"}</span>
        </footer>
      </div>
    </dialog>
  );
}
