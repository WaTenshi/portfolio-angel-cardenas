export const javascriptBasic01 = {
  id: "javascript-basic-01",
  route: "debug/javascript/basic",
  language: "javascript",
  difficulty: "basic",
  chamber: "02",
  engine: "javascript-subset",
  editorFile: "main.js",
  medalMark: "JS",
  certificatePrefix: "TL-JS01",
  title: { es: "JavaScript básico", en: "JavaScript Basic" },
  mission: {
    es: "La función debe calcular el precio final después de aplicar el descuento.",
    en: "The function must calculate the final price after applying the discount.",
  },
  initialCode: `const price = 120;
const discount = 20;

function calculateFinalPrice(price, discount) {
  return price + discount;
}

console.log(calculateFinalPrice(price, discount));`,
  expectedOutput: "100",
  hints: [
    { cost: 8, text: { es: "Un descuento normalmente hace que un número viaje en una dirección muy concreta.", en: "A discount usually makes a number travel in a very specific direction." } },
    { cost: 15, text: { es: "Compara la operación de `return` con el significado de aplicar un descuento.", en: "Compare the `return` operation with what applying a discount means." } },
    { cost: 25, text: { es: "El precio final debe ser menor que el original. Revisa el operador entre `price` y `discount`.", en: "The final price must be lower than the original. Check the operator between `price` and `discount`." } },
  ],
  score: { initial: 100, failedAttemptCost: 2, freeFailedAttempts: 1 },
  narrative: {
    angel: [
      { es: "Cámara 02. JavaScript básico.", en: "Chamber 02. JavaScript Basic." },
      { es: "Esta vez no hay listas silenciosas. Hay algo más peligroso: una operación perfectamente válida.", en: "This time there are no silent lists. There is something more dangerous: a perfectly valid operation." },
      { es: "El sistema calcula un precio final, pero el resultado contradice el propósito del programa.", en: "The system calculates a final price, but the result contradicts the program's purpose." },
      { es: "No basta con que el código ejecute. Debe expresar la decisión correcta.", en: "It is not enough for the code to run. It must express the correct decision." },
      { es: "Chimuelo ha revisado la tienda. No le gustaron los precios.", en: "Chimuelo reviewed the store. He did not like the prices." },
    ],
    examiner: [
      { es: "JavaScript. Cámara 02. Los números no son juguetes, aunque el lenguaje a veces opine lo contrario.", en: "JavaScript. Chamber 02. Numbers are not toys, though the language occasionally disagrees." },
      { es: "El descuento debe reducir el precio. Actualmente está logrando una hazaña distinta.", en: "The discount must reduce the price. It is currently accomplishing something else." },
      { es: "Dispones de 100 puntos y tres intervenciones mías.", en: "You have 100 points and three interventions from me." },
      { es: "Ejecutar sin pensar produce resultados. No necesariamente resultados útiles.", en: "Running without thinking produces results. Not necessarily useful ones." },
      { es: "Haz que el cálculo diga lo mismo que la intención.", en: "Make the calculation say the same thing as the intent." },
    ],
    failures: {
      es: ["El descuento acaba de encarecer el producto. Innovador. También incorrecto.", "La consola funciona. La aritmética sigue protestando.", "Resultado válido, decisión equivocada. JavaScript no te salvará de eso."],
      en: ["The discount just made the product more expensive. Innovative. Also incorrect.", "The console works. The arithmetic is still protesting.", "Valid result, wrong decision. JavaScript will not save you from that."],
    },
    completion: {
      es: "El precio descendió. El comercio y mi paciencia se han estabilizado.",
      en: "The price went down. Commerce and my patience are now stable.",
    },
  },
};

export default javascriptBasic01;
