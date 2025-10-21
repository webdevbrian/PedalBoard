/**
 * Board class - hosts pedals and manages routing between them
 * Modern TypeScript implementation
 */
import { Connectable } from './Connectable';
import { ConnectableModel } from './ConnectableModel';
export class Board extends Connectable {
    constructor(context) {
        super(context, ConnectableModel);
        Object.defineProperty(this, "pedals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "mediaStreamDestination", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * Adds pedals to the board
     */
    addPedals(pedals) {
        pedals.forEach(pedal => this.addPedal(pedal));
    }
    /**
     * Adds a single pedal to the board
     */
    addPedal(pedal) {
        this.pedals.push(pedal);
        this.routeInternal();
    }
    /**
     * Adds a pedal at a specific position
     */
    addPedalAt(pedal, index) {
        this.pedals.splice(index, 0, pedal);
        this.routeInternal();
    }
    /**
     * Removes a pedal from the board
     */
    removePedal(pedal) {
        const index = this.pedals.indexOf(pedal);
        if (index !== -1) {
            this.pedals.splice(index, 1);
            pedal.disconnect();
            this.routeInternal();
        }
    }
    /**
     * Removes a pedal at a specific index
     */
    removePedalAt(index) {
        if (index >= 0 && index < this.pedals.length) {
            const pedal = this.pedals.splice(index, 1)[0];
            pedal.disconnect();
            this.routeInternal();
            return pedal;
        }
        return undefined;
    }
    /**
     * Gets all pedals on the board
     */
    getPedals() {
        return [...this.pedals];
    }
    /**
     * Gets a pedal at a specific index
     */
    getPedalAt(index) {
        return this.pedals[index];
    }
    /**
     * Moves a pedal to a new position
     */
    movePedal(fromIndex, toIndex) {
        if (fromIndex >= 0 && fromIndex < this.pedals.length &&
            toIndex >= 0 && toIndex < this.pedals.length) {
            const pedal = this.pedals.splice(fromIndex, 1)[0];
            this.pedals.splice(toIndex, 0, pedal);
            this.routeInternal();
        }
    }
    /**
     * Routes the internal signal chain through all pedals
     */
    routeInternal() {
        // Disconnect all existing connections
        this.pedals.forEach(pedal => pedal.disconnect());
        try {
            this.model.inputBuffer.disconnect();
            this.model.outputBuffer.disconnect();
        }
        catch (e) {
            // Might not be connected
        }
        if (this.pedals.length === 0) {
            // No pedals, connect input directly to output
            this.model.inputBuffer.connect(this.model.outputBuffer);
        }
        else {
            // Connect input to first pedal
            this.model.inputBuffer.connect(this.pedals[0].getInput());
            // Connect pedals in series
            for (let i = 0; i < this.pedals.length - 1; i++) {
                this.pedals[i].connect(this.pedals[i + 1]);
            }
            // Connect last pedal to output
            const lastPedal = this.pedals[this.pedals.length - 1];
            lastPedal.getOutput().connect(this.model.outputBuffer);
        }
        // Connect to media stream if set
        if (this.mediaStreamDestination) {
            this.model.outputBuffer.connect(this.mediaStreamDestination);
        }
    }
    /**
     * Sets media stream destination for WebRTC
     */
    setMediaStreamDestination(destination) {
        this.mediaStreamDestination = destination;
        this.routeInternal();
    }
    /**
     * Clears all pedals from the board
     */
    clear() {
        this.pedals.forEach(pedal => pedal.disconnect());
        this.pedals = [];
        this.routeInternal();
    }
    /**
     * Disposes of the board and all its pedals
     */
    dispose() {
        this.pedals.forEach(pedal => pedal.dispose());
        this.pedals = [];
        super.dispose();
    }
    /**
     * Serializes the board configuration
     */
    toJSON() {
        return {
            pedals: this.pedals.map(pedal => ({
                name: pedal.name,
                bypassed: pedal.isBypassed(),
                pots: pedal.pots.map(pot => ({
                    name: pot.getName(),
                    value: pot.getValue()
                }))
            }))
        };
    }
}
