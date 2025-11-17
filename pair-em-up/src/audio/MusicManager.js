export class MusicManager {
  constructor() {
    this.audio = null;
    this.isEnabled = true;
    this.isPlaying = false;
    this.loadSettings();
  }

  loadSettings() {
    const savedState = localStorage.getItem('pairEmUpMusic');
    this.isEnabled = savedState !== 'false';
  }

  init() {
    if (this.audio) {
      return;
    }

    this.audio = new Audio(new URL('./ATC - Around The World.mp3', import.meta.url));
    this.audio.loop = true;
    this.audio.volume = 0.3;
  }

  play() {
    if (!this.isEnabled || this.isPlaying) {
      return;
    }

    if (!this.audio) {
      this.init();
    }

    this.audio.play().catch(() => {});
    this.isPlaying = true;
  }

  stop() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('pairEmUpMusic', String(enabled));

    if (!enabled) {
      this.stop();
    } else if (!this.isPlaying) {
      this.play();
    }
  }

  toggle() {
    this.setEnabled(!this.isEnabled);
    return this.isEnabled;
  }
}
