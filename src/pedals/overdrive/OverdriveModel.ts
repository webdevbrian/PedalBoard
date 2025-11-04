/**
 * Overdrive pedal model - creates distortion effect
 */

import { BoxModel } from '../BoxModel';

export class OverdriveModel extends BoxModel {
  private waveShaper: WaveShaperNode;
  private lowPass: BiquadFilterNode;
  private lowPassFreq: number = 3000;
  private driveAmount: number = 0;

  constructor(context: AudioContext) {
    super(context);
    
    // Create low-pass filter for tone control
    this.lowPass = this.context.createBiquadFilter();
    this.lowPass.type = 'lowpass';
    this.lowPass.frequency.value = this.lowPassFreq;
    
    // Create wave shaper for distortion
    this.waveShaper = this.context.createWaveShaper();
    this.waveShaper.oversample = '4x'; // Better quality
    
    // Set up effects chain: input -> waveshaper -> lowpass -> level -> output
    this.effects = [
      this.waveShaper,
      this.lowPass,
      this.level
    ];
    
    // Build initial chain for internal routing
    this.chain = [this.inputBuffer, ...this.effects, this.outputBuffer];
    
    // Set up initial routing
    this.routeInternal();

    // Initialize with no overdrive (will be set by pedal controls)
    this.createWSCurve(0);
  }

  /**
   * Creates wave shaper curve for distortion
   */
  private createWSCurve(amount: number): void {
    const k = amount;
    const nSamples = 22050;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < nSamples; i++) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    
    this.waveShaper.curve = curve;
  }

  /**
   * Sets the drive (distortion) level
   * @param value 0-10 range
   */
  setDrive(value: number): void {
    // Clamp and store
    this.driveAmount = Math.max(0, Math.min(10, value));
    
    // Create new curve with this amount
    this.createWSCurve(this.driveAmount * 10);
  }

  /**
   * Sets the tone (brightness) level
   * @param value 0-10 range
   */
  setTone(value: number): void {
    // Map 0-10 to 200Hz-5000Hz frequency range
    value = Math.max(0, Math.min(10, value));
    this.lowPass.frequency.value = 200 + (value * 480);
  }

  /**
   * Gets the current drive amount
   */
  getDrive(): number {
    return this.driveAmount;
  }

  /**
   * Gets the current tone frequency
   */
  getTone(): number {
    return this.lowPass.frequency.value;
  }

  /**
   * Routes internal connections for overdrive pedal
   */
  routeInternal(): void {
    // Disconnect everything first
    try {
      this.inputBuffer.disconnect();
      this.waveShaper.disconnect();
      this.lowPass.disconnect();
      this.level.disconnect();
      this.outputBuffer.disconnect();
    } catch (e) {
      // Some might not be connected
    }

    // Route: input -> waveshaper -> lowpass -> level -> output
    this.inputBuffer.connect(this.waveShaper);
    this.waveShaper.connect(this.lowPass);
    this.lowPass.connect(this.level);
    this.level.connect(this.outputBuffer);

    // Connect to next if exists
    if (this.next) {
      this.outputBuffer.connect(this.next);
    }
  }
}
