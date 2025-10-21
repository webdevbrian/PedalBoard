/**
 * Overdrive pedal - adds distortion/overdrive effect
 */

import { Box } from '../Box';
import { OverdriveModel } from './OverdriveModel';
import { LogPot } from '../../controls/pots/LogPot';

export class Overdrive extends Box {
  protected model: OverdriveModel;
  public readonly name = 'overdrive';
  
  private drivePot!: LogPot;
  private tonePot!: LogPot;

  constructor(context: AudioContext) {
    super(context, OverdriveModel);
    this.model = this.model as OverdriveModel;
  }

  /**
   * Creates the pots for this pedal
   */
  protected createPots(): void {
    super.createPots();
    
    // Drive pot (distortion amount)
    this.drivePot = new LogPot(
      (value: number) => this.model.setDrive(value),
      'drive',
      10,
      0,
      10
    );
    
    // Tone pot (brightness)
    this.tonePot = new LogPot(
      (value: number) => this.model.setTone(value),
      'tone',
      10,
      0,
      10
    );
    
    // Add to pots array
    this.pots.push(this.drivePot, this.tonePot);
    
    // Set default values
    this.drivePot.setActualValue(2);
    this.tonePot.setActualValue(5);
  }

  /**
   * Sets the drive amount
   */
  setDrive(value: number): void {
    this.drivePot.setActualValue(value);
  }

  /**
   * Gets the drive amount
   */
  getDrive(): number {
    return this.drivePot.getValue();
  }

  /**
   * Sets the tone
   */
  setTone(value: number): void {
    this.tonePot.setActualValue(value);
  }

  /**
   * Gets the tone
   */
  getTone(): number {
    return this.tonePot.getValue();
  }
}
