export default function Reveal({ children, className = "", delay = 0 }) {
  return <div className={`reveal ${className}`} data-reveal style={{ "--reveal-delay": `${Math.min(delay, 240)}ms` }}>{children}</div>;
}
