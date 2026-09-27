export const tacticalDialogue = [
  {
    speaker: "angel",
    text: {
      es: "Chimuelo, tenemos una visita en la frecuencia. Necesita una ruta segura por el portfolio.",
      en: "Chimuelo, we have a visitor on the frequency. They need a safe route through the portfolio.",
    },
  },
  {
    speaker: "chimuelo",
    text: {
      es: "Lo veo. Entró sin mapa y ya está mirando producción. Conducta arriesgada.",
      en: "I see them. They entered without a map and are already looking at production. Risky behavior.",
    },
  },
  {
    speaker: "angel",
    text: {
      es: "Activaremos un recorrido táctico: proyectos, experiencia, decisiones técnicas y laboratorio.",
      en: "We will activate a tactical route: projects, experience, technical decisions, and the Lab.",
    },
  },
  {
    speaker: "chimuelo",
    text: {
      es: "Yo vigilaré las conexiones. Tú intenta que el briefing no se convierta en otra reunión.",
      en: "I will monitor the connections. Try not to turn the briefing into another meeting.",
    },
  },
  {
    speaker: "angel",
    text: {
      es: "Cada señal marcará una sección. Puede avanzar, retroceder o abortar cuando quiera.",
      en: "Each signal will mark one section. They can advance, go back, or abort at any time.",
    },
  },
  {
    speaker: "chimuelo",
    text: {
      es: "Frecuencia estable. Catorce objetivos identificados. Inicia la misión.",
      en: "Frequency stable. Fourteen objectives identified. Begin the mission.",
    },
  },
];

export const tacticalTourSteps = [
  {
    id: "hero",
    target: "hero",
    code: "INSERTION",
    title: { es: "Punto de inserción", en: "Insertion point" },
    body: {
      es: "Aquí está la síntesis: Full Stack, producto, diseño y sistemas que llegan a producción.",
      en: "This is the summary: full stack, product, design, and systems that reach production.",
    },
  },
  {
    id: "projects",
    target: "projects",
    code: "MISSION INDEX",
    title: { es: "Mapa de proyectos", en: "Project map" },
    body: {
      es: "La selección está dividida en dos frentes: productos publicados para clientes y proyectos personales donde exploro ideas, arquitectura e interacción.",
      en: "The selection is split into two fronts: published client products and personal projects where I explore ideas, architecture, and interaction.",
    },
  },
  {
    id: "projects-production",
    target: "projects-production",
    code: "LIVE SYSTEMS",
    title: { es: "Clientes · En producción", en: "Clients · In production" },
    body: {
      es: "Susana Riquelme, Calzados Paula y Hallazgo Beauty & Care son productos activos para clientes reales. Aquí importan la identidad, la conversión, el rendimiento y mantener cada sitio operativo.",
      en: "Susana Riquelme, Calzados Paula, and Hallazgo Beauty & Care are active products for real clients. Identity, conversion, performance, and keeping every site operational matter here.",
    },
  },
  {
    id: "projects-personal",
    target: "projects-personal",
    code: "R&D ARCHIVE",
    title: { es: "Proyectos personales", en: "Personal projects" },
    body: {
      es: "JournalFit, Consultora Psicológica, el Sistema de Certificados y la Invitación de boda muestran exploración propia: producto, automatización, arquitectura y detalle visual.",
      en: "JournalFit, Consultora Psicológica, the Certificate System, and the Wedding Invitation show independent exploration across product, automation, architecture, and visual detail.",
    },
  },
  {
    id: "experience",
    target: "experience",
    code: "FIELD LOG",
    title: { es: "Registro de campo", en: "Field log" },
    body: {
      es: "Cinco roles resumen mi recorrido desde soporte y datos hasta productos web, móviles y SaaS. Para fechas, responsabilidades y contexto profesional completo, recomiendo visitar mi LinkedIn al final del recorrido.",
      en: "Five roles summarize my path from support and data to web, mobile, and SaaS products. For dates, responsibilities, and full professional context, I recommend visiting my LinkedIn at the end of the route.",
    },
  },
  {
    id: "about",
    target: "about",
    code: "OPERATOR",
    title: { es: "Perfil del operador", en: "Operator profile" },
    body: {
      es: "Una mirada al criterio detrás del código: formación, enfoque de producto, UX/UI y forma de trabajo.",
      en: "A look at the judgment behind the code: education, product thinking, UX/UI, and working method.",
    },
  },
  {
    id: "stack",
    target: "stack",
    code: "TECH GRAPH",
    title: { es: "Mapa tecnológico", en: "Technology map" },
    body: {
      es: "Mi núcleo es React y TypeScript; lo extiendo con React Native y Expo en mobile, Astro en sitios rápidos, Python y Django en backend, y Firebase o Supabase para datos y servicios.",
      en: "My core is React and TypeScript; I extend it with React Native and Expo for mobile, Astro for fast sites, Python and Django for backend, and Firebase or Supabase for data and services.",
    },
  },
  {
    id: "certificate-mobile",
    target: "certificate-mobile",
    code: "TRAINING 01",
    title: { es: "Desarrollo de Aplicaciones", en: "Application Development" },
    body: {
      es: "Formación práctica para construir aplicaciones multiplataforma con React Native, Expo, Firebase, componentes reutilizables y persistencia de datos.",
      en: "Practical training for building cross-platform applications with React Native, Expo, Firebase, reusable components, and data persistence.",
    },
  },
  {
    id: "certificate-ai",
    target: "certificate-ai",
    code: "TRAINING 02",
    title: { es: "IA aplicada a negocios", en: "AI applied to business" },
    body: {
      es: "Este seminario aporta criterio para detectar oportunidades de IA, automatizar con propósito y evaluar datos, riesgos y adopción responsable.",
      en: "This seminar provides judgment for finding AI opportunities, automating with purpose, and evaluating data, risk, and responsible adoption.",
    },
  },
  {
    id: "certificate-data",
    target: "certificate-data",
    code: "TRAINING 03",
    title: { es: "Bootcamp de Ciencia de Datos", en: "Data Science Bootcamp" },
    body: {
      es: "Doce semanas recorriendo preparación, exploración, visualización e interpretación con Python, Pandas y herramientas de análisis de datos.",
      en: "Twelve weeks covering preparation, exploration, visualization, and interpretation with Python, Pandas, and data analysis tooling.",
    },
  },
  {
    id: "blog",
    target: "blog",
    code: "FIELD NOTES",
    title: { es: "Bitácora de construcción", en: "Building log" },
    body: {
      es: "El blog documenta decisiones, procesos y aprendizajes que no caben en una tarjeta de proyecto. Es el lugar para entender cómo pienso mientras construyo.",
      en: "The blog documents decisions, processes, and lessons that do not fit in a project card. It is the place to understand how I think while building.",
    },
  },
  {
    id: "lab",
    target: "lab",
    code: "EXPERIMENTAL OPS",
    title: { es: "Tenshi Lab", en: "Tenshi Lab" },
    body: {
      es: "El laboratorio reúne experiencias jugables: desafíos de debugging guiados por Chimuelo y experimentos de DOM. Aquí el portfolio deja de ser vitrina y se vuelve interactivo.",
      en: "The laboratory holds playable experiences: debugging challenges guided by Chimuelo and DOM experiments. Here the portfolio stops being a showcase and becomes interactive.",
    },
  },
  {
    id: "contact-form",
    target: "contact-form",
    code: "OPEN CHANNEL",
    title: { es: "Cómo iniciar contacto", en: "How to get in touch" },
    body: {
      es: "Completa nombre, correo, asunto y un mensaje breve con el contexto del proyecto u oportunidad. Al enviar, se abrirá tu aplicación de correo con todo preparado.",
      en: "Complete your name, email, subject, and a short message with the project or opportunity context. Submitting opens your email app with everything prepared.",
    },
  },
  {
    id: "linkedin",
    target: "linkedin",
    code: "PROFESSIONAL LINK",
    title: { es: "Contexto profesional completo", en: "Full professional context" },
    body: {
      es: "LinkedIn complementa este portfolio con el detalle de mi trayectoria, fechas y red profesional. Es la ruta recomendada antes de una conversación laboral.",
      en: "LinkedIn complements this portfolio with detailed experience, dates, and professional network. It is the recommended route before a work conversation.",
    },
  },
];

export const tacticalCopy = {
  es: {
    launch: "Iniciar tour guiado",
    incoming: "Llamada táctica entrante",
    frequency: "FRECUENCIA 141.27",
    connecting: "Sincronizando canal seguro...",
    skipCall: "Omitir comunicación",
    continue: "Continuar",
    begin: "Iniciar misión",
    mute: "Silenciar comunicación",
    unmute: "Activar comunicación",
    soundOn: "Sonido activo",
    soundOff: "Sonido silenciado",
    unavailable: "Audio no disponible",
    close: "Abortar tour",
    previous: "Anterior",
    next: "Siguiente",
    finish: "Completar",
    step: "Objetivo",
    completeEyebrow: "TRANSMISIÓN FINAL / RUTA COMPLETA",
    completeTitle: "Misión completada.",
    completeBody: "Recorrido finalizado. El canal queda abierto para explorar cualquier sección con libertad.",
    explore: "Explorar por mi cuenta",
    dialogueTitle: "Comunicación táctica sobre el recorrido",
    tourTitle: "Recorrido táctico del portfolio",
  },
  en: {
    launch: "Start guided tour",
    incoming: "Incoming tactical call",
    frequency: "FREQUENCY 141.27",
    connecting: "Synchronizing secure channel...",
    skipCall: "Skip communication",
    continue: "Continue",
    begin: "Begin mission",
    mute: "Mute communication",
    unmute: "Enable communication",
    soundOn: "Sound enabled",
    soundOff: "Sound muted",
    unavailable: "Audio unavailable",
    close: "Abort tour",
    previous: "Previous",
    next: "Next",
    finish: "Complete",
    step: "Objective",
    completeEyebrow: "FINAL TRANSMISSION / ROUTE COMPLETE",
    completeTitle: "Mission complete.",
    completeBody: "Route completed. The channel remains open so you can explore any section freely.",
    explore: "Explore on my own",
    dialogueTitle: "Tactical communication about the guided route",
    tourTitle: "Tactical portfolio tour",
  },
};

export function clampSpotlightRect(rect, viewport, padding = 12) {
  const left = Math.max(padding, Math.min(viewport.width - padding, rect.left));
  const top = Math.max(padding, Math.min(viewport.height - padding, rect.top));
  const right = Math.max(left, Math.min(viewport.width - padding, rect.right));
  const bottom = Math.max(top, Math.min(viewport.height - padding, rect.bottom));
  return { left, top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) };
}

export function positionTourCard(rect, viewport, card = { width: 390, height: 270 }, gap = 18) {
  const edge = 16;
  const fitsBelow = viewport.height - rect.top - rect.height >= card.height + gap;
  const top = fitsBelow ? rect.top + rect.height + gap : Math.max(edge, rect.top - card.height - gap);
  const left = Math.max(edge, Math.min(viewport.width - card.width - edge, rect.left));
  return { left, top };
}
