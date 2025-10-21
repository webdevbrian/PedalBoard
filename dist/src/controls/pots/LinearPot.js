/**
 * Linear potentiometer - maps input linearly to output
 */
import { Pot } from './Pot';
export class LinearPot extends Pot {
    /**
     * Maps normalized value (0-1) to actual range using linear mapping
     */
    mapValue(normalizedValue) {
        return this.min + (normalizedValue * (this.max - this.min));
    }
}
