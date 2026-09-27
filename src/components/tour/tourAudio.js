import { readPreference, savePreference } from "../../hooks/useMotion.js";

const AudioContextClass = () => window.AudioContext || window.webkitAudioContext;

export function createTacticalAudio() {
  const Context = AudioContextClass();
  let context = null;
  let master = null;
  let muted = readPreference("tour-sound-muted", "false") === "true";
  let available = Boolean(Context);
  const sources = new Set();

  const resume = () => {
    if (!context || context.state === "running") return;
    try {
      const pending = context.resume?.();
      pending?.catch?.(() => {});
    } catch { /* Audio can remain unavailable without blocking the tour. */ }
  };

  try {
    if (Context) {
      context = new Context();
      master = context.createGain();
      master.gain.value = muted ? 0 : 0.055;
      master.connect(context.destination);
      resume();
    }
  } catch {
    available = false;
    context = null;
  }

  const tone = (frequency, start, duration, volume = 1, type = "square") => {
    if (!context || !master || muted) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(master);
    sources.add(oscillator);
    oscillator.addEventListener("ended", () => {
      sources.delete(oscillator);
      oscillator.disconnect();
      envelope.disconnect();
    }, { once: true });
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  };

  const ring = () => {
    if (!context || muted) return;
    resume();
    const start = context.currentTime + 0.02;
    for (let pulse = 0; pulse < 5; pulse += 1) {
      const at = start + pulse * 0.27;
      tone(784, at, 0.105, 0.72);
      tone(1046, at + 0.11, 0.09, 0.48);
    }
  };

  const blip = (kind = "next") => {
    if (!context || muted) return;
    resume();
    const start = context.currentTime + 0.01;
    const notes = kind === "back" ? [620, 480] : kind === "complete" ? [620, 784, 1046] : [720, 920];
    notes.forEach((frequency, index) => tone(frequency, start + index * 0.055, 0.07, 0.38, "triangle"));
  };

  const setMuted = (next) => {
    muted = Boolean(next);
    savePreference("tour-sound-muted", String(muted));
    if (master && context) master.gain.setTargetAtTime(muted ? 0 : 0.055, context.currentTime, 0.015);
    if (muted) {
      sources.forEach((source) => { try { source.stop(); } catch { /* already stopped */ } });
      sources.clear();
    } else {
      resume();
      blip("next");
    }
    return muted;
  };

  const suspend = () => {
    sources.forEach((source) => { try { source.stop(); } catch { /* already stopped */ } });
    sources.clear();
    try {
      const pending = context?.suspend?.();
      pending?.catch?.(() => {});
    } catch { /* optional audio suspension */ }
  };

  const destroy = () => {
    suspend();
    try {
      const pending = context?.close?.();
      pending?.catch?.(() => {});
    } catch { /* optional audio cleanup */ }
    context = null;
    master = null;
  };

  return { available, ring, blip, setMuted, suspend, destroy, get muted() { return muted; } };
}
