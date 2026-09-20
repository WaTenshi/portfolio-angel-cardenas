import { useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay, FiRotateCcw } from 'react-icons/fi'
import ArchitectureScene from './ArchitectureScene.jsx'

export default function DataFlow({ project, language, sceneProps, onManualInteraction }) {
  const [flowId, setFlowId] = useState(project.flows[0].id)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const flow = project.flows.find((item) => item.id === flowId) || project.flows[0]
  const step = flow.steps[stepIndex]
  useEffect(() => {
    if (!playing) return undefined
    const timer = window.setTimeout(() => {
      const next = Math.min(flow.steps.length - 1, stepIndex + 1)
      setStepIndex(next)
      if (next === flow.steps.length - 1) setPlaying(false)
    }, 2400)
    return () => window.clearTimeout(timer)
  }, [playing, stepIndex, flow.steps.length])
  const move = (next) => { onManualInteraction(); setPlaying(false); setStepIndex(Math.max(0, Math.min(flow.steps.length - 1, next))) }
  return (
    <div className="architecture-flow">
      <div className="architecture-flow-picker" role="group" aria-label={language === 'es' ? 'Escenario' : 'Scenario'}>{project.flows.map((item) => <button type="button" key={item.id} aria-pressed={item.id === flow.id} onClick={() => { onManualInteraction(); setFlowId(item.id); setStepIndex(0); setPlaying(false) }}>{item.title[language]}</button>)}</div>
      <ArchitectureScene {...sceneProps} activeNode={step.node} activeConnection={step.connection} />
      <section className="architecture-step" aria-live="polite">
        <div><span>STEP {String(stepIndex + 1).padStart(2, '0')} / {String(flow.steps.length).padStart(2, '0')}</span><h2>{step.title[language]}</h2><p>{step.description[language]}</p>{step.packet && <code>{step.packet}</code>}</div>
        <div className="architecture-step-controls"><button type="button" onClick={() => move(stepIndex - 1)} disabled={stepIndex === 0} aria-label={language === 'es' ? 'Paso anterior' : 'Previous step'}><FiChevronLeft /></button><button type="button" onClick={() => { if (!playing && stepIndex === flow.steps.length - 1) setStepIndex(0); setPlaying(!playing) }} aria-pressed={playing}>{playing ? <FiPause /> : <FiPlay />}{playing ? 'PAUSE' : 'PLAY'}</button><button type="button" onClick={() => move(stepIndex + 1)} disabled={stepIndex === flow.steps.length - 1} aria-label={language === 'es' ? 'Paso siguiente' : 'Next step'}><FiChevronRight /></button><button type="button" onClick={() => move(0)} aria-label="Reset"><FiRotateCcw /></button></div>
      </section>
    </div>
  )
}
