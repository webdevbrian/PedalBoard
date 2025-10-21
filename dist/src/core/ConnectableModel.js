/**
 * Base connectable component model. Hosts input and output buffer, chain and effects base.
 * Modern TypeScript implementation of the original ConnectableModel
 */
export class ConnectableModel {
    constructor(context) {
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputBuffer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputBuffer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "effects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "prev", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "next", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "disposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.context = context;
        this.inputBuffer = this.context.createGain();
        this.outputBuffer = this.context.createGain();
    }
    /**
     * Connects the output of the audio node of this model to another audio node.
     */
    connect(destination) {
        this.next = destination;
        this.chain = [
            this.inputBuffer,
            ...this.effects,
            this.outputBuffer,
            this.next
        ].filter(Boolean);
        this.routeInternal();
    }
    /**
     * Gets the input buffer
     */
    getInput() {
        return this.inputBuffer;
    }
    /**
     * Gets the output buffer
     */
    getOutput() {
        return this.outputBuffer;
    }
    /**
     * Sets the previous node in the chain
     */
    setPrev(prev) {
        this.prev = prev;
    }
    /**
     * Routes the internal effects chain
     */
    routeInternal() {
        const chain = this.chain;
        // Disconnect all existing connections first
        chain.forEach(node => {
            try {
                node.disconnect();
            }
            catch (e) {
                // Node might not be connected, that's okay
            }
        });
        // Connect the chain
        for (let i = 0; i < chain.length - 1; i++) {
            try {
                chain[i].connect(chain[i + 1]);
            }
            catch (e) {
                console.error('Error connecting audio nodes:', e);
            }
        }
    }
    /**
     * Disconnects the output buffer
     */
    disconnect() {
        try {
            this.outputBuffer.disconnect();
        }
        catch (e) {
            // Already disconnected, that's okay
        }
    }
    /**
     * Disposes of the model and cleans up resources
     */
    dispose() {
        if (this.disposed)
            return;
        this.disconnect();
        this.chain = [];
        this.effects = [];
        this.disposed = true;
    }
}
