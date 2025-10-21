/**
 * Base pedal class
 * Modern TypeScript implementation
 */
import { Connectable } from '../core/Connectable';
import { BoxModel } from './BoxModel';
import { LinearPot } from '../controls/pots/LinearPot';
import { Pot } from '../controls/pots/Pot';
import { ToggleSwitch } from '../controls/switches/ToggleSwitch';
import { Led } from '../controls/Led';
import { IConnectable } from '../types';
export declare abstract class Box extends Connectable {
    protected model: BoxModel;
    volumePot: LinearPot;
    bypassSwitch: ToggleSwitch;
    led: Led;
    pots: Pot[];
    switches: ToggleSwitch[];
    leds: Led[];
    abstract readonly name: string;
    constructor(context: AudioContext, ModelClass?: typeof BoxModel);
    /**
     * Creates the potentiometers for this pedal
     */
    protected createPots(): void;
    /**
     * Creates the switches for this pedal
     */
    protected createSwitches(): void;
    /**
     * Override createChildComponents to create pots and switches
     */
    protected createChildComponents(): void;
    /**
     * Connects to another pedal and sets up bypass nodes
     */
    connect(destination: IConnectable): void;
    /**
     * Sets the volume level
     */
    setLevel(value: number): void;
    /**
     * Gets the current volume level
     */
    getLevel(): number;
    /**
     * Toggles the bypass state
     */
    toggleBypass(): void;
    /**
     * Sets the bypass state
     */
    setBypass(bypassed: boolean): void;
    /**
     * Gets the bypass state
     */
    isBypassed(): boolean;
}
//# sourceMappingURL=Box.d.ts.map