export default function DebugConsole({ result, running, challenge, language }) {
  const received = result?.stdout || (result?.error ? result.error : "—");
  return (
    <section className={`debug-console${result ? result.passed ? " is-passed" : " is-failed" : ""}`} aria-labelledby="debug-output-title">
      <header><span id="debug-output-title">OUTPUT / TESTS</span><b>{running ? "RUNNING..." : result ? result.passed ? "PASSED" : "FAILED" : "WAITING"}</b></header>
      <div className="debug-output" role="log" aria-live="polite">
        <code>{running ? (language === "es" ? "Ejecutando entorno aislado..." : "Running isolated environment...") : received}</code>
      </div>
      <div className="debug-test-result">
        <span>TEST {challenge.chamber}</span>
        <dl><div><dt>Expected</dt><dd><code>{challenge.expectedOutput}</code></dd></div><div><dt>Received</dt><dd><code>{result ? received : "—"}</code></dd></div></dl>
        <strong>{running ? "RUNNING" : result ? result.passed ? "PASSED" : "FAILED" : "READY"}</strong>
      </div>
    </section>
  );
}
