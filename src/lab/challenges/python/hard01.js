export const pythonHard01 = {
  id: "python-hard-01",
  route: "debug/python/hard",
  language: "python",
  difficulty: "hard",
  chamber: "05",
  engine: "python-subset",
  editorFile: "release_score.py",
  medalMark: "PY",
  certificatePrefix: "TL-PY03",
  title: { es: "Python difícil", en: "Advanced Python" },
  mission: {
    es: "Calcula el puntaje de release: pruebas aprobadas menos fallidas, multiplicado por diez.",
    en: "Calculate the release score: passed tests minus failed tests, multiplied by ten.",
  },
  initialCode: `def release_score(passed, failed):
    stable = passed + failed
    return stable / 10

print(release_score(18, 3))`,
  expectedOutput: "150",
  hints: [
    { cost: 10, text: { es: "Hay más de una operación que contradice la misión.", en: "More than one operation contradicts the mission." } },
    { cost: 18, text: { es: "Las pruebas fallidas reducen el total estable; no lo aumentan.", en: "Failed tests reduce the stable total; they do not increase it." } },
    { cost: 28, text: { es: "Primero resta `failed` de `passed`; después escala el resultado multiplicándolo por diez.", en: "First subtract `failed` from `passed`; then scale the result by multiplying it by ten." } },
  ],
  score: { initial: 100, failedAttemptCost: 5, freeFailedAttempts: 0 },
  narrative: {
    angel: [
      { es: "Cámara 05. Python difícil.", en: "Chamber 05. Advanced Python." },
      { es: "El sistema de releases está premiando fallos y reduciendo éxitos.", en: "The release system is rewarding failures and shrinking successes." },
      { es: "No hay un único accidente. Dos operaciones cooperan para producir una cifra absurda.", en: "There is not a single accident. Two operations cooperate to produce an absurd number." },
      { es: "Debes reconstruir el flujo completo, no reparar solo el primer síntoma.", en: "You must reconstruct the entire flow, not repair only the first symptom." },
      { es: "Chimuelo ha marcado esta cámara como hostil. Lo considera un cumplido.", en: "Chimuelo marked this chamber as hostile. He considers that a compliment." },
    ],
    examiner: [
      { es: "Python difícil. Dos bugs, una función y ninguna excusa estadísticamente relevante.", en: "Advanced Python. Two bugs, one function, and no statistically relevant excuses." },
      { es: "Dieciocho pruebas pasan. Tres fallan. El puntaje debe conservar esa diferencia y escalarla.", en: "Eighteen tests pass. Three fail. The score must preserve that difference and scale it." },
      { es: "Corregir una sola línea producirá un resultado distinto. No necesariamente el correcto.", en: "Correcting only one line will produce a different result. Not necessarily the correct one." },
      { es: "En esta cámara cada ejecución fallida cuesta puntos desde el primer intento.", en: "In this chamber every failed execution costs points from the first attempt." },
      { es: "Sigue los datos desde los parámetros hasta el retorno.", en: "Follow the data from the parameters to the return value." },
    ],
    failures: {
      es: ["Has movido la cifra. El objetivo era corregirla.", "Uno de los bugs parece nervioso. El otro sigue trabajando.", "El pipeline continúa rechazando ese puntaje."],
      en: ["You moved the number. The objective was to correct it.", "One bug looks nervous. The other is still working.", "The pipeline continues rejecting that score."],
    },
    completion: {
      es: "Ciento cincuenta. Ambos fallos fueron aislados y el release vuelve a ser medible.",
      en: "One hundred fifty. Both faults were isolated and the release is measurable again.",
    },
  },
};

export default pythonHard01;
