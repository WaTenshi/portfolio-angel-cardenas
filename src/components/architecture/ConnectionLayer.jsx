import { memo, useEffect, useRef } from 'react'

function curve(from, to) {
  const bend = Math.max(4, Math.abs(to.x - from.x) * 0.18)
  return `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend} ${to.y}, ${to.x} ${to.y}`
}

function ConnectionLayer({ project, hiddenNodes, selectedNode, activeConnection, motionEnabled }) {
  const svgRef = useRef(null)
  const nodes = new Map(project.nodes.map((node) => [node.id, node]))
  useEffect(() => {
    const sync = () => {
      if (!svgRef.current) return
      if (!motionEnabled || document.hidden) svgRef.current.pauseAnimations?.()
      else svgRef.current.unpauseAnimations?.()
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [motionEnabled])
  return (
    <svg ref={svgRef} className="architecture-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`architecture-line-${project.id}`} x1="0" x2="1">
          <stop offset="0" stopColor="var(--line-strong)" />
          <stop offset=".55" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--line-strong)" />
        </linearGradient>
      </defs>
      {project.connections.map((connection) => {
        const from = nodes.get(connection.from)?.position
        const to = nodes.get(connection.to)?.position
        if (!from || !to) return null
        const hidden = hiddenNodes.has(connection.from) || hiddenNodes.has(connection.to)
        const related = !selectedNode || connection.from === selectedNode || connection.to === selectedNode
        const active = activeConnection === connection.id
        const path = curve(from, to)
        return (
          <g key={connection.id} className="architecture-connection" data-hidden={hidden} data-dimmed={!related} data-active={active}>
            <path className="architecture-connection-hit" d={path} />
            <path className="architecture-connection-line" d={path} />
            {motionEnabled && (active || !selectedNode) && <circle className="architecture-packet-dot" r=".72"><animateMotion dur={active ? '1.3s' : '4s'} repeatCount="indefinite" path={path} /></circle>}
            {!motionEnabled && active && <circle className="architecture-packet-dot" r=".72" cx={to.x} cy={to.y} />}
          </g>
        )
      })}
    </svg>
  )
}

export default memo(ConnectionLayer)
