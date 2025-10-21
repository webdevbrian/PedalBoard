/**
 * Logarithmic potentiometer - maps input logarithmically to output
 * Better for audio applications where human perception is logarithmic
 */
import { Pot } from './Pot';
export declare class LogPot extends Pot {
    /**
     * Maps normalized value (0-1) to actual range using logarithmic mapping
     */
    protected mapValue(normalizedValue: number): number;
}
//# sourceMappingURL=LogPot.d.ts.map