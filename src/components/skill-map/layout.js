import { areas, entityKey, getRelatedEntities } from "../../data/skillGraph/index.js";

function hash(id) {
  let value = 0;
  for (const char of id) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}
const polar = (index, total, radius, cx, cy, phase = 0) => {
  const angle = phase + (Math.PI * 2 * index) / Math.max(total, 1);
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
};

const areaCenters = {
  frontend: [24, 24], backend: [52, 23], mobile: [79, 22], data: [28, 55],
  cloud: [54, 51], devops: [78, 52], design: [21, 81], monitoring: [52, 80], "education-tech": [80, 80],
};

export function createLayout(nodes, view, selected, exploded) {
  const result = new Map();
  const byArea = new Map(areas.map(({ id }) => [id, nodes.filter((node) => node.type === "skill" && node.area === id)]));
  const projects = nodes.filter((node) => node.type === "project");
  const roles = nodes.filter((node) => node.type === "experience");

  if (view === "clusters" || view === "graph") {
    byArea.forEach((items, area) => items.forEach((node, index) => {
      const [cx, cy] = areaCenters[area];
      const offset = polar(index, items.length, view === "graph" ? 7 : 8.5, cx, cy, (hash(area) % 90) / 40);
      result.set(entityKey(node.type, node.id), { ...offset, z: (areas.findIndex((item) => item.id === area) % 3 - 1) * 14 });
    }));
    projects.forEach((node, index) => result.set(entityKey(node.type, node.id), { ...polar(index, projects.length, 41, 50, 51, -.3), z: -22 }));
    roles.forEach((node, index) => result.set(entityKey(node.type, node.id), { ...polar(index, roles.length, 45, 50, 50, .6), z: -34 }));
  }

  if (view === "projects") {
    projects.forEach((node, index) => {
      const col = index % 3; const row = Math.floor(index / 3);
      result.set(entityKey(node.type, node.id), { x: 19 + col * 31, y: 28 + row * 45, z: 28 });
    });
    nodes.filter((node) => node.type === "skill").forEach((node, index) => {
      const related = getRelatedEntities("skill", node.id).filter((item) => item.type === "project");
      const targetIndex = Math.max(0, projects.findIndex((item) => item.id === related[0]?.id));
      const base = result.get(entityKey("project", projects[targetIndex]?.id)) || { x: 50, y: 50 };
      result.set(entityKey(node.type, node.id), { ...polar(index, 12, 11 + (index % 2) * 5, base.x, base.y, hash(node.id) % 5), z: 2 });
    });
    roles.forEach((node, index) => result.set(entityKey(node.type, node.id), { x: 8 + index * 21, y: 94, z: -45 }));
  }

  if (view === "experience") {
    roles.forEach((node, index) => result.set(entityKey(node.type, node.id), { x: 11 + index * 19.5, y: 48, z: 30 }));
    nodes.filter((node) => node.type === "skill").forEach((node, index) => {
      const related = getRelatedEntities("skill", node.id).filter((item) => item.type === "experience");
      const targetIndex = Math.max(0, roles.findIndex((item) => item.id === related[0]?.id));
      const base = result.get(entityKey("experience", roles[targetIndex]?.id)) || { x: 50, y: 50 };
      result.set(entityKey(node.type, node.id), { ...polar(index, 13, 16 + (index % 3) * 3, base.x, base.y, hash(node.id) % 4), z: 0 });
    });
    projects.forEach((node, index) => result.set(entityKey(node.type, node.id), { x: 9 + index * 16, y: 91, z: -45 }));
  }

  if (selected) {
    const selectedKey = entityKey(selected.type, selected.id);
    const related = getRelatedEntities(selected.type, selected.id);
    const relatedKeys = new Set(related.map((item) => entityKey(item.type, item.id)));
    result.set(selectedKey, { x: 50, y: 48, z: 70 });
    const direct = nodes.filter((node) => relatedKeys.has(entityKey(node.type, node.id)));
    direct.forEach((node, index) => result.set(entityKey(node.type, node.id), { ...polar(index, direct.length, node.type === "skill" ? 24 : 29, 50, 48, -.5), z: 34 }));
    const others = nodes.filter((node) => entityKey(node.type, node.id) !== selectedKey && !relatedKeys.has(entityKey(node.type, node.id)));
    others.forEach((node, index) => result.set(entityKey(node.type, node.id), { ...polar(index, others.length, 46, 50, 50, .4), z: -48 }));
  }

  if (exploded) result.forEach((position, key) => {
    const node = nodes.find((item) => entityKey(item.type, item.id) === key);
    const layer = node?.type === "skill" ? areas.findIndex((item) => item.id === node.area) : node?.type === "project" ? 3 : -3;
    position.z += (layer - 3) * 12;
  });
  return result;
}
