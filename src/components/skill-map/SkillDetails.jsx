import { FiArrowUpRight, FiGitBranch, FiLock } from "react-icons/fi";
import {
  connections, getConnections, getEntity, getPublicEvidence, getRelatedEntities,
} from "../../data/skillGraph/index.js";

const copy = {
  es: { empty: "Selecciona un nodo para explorar su contexto.", projects: "Proyectos", roles: "Experiencia", related: "Relacionado", evidence: "Evidencia", private: "Fuente privada verificada", source: "Ver fuente", architecture: "Explorar arquitectura", visit: "Visitar proyecto", used: "Usado en", path: "Ruta técnica" },
  en: { empty: "Select a node to explore its context.", projects: "Projects", roles: "Experience", related: "Related", evidence: "Evidence", private: "Verified private source", source: "View source", architecture: "Explore architecture", visit: "Visit project", used: "Used in", path: "Technical path" },
};

export default function SkillDetails({ selected, language, originSkill, onSelect, onOpenArchitecture }) {
  const text = copy[language];
  if (!selected) return <aside className="skill-details skill-details-empty"><span>SELECT A NODE</span><p>{text.empty}</p><div className="skill-details-radar" aria-hidden="true"><i /><i /><i /></div></aside>;
  const entity = getEntity(selected.type, selected.id);
  if (!entity) return null;
  const label = selected.type === "skill" ? entity.name : entity.title;
  const related = getRelatedEntities(selected.type, selected.id).map((item) => ({ ...item, entity: getEntity(item.type, item.id) })).filter((item) => item.entity);
  const relatedProjects = related.filter((item) => item.type === "project");
  const relatedRoles = related.filter((item) => item.type === "experience");
  const relatedSkills = related.filter((item) => item.type === "skill");
  const publicEvidence = getConnections(selected.type, selected.id).flatMap((edge) => edge.evidence.map(getPublicEvidence));
  const uniqueEvidence = [...new Map(publicEvidence.map((item) => [`${item.visibility}-${item.repo || "private"}`, item])).values()];
  const project = selected.type === "project" ? entity : null;
  const sourceSkill = selected.type === "skill" ? selected.id : originSkill;
  const architectureEdge = project && sourceSkill ? connections.find((edge) => edge.from.id === sourceSkill && edge.to.id === project.id && edge.architectureNodeId) : null;

  return (
    <aside className="skill-details" aria-live="polite">
      <span>{selected.type.toUpperCase()} / {entity.area || entity.category || "PROFESSIONAL"}</span>
      <h3>{label}</h3>
      {selected.type === "skill" && <p>{entity.description[language]}</p>}
      {selected.type === "project" && <p>{entity.description[language]}</p>}
      {selected.type === "experience" && <p>{typeof entity.role === "string" ? entity.role : entity.role[language]} · {entity.dates[language]}</p>}
      {(originSkill && project) && <div className="skill-path"><small>{text.path}</small><div><button onClick={() => onSelect("skill", originSkill)}>{getEntity("skill", originSkill)?.name}</button><span>→</span><strong>{project.title}</strong>{project.architectureId && <><span>→</span><em>Architecture</em></>}</div></div>}
      <div className="skill-detail-counts"><div><strong>{relatedProjects.length.toString().padStart(2, "0")}</strong><span>{text.projects}</span></div><div><strong>{relatedRoles.length.toString().padStart(2, "0")}</strong><span>{text.roles}</span></div><div><strong>{relatedSkills.length.toString().padStart(2, "0")}</strong><span>{text.related}</span></div></div>
      {[...relatedProjects, ...relatedRoles, ...relatedSkills].length > 0 && <div className="skill-related"><h4>{text.used}</h4>{[...relatedProjects, ...relatedRoles, ...relatedSkills].slice(0, 12).map((item) => <button key={`${item.type}-${item.id}`} onClick={() => onSelect(item.type, item.id)}><span>{item.type}</span><strong>{item.type === "skill" ? item.entity.name : item.entity.title}</strong></button>)}</div>}
      {project && <div className="skill-detail-actions"><a href={project.live} target="_blank" rel="noreferrer">{text.visit}<FiArrowUpRight /></a>{project.architectureId && <button type="button" onClick={(event) => onOpenArchitecture(project, architectureEdge?.architectureNodeId, event.currentTarget)}>{text.architecture}<FiGitBranch /></button>}</div>}
      <details className="skill-evidence"><summary>{text.evidence} · {uniqueEvidence.length.toString().padStart(2, "0")}</summary>{uniqueEvidence.map((item, index) => item.visibility === "private" ? <span key={`private-${index}`}><FiLock />{text.private}</span> : <a key={item.repo} href={item.url} target="_blank" rel="noreferrer"><span><FiGitBranch />{item.repo}</span><small>{text.source}<FiArrowUpRight /></small></a>)}</details>
    </aside>
  );
}
