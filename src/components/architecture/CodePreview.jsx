import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiX } from 'react-icons/fi'
import { loadCodePreview } from '../../data/projectArchitectures/previews/registry.js'

const keywordPattern = /\b(await|async|const|let|return|if|else|try|catch|finally|export|function|new|throw|true|false|null|interface|type)\b/g
const keywords = new Set(['await', 'async', 'const', 'let', 'return', 'if', 'else', 'try', 'catch', 'finally', 'export', 'function', 'new', 'throw', 'true', 'false', 'null', 'interface', 'type'])

function HighlightedLine({ line }) {
  const pieces = line.split(keywordPattern)
  return pieces.map((piece, index) => keywords.has(piece)
    ? <span className="code-keyword" key={`${piece}-${index}`}>{piece}</span>
    : <span key={`${piece}-${index}`}>{piece}</span>)
}

export default function CodePreview({ projectId, previewId, language, onClose }) {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let cancelled = false
    loadCodePreview(projectId, previewId).then((value) => { if (!cancelled) setPreview(value) }).catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [projectId, previewId])

  return (
    <div className="architecture-code" role="region" aria-label={language === 'es' ? 'Vista previa de código' : 'Code preview'}>
      <div className="architecture-code-head"><div><span>RELATED CODE</span><strong>{preview?.path || (error ? 'Unavailable' : 'Loading…')}</strong></div><button type="button" onClick={onClose} aria-label={language === 'es' ? 'Cerrar código' : 'Close code'}><FiX /></button></div>
      {preview && <><pre><code>{preview.code.split('\n').map((line, index) => <span className="code-line" key={index}><i>{String(index + 1).padStart(2, '0')}</i><HighlightedLine line={line} />{'\n'}</span>)}</code></pre><a href={preview.url} target="_blank" rel="noreferrer">{language === 'es' ? 'Ver en GitHub' : 'View on GitHub'}<FiArrowUpRight /></a></>}
      {error && <p>{language === 'es' ? 'No fue posible cargar este fragmento.' : 'This snippet could not be loaded.'}</p>}
    </div>
  )
}
