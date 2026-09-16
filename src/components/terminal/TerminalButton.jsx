import { forwardRef } from "react";
import { FiTerminal } from "react-icons/fi";

const TerminalButton = forwardRef(function TerminalButton({ language, onClick, expanded }, ref) {
  const label = language === "es" ? "Abrir terminal interactiva" : "Open interactive terminal";
  return (
    <button
      ref={ref}
      className="terminal-fab"
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls="portfolio-terminal"
      title={label}
    >
      <FiTerminal aria-hidden="true" />
      <span>Terminal</span>
    </button>
  );
});

export default TerminalButton;
