import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiAward,
  FiBookOpen,
  FiCode,
  FiLinkedin,
  FiMenu,
  FiMoon,
  FiPause,
  FiPlay,
  FiSend,
  FiSun,
  FiX,
} from "react-icons/fi";
import { SiFigma } from "react-icons/si";
import "./App.css";
import Reveal from "./components/Reveal";
import CertificateModal from "./components/CertificateModal";
import { useMotion } from "./hooks/useMotion";
import { useSitePreferences } from "./hooks/useSitePreferences";
import BlogFab from "./components/BlogFab";
import PortfolioTerminal from "./components/terminal/PortfolioTerminal";
import SkillMapLoader from "./components/skill-map/SkillMapLoader";
import { blogPath } from "./blog/paths";
import images from "./assets/optimized/images";
import { experience, projects } from "./data/portfolio/index.js";
import { areas, skills } from "./data/skillGraph/index.js";
import { labDebugPath, labPath } from "./lab/labData.js";

const ProjectArchitectureExplorer = lazy(() => import("./components/architecture/ProjectArchitectureExplorer.jsx"));
const architectureIds = new Set(["journalfit", "consultora", "certificados"]);
const architectureViews = new Set(["architecture", "data-flow", "decisions"]);

const profile = images.profile;
import terminalCertificate from "./assets/1752023569576.jpg";
import aiSeminarCertificate from "./assets/1764267414745.jpg";
import coderCertificate from "./assets/coderhouse-certificate.jpg";
import dataBootcampCertificate from "./assets/Certificado - Bootcamp de Ciencia de Datos.pdf";
import dataFoundationsCertificate from "./assets/Certificado - Curso de Bases y conceptos de la Ciencia de Datos.pdf";
import dataScientistCertificate from "./assets/Certificado - Qué hace un científico de datos - Bootcamp de ciencia de datos.pdf";
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
      ["7", "proyectos destacados"],
      ["2", "plataformas · web + mobile"],
      ["360°", "visión de producto"],
    ],
    section: {
      about: ["03 / SOBRE MÍ", "Código con criterio de producto.", "No me interesa construir pantallas aisladas. Diseño sistemas completos que sean claros para las personas y sostenibles para los equipos."],
      experience: ["02 / EXPERIENCIA", "Trayectoria profesional.", "Productos SaaS, plataformas educativas y operación tecnológica en entornos reales."],
      stack: ["04 / SKILL MAP", "Tecnología en contexto.", "Explora cómo cada tecnología conecta proyectos, experiencia profesional y decisiones de arquitectura."],
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
    projectActions: { live: "Visitar sitio", architecture: "Explorar arquitectura" },
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
      ["7", "featured projects"],
      ["2", "platforms · web + mobile"],
      ["360°", "product perspective"],
    ],
    section: {
      about: ["03 / ABOUT", "Code guided by product thinking.", "I do not build isolated screens. I design complete systems that are clear for people and sustainable for teams."],
      experience: ["02 / EXPERIENCE", "Professional journey.", "SaaS products, education platforms, and technology operations in real environments."],
      stack: ["04 / SKILL MAP", "Technology in context.", "Explore how each technology connects projects, professional experience, and architecture decisions."],
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
    projectActions: { live: "Visit website", architecture: "Explore architecture" },
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
  const [architectureProject, setArchitectureProject] = useState(() => {
    const id = new URLSearchParams(window.location.search).get("architecture");
    return architectureIds.has(id) ? id : null;
  });
  const [architectureView, setArchitectureView] = useState(() => {
    const view = new URLSearchParams(window.location.search).get("view");
    return architectureViews.has(view) ? view : "architecture";
  });
  const [architectureNode, setArchitectureNode] = useState(() => new URLSearchParams(window.location.search).get("node"));
  const [architectureOrigin, setArchitectureOrigin] = useState(null);
  const certificateTrigger = useRef(null);
  const architectureTrigger = useRef(null);
  const { enabled, reduced, toggleMotion, scrollBehavior } = useMotion();
  const t = copy[language];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = window.location.hash.slice(1) || (!params.has("architecture") ? params.get("view") : null);
    if (!target) return;
    // Wait for local fonts so deep links land at their final layout position.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) document.getElementById(target)?.scrollIntoView({ behavior: "instant" });
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const syncArchitectureRoute = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("architecture");
      const nextView = params.get("view");
      setArchitectureProject(architectureIds.has(id) ? id : null);
      setArchitectureView(architectureViews.has(nextView) ? nextView : "architecture");
      setArchitectureNode(params.get("node"));
    };
    window.addEventListener("popstate", syncArchitectureRoute);
    return () => window.removeEventListener("popstate", syncArchitectureRoute);
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
    skills,
    areas,
    aboutText: t.aboutText,
    location: t.location,
    blogUrl: blogPath,
    labUrl: labPath,
    debugUrl: labDebugPath,
  };

  const navigate = (event, id) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.replaceState(null, "", `#${id}`);
    scrollTo(id);
  };

  const openSkillMap = (skillId = null) => {
    const url = new URL(window.location.href);
    ["skill", "skillProject", "role"].forEach((key) => url.searchParams.delete(key));
    if (skillId) url.searchParams.set("skill", skillId);
    window.history.pushState(window.history.state, "", `${url.pathname}${url.search}#stack`);
    scrollTo("stack");
    window.dispatchEvent(new CustomEvent("portfolio:open-skill", { detail: { id: skillId } }));
  };

  const openCertificate = (certificate, event) => {
    certificateTrigger.current = event.currentTarget;
    setModalCertificate(certificate);
  };

  const closeCertificate = () => {
    setModalCertificate(null);
    requestAnimationFrame(() => certificateTrigger.current?.focus({ preventScroll: true }));
  };

  const openArchitecture = (project, event, nodeId = null) => {
    architectureTrigger.current = event.currentTarget;
    const rect = event.currentTarget.closest?.(".project-card")?.getBoundingClientRect() || event.currentTarget.getBoundingClientRect();
    setArchitectureOrigin({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    setArchitectureProject(project.architectureId);
    setArchitectureView("architecture");
    setArchitectureNode(nodeId);
    const url = new URL(window.location.href);
    url.searchParams.set("architecture", project.architectureId);
    url.searchParams.set("view", "architecture");
    if (nodeId) url.searchParams.set("node", nodeId); else url.searchParams.delete("node");
    window.history.pushState({ architectureExplorer: true }, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const closeArchitecture = () => {
    setArchitectureProject(null);
    setArchitectureNode(null);
    if (window.history.state?.architectureExplorer) {
      window.history.back();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("architecture");
      url.searchParams.delete("node");
      if (architectureViews.has(url.searchParams.get("view"))) url.searchParams.delete("view");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
    requestAnimationFrame(() => architectureTrigger.current?.focus({ preventScroll: true }));
  };

  const changeArchitectureView = (view) => {
    setArchitectureView(view);
    const url = new URL(window.location.href);
    url.searchParams.set("view", view);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
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
          <a className="header-lab-link" href={labPath}>LAB<i aria-hidden="true" /></a>
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
                      <div className="project-body"><div className="project-index"><span>{group === "clients" ? new URL(project.live).hostname : project.date}</span>{project.status && <span className="project-status">{t.projectStatus[project.status]}</span>}</div><h4>{project.title}</h4><p>{project.description[language]}</p><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-actions"><a className="project-link" href={project.live} target="_blank" rel="noreferrer">{t.projectActions.live}<FiArrowUpRight /></a>{project.architectureId && <button className="project-link architecture-link" type="button" onClick={(event) => openArchitecture(project, event)}><span className="architecture-link-mark" aria-hidden="true"><i /><i /><i /></span>{t.projectActions.architecture}<FiArrowUpRight /></button>}</div></div>
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

        <section className="content-section skill-map-section" id="stack">
          <SectionHeader content={t.section.stack} />
          <SkillMapLoader language={language} motionEnabled={enabled} onOpenArchitecture={(project, node, trigger) => openArchitecture(project, { currentTarget: trigger }, node)} />
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
      <PortfolioTerminal context={terminalContext} setLanguage={setLanguage} setTheme={setTheme} navigateTo={scrollTo} openSkillMap={openSkillMap} />
      {modalCertificate && <CertificateModal certificate={modalCertificate} labels={t.certificateLabels} onClose={closeCertificate} />}
      {architectureProject && <Suspense fallback={<div className="architecture-load-fallback" role="status">SYSTEM / LOADING</div>}><ProjectArchitectureExplorer key={`${architectureProject}-${architectureNode || "root"}`} projectId={architectureProject} language={language} motionEnabled={enabled} initialView={architectureView} initialNode={architectureNode} originRect={architectureOrigin} onClose={closeArchitecture} onViewChange={changeArchitectureView} /></Suspense>}
    </div>
  );
}

export default App;
