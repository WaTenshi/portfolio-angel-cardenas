import { FiArrowUpRight, FiCode } from 'react-icons/fi'

export default function NodeDetails({ project, node, language, onPreview }) {
  if (!node) return <aside className="architecture-details architecture-details-empty"><span>NODE / —</span><p>{language === 'es' ? 'Selecciona un nodo para entrar en el sistema.' : 'Select a node to enter the system.'}</p></aside>
  const connected = project.connections.filter((edge) => edge.from === node.id || edge.to === node.id).map((edge) => project.nodes.find((item) => item.id === (edge.from === node.id ? edge.to : edge.from))?.title).filter(Boolean)
  const preview = node.evidence.find((entry) => entry.previewId)
  return (
    <aside className="architecture-details" aria-live="polite">
      <span>NODE {String(project.nodes.indexOf(node) + 1).padStart(2, '0')} / {node.layer}</span>
      <h2>{node.title}</h2><strong>{node.technology}</strong>
      <dl><div><dt>{language === 'es' ? 'Responsabilidad' : 'Responsibility'}</dt><dd>{node.responsibility[language]}</dd></div><div><dt>{language === 'es' ? 'Cómo funciona' : 'How it works'}</dt><dd>{node.details[language]}</dd></div><div><dt>{language === 'es' ? 'Se conecta con' : 'Connects to'}</dt><dd>{connected.join(' · ') || '—'}</dd></div></dl>
      <div className="architecture-evidence"><span>{language === 'es' ? 'EVIDENCIA' : 'EVIDENCE'}</span>{node.evidence.map((entry, index) => entry.private ? <code key={`private-${index}`}>{language === 'es' ? 'Fuente privada verificada' : 'Verified private source'}</code> : entry.sourceUrl ? <a key={entry.path} href={entry.sourceUrl} target="_blank" rel="noreferrer"><code>{entry.path}</code><FiArrowUpRight /></a> : <code key={entry.path}>{entry.path}</code>)}</div>
      {preview && <button className="architecture-code-button" type="button" onClick={() => onPreview(preview.previewId)}><FiCode />VIEW CODE</button>}
      {project.visibility === 'mixed' && <small>{language === 'es' ? 'La evidencia privada está verificada; no se publican repositorios, commits, rutas ni símbolos internos.' : 'Private evidence is verified; repositories, commits, paths, and internal symbols are not published.'}</small>}
    </aside>
  )
}
