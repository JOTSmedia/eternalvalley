export const Soundscape = {
  init: () => {},
  play: () => {},
  pause: () => {},
  setMode: () => {},
  setVolume: () => {},
  setSolfeggio: () => {},
  setBinaural: () => {},
  playBowlGong: () => {},
  playChime: () => {},
  playSolfeggioBell: () => {},
  playCandleShimmer: () => {},
  playHarmonicChord: () => {},
  mode: 'silent',
  volume: 0,
  solfeggio: '432',
  binaural: 'none',
  isPlaying: false,
  SOLFEGGIO: {
    '432': { name: '432Hz (Cosmic Tuning)', freq: 432 },
    '528': { name: '528Hz (DNA Repair)', freq: 528 },
    '963': { name: '963Hz (Divine Light)', freq: 963 }
  },
  BINAURAL: {
    'none': { name: 'None', freq: 0 },
    'delta': { name: 'Delta (Deep Sleep)', freq: 2 },
    'theta': { name: 'Theta (Meditation)', freq: 6 }
  }
};
window.Soundscape = Soundscape;
