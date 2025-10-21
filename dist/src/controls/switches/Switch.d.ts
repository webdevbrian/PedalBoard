/**
 * Base switch class for pedal switches
 */
import { EventEmitter } from '../../utils/EventEmitter';
import { ISwitchState } from '../../types';
export declare abstract class Switch extends EventEmitter {
    protected state: boolean;
    protected name: string;
    protected nodes?: [AudioNode, AudioNode, AudioNode | null][];
    constructor(name: string, defaultState?: boolean);
    /**
     * Sets the switch state
     */
    setState(state: boolean): void;
    /**
     * Gets the current state
     */
    getState(): boolean;
    /**
     * Toggles the switch state
     */
    abstract toggle(): void;
    /**
     * Sets the audio nodes for bypass routing
     * Format: [[activeNode, inputNode, bypassNode], ...]
     */
    setNodes(nodes: [AudioNode, AudioNode, AudioNode | null][]): void;
    /**
     * Routes audio nodes based on switch state
     */
    protected routeNodes(): void;
    /**
     * Gets the switch configuration
     */
    getConfig(): ISwitchState;
    /**
     * Returns whether this is a momentary switch
     */
    abstract isMomentary(): boolean;
    /**
     * Gets the switch name
     */
    getName(): string;
}
//# sourceMappingURL=Switch.d.ts.map