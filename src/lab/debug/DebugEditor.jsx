import { useMemo, useRef, useState } from "react";

const patterns = {
  python: {
    split: /(#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:def|return|if|else|for|in|True|False|None)\b|\b(?:print|append)\b|\b\d+(?:\.\d+)?\b)/gm,
    full: /^(#.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?:def|return|if|else|for|in|True|False|None)|(?:print|append)|\d+(?:\.\d+)?)$/,
  },
  javascript: {
    split: /(\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:const|let|function|return|if|else|for|of|true|false|null)\b|\b(?:console|log)\b|\b\d+(?:\.\d+)?\b)/gm,
    full: /^(\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?:const|let|function|return|if|else|for|of|true|false|null)|(?:console|log)|\d+(?:\.\d+)?)$/,
  },
};

function tokenClass(token) {
  if (token.startsWith("#") || token.startsWith("//")) return "comment";
  if (token.startsWith('"') || token.startsWith("'")) return "string";
  if (/^\d/.test(token)) return "number";
  if (["print", "append", "console", "log"].includes(token)) return "builtin";
  return "keyword";
}

function HighlightedCode({ code, mode }) {
  const selected = patterns[mode] || patterns.python;
  const parts = code.split(selected.split);
  return <>{parts.map((part, index) => selected.full.test(part) ? <span className={`token-${tokenClass(part)}`} key={`${part}-${index}`}>{part}</span> : part)}</>;
}

export default function DebugEditor({ code, onChange, language, mode, fileName, disabled }) {
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const lines = useMemo(() => Array.from({ length: code.split("\n").length }, (_, index) => index + 1), [code]);
  const syncScroll = (event) => {
    if (!highlightRef.current) return;
    highlightRef.current.scrollTop = event.currentTarget.scrollTop;
    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };
  const insertTab = (event) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const input = event.currentTarget;
    const next = `${code.slice(0, input.selectionStart)}    ${code.slice(input.selectionEnd)}`;
    const caret = input.selectionStart + 4;
    onChange(next);
    window.requestAnimationFrame(() => { input.selectionStart = caret; input.selectionEnd = caret; });
  };
  return (
    <section className={`debug-editor${focused ? " is-focused" : ""}`} aria-labelledby="debug-editor-title">
      <header><span id="debug-editor-title">{fileName}</span><span>{mode.toUpperCase()} · UTF-8</span></header>
      <div className="debug-editor-body">
        <div className="debug-line-numbers" aria-hidden="true">{lines.map((line) => <span key={line}>{String(line).padStart(2, "0")}</span>)}</div>
        <div className="debug-code-layer">
          <pre ref={highlightRef} aria-hidden="true"><code><HighlightedCode code={code} mode={mode} />{"\n"}</code></pre>
          <textarea ref={textareaRef} value={code} onChange={(event) => onChange(event.target.value)} onScroll={syncScroll} onKeyDown={insertTab} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} disabled={disabled} spellCheck="false" autoCapitalize="off" autoCorrect="off" aria-label={language === "es" ? `Editor de código ${mode}` : `${mode} code editor`} />
        </div>
      </div>
    </section>
  );
}
