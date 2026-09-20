import { useMemo, useRef, useState } from "react";
import { allConnections, entityKey, getRelatedEntities } from "../../data/skillGraph/index.js";
import ConnectionLayer from "./ConnectionLayer.jsx";
import GraphNode from "./GraphNode.jsx";
import { createLayout } from "./layout.js";
import { useSkillMapMotion } from "./useSkillMapMotion.js";

export default function GraphScene({ nodes, selected, hovered, setHovered, onSelect, view, zoom, exploded, orbit, motionEnabled, tour }) {
  const rootRef = useRef(null);
  const [focusKey, setFocusKey] = useState(() => nodes[0] ? entityKey(nodes[0].type, nodes[0].id) : "");
  const positions = useMemo(() => createLayout(nodes, view, selected, exploded), [nodes, view, selected, exploded]);
  const nodeKeys = useMemo(() => new Set(nodes.map((node) => entityKey(node.type, node.id))), [nodes]);
  const effectiveFocusKey = nodeKeys.has(focusKey) ? focusKey : nodes[0] ? entityKey(nodes[0].type, nodes[0].id) : "";
  const edges = useMemo(() => allConnections.filter((edge) => nodeKeys.has(entityKey(edge.from.type, edge.from.id)) && nodeKeys.has(entityKey(edge.to.type, edge.to.id))), [nodeKeys]);
  const activeKey = hovered || (selected ? entityKey(selected.type, selected.id) : null);
  const related = useMemo(() => selected ? new Set(getRelatedEntities(selected.type, selected.id).map((item) => entityKey(item.type, item.id))) : new Set(), [selected]);
  const { onPointerMove, onPointerLeave } = useSkillMapMotion(rootRef, motionEnabled);

  const navigate = (event, node) => {
    if (event.key === "Escape") { event.preventDefault(); onSelect(null); return; }
    if (!event.key.startsWith("Arrow")) return;
    event.preventDefault();
    const origin = positions.get(entityKey(node.type, node.id));
    const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    const candidates = nodes.map((candidate) => ({ candidate, position: positions.get(entityKey(candidate.type, candidate.id)) })).filter(({ position, candidate }) => position && candidate !== node).map(({ candidate, position }) => {
      const dx = position.x - origin.x; const dy = position.y - origin.y; const directional = dx * direction[0] + dy * direction[1];
      return { candidate, score: directional > 0 ? Math.hypot(dx, dy) + Math.abs(dx * direction[1] - dy * direction[0]) * 1.8 : Infinity };
    }).sort((a, b) => a.score - b.score);
    if (Number.isFinite(candidates[0]?.score)) {
      const key = entityKey(candidates[0].candidate.type, candidates[0].candidate.id); setFocusKey(key);
      rootRef.current?.querySelector(`[data-node-key="${key}"] .skill-node`)?.focus();
    }
  };

  return (
    <div className="skill-scene-shell" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="skill-coordinates" aria-hidden="true"><span>X 421</span><span>Y 208</span><span>Z {exploded ? "128" : "042"}</span></div>
      {view === "experience" && <div className="skill-year-axis" aria-hidden="true"><span>2024</span><i /><span>2025</span><i /><span>2026</span></div>}
      <div ref={rootRef} className="skill-scene" data-motion-region data-tour={tour?.id || ""} style={{ "--skill-zoom": zoom / 100 }}>
        <div className="skill-grid" aria-hidden="true" />
        <div className="skill-cluster-labels" aria-hidden="true">{view === "clusters" && [...new Set(nodes.filter((node) => node.area).map((node) => node.area))].map((area) => <span key={area} data-area={area}>{area}</span>)}</div>
        <ConnectionLayer edges={edges} positions={positions} activeKey={activeKey} motionEnabled={motionEnabled} />
        {nodes.map((node) => {
          const key = entityKey(node.type, node.id); const isSelected = selected?.type === node.type && selected.id === node.id;
          const dimmed = Boolean(selected && !isSelected && !related.has(key));
          return <span className="skill-node-anchor" data-node-key={key} key={key}><GraphNode node={node} position={positions.get(key) || { x: 50, y: 50, z: -50 }} selected={isSelected} active={tour?.area === node.area || (tour?.context && getRelatedEntities(node.type, node.id).length > 0)} dimmed={dimmed} hidden={false} orbit={orbit && related.has(key)} motionEnabled={motionEnabled} tabIndex={effectiveFocusKey === key ? 0 : -1} onSelect={onSelect} onHover={setHovered} onNavigate={navigate} /></span>;
        })}
      </div>
      <span className="skill-scene-caption" aria-hidden="true">RELATIONSHIP MAP / LIVE MODEL</span>
    </div>
  );
}
