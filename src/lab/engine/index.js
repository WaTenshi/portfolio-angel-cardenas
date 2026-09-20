import { evaluateChallenge as evaluatePythonChallenge } from "./pythonSubset.js";
import { evaluateJavaScriptChallenge } from "./javascriptSubset.js";

export function evaluateDebugChallenge(source, challenge) {
  if (challenge.engine === "python-subset") return evaluatePythonChallenge(source, challenge);
  if (challenge.engine === "javascript-subset") return evaluateJavaScriptChallenge(source, challenge);
  return { ok: false, passed: false, stdout: "", error: `Unknown engine: ${challenge.engine}` };
}
