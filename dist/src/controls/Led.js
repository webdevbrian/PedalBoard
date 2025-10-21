/**
 * LED indicator that follows a switch state
 */
import { EventEmitter } from '../utils/EventEmitter';
export class Led extends EventEmitter {
    constructor(switchControl) {
        super();
        Object.defineProperty(this, "switch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.switch = switchControl;
        // Follow switch state
        this.switch.on('change', (state) => {
            this.setState(state);
        });
        // Set initial state
        this.setState(this.switch.getState());
    }
    /**
     * Sets the LED state
     */
    setState(state) {
        if (this.state !== state) {
            this.state = state;
            this.emit('change', state);
        }
    }
    /**
     * Gets the LED state
     */
    getState() {
        return this.state;
    }
    /**
     * Checks if LED is on
     */
    isOn() {
        return this.state;
    }
    /**
     * Checks if LED is off
     */
    isOff() {
        return !this.state;
    }
}
