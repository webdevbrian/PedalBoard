/**
 * Output class for audio destination (speakers)
 */

import { EventEmitter } from '../utils/EventEmitter';

export class Output extends EventEmitter {
  private context: AudioContext;
  private inputNode: GainNode;
  private masterVolume: GainNode;
  private compressor: DynamicsCompressorNode;
  private limiter: DynamicsCompressorNode;
  private analyser: AnalyserNode;

  constructor(context: AudioContext) {
    super();
    this.context = context;
    
    // Create nodes
    this.inputNode = this.context.createGain();
    this.masterVolume = this.context.createGain();
    
    // Create compressor for dynamics control
    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;
    
    // Create limiter to prevent clipping
    this.limiter = this.context.createDynamicsCompressor();
    this.limiter.threshold.value = -0.5;
    this.limiter.knee.value = 0;
    this.limiter.ratio.value = 20;
    this.limiter.attack.value = 0.001;
    this.limiter.release.value = 0.01;
    
    // Create analyser for visualization
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
    
    // Connect chain: input -> compressor -> limiter -> masterVolume -> analyser -> destination
    this.inputNode.connect(this.compressor);
    this.compressor.connect(this.limiter);
    this.limiter.connect(this.masterVolume);
    this.masterVolume.connect(this.analyser);
    this.analyser.connect(this.context.destination);
  }

  /**
   * Gets the input node for connections
   */
  getInput(): AudioNode {
    return this.inputNode;
  }

  /**
   * Sets the master volume (0-1)
   */
  setVolume(value: number): void {
    value = Math.max(0, Math.min(1, value));
    this.masterVolume.gain.value = value;
    this.emit('volumeChange', value);
  }

  /**
   * Gets the master volume
   */
  getVolume(): number {
    return this.masterVolume.gain.value;
  }

  /**
   * Mutes the output
   */
  mute(): void {
    this.masterVolume.gain.value = 0;
    this.emit('mute');
  }

  /**
   * Unmutes the output
   */
  unmute(): void {
    this.masterVolume.gain.value = 1;
    this.emit('unmute');
  }

  /**
   * Enables/disables the compressor
   */
  setCompressorEnabled(enabled: boolean): void {
    if (enabled) {
      // Reconnect with compressor
      try {
        this.inputNode.disconnect();
        this.inputNode.connect(this.compressor);
      } catch (e) {
        // Already connected
      }
    } else {
      // Bypass compressor
      try {
        this.inputNode.disconnect();
        this.inputNode.connect(this.limiter);
      } catch (e) {
        // Already connected
      }
    }
  }

  /**
   * Sets compressor parameters
   */
  setCompressorParams(params: {
    threshold?: number;
    knee?: number;
    ratio?: number;
    attack?: number;
    release?: number;
  }): void {
    if (params.threshold !== undefined) {
      this.compressor.threshold.value = params.threshold;
    }
    if (params.knee !== undefined) {
      this.compressor.knee.value = params.knee;
    }
    if (params.ratio !== undefined) {
      this.compressor.ratio.value = params.ratio;
    }
    if (params.attack !== undefined) {
      this.compressor.attack.value = params.attack;
    }
    if (params.release !== undefined) {
      this.compressor.release.value = params.release;
    }
  }

  /**
   * Gets the current output level (0-1)
   */
  getLevel(): number {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);
    
    let max = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const value = Math.abs(dataArray[i] - 128) / 128;
      if (value > max) {
        max = value;
      }
    }
    
    return max;
  }

  /**
   * Gets frequency data for visualization
   */
  getFrequencyData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * Gets waveform data for visualization
   */
  getWaveformData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  /**
   * Connects an additional output destination
   */
  connectDestination(destination: AudioNode): void {
    this.analyser.connect(destination);
  }

  /**
   * Disconnects from a destination
   */
  disconnectDestination(destination: AudioNode): void {
    try {
      this.analyser.disconnect(destination);
    } catch (e) {
      // Not connected
    }
  }

  /**
   * Disposes of the output
   */
  dispose(): void {
    try {
      this.inputNode.disconnect();
      this.compressor.disconnect();
      this.limiter.disconnect();
      this.masterVolume.disconnect();
      this.analyser.disconnect();
    } catch (e) {
      // Already disconnected
    }
    this.removeAllListeners();
  }
}
