/**
 * Base Pot (potentiometer) class
 * Modern TypeScript implementation
 */

import { EventEmitter } from '../../utils/EventEmitter';
import { IPotValue } from '../../types';

export abstract class Pot extends EventEmitter {
  protected value: number = 0;
  protected min: number;
  protected max: number;
  protected step: number;
  protected name: string;
  protected handler?: (value: number) => void;
  protected audioParam?: AudioParam;

  constructor(
    handlerOrParam: ((value: number) => void) | AudioParam,
    name: string,
    multiplier: number = 1,
    min: number = 0,
    max?: number
  ) {
    super();
    this.name = name;
    this.min = min;
    this.max = max ?? min + multiplier;
    this.step = (this.max - this.min) / 100; // 100 steps by default
    
    // Check if handler is an AudioParam or a function
    if (handlerOrParam instanceof AudioParam) {
      this.audioParam = handlerOrParam;
      this.handler = (value: number) => {
        this.audioParam!.value = value;
      };
    } else {
      this.handler = handlerOrParam;
    }
  }

  /**
   * Sets the value of the pot (0-1 range, will be mapped to min-max)
   */
  setValue(normalizedValue: number): void {
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
  setActualValue(value: number): void {
    // Clamp to range
    value = Math.max(this.min, Math.min(this.max, value));
    
    // Calculate normalized value
    const normalizedValue = (value - this.min) / (this.max - this.min);
    this.setValue(normalizedValue);
  }

  /**
   * Maps normalized value (0-1) to actual range
   * Override in subclasses for different curves
   */
  protected abstract mapValue(normalizedValue: number): number;

  /**
   * Gets the current value
   */
  getValue(): number {
    return this.value;
  }

  /**
   * Gets the normalized value (0-1)
   */
  getNormalizedValue(): number {
    return (this.value - this.min) / (this.max - this.min);
  }

  /**
   * Gets the pot configuration
   */
  getConfig(): IPotValue {
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
  getName(): string {
    return this.name;
  }
}
