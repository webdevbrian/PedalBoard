/**
 * Delay pedal model - creates echo/delay effect
 */
import { BoxModel } from '../BoxModel';
export declare class DelayModel extends BoxModel {
    private delay;
    private feedback;
    private wetGain;
    private dryGain;
    private maxDelayTime;
    constructor(context: AudioContext);
    /**
     * Routes internal connections
     */
    routeInternal(): void;
    /**
     * Sets the delay time in seconds
     * @param time Delay time in seconds (0 to maxDelayTime)
     */
    setDelayTime(time: number): void;
    /**
     * Sets the feedback amount (how much of the delayed signal feeds back)
     * @param amount 0-1 range (be careful with values close to 1)
     */
    setFeedback(amount: number): void;
    /**
     * Sets the wet/dry mix
     * @param mix 0-1 range (0 = fully dry, 1 = fully wet)
     */
    setMix(mix: number): void;
    /**
     * Gets the current delay time
     */
    getDelayTime(): number;
    /**
     * Gets the current feedback amount
     */
    getFeedback(): number;
    /**
     * Gets the current mix
     */
    getMix(): number;
}
//# sourceMappingURL=DelayModel.d.ts.map