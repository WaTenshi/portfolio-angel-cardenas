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

function readAtom(source, scope, globals, functions) {
  const value = source.trim();
  if (/^(['"]).*\1$/.test(value)) return value.slice(1, -1).replace(/\\(['"\\])/g, "$1");
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (value === "True" || value === "False") return value === "True";
  const call = value.match(/^([A-Za-z_]\w*)\((.*)\)$/);
  if (call && functions[call[1]]) return runFunction(functions[call[1]], splitArguments(call[2]), globals, functions);
  if (identifier.test(value) && Object.hasOwn(scope, value)) return scope[value];
  if (identifier.test(value) && Object.hasOwn(globals, value)) return globals[value];
  throw new Error(`NameError: name '${value}' is not defined`);
}

function readExpression(source, scope, globals, functions) {
  const expression = source.trim();
  const binary = expression.match(/^(.+?)\s*(==|!=|\+|-|\*|\/)\s*(.+)$/);
  if (!binary) return readAtom(expression, scope, globals, functions);
  const left = readAtom(binary[1], scope, globals, functions);
  const right = readAtom(binary[3], scope, globals, functions);
  const operations = {
    "+": () => left + right,
    "-": () => left - right,
    "*": () => left * right,
    "/": () => left / right,
    "==": () => left === right,
    "!=": () => left !== right,
  };
  return operations[binary[2]]();
}

function pythonRepr(value) {
  if (Array.isArray(value)) return `[${value.map(pythonRepr).join(", ")}]`;
  if (typeof value === "string") return `'${value.replaceAll("'", "\\'")}'`;
  if (value === null) return "None";
  return String(value);
}

function executeLine(line, scope, globals, functions, output) {
  const statement = line.trim();
  if (!statement || statement.startsWith("#")) return;
  const append = statement.match(/^([A-Za-z_]\w*)\.append\((.*)\)$/);
  if (append) {
    const target = globals[append[1]] ?? scope[append[1]];
    if (!Array.isArray(target)) throw new Error(`AttributeError: '${append[1]}' has no attribute 'append'`);
    target.push(readExpression(append[2], scope, globals, functions));
    return;
  }
  if (/^[A-Za-z_]\w*\.append$/.test(statement)) return;
  const print = statement.match(/^print\((.*)\)$/);
  if (print) { output.push(pythonRepr(readExpression(print[1], scope, globals, functions))); return; }
  throw new Error(`SyntaxError: unsupported statement '${statement}'`);
}

function runFunction(fn, rawArgs, globals, functions) {
  const args = rawArgs.map((item) => readExpression(item, globals, globals, functions));
  if (args.length !== fn.params.length) throw new Error(`TypeError: function received ${args.length} arguments`);
  const scope = Object.fromEntries(fn.params.map((param, position) => [param, args[position]]));
  for (const line of fn.body) {
    const assignment = line.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
    if (assignment) { scope[assignment[1]] = readExpression(assignment[2], scope, globals, functions); continue; }
    const returned = line.match(/^return\s+(.+)$/);
    if (returned) return readExpression(returned[1], scope, globals, functions);
    executeLine(line, scope, globals, functions, []);
  }
  return null;
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
        globals[listAssignment[1]] = splitArguments(listAssignment[2]).map((item) => readExpression(item, globals, globals, functions));
        continue;
      }
      const scalarAssignment = statement.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
      if (scalarAssignment) { globals[scalarAssignment[1]] = readExpression(scalarAssignment[2], globals, globals, functions); continue; }
      const call = statement.match(/^([A-Za-z_]\w*)\((.*)\)$/);
      if (call && functions[call[1]]) {
        const fn = functions[call[1]];
        const args = splitArguments(call[2]).map((item) => readExpression(item, globals, globals, functions));
        if (args.length !== fn.params.length) throw new Error(`TypeError: ${call[1]}() received ${args.length} arguments`);
        const scope = Object.fromEntries(fn.params.map((param, position) => [param, args[position]]));
        fn.body.forEach((line) => executeLine(line, scope, globals, functions, output));
        continue;
      }
      executeLine(statement, globals, globals, functions, output);
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
