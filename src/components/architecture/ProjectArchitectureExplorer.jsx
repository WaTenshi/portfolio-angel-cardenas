import { useEffect, useMemo, useRef, useState } from 'react'
import { FiArrowUpRight, FiMaximize2, FiX } from 'react-icons/fi'
import { architectureLayers } from '../../data/projectArchitectures/schema.js'
import { loadArchitecture } from '../../data/projectArchitectures/registry.js'
import ArchitectureScene from './ArchitectureScene.jsx'
import ArchitectureControls from './ArchitectureControls.jsx'
import NodeDetails from './NodeDetails.jsx'
import DataFlow from './DataFlow.jsx'
import Decisions from './Decisions.jsx'
import GuidedTour from './GuidedTour.jsx'
import CodePreview from './CodePreview.jsx'
import './architecture.css'

const copy = {
  es: { close: 'Cerrar explorador', loading: 'Cargando arquitectura…', error: 'No fue posible cargar la arquitectura.', architecture: 'Arquitectura', flow: 'Flujo de datos', decisions: 'Decisiones', source: 'Fuente verificada', graph: 'Representación textual del grafo', connects: 'se conecta con' },
  en: { close: 'Close explorer', loading: 'Loading architecture…', error: 'The architecture could not be loaded.', architecture: 'Architecture', flow: 'Data flow', decisions: 'Decisions', source: 'Verified source', graph: 'Text representation of the graph', connects: 'connects to' },
}
const validViews = ['architecture', 'data-flow', 'decisions']

export default function ProjectArchitectureExplorer({ projectId, language, motionEnabled, initialView = 'architecture', initialNode = null, originRect, onClose, onViewChange }) {
  const [project, setProject] = useState(null)
  const [failed, setFailed] = useState(false)
  const [view, setView] = useState(validViews.includes(initialView) ? initialView : 'architecture')
  const [selectedNode, setSelectedNode] = useState(initialNode)
  const [enabledLayers, setEnabledLayers] = useState(() => new Set(architectureLayers))
  const [filter, setFilter] = useState('all')
  const [zoom, setZoom] = useState(100)
  const [exploded, setExploded] = useState(false)
  const [tourIndex, setTourIndex] = useState(-1)
  const [previewId, setPreviewId] = useState(null)
  const [canFullscreen] = useState(() => Boolean(document.fullscreenEnabled))
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const previewRef = useRef(previewId)
  const closeHandlerRef = useRef(onClose)
  const t = copy[language]

  useEffect(() => {
    previewRef.current = previewId
    closeHandlerRef.current = onClose
  })

  useEffect(() => {
    let cancelled = false
    loadArchitecture(projectId).then((value) => {
      if (cancelled) return
      setProject(value)
      setSelectedNode(value.nodes.some((node) => node.id === initialNode) ? initialNode : null)
    }).catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [initialNode, projectId])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const background = [document.querySelector('.site-header'), document.getElementById('main'), document.querySelector('.portfolio-shell > footer')].filter(Boolean)
    background.forEach((element) => { element.inert = true })
    const focusTimer = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 0)
    const keydown = (event) => {
      if (event.key === 'Escape') { if (previewRef.current) setPreviewId(null); else closeHandlerRef.current(); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')]
      if (!focusable.length) return
      const first = focusable[0]; const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => {
      window.clearTimeout(focusTimer); document.removeEventListener('keydown', keydown)
      document.body.style.overflow = previousOverflow
      background.forEach((element) => { element.inert = false })
      if (document.fullscreenElement) document.exitFullscreen?.()
    }
  }, [])

  useEffect(() => {
    if (!project || tourIndex < 0) return undefined
    const timer = window.setTimeout(() => {
      setTourIndex((current) => current >= project.tour.length - 1 ? -1 : current + 1)
    }, 3500)
    return () => window.clearTimeout(timer)
  }, [project, tourIndex, motionEnabled])

  const selectNode = (id) => { setTourIndex(-1); setSelectedNode((current) => current === id ? null : id) }
  const resetView = () => { setSelectedNode(null); setEnabledLayers(new Set(architectureLayers)); setFilter('all'); setZoom(100); setExploded(false); setTourIndex(-1) }
  const changeView = (next) => { setView(next); setSelectedNode(null); setTourIndex(-1); onViewChange(next) }
  const effectiveSelectedNode = project && tourIndex >= 0 ? project.tour[tourIndex].node : selectedNode
  const sceneProps = project ? { project, selectedNode: effectiveSelectedNode, onSelectNode: selectNode, enabledLayers, filter, zoom, exploded, motionEnabled, language } : null
  const node = useMemo(() => project?.nodes.find((item) => item.id === effectiveSelectedNode) || null, [project, effectiveSelectedNode])
  const style = originRect ? { '--origin-x': `${originRect.left + originRect.width / 2}px`, '--origin-y': `${originRect.top + originRect.height / 2}px` } : undefined

  return (
    <div className="architecture-overlay" data-motion-enabled={motionEnabled} style={style} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={dialogRef} className="architecture-explorer" role="dialog" aria-modal="true" aria-labelledby="architecture-title">
        <button ref={closeRef} className="architecture-close" type="button" onClick={onClose} aria-label={t.close}><FiX /></button>
        {!project && !failed && <div className="architecture-loading" role="status"><i /><span>{t.loading}</span></div>}
        {failed && <div className="architecture-loading" role="alert"><span>{t.error}</span></div>}
        {project && <>
          <header className="architecture-hero"><div><span>SYSTEM / {project.id === 'journalfit' ? '01' : project.id === 'consultora' ? '02' : '03'}</span><h1 id="architecture-title">{project.title}</h1><p>{project.subtitle[language]}</p></div><div className="architecture-source"><span>{t.source}</span><strong>{project.sourceLabel}</strong><code>{project.sourceCommit.slice(0, 10)}</code></div></header>
          <div className="architecture-stack" aria-label="Technology stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          <nav className="architecture-tabs" role="tablist" aria-label="Explorer views">{[['architecture', t.architecture], ['data-flow', t.flow], ['decisions', t.decisions]].map(([id, label]) => <button type="button" role="tab" aria-selected={view === id} key={id} onClick={() => changeView(id)}>{label}</button>)}</nav>
          {view !== 'decisions' && <ArchitectureControls language={language} enabledLayers={enabledLayers} setEnabledLayers={setEnabledLayers} filter={filter} setFilter={setFilter} zoom={zoom} setZoom={setZoom} exploded={exploded} setExploded={setExploded} resetView={resetView} canFullscreen={canFullscreen} onFullscreen={() => dialogRef.current?.requestFullscreen?.()} />}
          {view === 'architecture' && <div className="architecture-main"><ArchitectureScene {...sceneProps} /><NodeDetails project={project} node={node} language={language} onPreview={setPreviewId} /></div>}
          {view === 'data-flow' && <DataFlow project={project} language={language} sceneProps={sceneProps} onManualInteraction={() => setTourIndex(-1)} />}
          {view === 'decisions' && <Decisions project={project} language={language} />}
          <div className="architecture-footer-tools"><GuidedTour language={language} tour={project.tour} index={tourIndex} onStart={() => { setView('architecture'); onViewChange('architecture'); setTourIndex(0) }} onStop={() => setTourIndex(-1)} /><details className="architecture-text-graph"><summary>{t.graph}</summary><ul>{project.connections.map((edge) => <li key={edge.id}>{project.nodes.find((item) => item.id === edge.from)?.title} {t.connects} {project.nodes.find((item) => item.id === edge.to)?.title}: {edge.label[language]}</li>)}</ul></details></div>
          <footer className="architecture-explorer-footer"><span>AC / SYSTEM EXPLORER / 2026</span><a href={project.id === 'journalfit' ? 'https://github.com/WaTenshi/Landing-Journal-Fit' : `https://github.com/WaTenshi/${project.id === 'consultora' ? 'consultora-psicologica' : 'sistema-certificados'}`} target="_blank" rel="noreferrer">SOURCE<FiArrowUpRight /></a>{canFullscreen && <button type="button" onClick={() => dialogRef.current?.requestFullscreen?.()}><FiMaximize2 />FULLSCREEN</button>}</footer>
          {previewId && <CodePreview projectId={project.id} previewId={previewId} language={language} onClose={() => setPreviewId(null)} />}
        </>}
      </div>
    </div>
  )
}
