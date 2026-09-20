import { FiMaximize2, FiMinus, FiPlus, FiRotateCcw } from 'react-icons/fi'
import { architectureLayers } from '../../data/projectArchitectures/schema.js'

const labels = {
  es: { layers: 'Capas', view: 'Vista', all: 'Todo', explode: 'Separar sistema', collapse: 'Colapsar', reset: 'Restablecer vista', fullscreen: 'Pantalla completa' },
  en: { layers: 'Layers', view: 'View', all: 'All', explode: 'Explode system', collapse: 'Collapse', reset: 'Reset view', fullscreen: 'Fullscreen' },
}

export default function ArchitectureControls({ language, enabledLayers, setEnabledLayers, filter, setFilter, zoom, setZoom, exploded, setExploded, resetView, canFullscreen, onFullscreen }) {
  const t = labels[language]
  const toggleLayer = (layer) => setEnabledLayers((current) => {
    const next = new Set(current)
    if (next.has(layer) && next.size > 1) next.delete(layer); else next.add(layer)
    return next
  })
  return (
    <div className="architecture-controls">
      <fieldset><legend>{t.layers}</legend><div>{architectureLayers.map((layer) => <button type="button" key={layer} aria-pressed={enabledLayers.has(layer)} onClick={() => toggleLayer(layer)}>{layer}</button>)}</div></fieldset>
      <fieldset><legend>{t.view}</legend><div>{['all', ...architectureLayers].map((layer) => <button type="button" key={layer} aria-pressed={filter === layer} onClick={() => setFilter(layer)}>{layer === 'all' ? t.all : layer}</button>)}</div></fieldset>
      <div className="architecture-view-buttons" aria-label="Zoom">
        <button type="button" onClick={() => setZoom(Math.max(80, zoom - 10))} disabled={zoom <= 80} aria-label="Zoom out"><FiMinus /></button><output>{zoom}%</output><button type="button" onClick={() => setZoom(Math.min(120, zoom + 10))} disabled={zoom >= 120} aria-label="Zoom in"><FiPlus /></button>
        <button type="button" onClick={() => setExploded(!exploded)} aria-pressed={exploded}>{exploded ? t.collapse : t.explode}</button>
        <button type="button" onClick={resetView}><FiRotateCcw />{t.reset}</button>
        {canFullscreen && <button type="button" onClick={onFullscreen}><FiMaximize2 />{t.fullscreen}</button>}
      </div>
    </div>
  )
}
