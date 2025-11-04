/**
 * Overdrive pedal - adds distortion/overdrive effect
 */

import { Box } from '../Box';
import { OverdriveModel } from './OverdriveModel';
import { LogPot } from '../../controls/pots/LogPot';

export class Overdrive extends Box {
  declare protected model: OverdriveModel;
  public readonly name = 'overdrive';

  constructor(context: AudioContext) {
    super(context, OverdriveModel);
  }

  /**
   * Creates the pots for this pedal
   */
  protected createPots(): void {
    super.createPots();

    // Drive pot (distortion amount, default moderate drive) - pots[1]
    const drivePot = new LogPot(
      (value: number) => this.model.setDrive(value),
      'drive',
      10,
      0,
      10,
      4 // default moderate drive
    );

    // Tone pot (brightness, default bright) - pots[2]
    const tonePot = new LogPot(
      (value: number) => this.model.setTone(value),
      'tone',
      10,
      0,
      10,
      7 // default bright tone
    );

    // Add to pots array (volumePot is pots[0])
    this.pots.push(drivePot, tonePot);
  }

  /**
   * Sets the drive amount
   */
  setDrive(value: number): void {
    const drivePot = this.pots[1] as LogPot;
    if (!drivePot) {
      console.error('Drive pot not initialized');
      return;
    }
    drivePot.setActualValue(value);
  }

  /**
   * Gets the drive amount
   */
  getDrive(): number {
    return (this.pots[1] as LogPot).getValue();
  }

  /**
   * Sets the tone
   */
  setTone(value: number): void {
    (this.pots[2] as LogPot).setActualValue(value);
  }

  /**
   * Gets the tone
   */
  getTone(): number {
    return (this.pots[2] as LogPot).getValue();
  }
}
