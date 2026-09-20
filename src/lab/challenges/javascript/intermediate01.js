export const javascriptIntermediate01 = {
  id: "javascript-intermediate-01",
  route: "debug/javascript/intermediate",
  language: "javascript",
  difficulty: "intermediate",
  chamber: "04",
  engine: "javascript-subset",
  editorFile: "deploy.js",
  medalMark: "JS",
  certificatePrefix: "TL-JS02",
  title: { es: "JavaScript intermedio", en: "Intermediate JavaScript" },
  mission: {
    es: "Autoriza el despliegue únicamente cuando las pruebas y la revisión coinciden en estado aprobado.",
    en: "Authorize deployment only when tests and review agree on an approved state.",
  },
  initialCode: `const testsPassing = true;
const reviewed = true;

function canDeploy(testsPassing, reviewed) {
  return testsPassing !== reviewed;
}

console.log(canDeploy(testsPassing, reviewed));`,
  expectedOutput: "true",
  hints: [
    { cost: 8, text: { es: "Ambas señales están aprobadas, pero la función rechaza que coincidan.", en: "Both signals are approved, but the function rejects their agreement." } },
    { cost: 15, text: { es: "Observa qué pregunta realmente el operador del `return`.", en: "Look at what the operator in the `return` is actually asking." } },
    { cost: 25, text: { es: "La condición debe comprobar igualdad estricta, no diferencia estricta.", en: "The condition must check strict equality, not strict inequality." } },
  ],
  score: { initial: 100, failedAttemptCost: 3, freeFailedAttempts: 1 },
  narrative: {
    angel: [
      { es: "Cámara 04. JavaScript intermedio.", en: "Chamber 04. Intermediate JavaScript." },
      { es: "El guardián del despliegue está rechazando el caso más seguro posible.", en: "The deployment guard is rejecting the safest possible case." },
      { es: "Pruebas aprobadas. Revisión aprobada. Resultado: acceso denegado.", en: "Tests approved. Review approved. Result: access denied." },
      { es: "El bug está en una comparación pequeña con autoridad excesiva.", en: "The bug lives in a small comparison with excessive authority." },
      { es: "Chimuelo no permitirá producción hasta que la condición diga lo que promete.", en: "Chimuelo will not allow production until the condition says what it promises." },
    ],
    examiner: [
      { es: "JavaScript intermedio. Dos booleanos entran. Una decisión equivocada sale.", en: "Intermediate JavaScript. Two booleans enter. One wrong decision leaves." },
      { es: "Las señales coinciden y ambas son verdaderas.", en: "The signals agree and both are true." },
      { es: "No confundas detectar diferencias con validar consenso.", en: "Do not confuse detecting differences with validating agreement." },
      { es: "La coerción no participa. El operador sí.", en: "Coercion is not involved. The operator is." },
      { es: "Devuelve una autorización coherente y abre el pipeline.", en: "Return a coherent authorization and open the pipeline." },
    ],
    failures: {
      es: ["Producción sigue cerrada mientras todo está aprobado. Admirable sabotaje.", "La condición continúa premiando el desacuerdo.", "Los booleanos son simples. La decisión aún no."],
      en: ["Production remains closed while everything is approved. Admirable sabotage.", "The condition continues rewarding disagreement.", "The booleans are simple. The decision still is not."],
    },
    completion: {
      es: "Consenso validado. El pipeline reconoce finalmente una aprobación.",
      en: "Agreement validated. The pipeline finally recognizes an approval.",
    },
  },
};

export default javascriptIntermediate01;
