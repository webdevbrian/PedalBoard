/**
 * Overdrive pedal - adds distortion/overdrive effect
 */
import { Box } from '../Box';
import { OverdriveModel } from './OverdriveModel';
export declare class Overdrive extends Box {
    protected model: OverdriveModel;
    readonly name = "overdrive";
    private drivePot;
    private tonePot;
    constructor(context: AudioContext);
    /**
     * Creates the pots for this pedal
     */
    protected createPots(): void;
    /**
     * Sets the drive amount
     */
    setDrive(value: number): void;
    /**
     * Gets the drive amount
     */
    getDrive(): number;
    /**
     * Sets the tone
     */
    setTone(value: number): void;
    /**
     * Gets the tone
     */
    getTone(): number;
}
//# sourceMappingURL=Overdrive.d.ts.map