/**
 * Base pedal component model
 * Modern TypeScript implementation
 */
import { ConnectableModel } from '../core/ConnectableModel';
export class BoxModel extends ConnectableModel {
    constructor(context) {
        super(context);
        Object.defineProperty(this, "level", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        // Create the level (volume) control
        this.level = this.context.createGain();
        this.level.gain.value = 1;
        // Add level to effects chain
        this.effects.push(this.level);
    }
    /**
     * Sets the level of the effect
     */
    setLevel(newLevel) {
        // Clamp between 0 and 10, then normalize to 0-1
        newLevel = Math.min(Math.max(newLevel, 0), 10);
        this.level.gain.value = newLevel / 10;
    }
    /**
     * Routes the internal effects chain and sets up bypass nodes
     */
    routeInternal() {
        super.routeInternal();
        // Set up nodes for bypass switching
        // When bypassed: input -> output (skip effects)
        // When active: input -> effects[0] -> ... -> output
        if (this.effects.length > 0) {
            this.nodes = [
                [this.effects[0], this.inputBuffer, this.outputBuffer],
                [this.outputBuffer, this.effects[this.effects.length - 1], null]
            ];
        }
    }
    /**
     * Enables the effect (removes bypass)
     */
    enable() {
        this.routeInternal();
    }
    /**
     * Bypasses the effect
     */
    bypass() {
        try {
            // Disconnect effects and connect input directly to output
            this.inputBuffer.disconnect();
            this.effects.forEach(effect => {
                try {
                    effect.disconnect();
                }
                catch (e) {
                    // Already disconnected
                }
            });
            this.inputBuffer.connect(this.outputBuffer);
            if (this.next) {
                this.outputBuffer.connect(this.next);
            }
        }
        catch (e) {
            console.error('Error bypassing effect:', e);
        }
    }
}
