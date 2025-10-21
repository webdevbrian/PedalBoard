/**
 * Overdrive pedal - adds distortion/overdrive effect
 */
import { Box } from '../Box';
import { OverdriveModel } from './OverdriveModel';
import { LogPot } from '../../controls/pots/LogPot';
export class Overdrive extends Box {
    constructor(context) {
        super(context, OverdriveModel);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'overdrive'
        });
        Object.defineProperty(this, "drivePot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tonePot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * Creates the pots for this pedal
     */
    createPots() {
        super.createPots();
        // Drive pot (distortion amount)
        this.drivePot = new LogPot((value) => this.model.setDrive(value), 'drive', 10, 0, 10);
        // Tone pot (brightness)
        this.tonePot = new LogPot((value) => this.model.setTone(value), 'tone', 10, 0, 10);
        // Add to pots array
        this.pots.push(this.drivePot, this.tonePot);
        // Set default values
        this.drivePot.setActualValue(2);
        this.tonePot.setActualValue(5);
    }
    /**
     * Sets the drive amount
     */
    setDrive(value) {
        this.drivePot.setActualValue(value);
    }
    /**
     * Gets the drive amount
     */
    getDrive() {
        return this.drivePot.getValue();
    }
    /**
     * Sets the tone
     */
    setTone(value) {
        this.tonePot.setActualValue(value);
    }
    /**
     * Gets the tone
     */
    getTone() {
        return this.tonePot.getValue();
    }
}
