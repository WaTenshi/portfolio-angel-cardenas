import { FiArrowUpRight, FiPlay } from 'react-icons/fi';
import { useContext } from 'react';
import Reveal from '../../components/Reveal';
import { MusicContext } from './musicContext';
import { musicCopy } from './musicCopy';
import { radioIdentity, trackArtwork } from './musicLibrary';

export default function MusicLibrary() {
  const music = useContext(MusicContext);
  const t = musicCopy[music.language];

  return (
    <section className="listening-section" aria-labelledby="listening-title">
      <Reveal className="listening-heading">
        <div><span className="blog-eyebrow">{t.listeningLabel}</span><h2 id="listening-title">{t.listeningStart}<br /><em>{t.listeningEnd}</em></h2></div>
        <div className="listening-note"><span aria-hidden="true">↳</span><p>{t.listeningIntro}</p><small>{String(music.tracks.length).padStart(2, '0')} {t.tracks} · {radioIdentity.shortName}</small></div>
      </Reveal>
      <div className="listening-tracks">
        {music.tracks.map((track, index) => (
          <Reveal key={track.id} delay={index * 80} className="listening-track-wrap">
            <article className="listening-track">
              <button className="listening-art" onClick={() => music.selectTrack(track.id)} aria-label={`${t.playTrack}: ${track.title} — ${track.artist}`}>
                <img src={trackArtwork(track)} alt="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
                <span><FiPlay /></span>
              </button>
              <div className="listening-track-copy"><span>{String(index + 1).padStart(2, '0')} / {t.track}</span><h3>{track.title}</h3><p>{track.artist}</p></div>
              <button className="listening-play" onClick={() => music.selectTrack(track.id)}>{t.playTrack}<FiArrowUpRight /></button>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
