import { memo, useRef } from "react";
import { entityKey, getConnections } from "../../data/skillGraph/index.js";
import SkillIcon from "./skillIcons.jsx";
import { hashMotion } from "./useSkillMapMotion.js";

function GraphNode({ node, position, selected, dimmed, hidden, active, orbit, motionEnabled, tabIndex, onSelect, onHover, onNavigate }) {
  const ref = useRef(null);
  const motion = hashMotion(entityKey(node.type, node.id));
  const style = {
    "--node-x": `${position.x}%`, "--node-y": `${position.y}%`, "--node-z": `${position.z + motion.depth}px`,
    "--float-x": `${motion.x}px`, "--float-y": `${motion.y}px`, "--float-duration": `${motion.duration}s`, "--float-delay": `${motion.delay}s`, "--float-phase": `${motion.phase}deg`,
  };
  const label = node.type === "skill" ? node.name : node.title;
  const count = getConnections(node.type, node.id).length;

  const move = (event) => {
    if (!motionEnabled || event.pointerType === "touch" || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    ref.current.style.setProperty("--magnet-x", `${(x * 6).toFixed(2)}px`);
    ref.current.style.setProperty("--magnet-y", `${(y * 5).toFixed(2)}px`);
  };
  const leave = () => {
    ref.current?.style.setProperty("--magnet-x", "0px"); ref.current?.style.setProperty("--magnet-y", "0px"); onHover(null);
  };
  return (
    <button ref={ref} type="button" className="skill-node" data-type={node.type} data-area={node.area} data-priority={node.priority} data-selected={selected} data-active={active} data-dimmed={dimmed} data-hidden={hidden} data-orbit={orbit}
      style={style} onClick={() => onSelect(node.type, node.id)} onPointerMove={move} onPointerEnter={() => onHover(entityKey(node.type, node.id))} onPointerLeave={leave}
      onFocus={() => onHover(entityKey(node.type, node.id))} onBlur={() => onHover(null)} onKeyDown={(event) => onNavigate(event, node)} aria-pressed={selected} aria-label={`${label}. ${count} ${count === 1 ? "connection" : "connections"}`} tabIndex={hidden ? -1 : tabIndex}>
      <span className="skill-node-float">
        <span className="skill-node-meta">{node.type === "skill" ? node.area : node.type}</span>
        {node.type === "skill" && <SkillIcon name={node.icon} />}
        <strong>{label}</strong>
        <small>{count.toString().padStart(2, "0")} LINKS</small>
        <i className="skill-node-status" aria-hidden="true" />
      </span>
    </button>
  );
}
export default memo(GraphNode);
