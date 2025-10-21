/**
 * Cabinet simulator pedal - simulates guitar cabinet
 */
import { Box } from '../Box';
import { CabinetModel } from './CabinetModel';
import { LinearPot } from '../../controls/pots/LinearPot';
export class Cabinet extends Box {
    constructor(context) {
        super(context, CabinetModel);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'cabinet'
        });
        Object.defineProperty(this, "bassPot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "midPot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "treblePot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "presencePot", {
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
        // Bass EQ
        this.bassPot = new LinearPot((value) => this.model.setBass(value), 'bass', 10, 0, 10);
        // Mid EQ
        this.midPot = new LinearPot((value) => this.model.setMid(value), 'mid', 10, 0, 10);
        // Treble EQ
        this.treblePot = new LinearPot((value) => this.model.setTreble(value), 'treble', 10, 0, 10);
        // Presence
        this.presencePot = new LinearPot((value) => this.model.setPresence(value), 'presence', 10, 0, 10);
        // Add to pots array
        this.pots.push(this.bassPot, this.midPot, this.treblePot, this.presencePot);
        // Set default values (neutral EQ)
        this.bassPot.setActualValue(5);
        this.midPot.setActualValue(5);
        this.treblePot.setActualValue(5);
        this.presencePot.setActualValue(5);
    }
    /**
     * Sets the cabinet type
     */
    setCabinetType(type) {
        this.model.setCabinetType(type);
    }
    /**
     * Sets the bass EQ
     */
    setBass(value) {
        this.bassPot.setActualValue(value);
    }
    /**
     * Sets the mid EQ
     */
    setMid(value) {
        this.midPot.setActualValue(value);
    }
    /**
     * Sets the treble EQ
     */
    setTreble(value) {
        this.treblePot.setActualValue(value);
    }
    /**
     * Sets the presence
     */
    setPresence(value) {
        this.presencePot.setActualValue(value);
    }
}
