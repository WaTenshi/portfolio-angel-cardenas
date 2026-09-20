import { useState } from "react";
import { FiDownload, FiRefreshCcw, FiArrowLeft } from "react-icons/fi";
import DebugMedal from "./DebugMedal.jsx";
import { medalForScore } from "./medal.js";

export default function DebugResults({ challenge, language, score, hints, attempts, certificateId, completedDate, onRetry, onBack }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const medal = medalForScore(score);
  const downloadCertificate = async () => {
    if (!name.trim()) { setNameError(true); return; }
    setNameError(false);
    const generator = await import("./achievementCanvas.js");
    await generator.downloadCertificate({ challenge, name: name.trim(), score, hints, attempts, date: completedDate, certificateId, language });
  };
  const downloadMedal = async () => {
    const generator = await import("./achievementCanvas.js");
    await generator.downloadMedal({ challenge, score, certificateId });
  };
  return (
    <section className="debug-results" aria-labelledby="debug-results-title">
      <div className="debug-results-heading"><span>TENSHI LAB / DEBUG CERTIFICATION</span><h1 id="debug-results-title">{medal.label}</h1><p>{language === "es" ? "Prueba completada. Entorno estabilizado." : "Test completed. Environment stabilized."}</p></div>
      <DebugMedal score={score} challenge={challenge} />
      <div className="debug-result-data"><div><span>SCORE</span><strong>{score} / 100</strong></div><div><span>HINTS</span><strong>{String(hints).padStart(2, "0")}</strong></div><div><span>ATTEMPTS</span><strong>{String(attempts).padStart(2, "0")}</strong></div><div><span>ID</span><strong>{certificateId}</strong></div></div>
      <div className="debug-certificate-form">
        <label htmlFor="certificate-name">{language === "es" ? "Nombre para la certificación" : "Name for certification"}</label>
        <input id="certificate-name" value={name} maxLength="60" onChange={(event) => { setName(event.target.value); setNameError(false); }} aria-invalid={nameError} aria-describedby="certificate-note certificate-error" placeholder={language === "es" ? "Tu nombre o display name" : "Your name or display name"} />
        {nameError && <span id="certificate-error" role="alert">{language === "es" ? "Escribe un nombre para generar el certificado." : "Enter a name to generate the certificate."}</span>}
        <small id="certificate-note">{language === "es" ? "El nombre permanece en este dispositivo y no se almacena. Recompensa experimental del portfolio; no es una acreditación oficial." : "The name stays on this device and is not stored. Experimental portfolio reward; not an official accreditation."}</small>
      </div>
      <div className="debug-result-actions">
        <button className="lab-button-primary" type="button" onClick={downloadCertificate}><FiDownload />{language === "es" ? "DESCARGAR CERTIFICADO" : "DOWNLOAD CERTIFICATE"}</button>
        <button type="button" onClick={downloadMedal}><FiDownload />{language === "es" ? "DESCARGAR MEDALLA" : "DOWNLOAD MEDAL"}</button>
        <button type="button" onClick={onRetry}><FiRefreshCcw />{language === "es" ? "INTENTAR DE NUEVO" : "TRY AGAIN"}</button>
        <button type="button" onClick={onBack}><FiArrowLeft />{language === "es" ? "VOLVER A DESAFÍOS" : "BACK TO CHALLENGES"}</button>
      </div>
    </section>
  );
}
