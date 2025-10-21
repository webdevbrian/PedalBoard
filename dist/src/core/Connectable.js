/**
 * Base Connectable component. It hosts other components as children, has a model and IO functionality.
 * Modern TypeScript implementation
 */
import { ConnectableModel } from './ConnectableModel';
import { EventEmitter } from '../utils/EventEmitter';
export class Connectable extends EventEmitter {
    constructor(context, ModelClass = ConnectableModel) {
        super();
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "components", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.context = context;
        this.model = new ModelClass(context);
        this.createChildComponents();
        this.bindModelEvents();
    }
    /**
     * Creates child components such as pots and switches.
     * Override in subclasses
     */
    createChildComponents() {
        this.components = [];
    }
    /**
     * Binds model events. Override in subclasses if needed
     */
    bindModelEvents() {
        // Override in subclasses
    }
    /**
     * Gets the input buffer
     */
    getInput() {
        return this.model.getInput();
    }
    /**
     * Gets the output buffer
     */
    getOutput() {
        return this.model.getOutput();
    }
    /**
     * Sets the previous pedal in the chain
     */
    setPrev(prev) {
        this.model.setPrev(prev.getOutput());
    }
    /**
     * Connects to another pedal
     */
    connect(destination) {
        destination.setPrev(this);
        this.model.connect(destination.getInput());
    }
    /**
     * Disconnects the output
     */
    disconnect() {
        this.model.disconnect();
    }
    /**
     * Disposes of the component
     */
    dispose() {
        this.components.forEach(component => {
            if (component.dispose) {
                component.dispose();
            }
        });
        this.model.dispose();
        this.removeAllListeners();
    }
}
