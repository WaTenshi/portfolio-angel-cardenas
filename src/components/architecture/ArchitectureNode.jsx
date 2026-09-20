import { memo } from 'react'

const layerDepth = { ui: 34, business: 22, services: 10, data: -4, infra: -18 }
const explodedOffset = { ui: -18, business: -9, services: 0, data: 9, infra: 18 }

function ArchitectureNode({ node, selected, dimmed, active, hidden, exploded, onSelect, motionEnabled, index }) {
  const handlePointerMove = (event) => {
    if (!motionEnabled || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    event.currentTarget.style.setProperty('--node-rx', `${(-y * 8).toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--node-ry', `${(x * 12).toFixed(2)}deg`)
  }
  const resetTilt = (event) => {
    event.currentTarget.style.setProperty('--node-rx', '0deg')
    event.currentTarget.style.setProperty('--node-ry', '0deg')
  }

  return (
    <button
      type="button"
      className="architecture-node"
      data-layer={node.layer}
      data-selected={selected}
      data-dimmed={dimmed}
      data-active={active}
      data-hidden={hidden}
      style={{
        '--node-x': `${node.position.x}%`, '--node-y': `${node.position.y}%`,
        '--node-z': `${node.position.z + layerDepth[node.layer]}px`,
        '--explode-x': exploded ? `${explodedOffset[node.layer]}%` : '0%',
        '--node-delay': `${index * 45}ms`,
      }}
      onClick={() => onSelect(node.id)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      aria-pressed={selected}
      aria-label={`${node.title}, ${node.technology}`}
      tabIndex={hidden ? -1 : 0}
    >
      <span className="architecture-node-index">{String(index + 1).padStart(2, '0')} / {node.layer}</span>
      <strong>{node.title}</strong>
      <span>{node.technology}</span>
      <i aria-hidden="true" />
    </button>
  )
}

export default memo(ArchitectureNode)
