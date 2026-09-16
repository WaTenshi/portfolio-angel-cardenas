export const radioIdentity = {
  name: "ANGEL'S RADIO",
  shortName: 'AC RADIO',
  edition: 'AC RADIO / 2026',
};

export const musicLibrary = Object.freeze([
  {
    id: 'jane',
    title: 'Jane!',
    artist: 'The Long Faces',
    youtubeId: 'HydkjjDNTmY',
  },
  {
    id: 'chase',
    title: 'chase',
    artist: 'batta',
    youtubeId: 'eiHqkDoFFFU',
  },
  {
    id: 'una-eternidad',
    title: 'Una Eternidad',
    artist: 'Aerstame ft. Bubaseta',
    youtubeId: '2NyNUX26ua0',
  },
  {
    id: 'huke',
    title: 'Huke',
    artist: 'Julius Popper',
    youtubeId: 'rBB8YOkPdBQ',
  },
  {
    id: 'la-innombrable',
    title: 'La Innombrable',
    artist: 'Julius Popper',
    youtubeId: 'u5CnYvdkCRM',
  },
  {
    id: 'sariyuku-kimi',
    title: '去り行く君 (Sariyuku Kimi)',
    artist: 'Tata Barahona',
    youtubeId: 'q1IXF-kzGLk',
  },
  {
    id: 'te-vas-de-mi',
    title: 'Te Vas De Mí',
    artist: 'Tata Barahona',
    youtubeId: 'vChLBxmu7Ts',
  },
  {
    id: 'boombarrio',
    title: 'BOOMBARRIO',
    artist: 'Chystemc',
    youtubeId: '9XRNPW9Bljg',
  },
]);

export function trackArtwork(track) {
  if (track.cover) {
    if (/^(https?:\/\/|data:|\/)/.test(track.cover)) return track.cover;
    return `${import.meta.env.BASE_URL}${track.cover.replace(/^\.\//, '')}`;
  }
  return `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`;
}
