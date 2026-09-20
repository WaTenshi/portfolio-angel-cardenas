import pythonBasic01 from "./python/basic01.js";
import pythonIntermediate01 from "./python/intermediate01.js";
import pythonHard01 from "./python/hard01.js";
import javascriptBasic01 from "./javascript/basic01.js";
import javascriptIntermediate01 from "./javascript/intermediate01.js";
import javascriptHard01 from "./javascript/hard01.js";

export const debugChallenges = [
  pythonBasic01,
  pythonIntermediate01,
  pythonHard01,
  javascriptBasic01,
  javascriptIntermediate01,
  javascriptHard01,
];

export function getDebugChallenge(id) {
  return debugChallenges.find((challenge) => challenge.id === id) || null;
}
