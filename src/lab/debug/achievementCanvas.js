import { medalForScore } from "./medal.js";

function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

function setupCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#101310"; context.fillRect(0, 0, width, height);
  context.strokeStyle = "#344038"; context.lineWidth = 2;
  for (let x = 0; x <= width; x += 60) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
  for (let y = 0; y <= height; y += 60) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
  return { canvas, context };
}

function drawMedal(context, x, y, radius, score, challenge) {
  const medal = medalForScore(score);
  const colors = { gold: ["#f3d37a", "#806520"], silver: ["#d8dfdc", "#68716d"], bronze: ["#d4986b", "#70472d"] }[medal.id];
  const gradient = context.createRadialGradient(x - radius * .25, y - radius * .3, radius * .1, x, y, radius);
  gradient.addColorStop(0, colors[0]); gradient.addColorStop(1, colors[1]);
  context.fillStyle = gradient; context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill();
  context.strokeStyle = "#101310"; context.lineWidth = radius * .045; context.stroke();
  context.fillStyle = "#101310"; context.textAlign = "center"; context.font = `700 ${radius * .52}px IBM Plex Mono`; context.fillText(challenge.medalMark, x, y + radius * .16);
  context.font = `700 ${radius * .11}px IBM Plex Mono`; context.fillText(`TENSHI LAB · TEST ${challenge.chamber}`, x, y - radius * .55);
  return medal;
}

export async function downloadMedal({ challenge, score, certificateId }) {
  await document.fonts?.ready;
  const { canvas, context } = setupCanvas(1200, 1200);
  const medal = drawMedal(context, 600, 525, 330, score, challenge);
  context.fillStyle = "#f1f1e9"; context.font = "700 58px IBM Plex Mono"; context.textAlign = "center"; context.fillText(medal.label, 600, 975);
  context.fillStyle = "#879188"; context.font = "26px IBM Plex Mono"; context.fillText(`${score} / 100 · ${certificateId}`, 600, 1040);
  downloadCanvas(canvas, `tenshi-lab-${challenge.language}-${medal.id}-debugger.png`);
}

export async function downloadCertificate({ challenge, name, score, hints, attempts, date, certificateId, language }) {
  await document.fonts?.ready;
  const { canvas, context } = setupCanvas(1800, 1200);
  context.fillStyle = "#101310dd"; context.fillRect(55, 55, 1690, 1090);
  context.strokeStyle = "#54e49b"; context.lineWidth = 4; context.strokeRect(74, 74, 1652, 1052);
  context.fillStyle = "#54e49b"; context.font = "700 28px IBM Plex Mono"; context.textAlign = "left"; context.fillText("TENSHI LABORATORY / DEBUG DIVISION", 125, 155);
  context.fillStyle = "#f1f1e9"; context.font = "400 102px Instrument Serif"; context.fillText(language === "es" ? "Certificado de Debugging" : "Certificate of Debugging", 125, 295);
  context.fillStyle = "#8f9a90"; context.font = "24px IBM Plex Mono"; context.fillText(language === "es" ? "OTORGA ESTE LOGRO EXPERIMENTAL A" : "PRESENTS THIS EXPERIMENTAL ACHIEVEMENT TO", 125, 385);
  context.fillStyle = "#f1f1e9"; context.font = "400 82px Instrument Serif"; context.fillText(name.slice(0, 60), 125, 490);
  context.strokeStyle = "#435047"; context.lineWidth = 2; context.beginPath(); context.moveTo(125, 530); context.lineTo(1180, 530); context.stroke();
  context.fillStyle = "#c7cec7"; context.font = "32px DM Sans"; context.fillText(language === "es" ? `por completar ${challenge.title.es} Debug Challenge` : `for successfully completing ${challenge.title.en} Debug Challenge`, 125, 610);
  context.fillStyle = "#54e49b"; context.font = "700 24px IBM Plex Mono"; context.fillText(`BASIC / TEST CHAMBER ${challenge.chamber}`, 125, 665);
  const medal = drawMedal(context, 1460, 450, 190, score, challenge);
  context.fillStyle = "#f1f1e9"; context.font = "700 24px IBM Plex Mono"; context.textAlign = "center"; context.fillText(medal.label, 1460, 700);
  context.textAlign = "left"; context.fillStyle = "#aeb7ae"; context.font = "24px IBM Plex Mono";
  [["SCORE", `${score} / 100`], ["HINTS USED", String(hints)], ["ATTEMPTS", String(attempts)], ["COMPLETED", date]].forEach(([label, value], index) => { const x = 125 + index * 390; context.fillText(label, x, 795); context.fillStyle = "#f1f1e9"; context.fillText(value, x, 840); context.fillStyle = "#aeb7ae"; });
  context.fillStyle = "#f1f1e9"; context.font = "400 38px Instrument Serif"; context.fillText("Ángel Cárdenas", 125, 970); context.fillText("Chimuelo  ฅ", 720, 970);
  context.fillStyle = "#879188"; context.font = "20px IBM Plex Mono"; context.fillText("LAB DIRECTOR", 125, 1010); context.fillText("DEBUG EXAMINER / 01", 720, 1010);
  context.textAlign = "right"; context.fillText(certificateId, 1675, 1080);
  context.textAlign = "left"; context.fillText("PORTFOLIO CHALLENGE ACHIEVEMENT · NOT AN ACADEMIC OR PROFESSIONAL ACCREDITATION", 125, 1080);
  downloadCanvas(canvas, `tenshi-lab-${challenge.language}-debug-${name.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "achievement"}.png`);
}
