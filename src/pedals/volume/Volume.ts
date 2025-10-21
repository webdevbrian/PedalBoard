/**
 * Volume pedal - simple volume control
 */

import { Box } from '../Box';
import { VolumeModel } from './VolumeModel';

export class Volume extends Box {
  declare protected model: VolumeModel;
  public readonly name = 'volume';

  constructor(context: AudioContext) {
    super(context, VolumeModel);
  }

  /**
   * Creates the pots for this pedal
   */
  protected createPots(): void {
    // Volume pedal only has the main volume pot
    super.createPots();
    
    // Set default to full volume
    this.volumePot.setActualValue(10);
  }

  /**
   * Sets the volume
   */
  setVolume(value: number): void {
    this.volumePot.setActualValue(value);
  }

  /**
   * Gets the volume
   */
  getVolume(): number {
    return this.volumePot.getValue();
  }
}
