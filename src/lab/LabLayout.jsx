import { FiArrowLeft, FiMoon, FiPause, FiPlay, FiSun } from "react-icons/fi";
import { labPath } from "./labData.js";
import { siteBase } from "../blog/paths.js";

export default function LabLayout({ preferences, motion, onNavigate, children }) {
  const { language, setLanguage, theme, setTheme } = preferences;
  const { enabled, reduced, toggleMotion } = motion;
  return (
    <div className="lab-shell" data-motion-enabled={enabled}>
      <a className="skip-link" href="#lab-main">{language === "es" ? "Saltar al laboratorio" : "Skip to laboratory"}</a>
      <header className="lab-header">
        <div className="lab-header-brand"><a href={labPath} onClick={(event) => onNavigate(event, labPath)}><b>TL</b><span>TENSHI / LAB<small>EXPERIMENTAL DIVISION</small></span></a></div>
        <div className="lab-system-status"><i className="ambient-loop" /><span>LAB SYSTEM / ONLINE</span></div>
        <nav aria-label={language === "es" ? "Navegación del laboratorio" : "Laboratory navigation"}>
          <a href={labPath} onClick={(event) => onNavigate(event, labPath)}>INDEX</a>
          <a href={siteBase}><FiArrowLeft />{language === "es" ? "PORTFOLIO" : "PORTFOLIO"}</a>
        </nav>
        <div className="lab-preferences">
          <button type="button" onClick={() => setLanguage(language === "es" ? "en" : "es")} aria-label={language === "es" ? "Switch to English" : "Cambiar a español"}>{language === "es" ? "EN" : "ES"}</button>
          <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "Activar tema claro" : "Activate dark theme"}>{theme === "dark" ? <FiSun /> : <FiMoon />}</button>
          <button type="button" onClick={toggleMotion} disabled={reduced} aria-pressed={!enabled} aria-label={enabled ? "Pause motion" : "Enable motion"}>{enabled ? <FiPause /> : <FiPlay />}</button>
        </div>
      </header>
      {children}
      <footer className="lab-footer"><span>TENSHI LABORATORY / {new Date().getFullYear()}</span><span>EXPERIMENTAL SOFTWARE DIVISION</span></footer>
    </div>
  );
}
