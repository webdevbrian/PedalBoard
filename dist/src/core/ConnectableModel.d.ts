/**
 * Base connectable component model. Hosts input and output buffer, chain and effects base.
 * Modern TypeScript implementation of the original ConnectableModel
 */
import { IConnectableModel } from '../types';
export declare class ConnectableModel implements IConnectableModel {
    context: AudioContext;
    inputBuffer: GainNode;
    outputBuffer: GainNode;
    chain: AudioNode[];
    effects: AudioNode[];
    protected prev?: AudioNode;
    protected next?: AudioNode;
    private disposed;
    constructor(context: AudioContext);
    /**
     * Connects the output of the audio node of this model to another audio node.
     */
    connect(destination: AudioNode): void;
    /**
     * Gets the input buffer
     */
    getInput(): AudioNode;
    /**
     * Gets the output buffer
     */
    getOutput(): AudioNode;
    /**
     * Sets the previous node in the chain
     */
    setPrev(prev: AudioNode): void;
    /**
     * Routes the internal effects chain
     */
    routeInternal(): void;
    /**
     * Disconnects the output buffer
     */
    disconnect(): void;
    /**
     * Disposes of the model and cleans up resources
     */
    dispose(): void;
}
//# sourceMappingURL=ConnectableModel.d.ts.map