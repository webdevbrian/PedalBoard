/**
 * Base input class for audio sources
 */
import { EventEmitter } from '../utils/EventEmitter';
export class Input extends EventEmitter {
    constructor(context) {
        super();
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "source", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isPlaying", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.context = context;
        this.outputNode = this.context.createGain();
    }
    /**
     * Connects the input to a destination
     */
    connect(destination) {
        if ('getInput' in destination) {
            this.outputNode.connect(destination.getInput());
        }
        else {
            this.outputNode.connect(destination);
        }
    }
    /**
     * Disconnects the input
     */
    disconnect() {
        try {
            this.outputNode.disconnect();
        }
        catch (e) {
            // Already disconnected
        }
    }
    /**
     * Starts playing the input
     */
    play() {
        this.isPlaying = true;
        this.emit('play');
    }
    /**
     * Stops playing the input
     */
    stop() {
        this.isPlaying = false;
        this.emit('stop');
    }
    /**
     * Gets the output node
     */
    getOutput() {
        return this.outputNode;
    }
    /**
     * Checks if input is playing
     */
    getIsPlaying() {
        return this.isPlaying;
    }
    /**
     * Sets the volume of the input
     */
    setVolume(value) {
        value = Math.max(0, Math.min(1, value));
        this.outputNode.gain.value = value;
    }
    /**
     * Gets the volume of the input
     */
    getVolume() {
        return this.outputNode.gain.value;
    }
    /**
     * Disposes of the input
     */
    dispose() {
        this.stop();
        this.disconnect();
        this.removeAllListeners();
    }
}
