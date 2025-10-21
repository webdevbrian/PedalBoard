/**
 * Base input class for audio sources
 */
import { EventEmitter } from '../utils/EventEmitter';
export declare class Input extends EventEmitter {
    protected context: AudioContext;
    protected outputNode: GainNode;
    protected source?: AudioNode;
    protected isPlaying: boolean;
    constructor(context: AudioContext);
    /**
     * Connects the input to a destination
     */
    connect(destination: AudioNode | {
        getInput(): AudioNode;
    }): void;
    /**
     * Disconnects the input
     */
    disconnect(): void;
    /**
     * Starts playing the input
     */
    play(): void;
    /**
     * Stops playing the input
     */
    stop(): void;
    /**
     * Gets the output node
     */
    getOutput(): AudioNode;
    /**
     * Checks if input is playing
     */
    getIsPlaying(): boolean;
    /**
     * Sets the volume of the input
     */
    setVolume(value: number): void;
    /**
     * Gets the volume of the input
     */
    getVolume(): number;
    /**
     * Disposes of the input
     */
    dispose(): void;
}
//# sourceMappingURL=Input.d.ts.map