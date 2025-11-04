/**
 * Delay pedal model - creates echo/delay effect
 */

import { BoxModel } from '../BoxModel';

export class DelayModel extends BoxModel {
  private delay: DelayNode;
  private feedback: GainNode;
  private wetGain: GainNode;
  private dryGain: GainNode;
  private maxDelayTime: number = 2; // 2 seconds max delay

  constructor(context: AudioContext) {
    super(context);

    // Create delay node (default values set by pedal controls)
    this.delay = this.context.createDelay(this.maxDelayTime);

    // Create feedback loop
    this.feedback = this.context.createGain();

    // Create wet/dry mix
    this.wetGain = this.context.createGain();

    this.dryGain = this.context.createGain();
    
    // Connect feedback loop: delay -> feedback -> delay
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
    
    // Connect wet path: input -> delay -> wetGain -> level
    this.delay.connect(this.wetGain);
    
    // Both wet and dry connect to level
    this.wetGain.connect(this.level);
    this.dryGain.connect(this.level);
    
    // Effects array for routing (delay uses custom parallel routing)
    this.effects = [this.level]; // Only the final level control in the effects chain
    
    // Don't build a series chain - delay uses parallel wet/dry paths
    // The routeInternal() method handles the complex routing
    
    // Set up initial routing
    this.routeInternal();
  }

  /**
   * Routes internal connections
   */
  routeInternal(): void {
    
    // Disconnect everything first
    try {
      this.inputBuffer.disconnect();
      this.dryGain.disconnect();
      this.delay.disconnect();
      this.wetGain.disconnect();
      this.level.disconnect();
      this.outputBuffer.disconnect();
    } catch (e) {
      // Some might not be connected
    }
    
    // Connect dry path
    this.inputBuffer.connect(this.dryGain);
    this.dryGain.connect(this.level);
    
    // Connect wet path
    this.inputBuffer.connect(this.delay);
    this.delay.connect(this.wetGain);
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
    this.wetGain.connect(this.level);
    
    // Connect output
    this.level.connect(this.outputBuffer);
    
    if (this.next) {
      this.outputBuffer.connect(this.next);
    }
    
  }

  /**
   * Sets the delay time in seconds
   * @param time Delay time in seconds (0 to maxDelayTime)
   */
  setDelayTime(time: number): void {
    time = Math.max(0, Math.min(this.maxDelayTime, time));
    this.delay.delayTime.value = time;
  }

  /**
   * Sets the feedback amount (how much of the delayed signal feeds back)
   * @param amount 0-1 range (be careful with values close to 1)
   */
  setFeedback(amount: number): void {
    amount = Math.max(0, Math.min(0.95, amount)); // Cap at 0.95 to prevent runaway feedback
    this.feedback.gain.value = amount;
  }

  /**
   * Sets the wet/dry mix
   * @param mix 0-1 range (0 = fully dry, 1 = fully wet)
   */
  setMix(mix: number): void {
    mix = Math.max(0, Math.min(1, mix));
    this.wetGain.gain.value = mix;
    this.dryGain.gain.value = 1 - (mix * 0.5); // Keep some dry signal
  }

  /**
   * Gets the current delay time
   */
  getDelayTime(): number {
    return this.delay.delayTime.value;
  }

  /**
   * Gets the current feedback amount
   */
  getFeedback(): number {
    return this.feedback.gain.value;
  }

  /**
   * Gets the current mix
   */
  getMix(): number {
    return this.wetGain.gain.value;
  }
}
