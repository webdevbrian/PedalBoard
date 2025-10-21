/**
 * Reverb pedal model - creates reverb/room effect using convolution
 */

import { BoxModel } from '../BoxModel';

export class ReverbModel extends BoxModel {
  private convolver: ConvolverNode;
  private wetGain: GainNode;
  private dryGain: GainNode;
  private impulseBuffer?: AudioBuffer;

  constructor(context: AudioContext) {
    super(context);
    
    // Create convolver for reverb
    this.convolver = this.context.createConvolver();
    
    // Create wet/dry mix
    this.wetGain = this.context.createGain();
    this.wetGain.gain.value = 0.3; // Default 30% wet
    
    this.dryGain = this.context.createGain();
    this.dryGain.gain.value = 0.7; // Default 70% dry
    
    // Generate default impulse response
    this.generateImpulse(2, 2, 0.5);
    
    // Connect wet path through convolver
    this.convolver.connect(this.wetGain);
    
    // Both paths connect to level
    this.wetGain.connect(this.level);
    this.dryGain.connect(this.level);
    
    // Effects array for routing
    this.effects = [this.dryGain, this.convolver, this.level];
  }

  /**
   * Generates an impulse response for the reverb
   * @param duration Duration of the reverb tail in seconds
   * @param decay Decay factor (how quickly it fades)
   * @param brightness High frequency content (0-1)
   */
  private generateImpulse(duration: number, decay: number, brightness: number): void {
    const length = this.context.sampleRate * duration;
    const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      
      for (let i = 0; i < length; i++) {
        // Generate white noise with exponential decay
        let sample = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        
        // Apply brightness filter (simple lowpass)
        if (brightness < 1 && i > 0) {
          sample = sample * brightness + channelData[i - 1] * (1 - brightness);
        }
        
        channelData[i] = sample;
      }
    }
    
    this.impulseBuffer = impulse;
    this.convolver.buffer = impulse;
  }

  /**
   * Routes internal connections
   */
  routeInternal(): void {
    // Disconnect everything first
    try {
      this.inputBuffer.disconnect();
      this.dryGain.disconnect();
      this.convolver.disconnect();
      this.wetGain.disconnect();
      this.level.disconnect();
      this.outputBuffer.disconnect();
    } catch (e) {
      // Some might not be connected
    }
    
    // Connect dry path
    this.inputBuffer.connect(this.dryGain);
    this.dryGain.connect(this.level);
    
    // Connect wet path
    this.inputBuffer.connect(this.convolver);
    this.convolver.connect(this.wetGain);
    this.wetGain.connect(this.level);
    
    // Connect output
    this.level.connect(this.outputBuffer);
    
    if (this.next) {
      this.outputBuffer.connect(this.next);
    }
    
    // Set up bypass nodes
    this.nodes = [
      [this.dryGain, this.inputBuffer, this.outputBuffer],
      [this.outputBuffer, this.level, null]
    ] as [AudioNode, AudioNode, AudioNode | null][];
  }

  /**
   * Sets the room size (generates new impulse)
   * @param size 0-10 range (maps to 0.5-4 seconds)
   */
  setRoomSize(size: number): void {
    size = Math.max(0, Math.min(10, size));
    const duration = 0.5 + (size / 10) * 3.5;
    const decay = 2 + (size / 10) * 2;
    this.generateImpulse(duration, decay, 0.5);
  }

  /**
   * Sets the wet/dry mix
   * @param mix 0-1 range (0 = fully dry, 1 = fully wet)
   */
  setMix(mix: number): void {
    mix = Math.max(0, Math.min(1, mix));
    this.wetGain.gain.value = mix;
    this.dryGain.gain.value = 1 - mix * 0.7; // Keep some dry signal
  }

  /**
   * Sets the brightness of the reverb
   * @param brightness 0-10 range
   */
  setBrightness(brightness: number): void {
    brightness = Math.max(0, Math.min(10, brightness));
    const duration = this.impulseBuffer ? this.impulseBuffer.duration : 2;
    const decay = 2;
    this.generateImpulse(duration, decay, brightness / 10);
  }

  /**
   * Loads a custom impulse response from URL
   */
  async loadImpulse(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.impulseBuffer = audioBuffer;
      this.convolver.buffer = audioBuffer;
    } catch (error) {
      console.error('Failed to load impulse response:', error);
      // Fall back to generated impulse
      this.generateImpulse(2, 2, 0.5);
    }
  }
}
