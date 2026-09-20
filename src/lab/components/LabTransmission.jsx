import { useEffect, useState } from "react";

const states = ["TRANSFERRING SESSION...", "LOADING EXAMINER...", "EXAMINER ONLINE"];

export default function LabTransmission({ motionEnabled, onComplete }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const delay = motionEnabled ? 420 : 10;
    const timer = window.setTimeout(() => {
      if (index === states.length - 1) onComplete();
      else setIndex((value) => value + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [index, motionEnabled, onComplete]);
  return (
    <section className="lab-transmission" role="status" aria-live="polite">
      <div className="lab-transfer-orbit" aria-hidden="true"><i /><i /><i /></div>
      <span>SESSION / HANDOFF</span>
      <h1 key={states[index]}>{states[index]}</h1>
      <div className="lab-transfer-progress" aria-hidden="true"><i style={{ width: `${((index + 1) / states.length) * 100}%` }} /></div>
    </section>
  );
}
