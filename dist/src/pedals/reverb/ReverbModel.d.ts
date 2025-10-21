/**
 * Reverb pedal model - creates reverb/room effect using convolution
 */
import { BoxModel } from '../BoxModel';
export declare class ReverbModel extends BoxModel {
    private convolver;
    private wetGain;
    private dryGain;
    private impulseBuffer?;
    constructor(context: AudioContext);
    /**
     * Generates an impulse response for the reverb
     * @param duration Duration of the reverb tail in seconds
     * @param decay Decay factor (how quickly it fades)
     * @param brightness High frequency content (0-1)
     */
    private generateImpulse;
    /**
     * Routes internal connections
     */
    routeInternal(): void;
    /**
     * Sets the room size (generates new impulse)
     * @param size 0-10 range (maps to 0.5-4 seconds)
     */
    setRoomSize(size: number): void;
    /**
     * Sets the wet/dry mix
     * @param mix 0-1 range (0 = fully dry, 1 = fully wet)
     */
    setMix(mix: number): void;
    /**
     * Sets the brightness of the reverb
     * @param brightness 0-10 range
     */
    setBrightness(brightness: number): void;
    /**
     * Loads a custom impulse response from URL
     */
    loadImpulse(url: string): Promise<void>;
}
//# sourceMappingURL=ReverbModel.d.ts.map