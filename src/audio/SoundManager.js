export class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.init();
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.enabled = localStorage.getItem('pairEmUpAudio') !== 'false';
    } catch {
      this.enabled = false;
    }
  }

  isEnabled() {
    return this.enabled && localStorage.getItem('pairEmUpAudio') !== 'false';
  }

  async ensureAudioContext() {
    if (!this.audioContext) {
      return;
    }
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch {
        return;
      }
    }
  }

  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.isEnabled() || !this.audioContext) {
      return;
    }

    this.ensureAudioContext().catch(() => {
      return;
    });

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playSelect() {
    this.playTone(440, 0.1, 'sine', 0.2);
  }

  playDeselect() {
    this.playTone(330, 0.08, 'sine', 0.15);
  }

  playValidPair() {
    const frequencies = [523.25, 659.25, 783.99];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'sine', 0.25);
      }, index * 100);
    });
  }

  playInvalidPair() {
    this.playTone(200, 0.3, 'sawtooth', 0.2);
  }

  playHelperUse() {
    this.playTone(600, 0.12, 'square', 0.2);
  }

  playGameStart() {
    const frequencies = [261.63, 329.63, 392.0, 523.25];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sine', 0.3);
      }, index * 120);
    });
  }

  playGameEnd() {
    const frequencies = [523.25, 392.0, 329.63, 261.63];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'sine', 0.3);
      }, index * 150);
    });
  }
}
