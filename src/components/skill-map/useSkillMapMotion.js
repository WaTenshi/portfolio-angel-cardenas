import { useEffect, useRef, useState } from "react";

export function hashMotion(id) {
  let value = 2166136261;
  for (const char of id) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  const unit = (shift) => ((value >>> shift) & 255) / 255;
  return {
    x: (unit(0) * 6 - 3).toFixed(2), y: (unit(8) * 8 - 4).toFixed(2),
    duration: (6.5 + unit(16) * 5).toFixed(2), delay: (-unit(20) * 8).toFixed(2),
    depth: Math.round(unit(12) * 42 - 18), phase: (unit(4) * 360).toFixed(1),
  };
}

export function useSkillMapMotion(rootRef, enabled) {
  const [inView, setInView] = useState(false);
  const frame = useRef(null);
  const visible = enabled && inView && !document.hidden;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(root);
    return () => observer.disconnect();
  }, [rootRef]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const sync = () => root.dataset.animationState = enabled && inView && !document.hidden ? "running" : "paused";
    sync(); document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [enabled, inView, rootRef]);

  const onPointerMove = (event) => {
    if (!visible || event.pointerType === "touch" || !rootRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      rootRef.current?.style.setProperty("--map-rx", `${(-y * 2).toFixed(2)}deg`);
      rootRef.current?.style.setProperty("--map-ry", `${(x * 3).toFixed(2)}deg`);
      rootRef.current?.style.setProperty("--map-x", `${(x * 8).toFixed(2)}px`);
      rootRef.current?.style.setProperty("--map-y", `${(y * 6).toFixed(2)}px`);
      rootRef.current?.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      rootRef.current?.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    });
  };
  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      for (const [key, value] of [["--map-rx", "0deg"], ["--map-ry", "0deg"], ["--map-x", "0px"], ["--map-y", "0px"]]) rootRef.current?.style.setProperty(key, value);
    });
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return { visible, onPointerMove, onPointerLeave };
}
