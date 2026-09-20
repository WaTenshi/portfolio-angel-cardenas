const loaders = {
  consultora: () => import('./consultora.js'),
  certificados: () => import('./certificados.js'),
}

export async function loadCodePreview(projectId, previewId) {
  const load = loaders[projectId]
  if (!load) return null
  const previews = (await load()).default
  return previews[previewId] ?? null
}
