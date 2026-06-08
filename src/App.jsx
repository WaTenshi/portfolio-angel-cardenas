import { createElement, useEffect, useState } from "react";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiAward,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiMenu,
  FiMoon,
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

import profile from "./assets/profile.jpg";
import terminalCertificate from "./assets/1752023569576.jpg";
import aiSeminarCertificate from "./assets/1764267414745.jpg";
import coderCertificate from "./assets/coderhouse-certificate.jpg";
import dataBootcampCertificate from "./assets/Certificado - Bootcamp de Ciencia de Datos.pdf";
import dataFoundationsCertificate from "./assets/Certificado - Curso de Bases y conceptos de la Ciencia de Datos.pdf";
import dataScientistCertificate from "./assets/Certificado - Qué hace un científico de datos - Bootcamp de ciencia de datos.pdf";
import journalFitPreview from "./assets/projects/journalfit.jpg";
import weddingPreview from "./assets/projects/boda.jpg";
import certificatesPreview from "./assets/projects/certificados.png";
import psychologyPreview from "./assets/projects/consultora.jpg";
import salonPreview from "./assets/projects/peluqueria.jpg";
import videoPreview from "./assets/projects/video-player.jpg";

const copy = {
  es: {
    nav: ["Sobre mí", "Experiencia", "Tecnologías", "Proyectos", "Certificados", "Contacto"],
    navIds: ["about", "experience", "stack", "projects", "certificates", "contact"],
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
      eyebrow: "Diseño + ingeniería",
      title: "Ideas que llegan a producción.",
      areas: ["Web apps", "Mobile", "SaaS", "UX/UI"],
      status: "Full Stack · Concepción, Chile",
    },
    stats: [
      ["4", "roles profesionales"],
      ["6", "proyectos destacados"],
      ["2", "plataformas · web + mobile"],
      ["360°", "visión de producto"],
    ],
    section: {
      about: ["01 / SOBRE MÍ", "Código con criterio de producto.", "No me interesa construir pantallas aisladas. Diseño sistemas completos que sean claros para las personas y sostenibles para los equipos."],
      experience: ["02 / EXPERIENCIA", "Trayectoria profesional.", "Productos SaaS, plataformas educativas y operación tecnológica en entornos reales."],
      stack: ["03 / STACK", "Tecnología con propósito.", "Herramientas utilizadas en proyectos reales, organizadas por el problema que resuelven."],
      projects: ["04 / PROYECTOS", "Trabajo seleccionado.", "JournalFit encabeza una colección de productos y experiencias digitales ordenada desde lo más reciente."],
      certificates: ["05 / CERTIFICADOS", "Aprendizaje que se convierte en práctica.", "Formación aplicada en desarrollo móvil, inteligencia artificial y ciencia de datos."],
      figma: ["06 / FIGMA", "Diseño en proceso.", "Espacio preparado para sumar casos de UX/UI, sistemas visuales y prototipos."],
      contact: ["07 / CONTACTO", "Construyamos algo útil.", "Estoy abierto a conversar sobre productos, equipos y desafíos donde diseño y desarrollo deban trabajar juntos."],
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
    experienceMeta: "NOV 2024 → PRESENTE · 4 ROLES",
    relation: "Experiencia profesional",
    current: "Actualidad",
    stackGroups: ["Front-end", "Back-end & data", "Cloud & tools"],
    projectActions: { live: "Visitar sitio" },
    projectStatus: { active: "En desarrollo" },
    certificateLabels: {
      featured: "Certificado principal",
      complementary: "Formación complementaria",
      view: "Ver certificado",
      skills: "Habilidades desarrolladas",
      close: "Cerrar certificado",
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
    nav: ["About", "Experience", "Technologies", "Projects", "Certificates", "Contact"],
    navIds: ["about", "experience", "stack", "projects", "certificates", "contact"],
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
      eyebrow: "Design + engineering",
      title: "Ideas shipped to production.",
      areas: ["Web apps", "Mobile", "SaaS", "UX/UI"],
      status: "Full Stack · Concepción, Chile",
    },
    stats: [
      ["4", "professional roles"],
      ["6", "featured projects"],
      ["2", "platforms · web + mobile"],
      ["360°", "product perspective"],
    ],
    section: {
      about: ["01 / ABOUT", "Code guided by product thinking.", "I do not build isolated screens. I design complete systems that are clear for people and sustainable for teams."],
      experience: ["02 / EXPERIENCE", "Professional journey.", "SaaS products, education platforms, and technology operations in real environments."],
      stack: ["03 / STACK", "Technology with purpose.", "Tools used in real projects, organized by the problems they solve."],
      projects: ["04 / PROJECTS", "Selected work.", "JournalFit leads a collection of digital products and experiences ordered from newest to oldest."],
      certificates: ["05 / CERTIFICATES", "Learning turned into practice.", "Applied training in mobile development, artificial intelligence, and data science."],
      figma: ["06 / FIGMA", "Design in progress.", "A prepared space for UX/UI case studies, visual systems, and prototypes."],
      contact: ["07 / CONTACT", "Let’s build something useful.", "I am open to discussing products, teams, and challenges where design and development need to work together."],
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
    experienceMeta: "NOV 2024 → PRESENT · 4 ROLES",
    relation: "Professional experience",
    current: "Present",
    stackGroups: ["Front-end", "Back-end & data", "Cloud & tools"],
    projectActions: { live: "Visit website" },
    projectStatus: { active: "In development" },
    certificateLabels: {
      featured: "Featured certificate",
      complementary: "Complementary training",
      view: "View certificate",
      skills: "Skills developed",
      close: "Close certificate",
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
    date: "Jun 2026",
    image: salonPreview,
    description: {
      es: "Landing editorial para peluquería, enfocada en identidad visual, servicios, marcas y experiencia responsive.",
      en: "Editorial salon landing page focused on visual identity, services, brands, and responsive experience.",
    },
    tags: ["React", "TypeScript", "Vite", "Responsive"],
    live: "https://watenshi.github.io/susanariquelme-peluqueria/",
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
    image: videoPreview,
    description: {
      es: "Reproductor de video personalizado creado con JavaScript vanilla, controles propios y una identidad visual experimental.",
      en: "Custom video player built with vanilla JavaScript, bespoke controls, and an experimental visual identity.",
    },
    tags: ["HTML", "CSS", "JavaScript"],
    live: "https://watenshi.github.io/video-player-uwu/",
  },
];

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

function SectionHeader({ content }) {
  return (
    <div className="section-heading">
      <span className="section-kicker"><i />{content[0]}</span>
      <h2>{content[1]}</h2>
      <p>{content[2]}</p>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "es");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [modalCertificate, setModalCertificate] = useState(null);
  const t = copy[language];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const target = window.location.hash.slice(1) || new URLSearchParams(window.location.search).get("view");
    if (!target) return;
    const timer = window.setTimeout(() => document.getElementById(target)?.scrollIntoView(), 800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!modalCertificate) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setModalCertificate(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [modalCertificate]);

  useEffect(() => {
    const sections = t.navIds.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (current) setActiveSection(current.target.id);
      },
      { rootMargin: "-30% 0px -60%", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [t.navIds]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleContact = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const recipient = String.fromCharCode(
      97, 110, 103, 101, 108, 46, 97, 98, 97, 114, 122, 117, 97, 49, 53, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109,
    );
    const name = data.get("name");
    const email = data.get("email");
    const subject = data.get("subject");
    const message = data.get("message");
    const body = `${language === "es" ? "Nombre" : "Name"}: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="brand-mark">AC</span>
            <span className="brand-name">Ángel Cárdenas</span>
            <span className="brand-role">/ full stack</span>
          </button>

          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
            {t.nav.map((item, index) => (
              <button
                key={t.navIds[index]}
                className={activeSection === t.navIds[index] ? "active" : ""}
                onClick={() => scrollTo(t.navIds[index])}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button className="utility-button language-button" onClick={() => setLanguage(language === "es" ? "en" : "es")}>
              {language === "es" ? "EN" : "ES"}
            </button>
            <button
              className="utility-button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
            <button className="menu-button utility-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="availability"><span />{t.available}</div>
            <h1><span>Ángel</span><em>Cárdenas.</em></h1>
            <p className="hero-intro">{t.intro}</p>
            <p className="hero-muted">{t.introMuted}</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => scrollTo("projects")}>{t.viewProjects}<FiArrowUpRight /></button>
              <button className="text-button" onClick={() => scrollTo("contact")}>{t.contact}</button>
            </div>
            <div className="social-row">
              <a href="https://github.com/WaTenshi" target="_blank" rel="noreferrer" aria-label="GitHub"><FiGithub /></a>
              <a href="https://www.linkedin.com/in/angel-cardenas-abarzua" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
            </div>
          </div>

          <aside className="profile-stage">
            <div className="profile-orbit orbit-one" />
            <div className="profile-orbit orbit-two" />
            <div className="profile-stage-top">
              <span>{t.profileLabel}</span>
              <b><i />{t.live}</b>
            </div>
            <div className="profile-visual">
              <div className="profile-photo"><img src={profile} alt="Ángel Cárdenas Abarzúa" /></div>
              <span className="floating-code">&lt;/&gt;</span>
              <span className="floating-dot dot-one" />
              <span className="floating-dot dot-two" />
            </div>
            <div className="profile-card-copy">
              <span>{t.profileCard.eyebrow}</span>
              <h2>{t.profileCard.title}</h2>
              <div className="profile-areas">{t.profileCard.areas.map((area) => <i key={area}>{area}</i>)}</div>
              <p>{t.profileCard.status}</p>
            </div>
          </aside>

          <div className="hero-stats">
            {t.stats.map(([value, label], index) => (
              <div className="stat" key={label}><strong>{value}{index === 1 && <sup>+</sup>}</strong><span>{label}</span></div>
            ))}
          </div>
          <button className="scroll-cue" onClick={() => scrollTo("about")} aria-label="Scroll"><FiArrowDown /></button>
        </section>

        <section className="content-section about-section" id="about">
          <SectionHeader content={t.section.about} />
          <div className="about-grid">
            <div className="about-copy">{t.aboutText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <dl className="about-list">
              {t.aboutDetails.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </div>
        </section>

        <section className="content-section" id="experience">
          <div className="heading-with-meta">
            <SectionHeader content={t.section.experience} />
            <span>{t.experienceMeta}</span>
          </div>
          <div className="experience-label">{t.relation}</div>
          <div className="experience-list">
            {experience.map((job, index) => (
              <article className={index === 0 ? "experience-card featured" : "experience-card"} key={job.company}>
                <div className="experience-date">
                  <b>{job.dates[language]}</b>
                  <span>{typeof job.place === "string" ? job.place : job.place[language]}</span>
                </div>
                <div className="experience-content">
                  <h3>{job.company}</h3>
                  <h4>{typeof job.role === "string" ? job.role : job.role[language]}</h4>
                  <ul>{job.points[language].map((point) => <li key={point}>{point}</li>)}</ul>
                  <div className="tag-list">{job.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section" id="stack">
          <SectionHeader content={t.section.stack} />
          <div className="stack-groups">
            {stackGroups.map((group, groupIndex) => (
              <div className="stack-group" key={t.stackGroups[groupIndex]}>
                <div className="stack-title"><h3>{t.stackGroups[groupIndex]}</h3><span>{group.items.length} ITEMS</span></div>
                <div className="stack-grid">
                  {group.items.map(([name, icon]) => <div className="tech-card" key={name}>{createElement(icon)}<span>{name}</span></div>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section projects-section" id="projects">
          <SectionHeader content={t.section.projects} />
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <div className="project-browser"><div className="browser-bar"><i /><i /><i /><span>{project.title.toLowerCase().replaceAll(" ", "-")}</span></div><img src={project.image} alt="" /></div>
                <div className="project-body">
                  <div className="project-index">
                    <span># {project.number}</span>
                    <span>{project.status && <i className="project-status">{t.projectStatus[project.status]}</i>}{project.date}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description[language]}</p>
                  <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className="project-links">
                    {project.live && <a href={project.live} target="_blank" rel="noreferrer">{t.projectActions.live}<FiArrowUpRight /></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section certificates-section" id="certificates">
          <SectionHeader content={t.section.certificates} />
          <div className="certificates-featured">
            {certificates.filter((certificate) => certificate.featured).map((certificate) => (
              <article className="certificate-card" key={certificate.title}>
                <div className="certificate-top">
                  <span>{certificate.number}</span>
                  <FiAward />
                </div>
                <div className="certificate-meta">
                  <span>{t.certificateLabels.featured}</span>
                  <i>{certificate.date}</i>
                </div>
                <h3>{certificate.title}</h3>
                <h4>{certificate.issuer}</h4>
                <p>{certificate.description[language]}</p>
                <div className="certificate-skills">
                  <strong>{t.certificateLabels.skills}</strong>
                  <div className="tag-list">{certificate.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                </div>
                <button className="certificate-link" type="button" onClick={() => setModalCertificate(certificate)}>
                  {t.certificateLabels.view}<FiArrowUpRight />
                </button>
              </article>
            ))}
          </div>

          <div className="certificates-secondary">
            {certificates.filter((certificate) => !certificate.featured).map((certificate) => (
              <article className="certificate-row" key={certificate.title}>
                <div className="certificate-row-number">{certificate.number}</div>
                <div className="certificate-row-copy">
                  <span>{t.certificateLabels.complementary} · {certificate.date}</span>
                  <h3>{certificate.title}</h3>
                  <h4>{certificate.issuer}</h4>
                  <p>{certificate.description[language]}</p>
                  <div className="tag-list">{certificate.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                </div>
                <button type="button" onClick={() => setModalCertificate(certificate)} aria-label={`${t.certificateLabels.view}: ${certificate.title}`}>
                  <FiArrowUpRight />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section figma-section" id="figma">
          <SectionHeader content={t.section.figma} />
          <div className="figma-grid">
            {[1, 2, 3].map((item) => (
              <article className="figma-card" key={item}>
                <div className="figma-preview"><SiFigma /><span>0{item}</span></div>
                <span className="figma-soon">{t.figmaSoon}</span>
                <h3>{t.figmaTitle} 0{item}</h3>
                <p>{t.figmaText}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section contact-section" id="contact">
          <SectionHeader content={t.section.contact} />
          <div className="contact-grid">
            <form className="contact-form" onSubmit={handleContact}>
              <div className="form-row">
                <label><span>{t.contactForm.name}</span><input name="name" required placeholder={t.contactForm.namePlaceholder} /></label>
                <label><span>{t.contactForm.email}</span><input name="email" type="email" required placeholder={t.contactForm.emailPlaceholder} /></label>
              </div>
              <label><span>{t.contactForm.subject}</span><input name="subject" required placeholder={t.contactForm.subjectPlaceholder} /></label>
              <label><span>{t.contactForm.message}</span><textarea name="message" required rows="6" placeholder={t.contactForm.messagePlaceholder} /></label>
              <div className="form-footer">
                <button type="submit">{t.contactForm.send}<FiSend /></button>
                <small>{t.contactForm.hint}</small>
              </div>
            </form>
            <a className="linkedin-card" href="https://www.linkedin.com/in/angel-cardenas-abarzua" target="_blank" rel="noreferrer">
              <FiLinkedin />
              <span>{t.contactForm.linkedin}</span>
              <FiArrowUpRight />
            </a>
          </div>
        </section>
      </main>

      <footer><span>© {new Date().getFullYear()} Ángel Cárdenas</span><span>{t.footer}</span><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑ TOP</button></footer>

      {modalCertificate && (
        <div className="certificate-modal-backdrop" role="presentation" onMouseDown={() => setModalCertificate(null)}>
          <section
            className="certificate-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>{modalCertificate.issuer} · {modalCertificate.date}</span>
                <h2 id="certificate-modal-title">{modalCertificate.title}</h2>
              </div>
              <button type="button" onClick={() => setModalCertificate(null)} aria-label={t.certificateLabels.close}>
                <FiX />
              </button>
            </header>
            <div className={`certificate-viewer ${modalCertificate.mediaType === "image" ? "is-image" : "is-pdf"}`}>
              {modalCertificate.mediaType === "image" ? (
                <img src={modalCertificate.file} alt={`${modalCertificate.title} — ${modalCertificate.issuer}`} />
              ) : (
                <iframe src={`${modalCertificate.file}#toolbar=0&navpanes=0`} title={modalCertificate.title} />
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
