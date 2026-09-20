const blockedSyntax = /\b(?:import|from|eval|exec|open|compile|globals|locals|__\w+__)\b/;
const identifier = /^[A-Za-z_]\w*$/;

function splitArguments(source) {
  const values = [];
  let current = "";
  let quote = null;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if ((character === '"' || character === "'") && source[index - 1] !== "\\") quote = quote === character ? null : quote || character;
    if (character === "," && !quote) { values.push(current.trim()); current = ""; }
    else current += character;
  }
  if (current.trim()) values.push(current.trim());
  return values;
}

function readValue(source, scope, globals) {
  const value = source.trim();
  if (/^(['"]).*\1$/.test(value)) return value.slice(1, -1).replace(/\\(['"\\])/g, "$1");
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (identifier.test(value) && Object.hasOwn(scope, value)) return scope[value];
  if (identifier.test(value) && Object.hasOwn(globals, value)) return globals[value];
  throw new Error(`NameError: name '${value}' is not defined`);
}

function pythonRepr(value) {
  if (Array.isArray(value)) return `[${value.map(pythonRepr).join(", ")}]`;
  if (typeof value === "string") return `'${value.replaceAll("'", "\\'")}'`;
  if (value === null) return "None";
  return String(value);
}

function executeLine(line, scope, globals, output) {
  const statement = line.trim();
  if (!statement || statement.startsWith("#")) return;
  const append = statement.match(/^([A-Za-z_]\w*)\.append\((.*)\)$/);
  if (append) {
    const target = globals[append[1]] ?? scope[append[1]];
    if (!Array.isArray(target)) throw new Error(`AttributeError: '${append[1]}' has no attribute 'append'`);
    target.push(readValue(append[2], scope, globals));
    return;
  }
  if (/^[A-Za-z_]\w*\.append$/.test(statement)) return;
  const print = statement.match(/^print\((.*)\)$/);
  if (print) { output.push(pythonRepr(readValue(print[1], scope, globals))); return; }
  throw new Error(`SyntaxError: unsupported statement '${statement}'`);
}

/** Executes the small, deliberately isolated Python subset used by Lab challenges. */
export function runPythonSubset(source) {
  if (blockedSyntax.test(source)) return { ok: false, stdout: "", error: "SecurityError: instruction not available in this chamber" };
  const globals = Object.create(null);
  const functions = Object.create(null);
  const output = [];
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  try {
    for (let index = 0; index < lines.length; index += 1) {
      const raw = lines[index];
      const statement = raw.trim();
      if (!statement || statement.startsWith("#")) continue;
      const definition = statement.match(/^def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:\s*$/);
      if (definition) {
        const body = [];
        while (index + 1 < lines.length && (/^\s+/.test(lines[index + 1]) || !lines[index + 1].trim())) {
          index += 1;
          if (lines[index].trim()) body.push(lines[index].trim());
        }
        if (!body.length) throw new Error("IndentationError: expected an indented block");
        const params = splitArguments(definition[2]);
        if (params.some((param) => !identifier.test(param))) throw new Error("SyntaxError: invalid function parameters");
        functions[definition[1]] = { params, body };
        continue;
      }
      const listAssignment = statement.match(/^([A-Za-z_]\w*)\s*=\s*\[(.*)\]\s*$/);
      if (listAssignment) {
        globals[listAssignment[1]] = splitArguments(listAssignment[2]).map((item) => readValue(item, globals, globals));
        continue;
      }
      const call = statement.match(/^([A-Za-z_]\w*)\((.*)\)$/);
      if (call && functions[call[1]]) {
        const fn = functions[call[1]];
        const args = splitArguments(call[2]).map((item) => readValue(item, globals, globals));
        if (args.length !== fn.params.length) throw new Error(`TypeError: ${call[1]}() received ${args.length} arguments`);
        const scope = Object.fromEntries(fn.params.map((param, position) => [param, args[position]]));
        fn.body.forEach((line) => executeLine(line, scope, globals, output));
        continue;
      }
      executeLine(statement, globals, globals, output);
    }
    return { ok: true, stdout: output.join("\n"), error: null };
  } catch (error) {
    return { ok: false, stdout: output.join("\n"), error: error.message };
  }
}

export function evaluateChallenge(source, challenge) {
  const execution = runPythonSubset(source);
  return { ...execution, passed: execution.ok && execution.stdout.trim() === challenge.expectedOutput.trim() };
}
