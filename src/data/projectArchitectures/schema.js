/**
 * @typedef {{ es: string, en: string }} LocalizedText
 * @typedef {{ path: string, symbols?: string[], previewId?: string, sourceUrl?: string }} ArchitectureEvidence
 * @typedef {{ id: string, layer: string, position: { x: number, y: number, z: number }, title: string, technology: string, responsibility: LocalizedText, details: LocalizedText, evidence: ArchitectureEvidence[] }} ArchitectureNode
 * @typedef {{ id: string, from: string, to: string, label: LocalizedText, kind: 'request'|'data'|'auth'|'deployment'|'local' }} ArchitectureConnection
 * @typedef {{ id: string, title: LocalizedText, description: LocalizedText, steps: Array<{ node: string, connection?: string, title: LocalizedText, description: LocalizedText, packet?: string }> }} ArchitectureFlow
 * @typedef {{ id: string, kind: 'verified'|'observation', category: string, title: LocalizedText, context: LocalizedText, choice: LocalizedText, tradeoff: LocalizedText, evidence: string[] }} ArchitectureDecision
 * @typedef {{ id: string, title: string, subtitle: LocalizedText, sourceCommit: string, sourceLabel: string, visibility: 'public'|'mixed', stack: string[], nodes: ArchitectureNode[], connections: ArchitectureConnection[], flows: ArchitectureFlow[], decisions: ArchitectureDecision[], tour: Array<{ node: string, text: LocalizedText }> }} ProjectArchitecture
 */

export const architectureLayers = ['ui', 'business', 'services', 'data', 'infra']

export function localized(es, en) {
  return { es, en }
}
