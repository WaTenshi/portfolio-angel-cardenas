import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { musicLibrary } from './musicLibrary';
import { loadYouTubeApi } from './youtubeApi';
import { MusicContext } from './musicContext';
import MusicDock from './MusicDock';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function MusicProvider({ language, motionEnabled, children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('idle');
  const [activated, setActivated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(72);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(null);
  const [playerHost, setPlayerHost] = useState(null);
  const playerRef = useRef(null);
  const readyRef = useRef(false);
  const desiredPlayingRef = useRef(false);
  const userStartedRef = useRef(false);
  const currentIndexRef = useRef(currentIndex);
  const shuffleRef = useRef(shuffle);
  const volumeRef = useRef(volume);
  const nextRef = useRef(null);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  const playIndex = useCallback((index) => {
    const normalized = (index + musicLibrary.length) % musicLibrary.length;
    const track = musicLibrary[normalized];
    currentIndexRef.current = normalized;
    desiredPlayingRef.current = true;
    userStartedRef.current = true;
    setCurrentIndex(normalized);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setQueueOpen(false);
    setActivated(true);
    setExpanded(true);
    setStatus(readyRef.current ? 'buffering' : 'loading');
    if (readyRef.current && playerRef.current) {
      playerRef.current.getIframe()?.setAttribute('title', `${track.title} — YouTube`);
      playerRef.current.loadVideoById(track.youtubeId);
    }
  }, []);

  const selectTrack = useCallback((id) => {
    const index = musicLibrary.findIndex((track) => track.id === id);
    if (index >= 0) playIndex(index);
  }, [playIndex]);

  const next = useCallback(() => {
    const current = currentIndexRef.current;
    let target = (current + 1) % musicLibrary.length;
    if (shuffleRef.current && musicLibrary.length > 1) {
      target = Math.floor(Math.random() * (musicLibrary.length - 1));
      if (target >= current) target += 1;
    }
    playIndex(target);
  }, [playIndex]);

  const previous = useCallback(() => playIndex(currentIndexRef.current - 1), [playIndex]);
  useEffect(() => { nextRef.current = next; }, [next]);

  const togglePlay = useCallback(() => {
    setExpanded(true);
    setActivated(true);
    setError(null);
    userStartedRef.current = true;
    if (!readyRef.current || !playerRef.current) {
      desiredPlayingRef.current = true;
      setStatus('loading');
      return;
    }
    if (playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
      desiredPlayingRef.current = false;
      playerRef.current.pauseVideo();
    } else {
      desiredPlayingRef.current = true;
      playerRef.current.playVideo();
    }
  }, []);

  const collapse = useCallback(() => {
    if (playerRef.current && isPlaying) playerRef.current.pauseVideo();
    desiredPlayingRef.current = false;
    setExpanded(false);
    setQueueOpen(false);
  }, [isPlaying]);

  const seek = useCallback((seconds) => {
    const value = clamp(Number(seconds) || 0, 0, duration || 0);
    setCurrentTime(value);
    playerRef.current?.seekTo(value, true);
  }, [duration]);

  const setVolume = useCallback((value) => {
    const nextVolume = clamp(Number(value) || 0, 0, 100);
    setVolumeState(nextVolume);
    playerRef.current?.setVolume(nextVolume);
    if (nextVolume > 0 && muted) {
      playerRef.current?.unMute();
      setMuted(false);
    }
  }, [muted]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (playerRef.current.isMuted()) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  }, []);

  useEffect(() => {
    if (!activated || !playerHost || playerRef.current) return undefined;
    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      const player = new YT.Player(playerHost, {
        width: 360,
        height: 203,
        videoId: musicLibrary[currentIndexRef.current].youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            readyRef.current = true;
            const track = musicLibrary[currentIndexRef.current];
            event.target.setVolume(volumeRef.current);
            event.target.getIframe()?.setAttribute('title', `${track.title} — YouTube`);
            setDuration(event.target.getDuration() || 0);
            setStatus('ready');
            if (event.target.getVideoData()?.video_id !== track.youtubeId) {
              if (desiredPlayingRef.current) event.target.loadVideoById(track.youtubeId);
              else event.target.cueVideoById(track.youtubeId);
            } else if (desiredPlayingRef.current) event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setStatus('playing');
              setError(null);
              setDuration(event.target.getDuration() || 0);
            } else if (event.data === YT.PlayerState.BUFFERING) {
              setStatus('buffering');
            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.CUED) {
              setIsPlaying(false);
              setStatus('paused');
            } else if (event.data === YT.PlayerState.ENDED) {
              setIsPlaying(false);
              if (userStartedRef.current) nextRef.current?.();
            }
          },
          onError: (event) => {
            desiredPlayingRef.current = false;
            setIsPlaying(false);
            setStatus('error');
            setError(event.data || 'unavailable');
          },
          onAutoplayBlocked: () => {
            desiredPlayingRef.current = false;
            setIsPlaying(false);
            setStatus('blocked');
            setError('blocked');
          },
        },
      });
      playerRef.current = player;
    }).catch(() => {
      if (!cancelled) {
        setStatus('error');
        setError('api');
      }
    });

    return () => {
      cancelled = true;
      readyRef.current = false;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [activated, playerHost]);

  useEffect(() => {
    if (!isPlaying || !readyRef.current) return undefined;
    const updateTime = () => {
      const player = playerRef.current;
      if (!player) return;
      setCurrentTime(player.getCurrentTime() || 0);
      const nextDuration = player.getDuration() || 0;
      if (nextDuration) setDuration(nextDuration);
    };
    updateTime();
    const interval = window.setInterval(updateTime, 500);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const value = useMemo(() => ({
    tracks: musicLibrary,
    currentTrack: musicLibrary[currentIndex],
    currentIndex,
    isPlaying,
    status,
    activated,
    expanded,
    queueOpen,
    shuffle,
    currentTime,
    duration,
    volume,
    muted,
    error,
    language,
    motionEnabled,
    open: () => setExpanded(true),
    collapse,
    togglePlay,
    selectTrack,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleQueue: () => setQueueOpen((value) => !value),
    toggleShuffle: () => setShuffle((value) => !value),
    setPlayerHost,
  }), [activated, collapse, currentIndex, currentTime, duration, error, expanded, isPlaying, language, motionEnabled, muted, next, previous, queueOpen, seek, selectTrack, setVolume, shuffle, status, toggleMute, togglePlay, volume]);

  return (
    <MusicContext.Provider value={value}>
      {children}
      <MusicDock
        tracks={musicLibrary} currentTrack={musicLibrary[currentIndex]} currentIndex={currentIndex} isPlaying={isPlaying}
        status={status} activated={activated} expanded={expanded} queueOpen={queueOpen} shuffle={shuffle}
        currentTime={currentTime} duration={duration} volume={volume} muted={muted} error={error}
        language={language} motionEnabled={motionEnabled} open={value.open} collapse={collapse} togglePlay={togglePlay}
        selectTrack={selectTrack} next={next} previous={previous} seek={seek} setVolume={setVolume} toggleMute={toggleMute}
        toggleQueue={value.toggleQueue} toggleShuffle={value.toggleShuffle} setPlayerHost={setPlayerHost}
      />
    </MusicContext.Provider>
  );
}
