import { FiPlay } from 'react-icons/fi';
import { musicCopy } from './musicCopy';

export default function MusicQueue({ tracks, currentTrack, isPlaying, language, onSelect }) {
  const t = musicCopy[language];
  return (
    <div className="music-queue" id="music-queue" role="region" aria-label={t.rotation}>
      <div className="music-queue-heading">
        <span>{t.rotation}</span>
        <b>{String(tracks.length).padStart(2, '0')} {t.tracks}</b>
      </div>
      <ol>
        {tracks.map((track, index) => {
          const active = track.id === currentTrack.id;
          return (
            <li key={track.id}>
              <button className={active ? 'is-current' : ''} onClick={() => onSelect(track.id)} aria-label={`${t.playTrack}: ${track.title} — ${track.artist}`}>
                <span className="music-queue-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="music-queue-copy"><strong>{track.title}</strong><small>{track.artist}</small></span>
                <span className="music-queue-state">{active ? <><i />{isPlaying ? t.nowPlaying : t.paused}</> : <FiPlay />}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
