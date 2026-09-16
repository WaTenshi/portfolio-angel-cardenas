import { useState } from "react";
import { terminalCompletions } from "./terminalCommands";

export default function TerminalInput({ inputRef, onExecute, onSuggestions, commandHistory, language }) {
  const [value, setValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState(commandHistory.length);

  const submit = (event) => {
    event.preventDefault();
    onExecute(value);
    if (value.trim()) setHistoryIndex(commandHistory.length + 1);
    setValue("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandHistory.length) return;
      const next = Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(commandHistory[next] || "");
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = Math.min(commandHistory.length, historyIndex + 1);
      setHistoryIndex(next);
      setValue(commandHistory[next] || "");
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const normalized = value.trim().toLocaleLowerCase("en");
      if (!normalized) return;
      const matches = terminalCompletions.filter((item) => item.startsWith(normalized));
      if (matches.length === 1) setValue(matches[0]);
      else if (matches.length > 1) onSuggestions(matches);
    }
  };

  return (
    <form className="terminal-input-row" onSubmit={submit}>
      <label htmlFor="terminal-command">portfolio@angel:~$</label>
      <input
        ref={inputRef}
        id="terminal-command"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
        aria-label={language === "es" ? "Comando de terminal" : "Terminal command"}
      />
      <span className="terminal-cursor" aria-hidden="true" />
    </form>
  );
}
