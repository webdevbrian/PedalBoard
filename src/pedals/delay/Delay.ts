/**
 * Delay pedal - adds echo/delay effect
 */

import { Box } from '../Box';
import { DelayModel } from './DelayModel';
import { LinearPot } from '../../controls/pots/LinearPot';

export class Delay extends Box {
  protected model: DelayModel;
  public readonly name = 'delay';
  
  private timePot!: LinearPot;
  private feedbackPot!: LinearPot;
  private mixPot!: LinearPot;

  constructor(context: AudioContext) {
    super(context, DelayModel);
    this.model = this.model as DelayModel;
  }

  /**
   * Creates the pots for this pedal
   */
  protected createPots(): void {
    super.createPots();
    
    // Delay time pot (0-2 seconds)
    this.timePot = new LinearPot(
      (value: number) => this.model.setDelayTime(value),
      'time',
      2,
      0,
      2
    );
    
    // Feedback pot (0-95% feedback)
    this.feedbackPot = new LinearPot(
      (value: number) => this.model.setFeedback(value),
      'feedback',
      0.95,
      0,
      0.95
    );
    
    // Mix pot (dry/wet balance)
    this.mixPot = new LinearPot(
      (value: number) => this.model.setMix(value),
      'mix',
      1,
      0,
      1
    );
    
    // Add to pots array
    this.pots.push(this.timePot, this.feedbackPot, this.mixPot);
    
    // Set default values
    this.timePot.setActualValue(0.3); // 300ms
    this.feedbackPot.setActualValue(0.4); // 40% feedback
    this.mixPot.setActualValue(0.5); // 50% mix
  }

  /**
   * Sets the delay time (0-10 maps to 0-2 seconds)
   */
  setDelayTimer(value: number): void {
    // Map 0-10 to 0-2 seconds
    value = (value / 10) * 2;
    this.timePot.setActualValue(value);
  }

  /**
   * Sets the feedback gain (0-10 maps to 0-95%)
   */
  setFeedbackGain(value: number): void {
    // Map 0-10 to 0-0.95
    value = (value / 10) * 0.95;
    this.feedbackPot.setActualValue(value);
  }

  /**
   * Sets the mix (0-10 maps to 0-100%)
   */
  setMix(value: number): void {
    // Map 0-10 to 0-1
    value = value / 10;
    this.mixPot.setActualValue(value);
  }

  /**
   * Gets the delay time in seconds
   */
  getDelayTime(): number {
    return this.timePot.getValue();
  }

  /**
   * Gets the feedback amount
   */
  getFeedback(): number {
    return this.feedbackPot.getValue();
  }

  /**
   * Gets the mix amount
   */
  getMix(): number {
    return this.mixPot.getValue();
  }
}
