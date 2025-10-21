/**
 * Linear potentiometer - maps input linearly to output
 */
import { Pot } from './Pot';
export declare class LinearPot extends Pot {
    /**
     * Maps normalized value (0-1) to actual range using linear mapping
     */
    protected mapValue(normalizedValue: number): number;
}
//# sourceMappingURL=LinearPot.d.ts.map