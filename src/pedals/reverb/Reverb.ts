/**
 * Reverb pedal - adds reverb/room effect
 */

import { Box } from '../Box';
import { ReverbModel } from './ReverbModel';
import { LinearPot } from '../../controls/pots/LinearPot';

export class Reverb extends Box {
  declare protected model: ReverbModel;
  public readonly name = 'reverb';
  
  private roomSizePot!: LinearPot;
  private mixPot!: LinearPot;
  private brightnessPot!: LinearPot;

  constructor(context: AudioContext) {
    super(context, ReverbModel);
  }

  /**
   * Creates the pots for this pedal
   */
  protected createPots(): void {
    super.createPots();
    
    // Room size pot
    this.roomSizePot = new LinearPot(
      (value: number) => this.model.setRoomSize(value),
      'room',
      10,
      0,
      10
    );
    
    // Mix pot (dry/wet balance)
    this.mixPot = new LinearPot(
      (value: number) => this.model.setMix(value),
      'mix',
      1,
      0,
      1
    );
    
    // Brightness pot
    this.brightnessPot = new LinearPot(
      (value: number) => this.model.setBrightness(value),
      'tone',
      10,
      0,
      10
    );
    
    // Add to pots array
    this.pots.push(this.roomSizePot, this.mixPot, this.brightnessPot);
    
    // Set default values
    this.roomSizePot.setActualValue(5); // Medium room
    this.mixPot.setActualValue(0.3); // 30% mix
    this.brightnessPot.setActualValue(5); // Medium brightness
  }

  /**
   * Sets the room size
   */
  setRoomSize(value: number): void {
    this.roomSizePot.setActualValue(value);
  }

  /**
   * Sets the mix (overrides setLevel for compatibility)
   */
  setLevel(value: number): void {
    // Map 0-10 to 0-1 for mix
    this.mixPot.setActualValue(value / 10);
  }

  /**
   * Sets the brightness
   */
  setBrightness(value: number): void {
    this.brightnessPot.setActualValue(value);
  }

  /**
   * Loads a custom impulse response
   */
  async loadImpulse(url: string): Promise<void> {
    await this.model.loadImpulse(url);
  }
}
