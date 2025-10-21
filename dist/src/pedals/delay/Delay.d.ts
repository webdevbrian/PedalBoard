/**
 * Delay pedal - adds echo/delay effect
 */
import { Box } from '../Box';
import { DelayModel } from './DelayModel';
export declare class Delay extends Box {
    protected model: DelayModel;
    readonly name = "delay";
    private timePot;
    private feedbackPot;
    private mixPot;
    constructor(context: AudioContext);
    /**
     * Creates the pots for this pedal
     */
    protected createPots(): void;
    /**
     * Sets the delay time (0-10 maps to 0-2 seconds)
     */
    setDelayTimer(value: number): void;
    /**
     * Sets the feedback gain (0-10 maps to 0-95%)
     */
    setFeedbackGain(value: number): void;
    /**
     * Sets the mix (0-10 maps to 0-100%)
     */
    setMix(value: number): void;
    /**
     * Gets the delay time in seconds
     */
    getDelayTime(): number;
    /**
     * Gets the feedback amount
     */
    getFeedback(): number;
    /**
     * Gets the mix amount
     */
    getMix(): number;
}
//# sourceMappingURL=Delay.d.ts.map