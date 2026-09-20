import pythonBasic01 from "./python/basic01.js";
import javascriptBasic01 from "./javascript/basic01.js";

export const debugChallenges = [pythonBasic01, javascriptBasic01];

export function getDebugChallenge(id) {
  return debugChallenges.find((challenge) => challenge.id === id) || null;
}
