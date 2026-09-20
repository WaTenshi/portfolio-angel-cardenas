import { memo } from "react";
import { entityKey } from "../../data/skillGraph/index.js";

function pathBetween(from, to) {
  const bend = Math.max(2, Math.abs(to.x - from.x) * .16);
  return `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend} ${to.y}, ${to.x} ${to.y}`;
}

function ConnectionLayer({ edges, positions, activeKey, motionEnabled }) {
  return (
    <svg className="skill-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="skill-line-gradient"><stop offset="0" stopColor="var(--line-strong)" /><stop offset=".5" stopColor="var(--accent)" /><stop offset="1" stopColor="var(--line-strong)" /></linearGradient></defs>
      {edges.map((edge, index) => {
        const fromKey = entityKey(edge.from.type, edge.from.id); const toKey = entityKey(edge.to.type, edge.to.id);
        const from = positions.get(fromKey); const to = positions.get(toKey);
        if (!from || !to) return null;
        const related = !activeKey || activeKey === fromKey || activeKey === toKey;
        const path = pathBetween(from, to);
        return <g key={edge.id} className="skill-connection" data-kind={edge.kind} data-dimmed={!related} data-active={Boolean(activeKey && related)}>
          <path d={path} className="skill-connection-line" pathLength="100" />
          {motionEnabled && related && index % 3 === 0 && <circle className="skill-packet" r=".48"><animateMotion dur={`${5 + index % 4}s`} begin={`${-(index % 5)}s`} repeatCount="indefinite" path={path} /></circle>}
        </g>;
      })}
    </svg>
  );
}
export default memo(ConnectionLayer);
