export const javascriptHard01 = {
  id: "javascript-hard-01",
  route: "debug/javascript/hard",
  language: "javascript",
  difficulty: "hard",
  chamber: "06",
  engine: "javascript-subset",
  editorFile: "capacity.js",
  medalMark: "JS",
  certificatePrefix: "TL-JS03",
  title: { es: "JavaScript difícil", en: "Advanced JavaScript" },
  mission: {
    es: "Resta los nodos de reserva y duplica la capacidad disponible para calcular el límite operativo.",
    en: "Subtract reserve nodes and double the available capacity to calculate the operating limit.",
  },
  initialCode: `function calculateCapacity(nodes, reserve) {
  const available = nodes + reserve;
  return available / 2;
}

console.log(calculateCapacity(12, 2));`,
  expectedOutput: "20",
  hints: [
    { cost: 10, text: { es: "El flujo contiene dos decisiones aritméticas incorrectas.", en: "The flow contains two incorrect arithmetic decisions." } },
    { cost: 18, text: { es: "La reserva se aparta de los nodos disponibles antes de escalar la capacidad.", en: "Reserve is removed from available nodes before capacity is scaled." } },
    { cost: 28, text: { es: "Calcula `nodes - reserve` y luego multiplica `available` por dos.", en: "Calculate `nodes - reserve` and then multiply `available` by two." } },
  ],
  score: { initial: 100, failedAttemptCost: 5, freeFailedAttempts: 0 },
  narrative: {
    angel: [
      { es: "Cámara 06. JavaScript difícil.", en: "Chamber 06. Advanced JavaScript." },
      { es: "El planificador suma lo que debe reservar y divide lo que debe expandir.", en: "The scheduler adds what it must reserve and divides what it must expand." },
      { es: "Dos líneas son válidas por separado y desastrosas como sistema.", en: "Two lines are valid separately and disastrous as a system." },
      { es: "Esta prueba exige rastrear un valor intermedio y su transformación final.", en: "This test requires tracing an intermediate value and its final transformation." },
      { es: "Es la última cámara. Chimuelo ya ha bloqueado la salida.", en: "This is the final chamber. Chimuelo has already locked the exit." },
    ],
    examiner: [
      { es: "JavaScript difícil. La capacidad actual desafía la infraestructura y el sentido común.", en: "Advanced JavaScript. Current capacity defies infrastructure and common sense." },
      { es: "Doce nodos, dos reservados. Solo diez pueden participar antes de duplicar el límite.", en: "Twelve nodes, two reserved. Only ten may participate before the limit is doubled." },
      { es: "El valor `available` está contaminado antes de llegar al retorno.", en: "The `available` value is contaminated before it reaches the return statement." },
      { es: "Una reparación parcial seguirá fallando. Esta cámara no concede intentos gratuitos.", en: "A partial repair will still fail. This chamber grants no free attempts." },
      { es: "Aísla ambos operadores y devuelve veinte.", en: "Isolate both operators and return twenty." },
    ],
    failures: {
      es: ["La capacidad cambió, pero el clúster aún se niega a aceptarla.", "Has corregido un síntoma. El segundo acaba de ronronear.", "Todavía no son veinte. La cámara permanece sellada."],
      en: ["Capacity changed, but the cluster still refuses to accept it.", "You corrected one symptom. The second one just purred.", "It is still not twenty. The chamber remains sealed."],
    },
    completion: {
      es: "Veinte unidades operativas. La última cámara ha perdido sus dos bugs.",
      en: "Twenty operating units. The final chamber has lost both of its bugs.",
    },
  },
};

export default javascriptHard01;
