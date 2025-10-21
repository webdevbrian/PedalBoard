/**
 * Momentary switch - only active while pressed
 */
import { Switch } from './Switch';
export class MomentarySwitch extends Switch {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "pressTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * Presses the switch (turns on)
     */
    press() {
        this.setState(true);
    }
    /**
     * Releases the switch (turns off)
     */
    release() {
        this.setState(false);
    }
    /**
     * Toggles momentarily (press and release after delay)
     */
    toggle() {
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
    isMomentary() {
        return true;
    }
    /**
     * Cleanup
     */
    dispose() {
        if (this.pressTimer) {
            clearTimeout(this.pressTimer);
        }
    }
}
