/**
 * Cabinet simulator pedal - simulates guitar cabinet
 */
import { Box } from '../Box';
import { CabinetModel } from './CabinetModel';
export declare class Cabinet extends Box {
    protected model: CabinetModel;
    readonly name = "cabinet";
    private bassPot;
    private midPot;
    private treblePot;
    private presencePot;
    constructor(context: AudioContext);
    /**
     * Creates the pots for this pedal
     */
    protected createPots(): void;
    /**
     * Sets the cabinet type
     */
    setCabinetType(type: 'vintage' | 'modern' | 'british' | 'custom'): void;
    /**
     * Sets the bass EQ
     */
    setBass(value: number): void;
    /**
     * Sets the mid EQ
     */
    setMid(value: number): void;
    /**
     * Sets the treble EQ
     */
    setTreble(value: number): void;
    /**
     * Sets the presence
     */
    setPresence(value: number): void;
}
//# sourceMappingURL=Cabinet.d.ts.map