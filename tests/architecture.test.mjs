import test from 'node:test'
import assert from 'node:assert/strict'
import journalfit from '../src/data/projectArchitectures/journalfit.js'
import consultora from '../src/data/projectArchitectures/consultora.js'
import certificados from '../src/data/projectArchitectures/certificados.js'
import consultoraPreviews from '../src/data/projectArchitectures/previews/consultora.js'
import certificadosPreviews from '../src/data/projectArchitectures/previews/certificados.js'

const projects = [journalfit, consultora, certificados]

test('architecture models contain valid nodes, edges, flows, decisions and translations', () => {
  for (const project of projects) {
    const ids = project.nodes.map(({ id }) => id)
    assert.equal(new Set(ids).size, ids.length, `${project.id}: duplicate node id`)
    assert(project.nodes.every((node) => node.evidence.length > 0), `${project.id}: every node needs evidence`)
    assert(project.nodes.every((node) => node.responsibility.es && node.responsibility.en && node.details.es && node.details.en))
    const connectionIds = new Set(project.connections.map(({ id }) => id))
    for (const edge of project.connections) {
      assert(ids.includes(edge.from), `${project.id}: unknown edge origin ${edge.from}`)
      assert(ids.includes(edge.to), `${project.id}: unknown edge target ${edge.to}`)
      assert(edge.label.es && edge.label.en)
    }
    for (const flow of project.flows) for (const step of flow.steps) {
      assert(ids.includes(step.node), `${project.id}/${flow.id}: unknown flow node ${step.node}`)
      if (step.connection) assert(connectionIds.has(step.connection), `${project.id}/${flow.id}: unknown flow edge ${step.connection}`)
      assert(step.title.es && step.title.en && step.description.es && step.description.en)
    }
    assert(project.decisions.every((decision) => decision.evidence.length > 0 && ['verified', 'observation'].includes(decision.kind)))
    assert(project.tour.every((step) => ids.includes(step.node) && step.text.es && step.text.en))
  }
})

test('private JournalFit evidence never embeds repository metadata, paths, symbols or source previews', () => {
  assert.equal(journalfit.visibility, 'mixed')
  const privateEvidence = journalfit.nodes.flatMap((node) => node.evidence).filter((evidence) => evidence.private)
  assert(privateEvidence.length > 0)
  for (const evidence of privateEvidence) {
    assert.deepEqual(evidence, { private: true, verified: true })
  }
  assert(!/c1837686|Journal-Fit\/app|src\/services|src\/screens|src\/navigation|users\/\{uid\}|@progress_entries/.test(JSON.stringify(journalfit)))
})

test('every public preview is real, compact and pinned to its source commit', () => {
  for (const [project, previews] of [[consultora, consultoraPreviews], [certificados, certificadosPreviews]]) {
    const requested = project.nodes.flatMap((node) => node.evidence).map((item) => item.previewId).filter(Boolean)
    for (const id of requested) {
      const preview = previews[id]
      assert(preview, `${project.id}: missing preview ${id}`)
      assert(preview.url.includes(project.sourceCommit))
      assert(preview.code.split('\n').length <= 26, `${id}: preview is too long`)
      assert(!/TODO|normalize rows|workspace panels/i.test(preview.code), `${id}: placeholder found`)
    }
  }
})
