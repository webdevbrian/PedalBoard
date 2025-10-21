/**
 * Base Connectable component. It hosts other components as children, has a model and IO functionality.
 * Modern TypeScript implementation
 */
import { IConnectable, IConnectableModel } from '../types';
import { ConnectableModel } from './ConnectableModel';
import { EventEmitter } from '../utils/EventEmitter';
export declare abstract class Connectable extends EventEmitter implements IConnectable {
    protected model: IConnectableModel;
    protected context: AudioContext;
    protected components: any[];
    constructor(context: AudioContext, ModelClass?: typeof ConnectableModel);
    /**
     * Creates child components such as pots and switches.
     * Override in subclasses
     */
    protected createChildComponents(): void;
    /**
     * Binds model events. Override in subclasses if needed
     */
    protected bindModelEvents(): void;
    /**
     * Gets the input buffer
     */
    getInput(): AudioNode;
    /**
     * Gets the output buffer
     */
    getOutput(): AudioNode;
    /**
     * Sets the previous pedal in the chain
     */
    setPrev(prev: IConnectable): void;
    /**
     * Connects to another pedal
     */
    connect(destination: IConnectable): void;
    /**
     * Disconnects the output
     */
    disconnect(): void;
    /**
     * Disposes of the component
     */
    dispose(): void;
}
//# sourceMappingURL=Connectable.d.ts.map