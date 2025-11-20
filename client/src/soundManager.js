// Procedural sound generation using Web Audio API
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  correct() {
    if (!this.enabled) return;
    // Ascending arpeggio: E-G-B-E
    const notes = [329.63, 392.00, 493.88, 659.25];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.2), i * 80);
    });
  }

  wrong() {
    if (!this.enabled) return;
    // Descending glitch buzz
    this.playTone(200, 0.3, 'sawtooth', 0.25);
    setTimeout(() => this.playTone(150, 0.2, 'square', 0.2), 150);
  }

  transition() {
    if (!this.enabled) return;
    // Laser swoosh: high to low
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      400,
      this.audioContext.currentTime + 0.3
    );

    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.3
    );

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  celebrate() {
    if (!this.enabled) return;
    // Victory fanfare: 6 ascending notes
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.2), i * 100);
    });
  }

  beep() {
    if (!this.enabled) return;
    this.playTone(1000, 0.05, 'sine', 0.15);
  }

  hover() {
    if (!this.enabled) return;
    this.playTone(800, 0.03, 'sine', 0.1);
  }

  glitch() {
    if (!this.enabled) return;
    // Chaotic random tones
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const freq = 100 + Math.random() * 500;
        this.playTone(freq, 0.05, 'square', 0.15);
      }, i * 30);
    }
  }

  laser() {
    if (!this.enabled) return;
    // High-to-low sweep
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      600,
      this.audioContext.currentTime + 0.2
    );

    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.2
    );

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export default new SoundManager();
