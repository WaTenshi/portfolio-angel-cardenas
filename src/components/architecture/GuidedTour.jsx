import { FiPlay, FiX } from 'react-icons/fi'

export default function GuidedTour({ language, tour, index, onStart, onStop }) {
  const running = index >= 0
  return running ? <div className="architecture-tour" role="status"><span>GUIDED TOUR / {String(index + 1).padStart(2, '0')}—{String(tour.length).padStart(2, '0')}</span><strong>{tour[index].text[language]}</strong><button type="button" onClick={onStop}><FiX />{language === 'es' ? 'Cancelar' : 'Cancel'}</button></div> : <button className="architecture-tour-start" type="button" onClick={onStart}><FiPlay />GUIDED TOUR</button>
}
