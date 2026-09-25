import { experience } from "../portfolio/experience.js";
import { projectCatalog as projects } from "../portfolio/projectCatalog.js";

const t = (es, en) => ({ es, en });

export const areas = [
  ["frontend", "Frontend", "Frontend"], ["backend", "Backend", "Backend"],
  ["mobile", "Mobile", "Mobile"], ["data", "Datos", "Data"],
  ["cloud", "Cloud", "Cloud"], ["devops", "DevOps", "DevOps"],
  ["design", "Diseño", "Design"], ["monitoring", "Monitoreo", "Monitoring"],
  ["education-tech", "Tecnología educativa", "Education tech"],
].map(([id, es, en]) => ({ id, label: t(es, en) }));

const skill = (id, name, area, icon, priority, es, en, aliases = []) => ({
  id, name, area, icon, priority, aliases, description: t(es, en),
});

export const skills = [
  skill("html", "HTML5", "frontend", "html", "supporting", "Estructura semántica y accesible para productos web.", "Semantic, accessible structure for web products."),
  skill("css", "CSS3", "frontend", "css", "core", "Sistemas visuales responsive, motion y composición editorial.", "Responsive visual systems, motion, and editorial composition."),
  skill("javascript", "JavaScript", "frontend", "javascript", "core", "Interacciones, lógica de producto y herramientas ejecutadas en el navegador.", "Browser-based interaction, product logic, and tooling.", ["js"]),
  skill("typescript", "TypeScript", "frontend", "typescript", "core", "Interfaces y contratos explícitos para productos web y servicios.", "Explicit interfaces and contracts for web products and services.", ["ts"]),
  skill("react", "React", "frontend", "react", "core", "Interfaces de producto componibles para web y superficies públicas.", "Composable product interfaces for web and public surfaces."),
  skill("astro", "Astro", "frontend", "code", "supporting", "Sitios orientados a contenido y rendimiento con islas interactivas.", "Content- and performance-oriented websites with interactive islands."),
  skill("vite", "Vite", "frontend", "vite", "supporting", "Tooling de desarrollo y builds estáticos rápidos.", "Fast development tooling and static builds."),
  skill("tailwind", "Tailwind CSS", "frontend", "tailwind", "extended", "Utilidades de estilos para experiencias visuales específicas.", "Style utilities for focused visual experiences."),
  skill("react-native", "React Native", "mobile", "react", "core", "Aplicaciones móviles multiplataforma conectadas a servicios reales.", "Cross-platform mobile applications connected to real services.", ["rn"]),
  skill("expo", "Expo", "mobile", "expo", "core", "Runtime, builds y APIs nativas para productos React Native.", "Runtime, builds, and native APIs for React Native products."),
  skill("async-storage", "AsyncStorage", "mobile", "database", "supporting", "Persistencia local para sesión, progreso y datos privados.", "Local persistence for sessions, progress, and private data."),
  skill("php", "PHP", "backend", "php", "core", "Sistemas institucionales, APIs y software educativo mantenido en producción.", "Institutional systems, APIs, and educational software maintained in production."),
  skill("python", "Python", "backend", "python", "core", "Automatización, procesamiento de datos y servicios web.", "Automation, data processing, and web services."),
  skill("django", "Django", "backend", "django", "supporting", "Servicios y APIs para plataformas educativas.", "Services and APIs for education platforms."),
  skill("flask", "Flask", "backend", "flask", "supporting", "Servicios Python ligeros e integraciones internas.", "Lightweight Python services and internal integrations."),
  skill("rest-api", "REST APIs", "backend", "api", "core", "Contratos HTTP entre aplicaciones, servicios y datos.", "HTTP contracts between applications, services, and data.", ["api", "rest"]),
  skill("emailjs", "EmailJS", "backend", "email", "extended", "Notificaciones transaccionales desde productos web.", "Transactional notifications from web products."),
  skill("zod", "Zod", "backend", "code", "extended", "Validación compartida de entradas y contratos.", "Shared input and contract validation."),
  skill("mysql", "MySQL", "data", "mysql", "core", "Persistencia relacional en sistemas educativos e institucionales.", "Relational persistence in education and institutional systems."),
  skill("postgresql", "PostgreSQL", "data", "postgresql", "core", "Datos relacionales para productos SaaS y Supabase.", "Relational data for SaaS products and Supabase."),
  skill("supabase", "Supabase", "data", "supabase", "core", "Auth, PostgreSQL y servicios de datos para productos web y móviles.", "Auth, PostgreSQL, and data services for web and mobile products."),
  skill("firebase", "Firebase", "data", "firebase", "core", "Auth y Firestore para aplicaciones web y móviles.", "Auth and Firestore for web and mobile applications."),
  skill("excel", "Excel", "data", "table", "supporting", "Entrada y transformación de datos en flujos operativos.", "Data input and transformation in operational workflows."),
  skill("sheetjs", "SheetJS", "data", "table", "extended", "Parseo local de libros y hojas de cálculo.", "Local workbook and spreadsheet parsing."),
  skill("pandas", "Pandas", "data", "python", "supporting", "Limpieza, transformación y análisis tabular.", "Tabular cleaning, transformation, and analysis."),
  skill("odoo", "Odoo", "data", "database", "extended", "Gestión y análisis de información operacional en ERP.", "Operational information management and analysis in ERP."),
  skill("jspdf", "jsPDF", "data", "file", "extended", "Generación de documentos PDF directamente en el navegador.", "In-browser PDF document generation."),
  skill("jszip", "JSZip", "data", "archive", "extended", "Empaquetado local de lotes y documentos.", "Local packaging of document batches."),
  skill("html2canvas", "html2canvas", "data", "image", "extended", "Rasterización de previews para exportación.", "Preview rasterization for export."),
  skill("docx-preview", "docx-preview", "data", "file", "extended", "Render de documentos Word en flujos locales.", "Word document rendering in local workflows."),
  skill("file-saver", "FileSaver", "data", "download", "extended", "Descarga controlada de artefactos generados.", "Controlled download of generated artifacts."),
  skill("google-cloud", "Google Cloud", "cloud", "google-cloud", "core", "Infraestructura y servicios para plataformas educativas.", "Infrastructure and services for education platforms.", ["gcp"]),
  skill("cloudflare", "Cloudflare", "cloud", "cloud", "supporting", "Pages y Functions para una aplicación comercial en producción.", "Pages and Functions for a production commercial application."),
  skill("cloudinary", "Cloudinary", "cloud", "image", "extended", "Entrega y transformación de imágenes de producto.", "Product image delivery and transformation."),
  skill("apache", "Apache", "devops", "server", "supporting", "Operación de plataformas PHP en hosting productivo.", "Operation of PHP platforms in production hosting."),
  skill("github-actions", "GitHub Actions", "devops", "github", "supporting", "CI y despliegue automatizado de proyectos públicos.", "CI and automated deployment for public projects.", ["actions", "ci/cd"]),
  skill("sentry", "Sentry", "monitoring", "sentry", "core", "Observabilidad y diagnóstico en una aplicación móvil SaaS.", "Observability and diagnostics in a mobile SaaS application."),
  skill("figma", "Figma", "design", "figma", "core", "Diseño UX/UI y definición de flujos antes del código.", "UX/UI design and flow definition before code."),
  skill("moodle", "Moodle", "education-tech", "moodle", "core", "Administración y soporte de aprendizaje digital en instituciones reales.", "Digital learning administration and support in real institutions."),
];

const publicEvidence = (repo, commit, files) => ({ source: "github", visibility: "public", repo, commit, files });
const privateEvidence = () => ({ source: "connector", visibility: "private", verified: true });
const clientEvidence = () => ({ source: "client", visibility: "private", verified: true });
const portfolioEvidence = (files = ["src/data/portfolio/experience.js"]) => ({
  source: "portfolio", visibility: "public", repo: "WaTenshi/portfolio-angel-cardenas", commit: "5973788fe90bdd221412f53a24458e768c587aa0", files,
});

const sources = {
  landing: (files) => publicEvidence("WaTenshi/Landing-Journal-Fit", "57c4d08b63dca1b6a64cceba8fd43808be4c48f1", files),
  journalfit: () => privateEvidence(),
  consultora: (files) => publicEvidence("WaTenshi/consultora-psicologica", "c98278b17974d2ab12d78f8d90933efbcef2f571", files),
  peluqueria: (files) => publicEvidence("WaTenshi/susanariquelme-peluqueria", "353fb4b34518579af0c10a8e991fe8ae17fb937d", files),
  calzados: () => privateEvidence(),
  hallazgo: () => clientEvidence(),
  certificados: (files) => publicEvidence("WaTenshi/sistema-certificados", "63cfd551d00d8c94e0c892da9b0911673dc0499f", files),
  boda: (files) => publicEvidence("WaTenshi/invitacion-boda-mariajose-cristopher", "2691ba4bdff3f0753e1c12616f3366a6a6d8523d", files),
  lector: () => privateEvidence(),
};

const relation = (skillId, targetType, targetId, contexts, evidence, architectureNodeId) => ({
  id: `${skillId}-${targetType}-${targetId}`, from: { type: "skill", id: skillId }, to: { type: targetType, id: targetId },
  kind: targetType === "project" ? "project-use" : "professional-use", contexts, evidence: [evidence], ...(architectureNodeId ? { architectureNodeId } : {}),
});
const p = (skillId, projectId, evidence, architectureNodeId) => {
  const project = projects.find(({ id }) => id === projectId);
  const contexts = [project?.category === "clients" ? "client" : "personal", ...(project?.status === "production" ? ["production"] : [])];
  return relation(skillId, "project", projectId, contexts, evidence, architectureNodeId);
};
const e = (skillId, roleId, evidence = portfolioEvidence(), production = false) => relation(skillId, "experience", roleId, ["professional", ...(production ? ["production"] : [])], evidence);

export const connections = [
  p("html", "journalfit", sources.landing(["index.html"]), "landing"), p("css", "journalfit", sources.landing(["src/App.css"]), "landing"),
  p("react", "journalfit", sources.landing(["package.json", "src/App.tsx"]), "landing"), p("typescript", "journalfit", sources.landing(["package.json", "src/App.tsx"]), "landing"), p("vite", "journalfit", sources.landing(["vite.config.ts"]), "landing"),
  p("react-native", "journalfit", sources.journalfit(), "mobile-ui"), p("expo", "journalfit", sources.journalfit(), "mobile-ui"),
  p("firebase", "journalfit", sources.journalfit(), "firestore"), p("async-storage", "journalfit", sources.journalfit(), "local-progress"),
  p("html", "consultora", sources.consultora(["index.html"]), "public-ui"), p("css", "consultora", sources.consultora(["src/App.css"]), "public-ui"),
  p("javascript", "consultora", sources.consultora(["src/App.jsx"]), "public-ui"), p("react", "consultora", sources.consultora(["package.json", "src/App.jsx"]), "public-ui"), p("vite", "consultora", sources.consultora(["vite.config.js"]), "public-ui"),
  p("firebase", "consultora", sources.consultora(["src/config/firebase.js", "firestore.rules"]), "firestore"), p("emailjs", "consultora", sources.consultora(["src/services/emailService.js"]), "email"), p("github-actions", "consultora", sources.consultora([".github/workflows/deploy-pages.yml"]), "deploy"),
  p("html", "peluqueria", sources.peluqueria(["index.html"])), p("css", "peluqueria", sources.peluqueria(["src/App.css"])), p("react", "peluqueria", sources.peluqueria(["package.json", "src/App.tsx"])),
  p("typescript", "peluqueria", sources.peluqueria(["src/App.tsx"])), p("vite", "peluqueria", sources.peluqueria(["vite.config.ts"])), p("firebase", "peluqueria", sources.peluqueria(["src/firebase.ts", "firestore.rules"])),
  p("cloudinary", "peluqueria", sources.peluqueria(["src/cloudinary.ts"])), p("excel", "peluqueria", sources.peluqueria(["src/hoursExcel.ts"])), p("github-actions", "peluqueria", sources.peluqueria([".github/workflows/deploy-pages.yml"])),
  p("html", "calzados-paula", sources.calzados()), p("css", "calzados-paula", sources.calzados()), p("react", "calzados-paula", sources.calzados()),
  p("typescript", "calzados-paula", sources.calzados()), p("vite", "calzados-paula", sources.calzados()),
  p("supabase", "calzados-paula", sources.calzados()), p("postgresql", "calzados-paula", sources.calzados()),
  p("cloudflare", "calzados-paula", sources.calzados()), p("zod", "calzados-paula", sources.calzados()), p("github-actions", "calzados-paula", sources.calzados()),
  p("astro", "mihallazgo", sources.hallazgo()), p("react", "mihallazgo", sources.hallazgo()), p("supabase", "mihallazgo", sources.hallazgo()),
  p("html", "certificados", sources.certificados(["index.html"]), "workspace-ui"), p("css", "certificados", sources.certificados(["src/styles.css"]), "workspace-ui"), p("react", "certificados", sources.certificados(["package.json", "src/App.tsx"]), "workspace-ui"),
  p("typescript", "certificados", sources.certificados(["src/App.tsx", "src/types.ts"]), "workspace-ui"), p("vite", "certificados", sources.certificados(["vite.config.ts"]), "workspace-ui"), p("excel", "certificados", sources.certificados(["src/services/excel.ts"]), "excel"),
  p("sheetjs", "certificados", sources.certificados(["package.json", "src/services/excel.ts"]), "excel"), p("jspdf", "certificados", sources.certificados(["src/services/pngPdf.ts"]), "png-pipeline"), p("html2canvas", "certificados", sources.certificados(["src/services/word.ts"]), "png-pipeline"),
  p("docx-preview", "certificados", sources.certificados(["src/services/word.ts"]), "word-pipeline"), p("jszip", "certificados", sources.certificados(["src/services/pngPdf.ts", "src/services/word.ts"]), "downloads"), p("file-saver", "certificados", sources.certificados(["src/services/pngPdf.ts"]), "downloads"), p("github-actions", "certificados", sources.certificados([".github/workflows/deploy-pages.yml"]), "deploy"),
  p("html", "boda", sources.boda(["index.html"])), p("css", "boda", sources.boda(["src/index.css"])), p("javascript", "boda", sources.boda(["src/App.jsx"])), p("react", "boda", sources.boda(["package.json", "src/App.jsx"])), p("vite", "boda", sources.boda(["vite.config.js"])), p("tailwind", "boda", sources.boda(["package.json", "src/index.css"])), p("github-actions", "boda", sources.boda([".github/workflows/deploy.yml"])),

  e("php", "crexer", portfolioEvidence(), true), e("mysql", "crexer", portfolioEvidence(), true), e("rest-api", "crexer", portfolioEvidence(), true), e("apache", "crexer", portfolioEvidence(), true), e("moodle", "crexer", portfolioEvidence(), true),
  e("php", "facea", portfolioEvidence(), true), e("mysql", "facea", portfolioEvidence(), true), e("moodle", "facea", portfolioEvidence(), true),
  e("react", "aymatch"), e("react-native", "aymatch"), e("expo", "aymatch"), e("typescript", "aymatch"), e("supabase", "aymatch"), e("postgresql", "aymatch"), e("sentry", "aymatch"),
  e("odoo", "econofertas"), e("python", "econofertas"), e("pandas", "econofertas"), e("excel", "econofertas"),
  e("react-native", "aula-educa", sources.lector()), e("expo", "aula-educa", sources.lector()), e("async-storage", "aula-educa", sources.lector()),
  e("rest-api", "aula-educa", sources.lector()), e("django", "aula-educa"), e("flask", "aula-educa"), e("php", "aula-educa"), e("mysql", "aula-educa"), e("google-cloud", "aula-educa"), e("figma", "aula-educa"), e("python", "aula-educa"),
];

const ecosystem = (from, to, evidence) => ({
  id: `${from}-skill-${to}`, from: { type: "skill", id: from }, to: { type: "skill", id: to }, kind: "ecosystem", contexts: [], evidence: [evidence],
});

export const skillConnections = [
  ecosystem("react", "typescript", sources.landing(["package.json"])), ecosystem("react", "vite", sources.landing(["package.json"])),
  ecosystem("react-native", "expo", sources.journalfit()), ecosystem("react-native", "async-storage", sources.journalfit()),
  ecosystem("supabase", "postgresql", sources.calzados()), ecosystem("astro", "react", sources.hallazgo()), ecosystem("firebase", "react", sources.consultora(["package.json"])),
  ecosystem("php", "mysql", portfolioEvidence()), ecosystem("python", "django", portfolioEvidence()), ecosystem("python", "flask", portfolioEvidence()), ecosystem("python", "pandas", portfolioEvidence()),
  ecosystem("excel", "sheetjs", sources.certificados(["src/services/excel.ts"])), ecosystem("jspdf", "jszip", sources.certificados(["src/services/pngPdf.ts"])),
];

export const allConnections = [...connections, ...skillConnections];
export const graphProjects = projects.map(({ id, title, category = "personal", status, description, live, architectureId }) => ({ id, title, category, status, description, live, architectureId }));
export const graphExperience = experience.map(({ id, company, role, dates, years }) => ({ id, title: company, role, dates, years }));

export const tours = [
  { id: "frontend", area: "frontend", text: t("React, TypeScript y JavaScript conectan las superficies web.", "React, TypeScript, and JavaScript connect the web surfaces.") },
  { id: "mobile", area: "mobile", text: t("React Native y Expo sostienen productos móviles reales.", "React Native and Expo support real mobile products.") },
  { id: "backend-data", area: "backend", text: t("Backend y datos enlazan servicios, automatización y persistencia.", "Backend and data connect services, automation, and persistence.") },
  { id: "production", context: "production", text: t("Producción muestra únicamente evidencia operativa confirmada.", "Production shows confirmed operational evidence only.") },
];

export function entityKey(type, id) { return `${type}:${id}`; }
export function getEntity(type, id) {
  if (type === "skill") return skills.find((item) => item.id === id);
  if (type === "project") return graphProjects.find((item) => item.id === id);
  return graphExperience.find((item) => item.id === id);
}
export function getConnections(type, id) {
  return allConnections.filter((edge) => (edge.from.type === type && edge.from.id === id) || (edge.to.type === type && edge.to.id === id));
}
export function getRelatedEntities(type, id) {
  return getConnections(type, id).map((edge) => edge.from.type === type && edge.from.id === id ? edge.to : edge.from);
}
export function getPublicEvidence(evidence) {
  if (evidence.visibility === "private") return { source: evidence.source, visibility: "private", verified: true };
  return { ...evidence, url: evidence.repo ? `https://github.com/${evidence.repo}/tree/${evidence.commit}` : undefined };
}
export function getVisualPriority(type, id) {
  const degree = getConnections(type, id).length;
  const level = degree >= 8 ? "core" : degree >= 4 ? "supporting" : "extended";
  return { degree, level, weight: Math.min(1, .35 + degree / 14) };
}
export function getInverseRelations() {
  return allConnections.reduce((index, edge) => {
    for (const endpoint of [edge.from, edge.to]) {
      const key = entityKey(endpoint.type, endpoint.id);
      if (!index[key]) index[key] = [];
      index[key].push(edge.id);
    }
    return index;
  }, {});
}
export function filterGraph({ area = "all", context = "all", includeExtended = true } = {}) {
  const filteredSkills = skills.filter((item) => (area === "all" || item.area === area) && (includeExtended || item.priority !== "extended"));
  const skillIds = new Set(filteredSkills.map((item) => item.id));
  const filteredConnections = allConnections.filter((edge) => {
    const areaMatches = area === "all" || (edge.from.type === "skill" && skillIds.has(edge.from.id)) || (edge.to.type === "skill" && skillIds.has(edge.to.id));
    const contextMatches = context === "all" || edge.contexts.includes(context);
    return areaMatches && contextMatches;
  });
  const endpoints = new Set(filteredConnections.flatMap((edge) => [entityKey(edge.from.type, edge.from.id), entityKey(edge.to.type, edge.to.id)]));
  return {
    skills: filteredSkills.filter((item) => context === "all" || endpoints.has(entityKey("skill", item.id))),
    projects: graphProjects.filter((item) => endpoints.has(entityKey("project", item.id))),
    experience: graphExperience.filter((item) => endpoints.has(entityKey("experience", item.id))),
    connections: filteredConnections,
  };
}
export function serializePublicGraph() {
  return {
    areas, skills, projects: graphProjects, experience: graphExperience,
    connections: allConnections.map((edge) => ({ ...edge, evidence: edge.evidence.map(getPublicEvidence) })),
  };
}
export function searchEntities(query, language = "es") {
  const normalized = query.trim().toLocaleLowerCase(language).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!normalized) return [];
  const entities = [
    ...skills.map((item) => ({ type: "skill", id: item.id, label: item.name, search: [item.name, ...item.aliases, item.description[language]] })),
    ...graphProjects.map((item) => ({ type: "project", id: item.id, label: item.title, search: [item.title, item.description[language]] })),
    ...graphExperience.map((item) => ({ type: "experience", id: item.id, label: item.title, search: [item.title, typeof item.role === "string" ? item.role : item.role[language]] })),
  ];
  return entities.filter((item) => item.search.some((value) => value?.toLocaleLowerCase(language).normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalized))).slice(0, 8);
}

export const graphStats = { skills: skills.length, projects: graphProjects.length, roles: graphExperience.length };
