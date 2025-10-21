/**
 * Volume pedal model - simple gain control
 */
import { BoxModel } from '../BoxModel';
export declare class VolumeModel extends BoxModel {
    constructor(context: AudioContext);
    /**
     * Sets the volume (0-10 range)
     */
    setVolume(value: number): void;
    /**
     * Gets the current volume
     */
    getVolume(): number;
}
//# sourceMappingURL=VolumeModel.d.ts.map