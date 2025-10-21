/**
 * Base Pot (potentiometer) class
 * Modern TypeScript implementation
 */
import { EventEmitter } from '../../utils/EventEmitter';
export class Pot extends EventEmitter {
    constructor(handlerOrParam, name, multiplier = 1, min = 0, max) {
        super();
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "min", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "max", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "step", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "handler", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "audioParam", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = name;
        this.min = min;
        this.max = max ?? min + multiplier;
        this.step = (this.max - this.min) / 100; // 100 steps by default
        // Check if handler is an AudioParam or a function
        if (handlerOrParam instanceof AudioParam) {
            this.audioParam = handlerOrParam;
            this.handler = (value) => {
                this.audioParam.value = value;
            };
        }
        else {
            this.handler = handlerOrParam;
        }
    }
    /**
     * Sets the value of the pot (0-1 range, will be mapped to min-max)
     */
    setValue(normalizedValue) {
        // Clamp between 0 and 1
        normalizedValue = Math.max(0, Math.min(1, normalizedValue));
        // Map to actual range
        const oldValue = this.value;
        this.value = this.mapValue(normalizedValue);
        // Call handler if provided
        if (this.handler) {
            this.handler(this.value);
        }
        // Emit change event
        this.emit('change', {
            value: this.value,
            normalizedValue,
            oldValue
        });
    }
    /**
     * Sets the actual value (not normalized)
     */
    setActualValue(value) {
        // Clamp to range
        value = Math.max(this.min, Math.min(this.max, value));
        // Calculate normalized value
        const normalizedValue = (value - this.min) / (this.max - this.min);
        this.setValue(normalizedValue);
    }
    /**
     * Gets the current value
     */
    getValue() {
        return this.value;
    }
    /**
     * Gets the normalized value (0-1)
     */
    getNormalizedValue() {
        return (this.value - this.min) / (this.max - this.min);
    }
    /**
     * Gets the pot configuration
     */
    getConfig() {
        return {
            value: this.value,
            min: this.min,
            max: this.max,
            step: this.step
        };
    }
    /**
     * Gets the pot name
     */
    getName() {
        return this.name;
    }
}
