/**
 * Base pedal class
 * Modern TypeScript implementation
 */
import { Connectable } from '../core/Connectable';
import { BoxModel } from './BoxModel';
import { LinearPot } from '../controls/pots/LinearPot';
import { ToggleSwitch } from '../controls/switches/ToggleSwitch';
import { Led } from '../controls/Led';
export class Box extends Connectable {
    constructor(context, ModelClass = BoxModel) {
        super(context, ModelClass);
        Object.defineProperty(this, "volumePot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bypassSwitch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "led", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pots", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "switches", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "leds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.model = new ModelClass(context);
    }
    /**
     * Creates the potentiometers for this pedal
     */
    createPots() {
        // Create volume pot that controls the level gain
        this.volumePot = new LinearPot((value) => this.model.setLevel(value), 'volume', 1, 0, 10);
        this.volumePot.setValue(10); // Default to full volume
        this.pots = [this.volumePot];
    }
    /**
     * Creates the switches for this pedal
     */
    createSwitches() {
        // Create bypass switch
        this.bypassSwitch = new ToggleSwitch('bypass');
        // Create LED that follows bypass switch
        this.led = new Led(this.bypassSwitch);
        this.leds = [this.led];
        this.switches = [this.bypassSwitch];
        // Handle bypass switching
        this.bypassSwitch.on('change', (state) => {
            if (state) {
                this.model.enable();
            }
            else {
                this.model.bypass();
            }
            // Small delay to avoid clicks
            setTimeout(() => {
                if (state) {
                    this.model.enable();
                }
                else {
                    this.model.bypass();
                }
            }, 10);
        });
    }
    /**
     * Override createChildComponents to create pots and switches
     */
    createChildComponents() {
        this.createPots();
        this.createSwitches();
    }
    /**
     * Connects to another pedal and sets up bypass nodes
     */
    connect(destination) {
        super.connect(destination);
        // Set up bypass switch nodes if needed
        if (this.bypassSwitch && this.model.nodes) {
            // The bypass switch will handle routing between effect and bypass
            this.bypassSwitch.setNodes(this.model.nodes);
        }
    }
    /**
     * Sets the volume level
     */
    setLevel(value) {
        this.volumePot.setValue(value);
    }
    /**
     * Gets the current volume level
     */
    getLevel() {
        return this.volumePot.getValue();
    }
    /**
     * Toggles the bypass state
     */
    toggleBypass() {
        this.bypassSwitch.toggle();
    }
    /**
     * Sets the bypass state
     */
    setBypass(bypassed) {
        this.bypassSwitch.setState(!bypassed);
    }
    /**
     * Gets the bypass state
     */
    isBypassed() {
        return !this.bypassSwitch.getState();
    }
}
