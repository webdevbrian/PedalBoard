import { Pot } from './Pot';
import { IPotValue } from '../../types';

export class SelectorPot extends Pot {
  private options: string[];

  constructor(
    handler: (index: number) => void,
    name: string,
    options: string[]
  ) {
    super(handler, name, options.length - 1, 0, options.length - 1);
    this.options = options;
    this.step = 1;
  }

  protected mapValue(normalizedValue: number): number {
    const raw = this.min + (normalizedValue * (this.max - this.min));
    const snapped = Math.round(raw);
    return Math.max(this.min, Math.min(this.max, snapped));
  }

  getConfig(): IPotValue {
    return {
      value: this.value,
      min: this.min,
      max: this.max,
      step: this.step,
      options: this.options
    };
  }
}
