/**
 * Procedural Sound Manager
 * Generates sounds using Web Audio API (no external files)
 */

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.isMuted = false;
    this.masterGain = null;
  }

  /**
   * Initialize audio context
   */
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // Master volume
    }
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
    return this.isMuted;
  }

  /**
   * Play a tone at specified frequency
   */
  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (this.isMuted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Play correct answer sound
   * Ascending arpeggio (E-G-B-E)
   */
  correct() {
    this.init();
    const notes = [329.63, 392.00, 493.88, 659.25]; // E4, G4, B4, E5
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'sine', 0.2);
      }, index * 100);
    });
  }

  /**
   * Play wrong answer sound
   * Descending glitch buzz
   */
  wrong() {
    this.init();
    const startFreq = 200;
    const endFreq = 100;
    
    if (this.isMuted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Play stage transition sound
   * Laser swoosh (1200→400 Hz)
   */
  transition() {
    this.init();
    if (this.isMuted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.25);
    
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.25);
  }

  /**
   * Play completion celebration sound
   * Victory fanfare (6 notes)
   */
  celebrate() {
    this.init();
    const melody = [
      { freq: 523.25, duration: 0.2 }, // C5
      { freq: 659.25, duration: 0.2 }, // E5
      { freq: 783.99, duration: 0.2 }, // G5
      { freq: 1046.50, duration: 0.3 }, // C6
      { freq: 783.99, duration: 0.15 }, // G5
      { freq: 1046.50, duration: 0.4 }  // C6
    ];

    let time = 0;
    melody.forEach(note => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration, 'sine', 0.25);
      }, time);
      time += note.duration * 1000;
    });
  }

  /**
   * Play button click sound
   * Short beep (1000 Hz)
   */
  beep() {
    this.init();
    this.playTone(1000, 0.05, 'sine', 0.15);
  }

  /**
   * Play hover sound
   * Soft blip (800 Hz)
   */
  hover() {
    this.init();
    this.playTone(800, 0.03, 'sine', 0.08);
  }

  /**
   * Play glitch error sound
   * Chaotic random tones
   */
  glitch() {
    this.init();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const freq = 100 + Math.random() * 500;
        this.playTone(freq, 0.05, 'square', 0.1);
      }, i * 30);
    }
  }

  /**
   * Play laser sound
   * High-to-low sweep (2000→600 Hz)
   */
  laser() {
    this.init();
    if (this.isMuted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
