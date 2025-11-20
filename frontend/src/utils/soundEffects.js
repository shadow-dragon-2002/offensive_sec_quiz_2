/**
 * Sound Effects Utility for Cyberpunk Escape Room
 * Provides synthwave sound effects using Web Audio API
 */

class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.3;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
      this.enabled = false;
    }
  }

  // Resume audio context on user interaction (required by browsers)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Play a synthesized beep sound
  playBeep(frequency = 440, duration = 0.1, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Cyberpunk UI hover sound
  hover() {
    this.playBeep(800, 0.05, 'sine');
  }

  // Button click sound - laser swoosh
  click() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Correct answer sound - success chime
  correct() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playBeep(freq, 0.15, 'sine');
      }, index * 80);
    });
  }

  // Wrong answer sound - error buzz
  incorrect() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(this.volume * 0.6, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // Glitch sound effect
  glitch() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'square';
    const baseFreq = 200;
    
    for (let i = 0; i < 5; i++) {
      const time = this.audioContext.currentTime + (i * 0.02);
      const freq = baseFreq + (Math.random() * 400);
      oscillator.frequency.setValueAtTime(freq, time);
    }

    gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Timer warning sound
  timerWarning() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    this.playBeep(1000, 0.1, 'sine');
    setTimeout(() => this.playBeep(1000, 0.1, 'sine'), 150);
  }

  // Digital hum ambient sound
  playAmbientHum() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = 60; // Low hum
    
    gainNode.gain.setValueAtTime(this.volume * 0.05, this.audioContext.currentTime);

    oscillator.start(this.audioContext.currentTime);
    
    return {
      stop: () => {
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        oscillator.stop(this.audioContext.currentTime + 0.5);
      }
    };
  }

  // Level complete sound
  levelComplete() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const frequencies = [440, 554.37, 659.25, 880]; // A, C#, E, A
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playBeep(freq, 0.2, 'sine');
      }, index * 100);
    });
  }

  // Game start sound
  gameStart() {
    if (!this.enabled || !this.audioContext) return;
    this.resume();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.5);

    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

// Create singleton instance
const soundEffects = new SoundEffects();

export default soundEffects;
