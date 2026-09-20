import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiMinus, FiPause, FiPlay, FiPlus, FiRotateCcw, FiSearch, FiX } from "react-icons/fi";
import {
  allConnections, areas, entityKey, getConnections, getEntity, getRelatedEntities, graphExperience,
  graphProjects, graphStats, searchEntities, skills, tours,
} from "../../data/skillGraph/index.js";
import GraphScene from "./GraphScene.jsx";
import SkillDetails from "./SkillDetails.jsx";
import "./skillMap.css";

const copy = {
  es: {
    eyebrow: "TECH GRAPH / 2026", title: "Tecnologías en contexto.", intro: "No se trata de cuántas herramientas conozco, sino de dónde y cómo las he utilizado.",
    search: "Buscar tecnología, proyecto o experiencia", select: "Explora las conexiones", current: "Nodo actual", all: "Todo", professional: "Profesional", client: "Clientes", personal: "Personal", production: "Producción",
    view: "Vista", area: "Área", context: "Contexto", graph: "Grafo", clusters: "Clusters", projects: "Proyectos", experience: "Experiencia", controls: "Controles", reset: "Restablecer", explode: "Separar", collapse: "Unir", orbit: "Órbita", showAll: "Mostrar todo", showCore: "Priorizar", tour: "Recorrido", stop: "Detener", textual: "Representación textual del grafo", connected: "conecta con", noResults: "Sin resultados",
  },
  en: {
    eyebrow: "TECH GRAPH / 2026", title: "Technology in context.", intro: "It is not about how many tools I know, but where and how I have used them.",
    search: "Search technology, project, or experience", select: "Explore the connections", current: "Current node", all: "All", professional: "Professional", client: "Client work", personal: "Personal", production: "Production",
    view: "View", area: "Area", context: "Context", graph: "Graph", clusters: "Clusters", projects: "Projects", experience: "Experience", controls: "Controls", reset: "Reset", explode: "Explode", collapse: "Collapse", orbit: "Orbit", showAll: "Show all", showCore: "Prioritize", tour: "Guided tour", stop: "Stop", textual: "Text representation of the graph", connected: "connects to", noResults: "No results",
  },
};
const views = ["graph", "clusters", "projects", "experience"];
const contexts = ["all", "professional", "client", "personal", "production"];

function selectionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (skills.some(({ id }) => id === params.get("skill"))) return { type: "skill", id: params.get("skill") };
  if (graphProjects.some(({ id }) => id === params.get("skillProject"))) return { type: "project", id: params.get("skillProject") };
  if (graphExperience.some(({ id }) => id === params.get("role"))) return { type: "experience", id: params.get("role") };
  return null;
}

function dispatchEvent(name, detail = {}) {
  window.dispatchEvent(new CustomEvent("portfolio:skillmap", { detail: { name, ...detail } }));
}

export default function SkillMap({ language, motionEnabled, onOpenArchitecture }) {
  const t = copy[language];
  const rootRef = useRef(null); const searchRef = useRef(null);
  const initialParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [selected, setSelected] = useState(selectionFromUrl);
  const [originSkill, setOriginSkill] = useState(() => selectionFromUrl()?.type === "skill" ? selectionFromUrl().id : null);
  const [hovered, setHovered] = useState(null);
  const [view, setView] = useState(() => views.includes(initialParams.get("skillView")) ? initialParams.get("skillView") : "graph");
  const [area, setArea] = useState(() => areas.some(({ id }) => id === initialParams.get("skillArea")) ? initialParams.get("skillArea") : "all");
  const [context, setContext] = useState(() => contexts.includes(initialParams.get("skillContext")) ? initialParams.get("skillContext") : "all");
  const [showAll, setShowAll] = useState(false); const [zoom, setZoom] = useState(100); const [exploded, setExploded] = useState(false); const [orbit, setOrbit] = useState(false);
  const [query, setQuery] = useState(""); const [searchOpen, setSearchOpen] = useState(false); const [tourIndex, setTourIndex] = useState(-1);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 560px)").matches);
  const results = useMemo(() => searchEntities(query, language), [query, language]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 560px)");
    const sync = (event) => setMobile(event.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const updateUrl = (nextSelection = selected, nextView = view, nextArea = area, nextContext = context, mode = "replace") => {
    const url = new URL(window.location.href);
    ["skill", "skillProject", "role"].forEach((key) => url.searchParams.delete(key));
    if (nextSelection?.type === "skill") url.searchParams.set("skill", nextSelection.id);
    if (nextSelection?.type === "project") url.searchParams.set("skillProject", nextSelection.id);
    if (nextSelection?.type === "experience") url.searchParams.set("role", nextSelection.id);
    if (nextView !== "graph") url.searchParams.set("skillView", nextView); else url.searchParams.delete("skillView");
    if (nextArea !== "all") url.searchParams.set("skillArea", nextArea); else url.searchParams.delete("skillArea");
    if (nextContext !== "all") url.searchParams.set("skillContext", nextContext); else url.searchParams.delete("skillContext");
    window.history[`${mode}State`](window.history.state, "", `${url.pathname}${url.search}#stack`);
  };

  const select = (type, id, mode = "push") => {
    if (!type) { setSelected(null); setOriginSkill(null); setOrbit(false); updateUrl(null, view, area, context, mode); return; }
    const next = { type, id };
    if (selected?.type === "skill" && type === "project") setOriginSkill(selected.id);
    else if (type === "skill") setOriginSkill(id);
    setSelected(next); setSearchOpen(false); setQuery(""); updateUrl(next, view, area, context, mode);
    dispatchEvent(`${type === "experience" ? "experience" : type}_selected`, { entityType: type, entityId: id, view });
  };

  useEffect(() => {
    const pop = () => {
      const params = new URLSearchParams(window.location.search); const next = selectionFromUrl();
      setSelected(next); setView(views.includes(params.get("skillView")) ? params.get("skillView") : "graph");
      setArea(areas.some(({ id }) => id === params.get("skillArea")) ? params.get("skillArea") : "all"); setContext(contexts.includes(params.get("skillContext")) ? params.get("skillContext") : "all");
    };
    window.addEventListener("popstate", pop); return () => window.removeEventListener("popstate", pop);
  }, []);

  useEffect(() => {
    const open = (event) => {
      const id = event.detail?.id;
      if (id && skills.some((skill) => skill.id === id)) select("skill", id, "replace");
      rootRef.current?.querySelector(".skill-search input")?.focus({ preventScroll: true });
    };
    window.addEventListener("portfolio:open-skill", open);
    return () => window.removeEventListener("portfolio:open-skill", open);
  });

  useEffect(() => {
    if (tourIndex < 0) return undefined;
    const timer = window.setTimeout(() => setTourIndex((value) => value >= tours.length - 1 ? -1 : value + 1), 6000);
    return () => window.clearTimeout(timer);
  }, [tourIndex]);

  const nodes = useMemo(() => {
    let candidateSkills = skills.filter((item) => showAll || item.priority !== "extended" || selected?.type === "skill" && selected.id === item.id);
    if (area !== "all") candidateSkills = candidateSkills.filter((item) => item.area === area || selected?.type === "skill" && selected.id === item.id);
    let candidateEdges = allConnections;
    if (context !== "all") candidateEdges = candidateEdges.filter((edge) => edge.contexts.includes(context));
    if (area !== "all") {
      const ids = new Set(candidateSkills.map(({ id }) => id)); candidateEdges = candidateEdges.filter((edge) => ids.has(edge.from.id) || edge.from.type !== "skill");
    }
    const connected = new Set(candidateEdges.flatMap((edge) => [entityKey(edge.from.type, edge.from.id), entityKey(edge.to.type, edge.to.id)]));
    if (context !== "all") candidateSkills = candidateSkills.filter((item) => connected.has(entityKey("skill", item.id)) || selected?.type === "skill" && selected.id === item.id);
    const projectNodes = graphProjects.filter((item) => (area === "all" && context === "all") || connected.has(entityKey("project", item.id)) || selected?.type === "project" && selected.id === item.id);
    const roleNodes = graphExperience.filter((item) => (area === "all" && context === "all") || connected.has(entityKey("experience", item.id)) || selected?.type === "experience" && selected.id === item.id);
    const graphNodes = [...candidateSkills.map((item) => ({ ...item, type: "skill" })), ...projectNodes.map((item) => ({ ...item, type: "project" })), ...roleNodes.map((item) => ({ ...item, type: "experience" }))];
    if (!mobile) return graphNodes;
    if (!selected) {
      return areas.flatMap(({ id }) => graphNodes.filter((node) => node.type === "skill" && node.area === id).sort((a, b) => (a.priority === "core" ? -1 : 1) - (b.priority === "core" ? -1 : 1)).slice(0, 1));
    }
    const localKeys = new Set([entityKey(selected.type, selected.id), ...getRelatedEntities(selected.type, selected.id).map((item) => entityKey(item.type, item.id))]);
    return graphNodes.filter((node) => localKeys.has(entityKey(node.type, node.id)));
  }, [showAll, area, context, selected, mobile]);

  const reset = () => { setSelected(null); setOriginSkill(null); setView("graph"); setArea("all"); setContext("all"); setZoom(100); setExploded(false); setOrbit(false); setShowAll(false); setTourIndex(-1); updateUrl(null, "graph", "all", "all"); };
  const changeView = (next) => { setView(next); updateUrl(selected, next, area, context); };
  const changeArea = (next) => { setArea(next); setSelected(null); updateUrl(null, view, next, context); };
  const changeContext = (next) => { setContext(next); setSelected(null); updateUrl(null, view, area, next); };
  const handleKey = (event) => {
    if (event.key === "/" && event.target.tagName !== "INPUT") { event.preventDefault(); searchRef.current?.focus(); setSearchOpen(true); }
    if (event.key === "Escape" && searchOpen) { setSearchOpen(false); setQuery(""); }
  };
  const tour = tourIndex >= 0 ? tours[tourIndex] : null;
  const currentLabel = selected ? (selected.type === "skill" ? getEntity("skill", selected.id)?.name : getEntity(selected.type, selected.id)?.title) : t.select;
  const activeHover = hovered ? (() => {
    const [type, ...parts] = hovered.split(":"); const id = parts.join(":"); const item = getEntity(type, id); const edges = getConnections(type, id);
    return {
      label: type === "skill" ? item?.name : item?.title,
      projects: new Set(edges.filter((edge) => edge.from.type === "project" || edge.to.type === "project").map((edge) => edge.from.type === "project" ? edge.from.id : edge.to.id)).size,
      roles: new Set(edges.filter((edge) => edge.from.type === "experience" || edge.to.type === "experience").map((edge) => edge.from.type === "experience" ? edge.from.id : edge.to.id)).size,
      contexts: [...new Set(edges.flatMap((edge) => edge.contexts))],
    };
  })() : null;

  return (
    <div ref={rootRef} className="skill-map" onKeyDown={handleKey} data-motion-enabled={motionEnabled}>
      <header className="skill-map-header"><div><span>{t.eyebrow}</span><h3>{t.title}</h3><p>{t.intro}</p></div><div className="skill-live-meta"><span>{graphStats.skills.toString().padStart(2, "0")} SKILLS</span><span>{graphStats.projects.toString().padStart(2, "0")} PROJECTS</span><span>{graphStats.roles.toString().padStart(2, "0")} ROLES</span><small>{t.current}<strong>{currentLabel}</strong></small></div></header>
      <div className="skill-toolbar">
        <div className="skill-search"><FiSearch /><input ref={searchRef} value={query} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} placeholder={t.search} aria-label={t.search} role="combobox" aria-expanded={searchOpen && Boolean(query)} aria-controls="skill-search-results" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear"><FiX /></button>}{searchOpen && query && <div id="skill-search-results" className="skill-search-results" role="listbox">{results.length ? results.map((item) => <button type="button" role="option" aria-selected="false" key={`${item.type}-${item.id}`} onClick={() => select(item.type, item.id)}><span>{item.type}</span><strong>{item.label}</strong></button>) : <span>{t.noResults}</span>}</div>}</div>
        <div className="skill-filter"><span>{t.view}</span>{views.map((item) => <button key={item} type="button" aria-pressed={view === item} onClick={() => changeView(item)}>{t[item]}</button>)}</div>
        <label className="skill-select"><span>{t.area}</span><select value={area} onChange={(event) => changeArea(event.target.value)}><option value="all">{t.all}</option>{areas.map((item) => <option value={item.id} key={item.id}>{item.label[language]}</option>)}</select><FiChevronDown /></label>
        <label className="skill-select"><span>{t.context}</span><select value={context} onChange={(event) => changeContext(event.target.value)}>{contexts.map((item) => <option value={item} key={item}>{t[item]}</option>)}</select><FiChevronDown /></label>
      </div>
      <div className="skill-mobile-clusters" aria-label={t.area}>{areas.map((item) => <button type="button" key={item.id} aria-pressed={area === item.id} onClick={() => changeArea(area === item.id ? "all" : item.id)}>{item.label[language]}</button>)}</div>
      <div className="skill-stage">
        <div className="skill-graph-column">
          <GraphScene nodes={nodes} selected={selected} hovered={hovered} setHovered={setHovered} onSelect={(type, id) => type ? select(type, id) : select(null)} view={mobile ? "clusters" : view} zoom={zoom} exploded={exploded} orbit={orbit} motionEnabled={motionEnabled && !mobile} tour={tour} />
          {activeHover && <span className="skill-hover-label" role="tooltip"><strong>EXPLORE / {activeHover.label}</strong><small>{activeHover.projects} {t.projects} · {activeHover.roles} {t.experience}{activeHover.contexts.length ? ` · ${activeHover.contexts.map((item) => t[item]).join(" / ")}` : ""}</small></span>}
          <div className="skill-controls" aria-label={t.controls}><button type="button" onClick={() => setZoom((value) => Math.max(70, value - 10))} disabled={zoom <= 70} aria-label="Zoom out"><FiMinus /></button><output>{zoom}%</output><button type="button" onClick={() => setZoom((value) => Math.min(140, value + 10))} disabled={zoom >= 140} aria-label="Zoom in"><FiPlus /></button><button type="button" onClick={() => setExploded((value) => !value)} aria-pressed={exploded}>{exploded ? t.collapse : t.explode}</button><button type="button" onClick={() => setOrbit((value) => !value)} aria-pressed={orbit} disabled={!selected}>{orbit ? <FiPause /> : <FiPlay />}{t.orbit}</button><button type="button" onClick={() => setShowAll((value) => !value)} aria-pressed={showAll}>{showAll ? t.showCore : t.showAll}</button><button type="button" onClick={reset}><FiRotateCcw />{t.reset}</button></div>
        </div>
        <SkillDetails selected={selected} language={language} originSkill={originSkill} onSelect={select} onOpenArchitecture={(project, node, trigger) => { dispatchEvent("architecture_opened", { entityId: project.id, node }); onOpenArchitecture(project, node, trigger); }} />
      </div>
      <div className="skill-tour-bar">{tour ? <><span>{String(tourIndex + 1).padStart(2, "0")} / 04</span><p>{tour.text[language]}</p><button type="button" onClick={() => setTourIndex(-1)}>{t.stop}<FiX /></button></> : <button type="button" onClick={() => { setTourIndex(0); dispatchEvent("guided_tour_started"); }}><FiPlay />{t.tour}</button>}</div>
      <details className="skill-text-graph"><summary>{t.textual}</summary><ul>{allConnections.filter((edge) => edge.kind !== "ecosystem" || showAll).map((edge) => { const from = getEntity(edge.from.type, edge.from.id); const to = getEntity(edge.to.type, edge.to.id); return <li key={edge.id}><strong>{edge.from.type === "skill" ? from?.name : from?.title}</strong> {t.connected} <strong>{edge.to.type === "skill" ? to?.name : to?.title}</strong></li>; })}</ul></details>
    </div>
  );
}
