import { createElement, useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiAward,
  FiBookOpen,
  FiCode,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiMenu,
  FiMoon,
  FiPause,
  FiPlay,
  FiSend,
  FiSun,
  FiX,
} from "react-icons/fi";
import {
  SiBootstrap,
  SiCss3,
  SiDjango,
  SiExpo,
  SiFigma,
  SiFirebase,
  SiFlask,
  SiGit,
  SiGooglecloud,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSentry,
  SiSupabase,
  SiTypescript,
} from "react-icons/si";
import "./App.css";
import Reveal from "./components/Reveal";
import CertificateModal from "./components/CertificateModal";
import { useMotion } from "./hooks/useMotion";
import { useSitePreferences } from "./hooks/useSitePreferences";
import BlogFab from "./components/BlogFab";
import PortfolioTerminal from "./components/terminal/PortfolioTerminal";
import { blogPath } from "./blog/paths";
import images from "./assets/optimized/images";

const profile = images.profile;
import terminalCertificate from "./assets/1752023569576.jpg";
import aiSeminarCertificate from "./assets/1764267414745.jpg";
import coderCertificate from "./assets/coderhouse-certificate.jpg";
import dataBootcampCertificate from "./assets/Certificado - Bootcamp de Ciencia de Datos.pdf";
import dataFoundationsCertificate from "./assets/Certificado - Curso de Bases y conceptos de la Ciencia de Datos.pdf";
import dataScientistCertificate from "./assets/Certificado - Qué hace un científico de datos - Bootcamp de ciencia de datos.pdf";
const journalFitPreview = images.journalfit;
const weddingPreview = images.boda;
const certificatesPreview = images.certificados;
const psychologyPreview = images.consultora;
const salonPreview = images.peluqueria;
const videoPreview = images.video;

const copy = {
  es: {
    nav: ["Proyectos", "Experiencia", "Sobre mí", "Tecnologías", "Certificados", "Contacto"],
    navIds: ["projects", "experience", "about", "stack", "certificates", "contact"],
    role: "Full Stack Developer",
    location: "Concepción, Chile",
    intro:
      "Construyo productos web y móviles completos, desde la experiencia visual hasta las APIs, datos e infraestructura que los mantienen vivos.",
    introMuted:
      "Especializado en React, React Native y TypeScript, con experiencia en productos SaaS, integraciones cloud y sistemas en producción.",
    viewProjects: "Ver proyectos",
    contact: "Contactar",
    available: "Construyendo productos digitales desde Chile",
    profileLabel: "PERFIL / 2026",
    live: "DISPONIBLE",
    profileCard: {
      eyebrow: "Diseño",
      title: "Ideas que llegan a producción.",
      areas: ["Web apps", "Mobile", "SaaS", "UX/UI"],
      status: "Full Stack · Concepción, Chile",
    },
    stats: [
      ["5", "roles profesionales"],
      ["6", "proyectos destacados"],
      ["2", "plataformas · web + mobile"],
      ["360°", "visión de producto"],
    ],
    section: {
      about: ["03 / SOBRE MÍ", "Código con criterio de producto.", "No me interesa construir pantallas aisladas. Diseño sistemas completos que sean claros para las personas y sostenibles para los equipos."],
      experience: ["02 / EXPERIENCIA", "Trayectoria profesional.", "Productos SaaS, plataformas educativas y operación tecnológica en entornos reales."],
      stack: ["04 / STACK", "Tecnología con propósito.", "Herramientas utilizadas en proyectos reales, organizadas por el problema que resuelven."],
      projects: ["01 / PROYECTOS", "Trabajo seleccionado.", "Trabajo para clientes y proyectos propios: dos formas de llevar ideas a la web."],
      certificates: ["05 / CERTIFICADOS", "Aprendizaje que se convierte en práctica.", "Formación aplicada en desarrollo móvil, inteligencia artificial y ciencia de datos."],
      figma: ["06 / FIGMA", "Diseño en proceso.", "Espacio preparado para sumar casos de UX/UI, sistemas visuales y prototipos."],
      contact: ["06 / CONTACTO", "Construyamos algo útil.", "Estoy abierto a conversar sobre productos, equipos y desafíos donde diseño y desarrollo deban trabajar juntos."],
    },
    aboutText: [
      "Soy Full Stack Developer y Técnico Universitario en Informática. He trabajado construyendo aplicaciones móviles, plataformas educativas, CMS y productos SaaS, conectando frontend, backend, bases de datos y despliegue.",
      "Mi formación en UX/UI me permite tomar decisiones más allá del código: ordenar flujos, priorizar contenido y convertir requisitos complejos en experiencias simples. También incorporo herramientas de IA para acelerar investigación, arquitectura y debugging sin perder criterio técnico.",
    ],
    aboutDetails: [
      ["Formación", "Técnico Universitario en Informática · UTFSM"],
      ["Especialidad", "Productos SaaS, web y aplicaciones móviles"],
      ["Idiomas", "Español nativo · Inglés técnico"],
      ["Método", "Producto, diseño, código y mejora continua"],
    ],
    experienceMeta: "NOV 2024 → PRESENTE · 5 ROLES",
    relation: "Experiencia profesional",
    current: "Actualidad",
    selected: "Ideas en acción / 2022 — 2026",
    explore: "Explora mi trabajo",
    skip: "Saltar al contenido",
    navigation: "Navegación principal",
    menu: "Abrir menú",
    closeMenu: "Cerrar menú",
    motion: "Animaciones",
    motionOn: "Pausar animaciones",
    motionOff: "Activar animaciones",
    motionReduced: "Movimiento reducido por tu sistema",
    lightTheme: "Activar tema claro",
    darkTheme: "Activar tema oscuro",
    backTop: "Volver arriba",
    projectPreview: "Vista previa de",
    items: "herramientas",
    stackGroups: ["Front-end", "Back-end & data", "Cloud & tools"],
    projectActions: { live: "Visitar sitio" },
    projectStatus: { active: "En desarrollo", production: "En producción" },
    projectGroups: {
      clients: { title: "Clientes · En producción", description: "Sitios creados para clientes, publicados y en uso." },
      personal: { title: "Proyectos propios", description: "Por curiosidad, por aprender y por amor al arte. Ideas que convierto en proyectos." },
    },
    certificateLabels: {
      featured: "Certificado principal",
      complementary: "Formación complementaria",
      view: "Ver certificado",
      skills: "Habilidades desarrolladas",
      close: "Cerrar certificado",
    },
    blogPromo: {
      label: "NOTAS / BLOG",
      title: "También escribo sobre lo que construyo.",
      description: "Ideas, procesos y aprendizajes detrás de cada proyecto.",
      action: "Explorar el blog",
    },
    figmaSoon: "PRÓXIMAMENTE",
    figmaTitle: "Caso de diseño",
    figmaText: "Espacio reservado para documentar el problema, proceso, decisiones y resultado.",
    contactForm: {
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      email: "Correo",
      emailPlaceholder: "tu@correo.com",
      subject: "Asunto",
      subjectPlaceholder: "Proyecto, oportunidad o colaboración",
      message: "Mensaje",
      messagePlaceholder: "Cuéntame brevemente en qué puedo ayudarte.",
      send: "Enviar mensaje",
      hint: "Al enviar se abrirá tu aplicación de correo con el mensaje preparado.",
      linkedin: "También puedes encontrarme en LinkedIn",
    },
    footer: "Diseñado y desarrollado por Ángel Cárdenas.",
  },
  en: {
    nav: ["Projects", "Experience", "About", "Technologies", "Certificates", "Contact"],
    navIds: ["projects", "experience", "about", "stack", "certificates", "contact"],
    role: "Full Stack Developer",
    location: "Concepción, Chile",
    intro:
      "I build complete web and mobile products, from the visual experience to the APIs, data, and infrastructure that keep them alive.",
    introMuted:
      "Specialized in React, React Native, and TypeScript, with experience in SaaS products, cloud integrations, and production systems.",
    viewProjects: "View projects",
    contact: "Contact",
    available: "Building digital products from Chile",
    profileLabel: "PROFILE / 2026",
    live: "AVAILABLE",
    profileCard: {
      eyebrow: "Design",
      title: "Ideas shipped to production.",
      areas: ["Web apps", "Mobile", "SaaS", "UX/UI"],
      status: "Full Stack · Concepción, Chile",
    },
    stats: [
      ["5", "professional roles"],
      ["6", "featured projects"],
      ["2", "platforms · web + mobile"],
      ["360°", "product perspective"],
    ],
    section: {
      about: ["03 / ABOUT", "Code guided by product thinking.", "I do not build isolated screens. I design complete systems that are clear for people and sustainable for teams."],
      experience: ["02 / EXPERIENCE", "Professional journey.", "SaaS products, education platforms, and technology operations in real environments."],
      stack: ["04 / STACK", "Technology with purpose.", "Tools used in real projects, organized by the problems they solve."],
      projects: ["01 / PROJECTS", "Selected work.", "Client work and personal projects: two ways to bring ideas to the web."],
      certificates: ["05 / CERTIFICATES", "Learning turned into practice.", "Applied training in mobile development, artificial intelligence, and data science."],
      figma: ["06 / FIGMA", "Design in progress.", "A prepared space for UX/UI case studies, visual systems, and prototypes."],
      contact: ["06 / CONTACT", "Let’s build something useful.", "I am open to discussing products, teams, and challenges where design and development need to work together."],
    },
    aboutText: [
      "I am a Full Stack Developer and University Technician in Computer Science. I have built mobile applications, education platforms, CMS products, and SaaS solutions connecting frontend, backend, databases, and deployment.",
      "My UX/UI background helps me make decisions beyond code: structure flows, prioritize content, and turn complex requirements into simple experiences. I also use AI tools to accelerate research, architecture, and debugging without giving up technical judgment.",
    ],
    aboutDetails: [
      ["Education", "University Technician in Computer Science · UTFSM"],
      ["Specialty", "SaaS products, web, and mobile applications"],
      ["Languages", "Native Spanish · Technical English"],
      ["Method", "Product, design, code, and continuous improvement"],
    ],
    experienceMeta: "NOV 2024 → PRESENT · 5 ROLES",
    relation: "Professional experience",
    current: "Present",
    selected: "Ideas in motion / 2022 — 2026",
    explore: "Explore my work",
    skip: "Skip to content",
    navigation: "Main navigation",
    menu: "Open menu",
    closeMenu: "Close menu",
    motion: "Animations",
    motionOn: "Pause animations",
    motionOff: "Enable animations",
    motionReduced: "Reduced motion enabled by your system",
    lightTheme: "Enable light theme",
    darkTheme: "Enable dark theme",
    backTop: "Back to top",
    projectPreview: "Preview of",
    items: "tools",
    stackGroups: ["Front-end", "Back-end & data", "Cloud & tools"],
    projectActions: { live: "Visit website" },
    projectStatus: { active: "In development", production: "In production" },
    projectGroups: {
      clients: { title: "Clients · In production", description: "Websites built for clients, published and in use." },
      personal: { title: "Personal projects", description: "For curiosity, for learning, and for the love of creating. Ideas I turn into projects." },
    },
    certificateLabels: {
      featured: "Featured certificate",
      complementary: "Complementary training",
      view: "View certificate",
      skills: "Skills developed",
      close: "Close certificate",
    },
    blogPromo: {
      label: "NOTES / BLOG",
      title: "I also write about what I build.",
      description: "Ideas, processes, and lessons behind each project.",
      action: "Explore the blog",
    },
    figmaSoon: "COMING SOON",
    figmaTitle: "Design case study",
    figmaText: "Reserved space to document the problem, process, decisions, and outcome.",
    contactForm: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@email.com",
      subject: "Subject",
      subjectPlaceholder: "Project, opportunity, or collaboration",
      message: "Message",
      messagePlaceholder: "Tell me briefly how I can help.",
      send: "Send message",
      hint: "Submitting will open your email app with the message prepared.",
      linkedin: "You can also find me on LinkedIn",
    },
    footer: "Designed and developed by Ángel Cárdenas.",
  },
};

const experience = [
  {
    company: "Instituto Grupo Crexer",
    current: true,
    dates: { es: "May 2026 — Actualidad", en: "May 2026 — Present" },
    role: "Full Stack Developer / Webmaster",
    place: { es: "Concepción · Híbrido · Media jornada", en: "Concepción · Hybrid · Part-time" },
    points: {
      es: [
        "Gestión del desarrollo Full Stack, soporte TI y plataformas institucionales en producción.",
        "Desarrollo y optimización de sistemas PHP, MySQL y Apache, junto a un CMS con API REST propia.",
        "Administración de cPanel, WHM, hosting, Moodle y bases de datos productivas.",
      ],
      en: [
        "Full Stack development, IT support, and production platform management.",
        "Development and optimization of PHP, MySQL, and Apache systems, plus a CMS with its own REST API.",
        "Administration of cPanel, WHM, hosting, Moodle, and production databases.",
      ],
    },
    tags: ["PHP", "MySQL", "REST API", "Apache", "Moodle"],
  },
  {
    company: "FACEA UdeC",
    current: true,
    dates: { es: "Jul 2026 — Actualidad", en: "Jul 2026 — Present" },
    role: "IT Department Assistant and Educational Software Developer",
    place: { es: "Concepción, Biobío, Chile · Remoto · Jornada parcial", en: "Concepción, Biobío, Chile · Remote · Part-time" },
    points: {
      es: [
        "Mantenimiento y desarrollo de software contable educativo con PHP y MySQL: mejoras funcionales, corrección de errores, gestión de bases de datos y asistencia a usuarios.",
        "Administración operativa de Moodle para docentes de FACEA UdeC: publicación de materiales, configuración de cursos, matriculación de usuarios, monitoreo y resolución de incidencias.",
        "Tutoría y apoyo técnico en cursos y diplomados presenciales, orientando a docentes y participantes en el uso de plataformas digitales, herramientas tecnológicas y recursos académicos.",
      ],
      en: [
        "Maintenance and development of educational accounting software with PHP and MySQL, including functional improvements, bug fixes, database management, and user support.",
        "Operational administration of Moodle for FACEA UdeC faculty: publishing materials, configuring courses, enrolling users, monitoring the platform, and resolving incidents.",
        "Tutoring and technical support for in-person courses and diploma programs, guiding faculty and participants in the use of digital platforms, technology tools, and academic resources.",
      ],
    },
    tags: ["PHP", "MySQL", "Moodle"],
  },
  {
    company: "AYMatch",
    dates: { es: "Mar 2026 — Abr 2026", en: "Mar 2026 — Apr 2026" },
    role: "Full Stack / Mobile Developer",
    place: "Santiago · Remoto",
    points: {
      es: [
        "Desarrollo end-to-end de un MVP SaaS y una app móvil para reservas en clubes deportivos.",
        "Integración de React, React Native, Expo, TypeScript y Supabase Auth/PostgreSQL.",
        "Refactor de arquitectura, monitoreo con Sentry y capacitación para publicación en Google Play.",
      ],
      en: [
        "End-to-end development of a SaaS MVP and mobile booking app for sports clubs.",
        "Integration of React, React Native, Expo, TypeScript, and Supabase Auth/PostgreSQL.",
        "Architecture refactor, Sentry monitoring, and Google Play publishing training.",
      ],
    },
    tags: ["React", "React Native", "TypeScript", "Supabase", "Sentry"],
  },
  {
    company: "Econofertas",
    dates: { es: "Feb 2026", en: "Feb 2026" },
    role: { es: "Analista de datos", en: "Data Analyst" },
    place: { es: "Concepción · Híbrido · Contrato temporal", en: "Concepción · Hybrid · Temporary contract" },
    points: {
      es: [
        "Gestión y análisis de datos mediante el software ERP Odoo.",
        "Integración masiva de datos desde Excel utilizando procesos automatizados con Python.",
        "Extracción, transformación y limpieza de datos con Python y Pandas.",
      ],
      en: [
        "Data management and analysis using the Odoo ERP platform.",
        "Bulk Excel data integration through automated processes built with Python.",
        "Data extraction, transformation, and cleaning with Python and Pandas.",
      ],
    },
    tags: ["Odoo", "Python", "Pandas", "Excel", "Data Cleaning"],
  },
  {
    company: "Aula Educa Limitada",
    dates: { es: "Nov 2024 — Ene 2026", en: "Nov 2024 — Jan 2026" },
    role: "Full Stack / UX/UI Developer",
    place: "Santiago · Remoto",
    points: {
      es: [
        "Aplicación móvil OMR multiplataforma con React Native y Expo para lectura de evaluaciones.",
        "APIs y servicios con Django, Flask y PHP, conectados a MySQL y Google Cloud Platform.",
        "Diseño UX/UI en Figma, automatizaciones Python y optimización de consultas y flujos internos.",
      ],
      en: [
        "Cross-platform OMR mobile app built with React Native and Expo for assessment scanning.",
        "APIs and services with Django, Flask, and PHP, connected to MySQL and Google Cloud Platform.",
        "UX/UI design in Figma, Python automation, and optimization of queries and internal workflows.",
      ],
    },
    tags: ["React Native", "Django", "Flask", "Python", "GCP", "Figma"],
  },
];

const stackGroups = [
  {
    items: [
      ["HTML5", SiHtml5],
      ["CSS3", SiCss3],
      ["JavaScript", SiJavascript],
      ["TypeScript", SiTypescript],
      ["React", SiReact],
      ["React Native", SiReact],
      ["Expo", SiExpo],
      ["Bootstrap", SiBootstrap],
    ],
  },
  {
    items: [
      ["Node.js", SiNodedotjs],
      ["Python", SiPython],
      ["PHP", SiPhp],
      ["Django", SiDjango],
      ["Flask", SiFlask],
      ["MySQL", SiMysql],
      ["PostgreSQL", SiPostgresql],
      ["Supabase", SiSupabase],
      ["Firebase", SiFirebase],
    ],
  },
  {
    items: [
      ["Google Cloud", SiGooglecloud],
      ["Sentry", SiSentry],
      ["Git", SiGit],
      ["GitHub", FiGithub],
      ["Figma", SiFigma],
      ["REST APIs", FiGlobe],
    ],
  },
];

const projects = [
  {
    number: "01",
    title: "JournalFit",
    date: "Jun 2026",
    status: "active",
    image: journalFitPreview,
    description: {
      es: "Producto móvil de entrenamiento que centraliza planificación, registro de sesiones y análisis del progreso. Incorpora seguimiento de RPE, cálculo de 1RM y métricas personales para entrenar con contexto y tomar decisiones basadas en evidencia.",
      en: "Mobile training product that centralizes planning, session logging, and progress analysis. It includes RPE tracking, 1RM calculation, and personal metrics for contextual, evidence-based training.",
    },
    tags: ["React", "TypeScript", "Mobile Product", "UX/UI", "Vite"],
    live: "https://watenshi.github.io/Landing-Journal-Fit/",
  },
  {
    number: "02",
    title: "Consultora Psicológica",
    date: "Jun 2026",
    status: "active",
    image: psychologyPreview,
    description: {
      es: "Sitio profesional para consulta psicológica con agenda, contacto y gestión de contenido orientada a conversión.",
      en: "Professional psychology practice website with scheduling, contact, and conversion-focused content.",
    },
    tags: ["React", "Firebase", "EmailJS", "Vite"],
    live: "https://watenshi.github.io/consultora-psicologica/",
  },
  {
    number: "03",
    title: "Susana Riquelme Peluquería",
    category: "clients",
    date: "Jun 2026",
    status: "production",
    image: salonPreview,
    description: {
      es: "Landing editorial para peluquería, enfocada en identidad visual, servicios, marcas y experiencia responsive.",
      en: "Editorial salon landing page focused on visual identity, services, brands, and responsive experience.",
    },
    tags: ["React", "TypeScript", "Vite", "Responsive"],
    live: "https://susanariquelmepeluqueria.cl",
  },
  {
    title: "Calzados Paula",
    category: "clients",
    status: "production",
    image: images.calzadospaula,
    description: {
      es: "Sitio web para Calzados Paula, con una presentación de la marca y su colección de calzado.",
      en: "Website for Calzados Paula, presenting the brand and its footwear collection.",
    },
    tags: ["Web", "Responsive"],
    live: "https://calzadospaula.cl",
  },
  {
    number: "04",
    title: "Sistema de Certificados",
    date: "May 2026",
    image: certificatesPreview,
    description: {
      es: "Herramienta para cargar datos desde Excel, previsualizar certificados y generarlos de forma masiva en PDF.",
      en: "Tool for importing Excel data, previewing certificates, and generating PDFs in bulk.",
    },
    tags: ["JavaScript", "SheetJS", "jsPDF", "JSZip"],
    live: "https://watenshi.github.io/sistema-certificados/",
  },
  {
    number: "05",
    title: "Invitación de boda",
    date: "Jan 2026",
    image: weddingPreview,
    description: {
      es: "Invitación digital inmersiva con animaciones, narrativa visual, información del evento y experiencia móvil.",
      en: "Immersive digital wedding invitation with animation, visual storytelling, event details, and mobile experience.",
    },
    tags: ["React", "Tailwind CSS", "Animation", "Vite"],
    live: "https://watenshi.github.io/invitacion-boda-mariajose-cristopher/",
  },
  {
    number: "06",
    title: "Video Player Tenshi",
    date: "Oct 2022",
    hidden: true,
    image: videoPreview,
    description: {
      es: "Reproductor de video personalizado creado con JavaScript vanilla, controles propios y una identidad visual experimental.",
      en: "Custom video player built with vanilla JavaScript, bespoke controls, and an experimental visual identity.",
    },
    tags: ["HTML", "CSS", "JavaScript"],
    live: "https://watenshi.github.io/video-player-uwu/",
  },
].filter((project) => !project.hidden);

const certificates = [
  {
    number: "01",
    featured: true,
    title: "Desarrollo de Aplicaciones",
    issuer: "Coderhouse",
    date: "26 Dic 2025",
    file: coderCertificate,
    mediaType: "image",
    description: {
      es: "Formación orientada a construir aplicaciones móviles multiplataforma, desde la arquitectura de componentes hasta persistencia de datos y servicios cloud.",
      en: "Training focused on building cross-platform mobile applications, from component architecture to data persistence and cloud services.",
    },
    skills: ["React Native", "Expo", "Firebase", "Mobile UI", "Componentes"],
  },
  {
    number: "02",
    featured: true,
    title: "Inteligencia Artificial en la Industria y en los Negocios",
    issuer: "#PymesSeLevantan",
    date: "26 Oct 2023",
    file: aiSeminarCertificate,
    mediaType: "image",
    description: {
      es: "Seminario dictado por John Atkinson y Julio Godoy sobre aplicación estratégica de IA en organizaciones: detección de oportunidades, automatización de procesos, apoyo a decisiones, productividad y adopción responsable considerando riesgos, datos y contexto humano.",
      en: "Seminar led by John Atkinson and Julio Godoy on strategic AI adoption in organizations: opportunity discovery, process automation, decision support, productivity, and responsible adoption considering risk, data, and human context.",
    },
    skills: ["IA aplicada", "Automatización", "Estrategia digital", "Procesos", "Adopción responsable"],
  },
  {
    number: "03",
    featured: true,
    title: "Bootcamp de Ciencia de Datos",
    issuer: "Código Facilito",
    date: "Nov 2023",
    file: dataBootcampCertificate,
    description: {
      es: "Programa intensivo de 12 semanas para trabajar el ciclo de análisis de datos: preparación, exploración, visualización e interpretación de información para comunicar hallazgos útiles.",
      en: "Intensive 12-week program covering the data analysis cycle: preparation, exploration, visualization, and interpretation of information to communicate useful findings.",
    },
    skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "EDA", "Limpieza de datos"],
  },
  {
    number: "04",
    featured: false,
    title: "Bases y conceptos de la Ciencia de Datos",
    issuer: "Código Facilito",
    date: "Nov 2023",
    file: dataFoundationsCertificate,
    description: {
      es: "Fundamentos del trabajo con datos: tipos y fuentes de información, etapas de un proyecto, preparación de datasets y criterios para transformar preguntas en análisis.",
      en: "Data work fundamentals: information types and sources, project stages, dataset preparation, and criteria for turning questions into analysis.",
    },
    skills: ["Fundamentos de datos", "Datasets", "Metodología", "Estadística descriptiva"],
  },
  {
    number: "05",
    featured: false,
    title: "Qué hace un científico de datos",
    issuer: "Código Facilito",
    date: "Nov 2023",
    file: dataScientistCertificate,
    description: {
      es: "Introducción al rol profesional, su relación con negocio y tecnología, formulación de hipótesis, comunicación de resultados y colaboración en equipos multidisciplinarios.",
      en: "Introduction to the professional role, its relationship with business and technology, hypothesis formulation, result communication, and multidisciplinary teamwork.",
    },
    skills: ["Pensamiento analítico", "Hipótesis", "Data storytelling", "Comunicación de hallazgos"],
  },
  {
    number: "06",
    featured: false,
    title: "Curso de Terminal para Frontends",
    issuer: "LeonidasEsteban.com",
    date: "Oct 2022",
    file: terminalCertificate,
    mediaType: "image",
    description: {
      es: "Uso práctico de la terminal en el flujo de desarrollo frontend: navegación del sistema de archivos, ejecución de comandos, gestión de proyectos y mayor autonomía al trabajar con herramientas de desarrollo.",
      en: "Practical terminal usage for frontend workflows: file system navigation, command execution, project management, and greater autonomy when working with development tools.",
    },
    skills: ["Terminal", "CLI", "Sistema de archivos", "Flujo frontend", "Productividad"],
  },
];

// Future Figma cases remain in copy; enable this section when real cases are available.
const showFigma = false;

function SectionHeader({ content }) {
  return (
    <Reveal className="section-heading">
      <span className="section-kicker"><i />{content[0]}</span>
      <h2>{content[1]}</h2>
      <p>{content[2]}</p>
    </Reveal>
  );
}

function App() {
  const { language, setLanguage, theme, setTheme } = useSitePreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [modalCertificate, setModalCertificate] = useState(null);
  const certificateTrigger = useRef(null);
  const { enabled, reduced, toggleMotion, scrollBehavior } = useMotion();
  const t = copy[language];

  useEffect(() => {
    const target = window.location.hash.slice(1) || new URLSearchParams(window.location.search).get("view");
    if (!target) return;
    // Wait for local fonts so deep links land at their final layout position.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) document.getElementById(target)?.scrollIntoView({ behavior: "instant" });
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = ["home", ...t.navIds].map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: "-15% 0px -70%", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [t.navIds]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        document.querySelector(".menu-button")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior });
    setMenuOpen(false);
  };

  const terminalContext = {
    language,
    theme,
    projects,
    experience,
    stackGroups,
    aboutText: t.aboutText,
    stackLabels: t.stackGroups,
    location: t.location,
    blogUrl: blogPath,
  };

  const navigate = (event, id) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.replaceState(null, "", `#${id}`);
    scrollTo(id);
  };

  const openCertificate = (certificate, event) => {
    certificateTrigger.current = event.currentTarget;
    setModalCertificate(certificate);
  };

  const closeCertificate = () => {
    setModalCertificate(null);
    requestAnimationFrame(() => certificateTrigger.current?.focus({ preventScroll: true }));
  };

  const handleContact = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const recipient = String.fromCharCode(97,110,103,101,108,46,97,98,97,114,122,117,97,49,53,64,103,109,97,105,108,46,99,111,109);
    const body = `${language === "es" ? "Nombre" : "Name"}: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(data.get("subject"))}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="site-shell portfolio-shell">
      <a className="skip-link" href="#main">{t.skip}</a>
      <div className="ambient-background" aria-hidden="true"><div className="ambient-shape shape-one ambient-loop" /><div className="ambient-shape shape-two ambient-loop" /></div>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#home" onClick={(event) => navigate(event, "home")} aria-label={`Ángel Cárdenas · ${t.backTop}`}><span className="brand-mark">ac<span>®</span></span></a>
          <nav id="main-nav" className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label={t.navigation}>
            {t.nav.map((item, index) => (
              <a key={t.navIds[index]} href={`#${t.navIds[index]}`} aria-current={activeSection === t.navIds[index] ? "location" : undefined} onClick={(event) => navigate(event, t.navIds[index])}>{item}</a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="utility-button language-button" onClick={() => setLanguage(language === "es" ? "en" : "es")} aria-label={language === "es" ? "Switch to English" : "Cambiar a español"}>{language === "es" ? "EN" : "ES"}</button>
            <button className="utility-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? t.lightTheme : t.darkTheme} title={theme === "dark" ? t.lightTheme : t.darkTheme}>{theme === "dark" ? <FiSun /> : <FiMoon />}</button>
            <button className="utility-button motion-button" onClick={toggleMotion} aria-label={reduced ? t.motionReduced : enabled ? t.motionOn : t.motionOff} aria-pressed={!enabled} disabled={reduced} title={reduced ? t.motionReduced : enabled ? t.motionOn : t.motionOff}>{enabled ? <FiPause /> : <FiPlay />}</button>
            <button className="menu-button utility-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t.closeMenu : t.menu} aria-expanded={menuOpen} aria-controls="main-nav">{menuOpen ? <FiX /> : <FiMenu />}</button>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero" id="home" data-motion-region>
          <div className="hero-topline"><span><i className="status-dot ambient-loop" />{t.available}</span><span>{t.profileLabel}</span></div>
          <div className="hero-layout">
            <div className="hero-copy">
              <span className="hero-role">{t.role}<span className="role-line" /></span>
              <h1><span>Ángel</span><em>Cárdenas<span className="name-period">.</span></em></h1>
              <Reveal delay={80} className="hero-description"><p className="hero-intro">{t.intro}</p><p className="hero-muted">{t.introMuted}</p></Reveal>
              <Reveal delay={160} className="hero-actions"><a className="primary-button" href="#projects" onClick={(event) => navigate(event, "projects")}>{t.viewProjects}<FiArrowUpRight /></a><a className="text-button" href="#contact" onClick={(event) => navigate(event, "contact")}>{t.contact}<span>↗</span></a></Reveal>
            </div>
            <aside className="profile-stage">
              <div className="profile-orbit orbit-one ambient-loop" aria-hidden="true"><i /></div>
              <div className="profile-orbit orbit-two ambient-loop" aria-hidden="true"><i /></div>
              <div className="portrait-frame"><div className="profile-photo ambient-loop"><img src={profile.src} srcSet={profile.srcSet} sizes="(max-width: 600px) 260px, (max-width: 1050px) 300px, 360px" width={profile.width} height={profile.height} fetchPriority="high" alt="Ángel Cárdenas Abarzúa" /></div></div>
              <span className="portrait-cross" aria-hidden="true"><FiCode /></span>
              <span className="portrait-coordinate" aria-hidden="true">36°49′ S / 73°03′ W</span>
              <div className="profile-caption"><span>{t.profileCard.eyebrow}</span><p>{t.profileCard.title}</p></div>
              <div className="social-row"><a href="https://www.linkedin.com/in/angel-cardenas-abarzua-0a7380290/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a><span>{t.location}</span></div>
            </aside>
          </div>
          <div className="hero-bottom"><a className="scroll-cue" href="#projects" onClick={(event) => navigate(event, "projects")}><FiArrowDown className="ambient-loop" />{t.explore}</a><div className="hero-areas">{t.profileCard.areas.map((area) => <span key={area}>{area}</span>)}</div></div>
          <div className="hero-stats">{t.stats.map(([value, label]) => <div className="stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        </section>

        <section className="content-section projects-section" id="projects">
          <div className="heading-with-meta"><SectionHeader content={t.section.projects} /><span className="section-side-note">{t.selected}<FiArrowDown /></span></div>
          {["clients", "personal"].map((group) => (
            <section className={`project-group project-group-${group}`} key={group} aria-labelledby={`projects-${group}-title`}>
              <Reveal className="project-group-heading">
                <h3 id={`projects-${group}-title`}>{t.projectGroups[group].title}</h3>
                <p>{t.projectGroups[group].description}</p>
              </Reveal>
              <div className="projects-grid">
                {projects.filter((project) => (project.category || "personal") === group).map((project, index) => (
                  <Reveal key={project.title} delay={index * 80} className="project-slot">
                    <article className="project-card">
                      <a className="project-visual" href={project.live} target="_blank" rel="noreferrer" aria-label={`${t.projectActions.live}: ${project.title}`}>
                        <div className="project-visual-top"><span>{String(index + 1).padStart(2, "0")} / {project.tags[0]}</span><FiArrowUpRight /></div>
                        <div className="project-browser"><div className="browser-bar"><i /><i /><i /><span>{project.title}</span></div><img src={project.image.src} srcSet={project.image.srcSet} sizes="(max-width: 780px) calc(100vw - 80px), (max-width: 1336px) calc(50vw - 112px), 556px" width={project.image.width} height={project.image.height} loading="lazy" decoding="async" alt={`${t.projectPreview} ${project.title}`} /></div>
                      </a>
                      <div className="project-body"><div className="project-index"><span>{group === "clients" ? new URL(project.live).hostname : project.date}</span>{project.status && <span className="project-status">{t.projectStatus[project.status]}</span>}</div><h4>{project.title}</h4><p>{project.description[language]}</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a className="project-link" href={project.live} target="_blank" rel="noreferrer">{t.projectActions.live}<FiArrowUpRight /></a></div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="content-section experience-section" id="experience">
          <div className="heading-with-meta"><SectionHeader content={t.section.experience} /><span className="section-side-note">{t.experienceMeta}</span></div>
          <div className="experience-list">
            {experience.map((job, index) => (
              <Reveal key={job.company} delay={index * 80}>
                <article className={job.current ? "experience-card featured" : "experience-card"} data-motion-region>
                  <div className="experience-date"><span className="experience-number">0{index + 1}</span><b>{job.dates[language]}</b><span>{typeof job.place === "string" ? job.place : job.place[language]}</span>{job.current && <span className="current-label"><i className="status-dot ambient-loop" />{t.current}</span>}</div>
                  <div className="experience-content"><h3>{job.company}</h3><h4>{typeof job.role === "string" ? job.role : job.role[language]}</h4><ul>{job.points[language].map((point) => <li key={point}>{point}</li>)}</ul><div className="tag-list">{job.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="content-section about-section" id="about">
          <SectionHeader content={t.section.about} />
          <div className="about-grid"><Reveal className="about-copy">{t.aboutText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Reveal><Reveal delay={80}><dl className="about-list">{t.aboutDetails.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></Reveal></div>
        </section>

        <section className="content-section" id="stack">
          <SectionHeader content={t.section.stack} />
          <div className="stack-groups">{stackGroups.map((group, index) => <Reveal key={t.stackGroups[index]} delay={index * 80} className="stack-group"><div className="stack-title"><span>0{index + 1}</span><h3>{t.stackGroups[index]}</h3><small>{group.items.length} {t.items}</small></div><div className="stack-grid">{group.items.map(([name, icon]) => <div className="tech-card" key={name}>{createElement(icon)}<span>{name}</span></div>)}</div></Reveal>)}</div>
        </section>

        <section className="content-section certificates-section" id="certificates">
          <SectionHeader content={t.section.certificates} />
          <div className="certificates-featured">{certificates.filter((certificate) => certificate.featured).map((certificate, index) => (
            <Reveal key={certificate.title} delay={index * 80}><article className="certificate-card"><div className="certificate-top"><span>{certificate.number}</span><FiAward /></div><div className="certificate-meta"><span>{t.certificateLabels.featured}</span><span>{certificate.date}</span></div><h3>{certificate.title}</h3><h4>{certificate.issuer}</h4><p>{certificate.description[language]}</p><div className="certificate-skills"><strong>{t.certificateLabels.skills}</strong><div className="tag-list">{certificate.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><button className="certificate-link" type="button" onClick={(event) => openCertificate(certificate, event)}>{t.certificateLabels.view}<FiArrowUpRight /></button></article></Reveal>
          ))}</div>
          <div className="certificates-secondary">{certificates.filter((certificate) => !certificate.featured).map((certificate, index) => (
            <Reveal key={certificate.title} delay={index * 80}><article className="certificate-row"><div className="certificate-row-number">{certificate.number}</div><div className="certificate-row-copy"><span>{t.certificateLabels.complementary} · {certificate.date}</span><h3>{certificate.title}</h3><h4>{certificate.issuer}</h4><p>{certificate.description[language]}</p><div className="tag-list">{certificate.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><button type="button" onClick={(event) => openCertificate(certificate, event)} aria-label={`${t.certificateLabels.view}: ${certificate.title}`}><FiArrowUpRight /></button></article></Reveal>
          ))}</div>
        </section>

        {showFigma && <section className="content-section figma-section" id="figma"><SectionHeader content={t.section.figma} /><div className="figma-grid">{[1,2,3].map((item) => <article className="figma-card" key={item}><SiFigma /><span>{t.figmaSoon}</span><h3>{t.figmaTitle} 0{item}</h3><p>{t.figmaText}</p></article>)}</div></section>}

        <section className="blog-promo" id="blog" aria-labelledby="blog-promo-title">
          <Reveal className="blog-promo-card">
            <span className="blog-promo-icon" aria-hidden="true"><FiBookOpen /></span>
            <div className="blog-promo-copy">
              <span className="blog-promo-label">{t.blogPromo.label}</span>
              <h2 id="blog-promo-title">{t.blogPromo.title}</h2>
              <p>{t.blogPromo.description}</p>
            </div>
            <a className="blog-promo-link" href={blogPath}>{t.blogPromo.action}<FiArrowUpRight aria-hidden="true" /></a>
          </Reveal>
        </section>

        <section className="content-section contact-section" id="contact">
          <SectionHeader content={t.section.contact} />
          <div className="contact-grid"><Reveal><form className="contact-form" onSubmit={handleContact}><div className="form-row"><label><span>{t.contactForm.name}</span><input name="name" autoComplete="name" required placeholder={t.contactForm.namePlaceholder} /></label><label><span>{t.contactForm.email}</span><input name="email" autoComplete="email" type="email" required placeholder={t.contactForm.emailPlaceholder} /></label></div><label><span>{t.contactForm.subject}</span><input name="subject" required placeholder={t.contactForm.subjectPlaceholder} /></label><label><span>{t.contactForm.message}</span><textarea name="message" required rows="5" placeholder={t.contactForm.messagePlaceholder} /></label><div className="form-footer"><button type="submit">{t.contactForm.send}<FiSend /></button><small>{t.contactForm.hint}</small></div></form></Reveal><Reveal delay={80}><a className="linkedin-card" href="https://www.linkedin.com/in/angel-cardenas-abarzua-0a7380290/" target="_blank" rel="noreferrer"><FiLinkedin /><span>{t.contactForm.linkedin}</span><FiArrowUpRight /></a></Reveal></div>
        </section>
      </main>
      <footer><a className="footer-brand" href="#home" onClick={(event) => navigate(event, "home")}>Ángel Cárdenas<span>®</span></a><div className="footer-bottom"><span>© {new Date().getFullYear()} · {t.footer}</span><a href="#home" onClick={(event) => navigate(event, "home")}>{t.backTop}<FiArrowUpRight /></a></div></footer>
      <BlogFab language={language} />
      <PortfolioTerminal context={terminalContext} setLanguage={setLanguage} setTheme={setTheme} navigateTo={scrollTo} />
      {modalCertificate && <CertificateModal certificate={modalCertificate} labels={t.certificateLabels} onClose={closeCertificate} />}
    </div>
  );
}

export default App;
