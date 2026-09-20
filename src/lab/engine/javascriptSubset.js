const blockedSyntax = /\b(?:fetch|XMLHttpRequest|import|require|eval|Function|document|window|globalThis|process|WebSocket)\b/;
const identifier = /^[A-Za-z_$][\w$]*$/;

function readAtom(source, scope, globals, functions) {
  const value = source.trim();
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (/^(['"]).*\1$/.test(value)) return value.slice(1, -1);
  if (value === "true" || value === "false") return value === "true";
  const call = value.match(/^([A-Za-z_$][\w$]*)\((.*)\)$/);
  if (call && functions[call[1]]) return runFunction(functions[call[1]], splitArguments(call[2]), globals, functions);
  if (identifier.test(value) && Object.hasOwn(scope, value)) return scope[value];
  if (identifier.test(value) && Object.hasOwn(globals, value)) return globals[value];
  throw new Error(`ReferenceError: ${value} is not defined`);
}

function splitArguments(source) {
  if (!source.trim()) return [];
  return source.split(",").map((item) => item.trim());
}

function readExpression(source, scope, globals, functions) {
  const expression = source.trim().replace(/;$/, "");
  const binary = expression.match(/^(.+?)\s*(===|!==|\+|-|\*|\/)\s*(.+)$/);
  if (!binary) return readAtom(expression, scope, globals, functions);
  const left = readAtom(binary[1], scope, globals, functions);
  const right = readAtom(binary[3], scope, globals, functions);
  const operations = {
    "+": () => left + right,
    "-": () => left - right,
    "*": () => left * right,
    "/": () => left / right,
    "===": () => left === right,
    "!==": () => left !== right,
  };
  return operations[binary[2]]();
}

function runFunction(fn, rawArgs, globals, functions) {
  const values = rawArgs.map((argument) => readExpression(argument, globals, globals, functions));
  if (values.length !== fn.params.length) throw new Error(`TypeError: expected ${fn.params.length} arguments`);
  const scope = Object.fromEntries(fn.params.map((param, index) => [param, values[index]]));
  for (const line of fn.body) {
    const declaration = line.match(/^(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(.+);$/);
    if (declaration) { scope[declaration[1]] = readExpression(declaration[2], scope, globals, functions); continue; }
    if (/^return\s+/.test(line)) return readExpression(line.replace(/^return\s+/, ""), scope, globals, functions);
    throw new Error(`SyntaxError: unsupported function statement '${line}'`);
  }
  return undefined;
}

export function runJavaScriptSubset(source) {
  if (blockedSyntax.test(source)) return { ok: false, stdout: "", error: "SecurityError: instruction not available in this chamber" };
  const globals = Object.create(null);
  const functions = Object.create(null);
  const output = [];
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  try {
    for (let index = 0; index < lines.length; index += 1) {
      const statement = lines[index].trim();
      if (!statement || statement.startsWith("//")) continue;
      const definition = statement.match(/^function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{$/);
      if (definition) {
        const body = [];
        while (++index < lines.length && lines[index].trim() !== "}") if (lines[index].trim()) body.push(lines[index].trim());
        if (lines[index]?.trim() !== "}") throw new Error("SyntaxError: missing closing brace");
        const params = splitArguments(definition[2]);
        if (params.some((param) => !identifier.test(param))) throw new Error("SyntaxError: invalid parameters");
        functions[definition[1]] = { params, body };
        continue;
      }
      const declaration = statement.match(/^(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(.+);$/);
      if (declaration) { globals[declaration[1]] = readExpression(declaration[2], globals, globals, functions); continue; }
      const log = statement.match(/^console\.log\((.*)\);?$/);
      if (log) { output.push(String(readExpression(log[1], globals, globals, functions))); continue; }
      throw new Error(`SyntaxError: unsupported statement '${statement}'`);
    }
    return { ok: true, stdout: output.join("\n"), error: null };
  } catch (error) {
    return { ok: false, stdout: output.join("\n"), error: error.message };
  }
}

export function evaluateJavaScriptChallenge(source, challenge) {
  const execution = runJavaScriptSubset(source);
  return { ...execution, passed: execution.ok && execution.stdout.trim() === challenge.expectedOutput.trim() };
}
