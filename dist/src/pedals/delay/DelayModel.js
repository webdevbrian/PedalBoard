/**
 * Delay pedal model - creates echo/delay effect
 */
import { BoxModel } from '../BoxModel';
export class DelayModel extends BoxModel {
    constructor(context) {
        super(context);
        Object.defineProperty(this, "delay", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "feedback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "wetGain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dryGain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxDelayTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 2
        }); // 2 seconds max delay
        // Create delay node
        this.delay = this.context.createDelay(this.maxDelayTime);
        this.delay.delayTime.value = 0.3; // Default 300ms delay
        // Create feedback loop
        this.feedback = this.context.createGain();
        this.feedback.gain.value = 0.4; // Default 40% feedback
        // Create wet/dry mix
        this.wetGain = this.context.createGain();
        this.wetGain.gain.value = 0.5;
        this.dryGain = this.context.createGain();
        this.dryGain.gain.value = 1;
        // Connect feedback loop: delay -> feedback -> delay
        this.delay.connect(this.feedback);
        this.feedback.connect(this.delay);
        // Connect wet path: input -> delay -> wetGain -> level
        this.delay.connect(this.wetGain);
        // Both wet and dry connect to level
        this.wetGain.connect(this.level);
        this.dryGain.connect(this.level);
        // Effects array for routing
        this.effects = [this.dryGain, this.delay, this.level];
    }
    /**
     * Routes internal connections
     */
    routeInternal() {
        // Disconnect everything first
        try {
            this.inputBuffer.disconnect();
            this.dryGain.disconnect();
            this.delay.disconnect();
            this.wetGain.disconnect();
            this.level.disconnect();
            this.outputBuffer.disconnect();
        }
        catch (e) {
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
        // Set up bypass nodes
        this.nodes = [
            [this.dryGain, this.inputBuffer, this.outputBuffer],
            [this.outputBuffer, this.level, null]
        ];
    }
    /**
     * Sets the delay time in seconds
     * @param time Delay time in seconds (0 to maxDelayTime)
     */
    setDelayTime(time) {
        time = Math.max(0, Math.min(this.maxDelayTime, time));
        this.delay.delayTime.value = time;
    }
    /**
     * Sets the feedback amount (how much of the delayed signal feeds back)
     * @param amount 0-1 range (be careful with values close to 1)
     */
    setFeedback(amount) {
        amount = Math.max(0, Math.min(0.95, amount)); // Cap at 0.95 to prevent runaway feedback
        this.feedback.gain.value = amount;
    }
    /**
     * Sets the wet/dry mix
     * @param mix 0-1 range (0 = fully dry, 1 = fully wet)
     */
    setMix(mix) {
        mix = Math.max(0, Math.min(1, mix));
        this.wetGain.gain.value = mix;
        this.dryGain.gain.value = 1 - (mix * 0.5); // Keep some dry signal
    }
    /**
     * Gets the current delay time
     */
    getDelayTime() {
        return this.delay.delayTime.value;
    }
    /**
     * Gets the current feedback amount
     */
    getFeedback() {
        return this.feedback.gain.value;
    }
    /**
     * Gets the current mix
     */
    getMix() {
        return this.wetGain.gain.value;
    }
}
