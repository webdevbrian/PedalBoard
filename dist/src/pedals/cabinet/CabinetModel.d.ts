/**
 * Cabinet simulator model - simulates guitar cabinet frequency response
 */
import { BoxModel } from '../BoxModel';
export declare class CabinetModel extends BoxModel {
    private lowShelf;
    private highShelf;
    private midPeak;
    private lowPass;
    private highPass;
    private cabinetType;
    constructor(context: AudioContext);
    /**
     * Sets the cabinet type with predefined EQ curves
     */
    setCabinetType(type: 'vintage' | 'modern' | 'british' | 'custom'): void;
    /**
     * Sets the bass response
     */
    setBass(value: number): void;
    /**
     * Sets the mid response
     */
    setMid(value: number): void;
    /**
     * Sets the treble response
     */
    setTreble(value: number): void;
    /**
     * Sets the presence (high frequency emphasis)
     */
    setPresence(value: number): void;
    /**
     * Gets the current cabinet type
     */
    getCabinetType(): string;
}
//# sourceMappingURL=CabinetModel.d.ts.map