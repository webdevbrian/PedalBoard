/**
 * Base Pot (potentiometer) class
 * Modern TypeScript implementation
 */
import { EventEmitter } from '../../utils/EventEmitter';
import { IPotValue } from '../../types';
export declare abstract class Pot extends EventEmitter {
    protected value: number;
    protected min: number;
    protected max: number;
    protected step: number;
    protected name: string;
    protected handler?: (value: number) => void;
    protected audioParam?: AudioParam;
    constructor(handlerOrParam: ((value: number) => void) | AudioParam, name: string, multiplier?: number, min?: number, max?: number);
    /**
     * Sets the value of the pot (0-1 range, will be mapped to min-max)
     */
    setValue(normalizedValue: number): void;
    /**
     * Sets the actual value (not normalized)
     */
    setActualValue(value: number): void;
    /**
     * Maps normalized value (0-1) to actual range
     * Override in subclasses for different curves
     */
    protected abstract mapValue(normalizedValue: number): number;
    /**
     * Gets the current value
     */
    getValue(): number;
    /**
     * Gets the normalized value (0-1)
     */
    getNormalizedValue(): number;
    /**
     * Gets the pot configuration
     */
    getConfig(): IPotValue;
    /**
     * Gets the pot name
     */
    getName(): string;
}
//# sourceMappingURL=Pot.d.ts.map