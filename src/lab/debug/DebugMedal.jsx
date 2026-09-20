import { medalForScore } from "./medal.js";

export default function DebugMedal({ score, challenge }) {
  const medal = medalForScore(score);
  return (
    <div className={`debug-medal is-${medal.id}`} aria-label={`${medal.label}, ${score} / 100`}>
      <div className="debug-medal-ribbon" aria-hidden="true"><i /><i /></div>
      <div className="debug-medal-disc"><span>TENSHI LAB</span><strong>{challenge.medalMark}</strong><small>DEBUG CHALLENGE · TEST {challenge.chamber}</small></div>
      <b>{medal.label}</b>
    </div>
  );
}
