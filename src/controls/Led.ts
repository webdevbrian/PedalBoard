/**
 * LED indicator that follows a switch state
 */

import { EventEmitter } from '../utils/EventEmitter';
import { Switch } from './switches/Switch';

export class Led extends EventEmitter {
  private switch: Switch;
  private state: boolean = false;

  constructor(switchControl: Switch) {
    super();
    this.switch = switchControl;
    
    // Follow switch state
    this.switch.on('change', (state: boolean) => {
      this.setState(state);
    });
    
    // Set initial state
    this.setState(this.switch.getState());
  }

  /**
   * Sets the LED state
   */
  setState(state: boolean): void {
    if (this.state !== state) {
      this.state = state;
      this.emit('change', state);
    }
  }

  /**
   * Gets the LED state
   */
  getState(): boolean {
    return this.state;
  }

  /**
   * Checks if LED is on
   */
  isOn(): boolean {
    return this.state;
  }

  /**
   * Checks if LED is off
   */
  isOff(): boolean {
    return !this.state;
  }
}
