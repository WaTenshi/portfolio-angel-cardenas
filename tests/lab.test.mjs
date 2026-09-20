import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { routeFromPath } from '../src/blog/paths.js';
import pythonChallenge from '../src/lab/challenges/python/basic01.js';
import javascriptChallenge from '../src/lab/challenges/javascript/basic01.js';
import { debugChallenges, getDebugChallenge } from '../src/lab/challenges/index.js';
import { evaluateChallenge, runPythonSubset } from '../src/lab/engine/pythonSubset.js';
import { evaluateJavaScriptChallenge, runJavaScriptSubset } from '../src/lab/engine/javascriptSubset.js';
import { experiments } from '../src/lab/labData.js';
import { executeTerminalCommand } from '../src/components/terminal/terminalCommands.js';

const base = '/portfolio-angel-cardenas/';

test('lab routes work as direct GitHub Pages routes', () => {
  for (const suffix of ['lab', 'lab/', 'lab/index.html']) assert.deepEqual(routeFromPath(base + suffix, base), { type: 'lab' });
  for (const suffix of ['lab/dum', 'lab/dum/', 'lab/dum/index.html']) assert.deepEqual(routeFromPath(base + suffix, base), { type: 'lab-dum' });
  for (const suffix of ['lab/debug', 'lab/debug/', 'lab/debug/index.html']) assert.deepEqual(routeFromPath(base + suffix, base), { type: 'lab-debug-index' });
  for (const suffix of ['lab/debug/python/basic', 'lab/debug/python/basic/', 'lab/debug/python/basic/index.html']) assert.deepEqual(routeFromPath(base + suffix, base), { type: 'lab-debug', challenge: 'python-basic-01' });
  for (const suffix of ['lab/debug/javascript/basic', 'lab/debug/javascript/basic/', 'lab/debug/javascript/basic/index.html']) assert.deepEqual(routeFromPath(base + suffix, base), { type: 'lab-debug', challenge: 'javascript-basic-01' });
});

test('lab experiment configuration remains unique and routable', () => {
  assert.equal(new Set(experiments.map(({ id }) => id)).size, experiments.length);
  assert.deepEqual(experiments.map(({ id }) => id), ['dum', 'debug-challenges']);
  for (const experiment of experiments) {
    assert.match(experiment.href, /\/lab\//);
    assert(experiment.description.es && experiment.description.en);
    assert(experiment.eyebrow.es && experiment.eyebrow.en);
  }
});

test('controlled Python engine executes behavior instead of matching a solution string', () => {
  assert.equal(evaluateChallenge(pythonChallenge.initialCode, pythonChallenge).passed, false);
  const alternative = `people = ['angel', 'nicolas']\n\ndef store(item):\n    people.append(item)\n\nstore('natasha')\nprint(people)`;
  const result = evaluateChallenge(alternative, pythonChallenge);
  assert.equal(result.passed, true);
  assert.equal(result.stdout, pythonChallenge.expectedOutput);
});

test('controlled JavaScript engine evaluates behavior and blocks browser facilities', () => {
  assert.equal(evaluateJavaScriptChallenge(javascriptChallenge.initialCode, javascriptChallenge).passed, false);
  const alternative = `const price = 120;\nconst discount = 20;\nfunction calculateFinalPrice(price, discount) {\n  return price - discount;\n}\nconsole.log(calculateFinalPrice(price, discount));`;
  const result = evaluateJavaScriptChallenge(alternative, javascriptChallenge);
  assert.equal(result.passed, true);
  assert.equal(result.stdout, javascriptChallenge.expectedOutput);
  assert.match(runJavaScriptSubset('fetch("https://example.com");').error, /SecurityError/);
  assert.match(runJavaScriptSubset('console.log(missing);').error, /ReferenceError/);
});

test('challenge registry has unique routes and complete, challenge-specific narratives', () => {
  assert.equal(new Set(debugChallenges.map(({ id }) => id)).size, debugChallenges.length);
  assert.equal(new Set(debugChallenges.map(({ route }) => route)).size, debugChallenges.length);
  assert.equal(getDebugChallenge('javascript-basic-01'), javascriptChallenge);
  for (const item of debugChallenges) {
    assert(item.title.es && item.title.en && item.mission.es && item.mission.en);
    assert(item.narrative.angel.length >= 4 && item.narrative.examiner.length >= 4);
    assert(item.narrative.failures.es.length && item.narrative.failures.en.length);
    assert(item.narrative.completion.es && item.narrative.completion.en);
  }
  assert.notDeepEqual(pythonChallenge.narrative.angel, javascriptChallenge.narrative.angel);
});

test('controlled engine reports failures and blocks unsafe facilities', () => {
  assert.match(runPythonSubset('import os').error, /SecurityError/);
  assert.match(runPythonSubset('print(missing)').error, /NameError/);
  assert.equal(runPythonSubset('users = ["a"]\nusers.append\nprint(users)').stdout, "['a']");
});

test('score configuration applies every hint once and never permits a negative score', () => {
  const afterHints = pythonChallenge.hints.reduce((score, hint) => Math.max(0, score - hint.cost), pythonChallenge.score.initial);
  assert.equal(afterHints, 52);
  const afterManyFailures = Array.from({ length: 100 }).reduce((score, _, index) => Math.max(0, score - (index + 1 > pythonChallenge.score.freeFailedAttempts ? pythonChallenge.score.failedAttemptCost : 0)), pythonChallenge.score.initial);
  assert.equal(afterManyFailures, 0);
});

test('terminal exposes Lab and Debug Challenge routes without changing DUM behavior', () => {
  const context = { language: 'es', theme: 'dark', projects: [], experience: [], skills: [], areas: [], aboutText: [], location: '', blogUrl: '/blog/', labUrl: '/lab/', debugUrl: '/lab/debug/' };
  assert.deepEqual(executeTerminalCommand('lab', context).action, { type: 'same-tab', url: '/lab/' });
  assert.deepEqual(executeTerminalCommand('debug', context).action, { type: 'same-tab', url: '/lab/debug/' });
  assert.deepEqual(executeTerminalCommand('dum', context).action, { type: 'game' });
});

test('production build emits direct Lab pages and local artwork instructions', () => {
  for (const path of ['dist/lab/index.html', 'dist/lab/dum/index.html', 'dist/lab/debug/index.html', 'dist/lab/debug/python/basic/index.html', 'dist/lab/debug/javascript/basic/index.html']) assert(existsSync(path), `${path} must exist`);
  assert.match(readFileSync('src/assets/lab/README.md', 'utf8'), /chimuelo-debug-examiner\.png/);
});
