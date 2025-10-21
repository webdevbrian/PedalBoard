/**
 * Overdrive pedal model - creates distortion effect
 */
import { BoxModel } from '../BoxModel';
export declare class OverdriveModel extends BoxModel {
    private waveShaper;
    private lowPass;
    private lowPassFreq;
    private driveAmount;
    constructor(context: AudioContext);
    /**
     * Creates wave shaper curve for distortion
     */
    private createWSCurve;
    /**
     * Sets the drive (distortion) level
     * @param value 0-10 range
     */
    setDrive(value: number): void;
    /**
     * Sets the tone (brightness) level
     * @param value 0-10 range
     */
    setTone(value: number): void;
    /**
     * Gets the current drive amount
     */
    getDrive(): number;
    /**
     * Gets the current tone frequency
     */
    getTone(): number;
}
//# sourceMappingURL=OverdriveModel.d.ts.map