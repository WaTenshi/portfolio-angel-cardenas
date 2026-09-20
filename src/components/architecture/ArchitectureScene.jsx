import { useEffect, useMemo, useRef } from 'react'
import ArchitectureNode from './ArchitectureNode.jsx'
import ConnectionLayer from './ConnectionLayer.jsx'

export default function ArchitectureScene({ project, selectedNode, onSelectNode, enabledLayers, filter, zoom, exploded, activeNode, activeConnection, motionEnabled, language }) {
  const sceneRef = useRef(null)
  const frameRef = useRef(null)
  const hiddenNodes = useMemo(() => new Set(project.nodes.filter((node) => !enabledLayers.has(node.layer) || (filter !== 'all' && node.layer !== filter)).map((node) => node.id)), [project, enabledLayers, filter])
  const related = useMemo(() => {
    if (!selectedNode) return new Set()
    const ids = new Set([selectedNode])
    project.connections.forEach((connection) => {
      if (connection.from === selectedNode) ids.add(connection.to)
      if (connection.to === selectedNode) ids.add(connection.from)
    })
    return ids
  }, [project, selectedNode])

  const handlePointerMove = (event) => {
    if (!motionEnabled || event.pointerType === 'touch' || !sceneRef.current) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      sceneRef.current?.style.setProperty('--scene-x', `${(x * 10).toFixed(2)}px`)
      sceneRef.current?.style.setProperty('--scene-y', `${(y * 8).toFixed(2)}px`)
      sceneRef.current?.style.setProperty('--scene-ry', `${(x * 2).toFixed(2)}deg`)
      sceneRef.current?.style.setProperty('--scene-rx', `${(-y * 1.5).toFixed(2)}deg`)
    })
  }
  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  return (
    <section className="architecture-scene-shell" aria-label={language === 'es' ? 'Diagrama interactivo del sistema' : 'Interactive system diagram'} onPointerMove={handlePointerMove}>
      <div className="architecture-coordinates" aria-hidden="true"><span>X 421</span><span>Y 208</span><span>Z {exploded ? '128' : '042'}</span></div>
      <div ref={sceneRef} className="architecture-scene" data-exploded={exploded} style={{ '--scene-zoom': zoom / 100 }}>
        <div className="architecture-grid" aria-hidden="true" />
        <ConnectionLayer project={project} hiddenNodes={hiddenNodes} selectedNode={selectedNode} activeConnection={activeConnection} motionEnabled={motionEnabled} />
        {project.nodes.map((node, index) => <ArchitectureNode key={node.id} node={node} index={index} selected={selectedNode === node.id} active={activeNode === node.id} dimmed={Boolean(selectedNode && !related.has(node.id))} hidden={hiddenNodes.has(node.id)} exploded={exploded} onSelect={onSelectNode} motionEnabled={motionEnabled} />)}
      </div>
    </section>
  )
}
