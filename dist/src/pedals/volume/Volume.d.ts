/**
 * Volume pedal - simple volume control
 */
import { Box } from '../Box';
import { VolumeModel } from './VolumeModel';
export declare class Volume extends Box {
    protected model: VolumeModel;
    readonly name = "volume";
    constructor(context: AudioContext);
    /**
     * Creates the pots for this pedal
     */
    protected createPots(): void;
    /**
     * Sets the volume
     */
    setVolume(value: number): void;
    /**
     * Gets the volume
     */
    getVolume(): number;
}
//# sourceMappingURL=Volume.d.ts.map