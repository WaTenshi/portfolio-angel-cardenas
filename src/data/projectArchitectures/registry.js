export const architectureIds = ['journalfit', 'consultora', 'certificados']

const loaders = {
  journalfit: () => import('./journalfit.js'),
  consultora: () => import('./consultora.js'),
  certificados: () => import('./certificados.js'),
}

export function hasArchitecture(id) {
  return architectureIds.includes(id)
}

export async function loadArchitecture(id) {
  if (!hasArchitecture(id)) throw new Error(`Unknown architecture: ${id}`)
  return (await loaders[id]()).default
}
