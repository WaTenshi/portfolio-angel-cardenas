const initialCode = `usuarios = ["angel", "nicolas"]

def agregar_usuario(nombre):
    usuarios.append

agregar_usuario("natasha")

print(usuarios)`;

export const pythonBasic01 = {
  id: "python-basic-01",
  route: "debug/python/basic",
  language: "python",
  difficulty: "basic",
  chamber: "01",
  engine: "python-subset",
  editorFile: "main.py",
  medalMark: "PY",
  certificatePrefix: "TL-PY01",
  title: { es: "Python básico", en: "Python Basic" },
  mission: {
    es: 'El programa debe agregar "natasha" a la lista de usuarios.',
    en: 'The program must add "natasha" to the users list.',
  },
  initialCode,
  expectedOutput: "['angel', 'nicolas', 'natasha']",
  hints: [
    {
      cost: 8,
      text: {
        es: "Las funciones suelen agradecer que las llamen.",
        en: "Functions usually appreciate being called.",
      },
    },
    {
      cost: 15,
      text: {
        es: "Observa detenidamente la línea que utiliza `append`.",
        en: "Look closely at the line that uses `append`.",
      },
    },
    {
      cost: 25,
      text: {
        es: "`append` necesita recibir el valor que quieres agregar. Quizá `nombre` debería participar en esa llamada.",
        en: "`append` needs the value you want to add. Perhaps `nombre` should take part in that call.",
      },
    },
  ],
  score: { initial: 100, failedAttemptCost: 2, freeFailedAttempts: 1 },
  narrative: {
    angel: [
      { es: "Bienvenido a la Cámara 01 del Tenshi Lab.", en: "Welcome to Tenshi Lab Chamber 01." },
      { es: "Esta prueba no mide cuánto Python puedes memorizar.", en: "This test does not measure how much Python you can memorize." },
      { es: "Aquí nos interesa qué haces cuando una función existe, pero decide no hacer absolutamente nada.", en: "We care about what you do when a function exists, but decides to do absolutely nothing." },
      { es: "Debes conseguir que un nuevo usuario llegue a su lista. El código parece correcto a primera vista; esa es la trampa.", en: "You must get a new user into the list. The code looks correct at first glance; that is the trap." },
      { es: "Yo diseñé la prueba. Chimuelo verificará si realmente entendiste la llamada.", en: "I designed the test. Chimuelo will verify whether you truly understood the call." },
    ],
    examiner: [
      { es: "Python. Cámara 01. He escondido mis juguetes lejos de las listas mutables.", en: "Python. Chamber 01. I have hidden my toys far from mutable lists." },
      { es: "El programa debe registrar a Natasha sin alterar los usuarios existentes.", en: "The program must register Natasha without altering the existing users." },
      { es: "Tienes 100 puntos. Las pistas cuestan puntos y quedan registradas.", en: "You have 100 points. Hints cost points and are recorded." },
      { es: "No busques un error espectacular. Los bugs pequeños suelen tener una autoestima desproporcionada.", en: "Do not look for a spectacular error. Small bugs tend to have disproportionate self-esteem." },
      { es: "Corrige el programa y ejecuta la prueba cuando estés preparado.", en: "Correct the program and run the test when you are ready." },
    ],
    failures: {
      es: ["No. La lista sigue ignorando a Natasha con notable disciplina.", "Has ejecutado una referencia. La referencia, con razón, no se impresionó.", "Interesante. Incorrecto, pero sintácticamente sereno."],
      en: ["No. The list continues to ignore Natasha with remarkable discipline.", "You executed a reference. The reference was, understandably, unimpressed.", "Interesting. Incorrect, but syntactically calm."],
    },
    completion: {
      es: "La lista ya responde como corresponde. Python puede volver a dormir.",
      en: "The list now behaves as expected. Python may return to sleep.",
    },
  },
};

export default pythonBasic01;
