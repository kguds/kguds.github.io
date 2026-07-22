class SoundManager {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.masterGain = null;
    this.isMuted = false;
  }

  // Initialize Web Audio Context after first user click/tap
  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
  }

  // Load and decode an audio file
  async loadSound(key, src) {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    
    // We can decode asynchronously even before context is unlocked
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const tempCtx = this.ctx || new AudioCtx();
    this.buffers[key] = await tempCtx.decodeAudioData(arrayBuffer);
  }

  // Play a sound by key
  play(key, { loop = false, volume = 1.0 } = {}) {
    if (!this.ctx) return; // Wait until init() is called by user action

    // Resume context if suspended (browser power saving / safety policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const buffer = this.buffers[key];
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    const gainNode = this.ctx.createGain();

    source.buffer = buffer;
    source.loop = loop;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(0);
    return source; // Returns source if you need manual stop() control
  }

  setMasterVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, value));
    }
  }
}

export const sounds = new SoundManager();