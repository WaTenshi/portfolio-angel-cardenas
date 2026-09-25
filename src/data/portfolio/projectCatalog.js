export const projectCatalog = [
  {
    id: "journalfit", number: "01", title: "JournalFit", date: "Jun 2026", status: "active",
    description: {
      es: "Producto móvil de entrenamiento que centraliza planificación, registro de sesiones y análisis del progreso. Incorpora seguimiento de RPE, cálculo de 1RM y métricas personales para entrenar con contexto y tomar decisiones basadas en evidencia.",
      en: "Mobile training product that centralizes planning, session logging, and progress analysis. It includes RPE tracking, 1RM calculation, and personal metrics for contextual, evidence-based training.",
    },
    tags: ["React", "TypeScript", "Mobile Product", "UX/UI", "Vite"],
    live: "https://watenshi.github.io/Landing-Journal-Fit/", architectureId: "journalfit",
  },
  {
    id: "consultora", number: "02", title: "Consultora Psicológica", date: "Jun 2026", status: "active",
    description: {
      es: "Sitio profesional para consulta psicológica con agenda, contacto y gestión de contenido orientada a conversión.",
      en: "Professional psychology practice website with scheduling, contact, and conversion-focused content.",
    },
    tags: ["React", "Firebase", "EmailJS", "Vite"],
    live: "https://watenshi.github.io/consultora-psicologica/", architectureId: "consultora",
  },
  {
    id: "peluqueria", number: "03", title: "Susana Riquelme Peluquería", category: "clients", date: "Jun 2026", status: "production",
    description: {
      es: "Landing editorial para peluquería, enfocada en identidad visual, servicios, marcas y experiencia responsive.",
      en: "Editorial salon landing page focused on visual identity, services, brands, and responsive experience.",
    },
    tags: ["React", "TypeScript", "Vite", "Responsive"], live: "https://susanariquelmepeluqueria.cl",
  },
  {
    id: "calzados-paula", title: "Calzados Paula", category: "clients", status: "production",
    description: {
      es: "Sitio web para Calzados Paula, con una presentación de la marca y su colección de calzado.",
      en: "Website for Calzados Paula, presenting the brand and its footwear collection.",
    },
    tags: ["React", "TypeScript", "Supabase", "Cloudflare"], live: "https://calzadospaula.cl",
  },
  {
    id: "mihallazgo", title: "Hallazgo Beauty & Care", category: "clients", status: "production",
    description: {
      es: "Sitio comercial para distribuidora de belleza y cuidado personal, con catálogo de productos, navegación editorial y acceso interno para el equipo.",
      en: "Commercial website for a beauty and personal care distributor, featuring a product catalog, editorial navigation, and private team access.",
    },
    tags: ["Astro", "React", "Supabase", "Responsive"], live: "https://mihallazgo.cl",
  },
  {
    id: "certificados", number: "04", title: "Sistema de Certificados", date: "May 2026",
    description: {
      es: "Herramienta para cargar datos desde Excel, previsualizar certificados y generarlos de forma masiva en PDF.",
      en: "Tool for importing Excel data, previewing certificates, and generating PDFs in bulk.",
    },
    tags: ["React", "TypeScript", "SheetJS", "jsPDF", "JSZip"],
    live: "https://watenshi.github.io/sistema-certificados/", architectureId: "certificados",
  },
  {
    id: "boda", number: "05", title: "Invitación de boda", date: "Jan 2026",
    description: {
      es: "Invitación digital inmersiva con animaciones, narrativa visual, información del evento y experiencia móvil.",
      en: "Immersive digital wedding invitation with animation, visual storytelling, event details, and mobile experience.",
    },
    tags: ["React", "Tailwind CSS", "Animation", "Vite"],
    live: "https://watenshi.github.io/invitacion-boda-mariajose-cristopher/",
  },
];

export default projectCatalog;
