const GITHUB_URL = "https://github.com/watenshi";
const LINKEDIN_URL = "https://www.linkedin.com/in/angel-cardenas-abarzua-0a7380290/";
const EMAIL = "angel.abarzua15@gmail.com";

export const terminalCompletions = [
  "help",
  "about",
  "projects",
  "project",
  "experience",
  "skills",
  "skill",
  "open skillmap",
  "contact",
  "github",
  "linkedin",
  "blog",
  "lab",
  "debug",
  "dum",
  "clear",
  "theme",
  "language",
  "goto",
  "whoami",
  "coffee",
  "sudo hire angel",
  "exit",
];

const normalize = (value) =>
  value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const localized = (value, language) =>
  typeof value === "string" ? value : value?.[language] || "";

function findProject(query, projects) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;
  const index = Number(normalizedQuery);
  if (Number.isInteger(index) && index > 0) return projects[index - 1] || null;
  return projects.find((project) => normalize(project.title).includes(normalizedQuery));
}

function findSkill(query, skills) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;
  return skills.find((skill) => [skill.id, skill.name, ...(skill.aliases || [])].some((value) => normalize(value).includes(normalizedQuery)));
}

const help = {
  es: [
    "COMANDOS DISPONIBLES",
    "",
    "about        Información sobre Ángel",
    "projects     Ver proyectos destacados",
    "project <id> Ver el detalle de un proyecto",
    "open <id>    Abrir un proyecto",
    "experience   Experiencia profesional",
    "skills       Tecnologías y herramientas",
    "skill <nombre> Seleccionar tecnología en el mapa",
    "open skillmap Abrir el mapa interactivo",
    "contact      Información de contacto",
    "github       Abrir GitHub",
    "linkedin     Abrir LinkedIn",
    "blog         Abrir el blog",
    "lab          Abrir Tenshi Lab",
    "debug        Iniciar Debug Challenge",
    "dum          Jugar DUM",
    "goto <lugar> Ir a una sección del portfolio",
    "clear        Limpiar la terminal",
    "theme [modo] Cambiar tema (dark / light)",
    "language     Cambiar idioma (es / en)",
    "exit         Cerrar la terminal",
  ],
  en: [
    "AVAILABLE COMMANDS",
    "",
    "about        About Ángel",
    "projects     View featured projects",
    "project <id> View project details",
    "open <id>    Open a project",
    "experience   Professional experience",
    "skills       Technologies and tools",
    "skill <name> Select a technology in the map",
    "open skillmap Open the interactive map",
    "contact      Contact information",
    "github       Open GitHub",
    "linkedin     Open LinkedIn",
    "blog         Open the blog",
    "lab          Open Tenshi Lab",
    "debug        Start Debug Challenge",
    "dum          Play DUM",
    "goto <place> Go to a portfolio section",
    "clear        Clear the terminal",
    "theme [mode] Change theme (dark / light)",
    "language     Change language (es / en)",
    "exit         Close the terminal",
  ],
};

function projectDetail(project, language) {
  return [
    `${project.title} · ${project.date || (language === "es" ? "En producción" : "In production")}`,
    localized(project.description, language),
    `Stack: ${project.tags.join(" · ")}`,
    `URL: ${project.live}`,
  ];
}

export function executeTerminalCommand(rawInput, context) {
  const { language, theme, projects, experience, skills, areas, aboutText, location, blogUrl, labUrl, debugUrl } = context;
  const input = rawInput.trim();
  const [command = "", ...args] = input.split(/\s+/);
  const name = command.toLocaleLowerCase("en");
  const argument = args.join(" ");
  const isEs = language === "es";

  if (!input) return { lines: [] };

  if (name === "help") return { lines: help[language] };

  if (name === "about") {
    return { lines: [aboutText[0], "", aboutText[1]] };
  }

  if (name === "projects") {
    return {
      lines: [
        isEs ? "PROYECTOS DESTACADOS" : "FEATURED PROJECTS",
        "",
        ...projects.map((project, index) => `${String(index + 1).padStart(2, "0")}  ${project.title}`),
        "",
        isEs ? 'Usa "project <número o nombre>" para ver detalles.' : 'Use "project <number or name>" to view details.',
      ],
    };
  }

  if (name === "project") {
    const project = findProject(argument, projects);
    if (!project) {
      return { lines: [isEs ? "Proyecto no encontrado. Usa “projects” para ver la lista." : "Project not found. Use “projects” to view the list."] };
    }
    return { lines: projectDetail(project, language) };
  }

  if (name === "open") {
    if (normalize(argument) === "skillmap" || normalize(argument) === "skill map") {
      return { lines: [isEs ? "Abriendo mapa de tecnologías…" : "Opening skill map…"], action: { type: "skillmap" }, close: true };
    }
    const project = findProject(argument, projects);
    if (!project) {
      return { lines: [isEs ? "Proyecto no encontrado. Usa “projects” para ver la lista." : "Project not found. Use “projects” to view the list."] };
    }
    return {
      lines: [`${isEs ? "Abriendo" : "Opening"} ${project.title}…`],
      action: { type: "open", url: project.live },
    };
  }

  if (name === "experience") {
    return {
      lines: [
        isEs ? "EXPERIENCIA PROFESIONAL" : "PROFESSIONAL EXPERIENCE",
        "",
        ...experience.flatMap((job, index) => [
          `${String(index + 1).padStart(2, "0")}  ${job.company}`,
          `    ${localized(job.role, language)} · ${localized(job.dates, language)}`,
        ]),
      ],
    };
  }

  if (name === "skills") {
    return {
      lines: areas.flatMap((area, index) => [
        ...(index ? [""] : []),
        area.label[language].toLocaleUpperCase(language),
        skills.filter((skill) => skill.area === area.id).map((skill) => skill.name).join(" · "),
      ]),
    };
  }

  if (name === "skill") {
    const skill = findSkill(argument, skills);
    if (!skill) return { lines: [isEs ? "Tecnología no encontrada. Usa “skills” para ver la lista." : "Technology not found. Use “skills” to see the list."] };
    return {
      lines: [`${isEs ? "Seleccionando" : "Selecting"} ${skill.name}…`, localized(skill.description, language)],
      action: { type: "skill", id: skill.id },
      close: true,
    };
  }

  if (name === "contact") {
    return {
      lines: [
        isEs ? "CONTACTO" : "CONTACT",
        "",
        `Email     ${EMAIL}`,
        `LinkedIn  ${LINKEDIN_URL}`,
        `${isEs ? "Ubicación" : "Location"}  ${location}`,
      ],
    };
  }

  if (name === "github") return { lines: [isEs ? "Abriendo GitHub…" : "Opening GitHub…"], action: { type: "open", url: GITHUB_URL } };
  if (name === "linkedin") return { lines: [isEs ? "Abriendo LinkedIn…" : "Opening LinkedIn…"], action: { type: "open", url: LINKEDIN_URL } };
  if (name === "blog") return { lines: [isEs ? "Abriendo el blog…" : "Opening the blog…"], action: { type: "same-tab", url: blogUrl } };
  if (name === "lab") return { lines: [isEs ? "Inicializando Tenshi Lab…" : "Initializing Tenshi Lab…"], action: { type: "same-tab", url: labUrl }, close: true };
  if (name === "debug") return { lines: [isEs ? "Abriendo Test Chamber 01…" : "Opening Test Chamber 01…"], action: { type: "same-tab", url: debugUrl }, close: true };
  if (name === "dum") return { lines: ["Loading DUM: Sector 01…"], action: { type: "game" } };
  if (name === "dom") return { lines: [isEs ? "El protocolo cambió. Prueba: dum" : "The protocol changed. Try: dum"] };
  if (name === "doom") return { lines: [isEs ? "Ese nombre pertenece a otro infierno. Aquí buscamos DUM." : "That name belongs to another hell. We are looking for DUM here."] };
  if (name === "clear") return { lines: [], clear: true };
  if (name === "exit") return { lines: [], close: true };

  if (name === "theme") {
    const requested = argument.toLocaleLowerCase("en");
    if (requested && !["dark", "light"].includes(requested)) {
      return { lines: [isEs ? "Uso: theme [dark | light]" : "Usage: theme [dark | light]"] };
    }
    const nextTheme = requested || (theme === "dark" ? "light" : "dark");
    return {
      lines: [`${isEs ? "Tema" : "Theme"}: ${nextTheme}`],
      action: { type: "theme", value: nextTheme },
    };
  }

  if (name === "language") {
    const requested = argument.toLocaleLowerCase("en");
    if (requested && !["es", "en"].includes(requested)) {
      return { lines: [isEs ? "Uso: language [es | en]" : "Usage: language [es | en]"] };
    }
    const nextLanguage = requested || (language === "es" ? "en" : "es");
    return {
      lines: [nextLanguage === "es" ? "Idioma cambiado a español." : "Language changed to English."],
      action: { type: "language", value: nextLanguage },
    };
  }

  if (name === "goto") {
    const aliases = { projects: "projects", experience: "experience", about: "about", skills: "stack", stack: "stack", certificates: "certificates", contact: "contact", blog: "blog" };
    const target = aliases[argument.toLocaleLowerCase("en")];
    if (!target) return { lines: [isEs ? "Destino no válido. Usa: projects, experience, about, skills, certificates, contact o blog." : "Invalid destination. Use: projects, experience, about, skills, certificates, contact, or blog."] };
    return {
      lines: [`${isEs ? "Navegando a" : "Going to"} ${argument}…`],
      action: { type: "goto", target },
      close: true,
    };
  }

  if (name === "whoami") return { lines: ["Ángel Cárdenas", "Full Stack Developer", "Concepción, Chile"] };
  if (name === "coffee") return { lines: ["Coffee level: 87%", "Developer productivity increased."] };
  if (normalize(input) === "sudo hire angel") {
    return {
      lines: ["Access granted.", "", "Great choice.", isEs ? "Abriendo contacto…" : "Opening contact…"],
      action: { type: "goto", target: "contact", delay: 650 },
      close: true,
    };
  }

  return {
    lines: [
      `${isEs ? "Comando no encontrado" : "Command not found"}: ${input}`,
      "",
      isEs ? 'Escribe "help" para ver los comandos disponibles.' : 'Type "help" to see available commands.',
    ],
  };
}
