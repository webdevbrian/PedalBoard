/**
 * Toggle switch - stays in position until toggled again
 */

import { Switch } from './Switch';

export class ToggleSwitch extends Switch {
  /**
   * Toggles the switch state
   */
  toggle(): void {
    this.setState(!this.state);
  }

  /**
   * Returns false as this is not a momentary switch
   */
  isMomentary(): boolean {
    return false;
  }
}
