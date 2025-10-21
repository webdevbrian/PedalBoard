/**
 * Momentary switch - only active while pressed
 */

import { Switch } from './Switch';

export class MomentarySwitch extends Switch {
  private pressTimer?: NodeJS.Timeout;

  /**
   * Presses the switch (turns on)
   */
  press(): void {
    this.setState(true);
  }

  /**
   * Releases the switch (turns off)
   */
  release(): void {
    this.setState(false);
  }

  /**
   * Toggles momentarily (press and release after delay)
   */
  toggle(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }
    
    this.press();
    
    // Auto-release after 100ms if not manually released
    this.pressTimer = setTimeout(() => {
      this.release();
    }, 100);
  }

  /**
   * Returns true as this is a momentary switch
   */
  isMomentary(): boolean {
    return true;
  }

  /**
   * Cleanup
   */
  dispose(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
    }
  }
}
