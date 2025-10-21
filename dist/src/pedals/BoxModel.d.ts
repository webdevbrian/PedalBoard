/**
 * Base pedal component model
 * Modern TypeScript implementation
 */
import { ConnectableModel } from '../core/ConnectableModel';
export declare class BoxModel extends ConnectableModel {
    level: GainNode;
    nodes: [AudioNode, AudioNode, AudioNode | null][];
    constructor(context: AudioContext);
    /**
     * Sets the level of the effect
     */
    setLevel(newLevel: number): void;
    /**
     * Routes the internal effects chain and sets up bypass nodes
     */
    routeInternal(): void;
    /**
     * Enables the effect (removes bypass)
     */
    enable(): void;
    /**
     * Bypasses the effect
     */
    bypass(): void;
}
//# sourceMappingURL=BoxModel.d.ts.map