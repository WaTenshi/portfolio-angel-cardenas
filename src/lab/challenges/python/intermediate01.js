export const pythonIntermediate01 = {
  id: "python-intermediate-01",
  route: "debug/python/intermediate",
  language: "python",
  difficulty: "intermediate",
  chamber: "03",
  engine: "python-subset",
  editorFile: "sessions.py",
  medalMark: "PY",
  certificatePrefix: "TL-PY02",
  title: { es: "Python intermedio", en: "Intermediate Python" },
  mission: {
    es: "La función debe informar cuántas sesiones continúan activas después de retirar las expiradas.",
    en: "The function must report how many sessions remain active after expired sessions are removed.",
  },
  initialCode: `def active_sessions(total, expired):
    return total + expired

print(active_sessions(48, 13))`,
  expectedOutput: "35",
  hints: [
    { cost: 8, text: { es: "Las sesiones expiradas no deberían aumentar la capacidad activa.", en: "Expired sessions should not increase active capacity." } },
    { cost: 15, text: { es: "Compara el nombre `expired` con el operador usado en el retorno.", en: "Compare the name `expired` with the operator used in the return statement." } },
    { cost: 25, text: { es: "Retira `expired` de `total` en vez de agregarlo.", en: "Remove `expired` from `total` instead of adding it." } },
  ],
  score: { initial: 100, failedAttemptCost: 3, freeFailedAttempts: 1 },
  narrative: {
    angel: [
      { es: "Cámara 03. Python intermedio.", en: "Chamber 03. Intermediate Python." },
      { es: "El monitor de sesiones está inflando una cifra que debería disminuir.", en: "The session monitor is inflating a number that should decrease." },
      { es: "La función recibe datos válidos, termina sin errores y aun así miente.", en: "The function receives valid data, finishes without errors, and still lies." },
      { es: "Aquí comienza el debugging incómodo: cuando la sintaxis es inocente.", en: "This is where uncomfortable debugging begins: when the syntax is innocent." },
      { es: "Chimuelo quiere el número real antes de cerrar conexiones sanas.", en: "Chimuelo wants the real number before healthy connections are closed." },
    ],
    examiner: [
      { es: "Python intermedio. Las sesiones caducaron; el bug, lamentablemente, no.", en: "Intermediate Python. The sessions expired; unfortunately, the bug did not." },
      { es: "El resultado debe representar lo que permanece activo, no todo lo que alguna vez existió.", en: "The result must represent what remains active, not everything that ever existed." },
      { es: "La función ejecuta correctamente. Su razonamiento no disfruta del mismo privilegio.", en: "The function executes correctly. Its reasoning does not enjoy the same privilege." },
      { es: "Tienes tres pistas. Cada una será registrada con la severidad apropiada.", en: "You have three hints. Each will be recorded with the appropriate severity." },
      { es: "Corrige la relación entre el total y lo expirado.", en: "Correct the relationship between the total and the expired amount." },
    ],
    failures: {
      es: ["Ahora tenemos más sesiones activas que antes de expirar. Matemáticamente creativo.", "La cifra continúa creciendo en la dirección equivocada.", "El servidor discrepa. Yo también."],
      en: ["We now have more active sessions than before expiration. Mathematically creative.", "The number continues growing in the wrong direction.", "The server disagrees. So do I."],
    },
    completion: {
      es: "Treinta y cinco sesiones activas. La telemetría vuelve a respetar la realidad.",
      en: "Thirty-five active sessions. Telemetry respects reality again.",
    },
  },
};

export default pythonIntermediate01;
