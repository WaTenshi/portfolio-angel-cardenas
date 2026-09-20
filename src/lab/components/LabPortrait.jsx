import angelPortrait from "../../assets/dom/angel-dialogue-pixel.webp";
import chimueloPortrait from "../../assets/lab/chimuelo-debug-examiner.png";

export default function LabPortrait({ subject, state = "idle" }) {
  const isAngel = subject === "angel";
  return (
    <div className={`lab-portrait lab-portrait-${subject} is-${state}`}>
      <div className="lab-portrait-frame">
        <img src={isAngel ? angelPortrait : chimueloPortrait} alt={isAngel ? "Ángel Cárdenas en pixel art" : "Chimuelo, examinador del Tenshi Lab, en pixel art"} decoding="async" />
        <span className="lab-scanlines" aria-hidden="true" />
        <span className="lab-monitor-glow" aria-hidden="true" />
      </div>
      <div className="lab-portrait-status" aria-hidden="true"><i /><span>{isAngel ? "DIRECTOR FEED" : "EXAMINER FEED"}</span><b>ONLINE</b></div>
    </div>
  );
}
