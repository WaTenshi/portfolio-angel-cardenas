import images from "../../assets/optimized/images";
import { projectCatalog } from "./projectCatalog.js";

export const projects = projectCatalog.map((project) => ({
  ...project,
  image: images[project.id === "calzados-paula" ? "calzadospaula" : project.id],
}));

export default projects;
