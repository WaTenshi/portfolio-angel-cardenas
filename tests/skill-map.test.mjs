import test from "node:test";
import assert from "node:assert/strict";
import {
  allConnections, areas, filterGraph, getEntity, getInverseRelations, getVisualPriority,
  graphExperience, graphProjects, graphStats, searchEntities, serializePublicGraph, skills,
} from "../src/data/skillGraph/model.js";
import journalfit from "../src/data/projectArchitectures/journalfit.js";
import consultora from "../src/data/projectArchitectures/consultora.js";
import certificados from "../src/data/projectArchitectures/certificados.js";
import { executeTerminalCommand } from "../src/components/terminal/terminalCommands.js";
import { experience } from "../src/data/portfolio/experience.js";
import { projectCatalog } from "../src/data/portfolio/projectCatalog.js";

const architectures = new Map([journalfit, consultora, certificados].map((project) => [project.id, new Set(project.nodes.map((node) => node.id))]));

test("skill graph IDs, endpoints, translations, aliases, and areas are valid", () => {
  const areaIds = new Set(areas.map(({ id }) => id));
  const entityIds = [
    ...skills.map(({ id }) => `skill:${id}`),
    ...graphProjects.map(({ id }) => `project:${id}`),
    ...graphExperience.map(({ id }) => `experience:${id}`),
  ];
  assert.equal(new Set(entityIds).size, entityIds.length);
  assert(skills.every((skill) => areaIds.has(skill.area) && skill.description.es && skill.description.en && Array.isArray(skill.aliases)));
  assert(graphProjects.every((project) => project.description.es && project.description.en));
  assert(graphExperience.every((role) => role.dates.es && role.dates.en));
  for (const edge of allConnections) {
    assert(getEntity(edge.from.type, edge.from.id), `unknown edge origin ${edge.id}`);
    assert(getEntity(edge.to.type, edge.to.id), `unknown edge target ${edge.id}`);
    assert(edge.evidence.length > 0, `${edge.id} has no evidence`);
  }
});

test("architecture references resolve to actual explorer nodes", () => {
  for (const edge of allConnections.filter((item) => item.architectureNodeId)) {
    const project = getEntity("project", edge.to.id);
    assert(project?.architectureId, `${edge.id} has no architecture project`);
    assert(architectures.get(project.architectureId)?.has(edge.architectureNodeId), `${edge.id} points to unknown node ${edge.architectureNodeId}`);
  }
});

test("public serialization strips private repository, commit, path, and fragment data", () => {
  const graph = serializePublicGraph();
  const privateEvidence = graph.connections.flatMap((edge) => edge.evidence).filter((evidence) => evidence.visibility === "private");
  assert(privateEvidence.length > 0);
  assert(privateEvidence.every((evidence) => evidence.verified === true));
  assert(privateEvidence.every((evidence) => !evidence.repo && !evidence.commit && !evidence.files && !evidence.path && !evidence.fragment));
});

test("derived filters, counters, priorities, inverse relations, and aliases stay coherent", () => {
  assert.deepEqual(graphStats, { skills: skills.length, projects: graphProjects.length, roles: graphExperience.length });
  const production = filterGraph({ context: "production" });
  assert(production.connections.length > 0);
  assert(production.connections.every((edge) => edge.contexts.includes("production")));
  const frontend = filterGraph({ area: "frontend", includeExtended: false });
  assert(frontend.skills.every((skill) => skill.area === "frontend" && skill.priority !== "extended"));
  const inverse = getInverseRelations();
  assert.equal(inverse["skill:react"].length, allConnections.filter((edge) => edge.from.id === "react" || edge.to.id === "react").length);
  assert.equal(getVisualPriority("skill", "react").degree, inverse["skill:react"].length);
  assert.equal(searchEntities("rn", "en")[0].id, "react-native");
  assert.equal(searchEntities("hallazgo", "es")[0].id, "mihallazgo");
  assert(filterGraph({ context: "production" }).projects.some(({ id }) => id === "mihallazgo"));
});

test("terminal exposes the textual summary and skill map actions", () => {
  const context = { language: "es", theme: "dark", projects: projectCatalog, experience, skills, areas, aboutText: ["", ""], location: "Concepción", blogUrl: "/blog/" };
  assert(executeTerminalCommand("skills", context).lines.some((line) => line.includes("React")));
  assert.deepEqual(executeTerminalCommand("skill rn", context).action, { type: "skill", id: "react-native" });
  assert.deepEqual(executeTerminalCommand("open skillmap", context).action, { type: "skillmap" });
});
