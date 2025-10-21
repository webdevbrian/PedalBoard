/**
 * Volume pedal model - simple gain control
 */

import { BoxModel } from '../BoxModel';

export class VolumeModel extends BoxModel {
  constructor(context: AudioContext) {
    super(context);
    
    // Volume pedal only has the level gain node
    // No additional effects needed
    this.effects = [this.level];
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
}
