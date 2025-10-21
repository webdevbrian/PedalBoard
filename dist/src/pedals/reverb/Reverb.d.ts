/**
 * Reverb pedal - adds reverb/room effect
 */
import { Box } from '../Box';
import { ReverbModel } from './ReverbModel';
export declare class Reverb extends Box {
    protected model: ReverbModel;
    readonly name = "reverb";
    private roomSizePot;
    private mixPot;
    private brightnessPot;
    constructor(context: AudioContext);
    /**
     * Creates the pots for this pedal
     */
    protected createPots(): void;
    /**
     * Sets the room size
     */
    setRoomSize(value: number): void;
    /**
     * Sets the mix (overrides setLevel for compatibility)
     */
    setLevel(value: number): void;
    /**
     * Sets the brightness
     */
    setBrightness(value: number): void;
    /**
     * Loads a custom impulse response
     */
    loadImpulse(url: string): Promise<void>;
}
//# sourceMappingURL=Reverb.d.ts.map