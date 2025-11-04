/**
 * Reverb pedal - adds reverb/room effect
 */

import { Box } from '../Box';
import { ReverbModel } from './ReverbModel';
import { LinearPot } from '../../controls/pots/LinearPot';

export class Reverb extends Box {
  declare protected model: ReverbModel;
  public readonly name = 'reverb';

  constructor(context: AudioContext) {
    super(context, ReverbModel);
  }

  /**
   * Creates the pots for this pedal
   */
  protected createPots(): void {
    super.createPots();

    // Room size pot (default medium room) - pots[1]
    const roomSizePot = new LinearPot(
      (value: number) => this.model.setRoomSize(value),
      'room',
      10,
      0,
      10,
      5 // default medium room
    );

    // Mix pot (dry/wet balance, default 30%) - pots[2]
    const mixPot = new LinearPot(
      (value: number) => this.model.setMix(value),
      'mix',
      1,
      0,
      1,
      0.3 // default 30% mix
    );

    // Brightness pot (default medium brightness) - pots[3]
    const brightnessPot = new LinearPot(
      (value: number) => this.model.setBrightness(value),
      'tone',
      10,
      0,
      10,
      5 // default medium brightness
    );

    // Add to pots array (volumePot is pots[0])
    this.pots.push(roomSizePot, mixPot, brightnessPot);
  }

  /**
   * Sets the room size
   */
  setRoomSize(value: number): void {
    (this.pots[1] as LinearPot).setActualValue(value);
  }

  /**
   * Sets the mix (overrides setLevel for compatibility)
   */
  setLevel(value: number): void {
    // Map 0-10 to 0-1 for mix
    (this.pots[2] as LinearPot).setActualValue(value / 10);
  }

  /**
   * Sets the brightness
   */
  setBrightness(value: number): void {
    (this.pots[3] as LinearPot).setActualValue(value);
  }

  /**
   * Loads a custom impulse response
   */
  async loadImpulse(url: string): Promise<void> {
    await this.model.loadImpulse(url);
  }
}
