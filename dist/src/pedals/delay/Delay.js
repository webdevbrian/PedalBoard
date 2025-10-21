/**
 * Delay pedal - adds echo/delay effect
 */
import { Box } from '../Box';
import { DelayModel } from './DelayModel';
import { LinearPot } from '../../controls/pots/LinearPot';
export class Delay extends Box {
    constructor(context) {
        super(context, DelayModel);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'delay'
        });
        Object.defineProperty(this, "timePot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "feedbackPot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mixPot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * Creates the pots for this pedal
     */
    createPots() {
        super.createPots();
        // Delay time pot (0-2 seconds)
        this.timePot = new LinearPot((value) => this.model.setDelayTime(value), 'time', 2, 0, 2);
        // Feedback pot (0-95% feedback)
        this.feedbackPot = new LinearPot((value) => this.model.setFeedback(value), 'feedback', 0.95, 0, 0.95);
        // Mix pot (dry/wet balance)
        this.mixPot = new LinearPot((value) => this.model.setMix(value), 'mix', 1, 0, 1);
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
    setDelayTimer(value) {
        // Map 0-10 to 0-2 seconds
        value = (value / 10) * 2;
        this.timePot.setActualValue(value);
    }
    /**
     * Sets the feedback gain (0-10 maps to 0-95%)
     */
    setFeedbackGain(value) {
        // Map 0-10 to 0-0.95
        value = (value / 10) * 0.95;
        this.feedbackPot.setActualValue(value);
    }
    /**
     * Sets the mix (0-10 maps to 0-100%)
     */
    setMix(value) {
        // Map 0-10 to 0-1
        value = value / 10;
        this.mixPot.setActualValue(value);
    }
    /**
     * Gets the delay time in seconds
     */
    getDelayTime() {
        return this.timePot.getValue();
    }
    /**
     * Gets the feedback amount
     */
    getFeedback() {
        return this.feedbackPot.getValue();
    }
    /**
     * Gets the mix amount
     */
    getMix() {
        return this.mixPot.getValue();
    }
}
