/**
 * Logarithmic potentiometer - maps input logarithmically to output
 * Better for audio applications where human perception is logarithmic
 */
import { Pot } from './Pot';
export class LogPot extends Pot {
    /**
     * Maps normalized value (0-1) to actual range using logarithmic mapping
     */
    mapValue(normalizedValue) {
        // Avoid log(0) by adding small offset
        const minLog = Math.log10(0.001);
        const maxLog = Math.log10(1);
        // Map to logarithmic scale
        const logValue = minLog + (normalizedValue * (maxLog - minLog));
        const scaledValue = Math.pow(10, logValue);
        // Map to actual range
        return this.min + (scaledValue * (this.max - this.min));
    }
}
