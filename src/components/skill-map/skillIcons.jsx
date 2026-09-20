import {
  FiArchive, FiCloud, FiCode, FiDatabase, FiDownload, FiFileText, FiGithub,
  FiGlobe, FiImage, FiMail, FiServer, FiTable,
} from "react-icons/fi";
import {
  SiCss3, SiDjango, SiExpo, SiFigma, SiFirebase, SiFlask, SiGooglecloud,
  SiHtml5, SiJavascript, SiMysql, SiPhp, SiPostgresql, SiPython, SiReact,
  SiSentry, SiSupabase, SiTypescript,
} from "react-icons/si";

const icons = {
  archive: FiArchive, api: FiGlobe, cloud: FiCloud, code: FiCode, css: SiCss3,
  database: FiDatabase, django: SiDjango, download: FiDownload, email: FiMail,
  expo: SiExpo, figma: SiFigma, file: FiFileText, firebase: SiFirebase,
  flask: SiFlask, "google-cloud": SiGooglecloud, github: FiGithub, html: SiHtml5,
  image: FiImage, javascript: SiJavascript, mysql: SiMysql, php: SiPhp,
  postgresql: SiPostgresql, python: SiPython, react: SiReact, sentry: SiSentry,
  server: FiServer, supabase: SiSupabase, table: FiTable, typescript: SiTypescript,
  vite: FiCode, tailwind: FiCode, moodle: FiGlobe,
};

export default function SkillIcon({ name }) {
  const Icon = icons[name] || FiCode;
  return <Icon aria-hidden="true" />;
}
