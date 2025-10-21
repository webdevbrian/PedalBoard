/**
 * Volume pedal model - simple gain control
 */

import { BoxModel } from '../BoxModel';

export class VolumeModel extends BoxModel {
  constructor(context: AudioContext) {
    super(context);
    
    // Volume only has the level control from BoxModel
    // No additional effects needed
    this.effects = [this.level];
    
    // Build initial chain for internal routing
    this.chain = [this.inputBuffer, ...this.effects, this.outputBuffer];
    
    // Set up initial routing
    this.routeInternal();
  }

  /**
   * Sets the volume (0-10 range)
   */
  setVolume(value: number): void {
    this.setLevel(value);
  }

  /**
   * Gets the current volume
   */
  getVolume(): number {
    return this.level.gain.value * 10;
  }

  /**
   * Routes internal connections for volume pedal
   */
  routeInternal(): void {
    // Disconnect everything first
    try {
      this.inputBuffer.disconnect();
      this.level.disconnect();
      this.outputBuffer.disconnect();
    } catch (e) {
      // Some might not be connected
    }

    // Simple routing: input -> level -> output
    this.inputBuffer.connect(this.level);
    this.level.connect(this.outputBuffer);

    // Connect to next if exists
    if (this.next) {
      this.outputBuffer.connect(this.next);
    }
  }
}
