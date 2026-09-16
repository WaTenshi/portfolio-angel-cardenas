import {
  FiChevronDown, FiList, FiPause, FiPlay, FiRefreshCw, FiShuffle,
  FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX,
} from 'react-icons/fi';
import MusicQueue from './MusicQueue';
import { musicCopy } from './musicCopy';
import { radioIdentity, trackArtwork } from './musicLibrary';
import './music.css';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00';
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

function Equalizer({ active }) {
  return <span className={`music-equalizer${active ? ' is-active' : ''}`} aria-hidden="true">{[1, 2, 3, 4, 5].map((bar) => <i key={bar} />)}</span>;
}

export default function MusicDock({
  tracks, currentTrack, currentIndex, isPlaying, status, activated, expanded, queueOpen, shuffle,
  currentTime, duration, volume, muted, error, language, motionEnabled, open, collapse, togglePlay,
  selectTrack, next, previous, seek, setVolume, toggleMute, toggleQueue, toggleShuffle, setPlayerHost,
}) {
  const t = musicCopy[language];
  const progress = duration ? (currentTime / duration) * 100 : 0;
  const statusText = status === 'loading' ? t.loading
    : status === 'buffering' ? t.buffering
      : isPlaying ? t.nowPlaying
        : activated ? t.paused : t.ready;

  if (!expanded) {
    return (
      <aside className="music-dock music-dock-collapsed" aria-label={t.radio} data-playing={isPlaying ? 'true' : 'false'}>
        <button className="music-dock-opener" onClick={open} aria-label={t.open}>
          <span className="music-note" aria-hidden="true">♪</span>
          <span><b>{radioIdentity.shortName}</b><small>{activated ? currentTrack.title : t.selected}</small></span>
          <Equalizer active={isPlaying} />
        </button>
        {activated && (
          <div className="music-mini-controls">
            <button onClick={previous} aria-label={t.previous}><FiSkipBack /></button>
            <button className="music-mini-play" onClick={togglePlay} aria-label={isPlaying ? t.pause : t.play}>{isPlaying ? <FiPause /> : <FiPlay />}</button>
            <button onClick={next} aria-label={t.next}><FiSkipForward /></button>
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside className="music-dock music-dock-expanded" aria-label={t.radio} data-playing={isPlaying ? 'true' : 'false'} data-motion={motionEnabled ? 'on' : 'off'}>
      <section className="music-panel">
        <header className="music-panel-header">
          <div><span>{radioIdentity.name}</span><small>{radioIdentity.edition}</small></div>
          <span className="music-track-count">{String(currentIndex + 1).padStart(2, '0')} / {String(tracks.length).padStart(2, '0')}</span>
          <button className="music-collapse" onClick={collapse} aria-label={t.close}><FiChevronDown /></button>
        </header>

        <div className="music-video-frame">
          {activated ? (
            <div className="music-youtube-mount" aria-label={t.youtube}><div ref={setPlayerHost} /></div>
          ) : (
            <button className="music-video-poster" onClick={togglePlay} aria-label={`${t.play}: ${currentTrack.title}`}>
              <img src={trackArtwork(currentTrack)} alt="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
              <span><FiPlay />{t.play}</span>
            </button>
          )}
          <span className={`music-disc${isPlaying ? ' is-spinning' : ''}`} aria-hidden="true">
            <img src={trackArtwork(currentTrack)} alt="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            <i />
          </span>
        </div>

        <div className="music-now-playing" key={currentTrack.id}>
          <div className="music-status"><span><i />{statusText}</span><Equalizer active={isPlaying} /></div>
          <h2>{currentTrack.title}</h2>
          <p>{currentTrack.artist}</p>
        </div>

        {error && (
          <div className="music-error" role="alert">
            <span>{error === 'blocked' ? t.blocked : t.unavailable}</span>
            <button onClick={error === 'blocked' ? togglePlay : next}>{error === 'blocked' ? t.retry : t.skip} <FiRefreshCw /></button>
          </div>
        )}

        <div className="music-progress-row">
          <time>{formatTime(currentTime)}</time>
          <input
            type="range" min="0" max={duration || 0} step="1" value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seek(event.target.value)} aria-label={t.progress} disabled={!duration}
            style={{ '--range-progress': `${progress}%` }}
          />
          <time>{formatTime(duration)}</time>
        </div>

        <div className="music-main-controls">
          <button className={shuffle ? 'is-active' : ''} onClick={toggleShuffle} aria-label={t.shuffle} aria-pressed={shuffle}><FiShuffle /></button>
          <button className="music-skip music-previous" onClick={previous} aria-label={t.previous}><FiSkipBack /></button>
          <button className="music-play" onClick={togglePlay} aria-label={isPlaying ? t.pause : t.play}>{isPlaying ? <FiPause /> : <FiPlay />}</button>
          <button className="music-skip music-next" onClick={next} aria-label={t.next}><FiSkipForward /></button>
          <button className={queueOpen ? 'is-active' : ''} onClick={toggleQueue} aria-label={queueOpen ? t.hideQueue : t.queue} aria-expanded={queueOpen} aria-controls="music-queue"><FiList /></button>
        </div>

        <div className="music-volume-row">
          <button onClick={toggleMute} aria-label={muted ? t.unmute : t.mute}>{muted ? <FiVolumeX /> : <FiVolume2 />}</button>
          <span>VOL</span>
          <input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(event.target.value)} aria-label={t.volume} style={{ '--range-progress': `${volume}%` }} />
        </div>

        {queueOpen && <MusicQueue tracks={tracks} currentTrack={currentTrack} isPlaying={isPlaying} language={language} onSelect={selectTrack} />}
        <p className="music-legal-note">{t.youtube}</p>
      </section>
    </aside>
  );
}
