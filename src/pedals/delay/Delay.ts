/**
 * Delay pedal - adds echo/delay effect
 */

import { Box } from '../Box';
import { DelayModel } from './DelayModel';
import { LinearPot } from '../../controls/pots/LinearPot';

export class Delay extends Box {
  declare protected model: DelayModel;
  public readonly name = 'delay';

  constructor(context: AudioContext) {
    super(context, DelayModel);
  }

  /**
   * Creates the pots for this pedal
   */
  protected createPots(): void {
    super.createPots();

    // Delay time pot (0-2 seconds, default 300ms) - pots[1]
    const timePot = new LinearPot(
      (value: number) => this.model.setDelayTime(value),
      'time',
      2,
      0,
      2,
      0.3 // default 300ms
    );

    // Feedback pot (0-95% feedback, default 40%) - pots[2]
    const feedbackPot = new LinearPot(
      (value: number) => this.model.setFeedback(value),
      'feedback',
      0.95,
      0,
      0.95,
      0.4 // default 40%
    );

    // Mix pot (dry/wet balance, default 50%) - pots[3]
    const mixPot = new LinearPot(
      (value: number) => this.model.setMix(value),
      'mix',
      1,
      0,
      1,
      0.5 // default 50%
    );

    // Add to pots array (volumePot is pots[0])
    this.pots.push(timePot, feedbackPot, mixPot);
  }

  /**
   * Sets the delay time (0-10 maps to 0-2 seconds)
   */
  setDelayTimer(value: number): void {
    // Map 0-10 to 0-2 seconds
    value = (value / 10) * 2;
    (this.pots[1] as LinearPot).setActualValue(value);
  }

  /**
   * Sets the feedback gain (0-10 maps to 0-95%)
   */
  setFeedbackGain(value: number): void {
    // Map 0-10 to 0-0.95
    value = (value / 10) * 0.95;
    (this.pots[2] as LinearPot).setActualValue(value);
  }

  /**
   * Sets the mix (0-10 maps to 0-100%)
   */
  setMix(value: number): void {
    // Map 0-10 to 0-1
    value = value / 10;
    (this.pots[3] as LinearPot).setActualValue(value);
  }

  /**
   * Gets the delay time in seconds
   */
  getDelayTime(): number {
    return (this.pots[1] as LinearPot).getValue();
  }

  /**
   * Gets the feedback amount
   */
  getFeedback(): number {
    return (this.pots[2] as LinearPot).getValue();
  }

  /**
   * Gets the mix amount
   */
  getMix(): number {
    return (this.pots[3] as LinearPot).getValue();
  }
}
