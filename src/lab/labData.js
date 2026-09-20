import { siteBase } from "../blog/paths.js";

export const labPath = `${siteBase}lab/`;
export const labDumPath = `${labPath}dum/`;
export const labDebugPath = `${labPath}debug/`;
export const labPythonPath = `${labDebugPath}python/basic/`;
export const labJavascriptPath = `${labDebugPath}javascript/basic/`;

export const experiments = [
  {
    id: "dum",
    number: "01",
    type: "game",
    href: labDumPath,
    title: "DUM",
    eyebrow: { es: "Experimento FPS", en: "FPS experiment" },
    description: {
      es: "Entra al Sector 01, recupera el núcleo y encuentra la única salida estable.",
      en: "Enter Sector 01, recover the core, and find the only stable exit.",
    },
    meta: "SECTOR 01",
    status: "available",
  },
  {
    id: "debug-challenges",
    number: "02",
    type: "debug",
    href: labDebugPath,
    title: "DEBUG CHALLENGE",
    eyebrow: { es: "Python + JavaScript / Básico", en: "Python + JavaScript / Basic" },
    description: {
      es: "Encuentra el bug. Corrige el código. Sobrevive al examinador.",
      en: "Find the bug. Fix the code. Survive the examiner.",
    },
    meta: "TEST CHAMBERS 01—02",
    status: "available",
  },
];

export function getLabExperiment(id) {
  return experiments.find((experiment) => experiment.id === id) || null;
}
