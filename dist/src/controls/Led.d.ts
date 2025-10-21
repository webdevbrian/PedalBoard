/**
 * LED indicator that follows a switch state
 */
import { EventEmitter } from '../utils/EventEmitter';
import { Switch } from './switches/Switch';
export declare class Led extends EventEmitter {
    private switch;
    private state;
    constructor(switchControl: Switch);
    /**
     * Sets the LED state
     */
    setState(state: boolean): void;
    /**
     * Gets the LED state
     */
    getState(): boolean;
    /**
     * Checks if LED is on
     */
    isOn(): boolean;
    /**
     * Checks if LED is off
     */
    isOff(): boolean;
}
//# sourceMappingURL=Led.d.ts.map