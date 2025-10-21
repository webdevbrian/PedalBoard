/**
 * Volume pedal - simple volume control
 */
import { Box } from '../Box';
import { VolumeModel } from './VolumeModel';
export class Volume extends Box {
    constructor(context) {
        super(context, VolumeModel);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'volume'
        });
    }
    /**
     * Creates the pots for this pedal
     */
    createPots() {
        // Volume pedal only has the main volume pot
        super.createPots();
        // Set default to full volume
        this.volumePot.setActualValue(10);
    }
    /**
     * Sets the volume
     */
    setVolume(value) {
        this.volumePot.setActualValue(value);
    }
    /**
     * Gets the volume
     */
    getVolume() {
        return this.volumePot.getValue();
    }
}
