/**
 * Output class for audio destination (speakers)
 */
import { EventEmitter } from '../utils/EventEmitter';
import { IConnectable } from '../types';
export declare class Output extends EventEmitter implements IConnectable {
    private context;
    private inputNode;
    private masterVolume;
    private compressor;
    private limiter;
    private analyser;
    constructor(context: AudioContext);
    /**
     * Gets the input node for connections
     */
    getInput(): AudioNode;
    /**
     * Gets the output node (returns destination for compatibility)
     */
    getOutput(): AudioNode;
    /**
     * Connects to another destination (for IConnectable compatibility)
     */
    connect(destination: IConnectable): void;
    /**
     * Sets previous in chain (for IConnectable compatibility)
     */
    setPrev(_prev: IConnectable): void;
    /**
     * Disconnects (for IConnectable compatibility)
     */
    disconnect(): void;
    /**
     * Sets the master volume (0-1)
     */
    setVolume(value: number): void;
    /**
     * Gets the master volume
     */
    getVolume(): number;
    /**
     * Mutes the output
     */
    mute(): void;
    /**
     * Unmutes the output
     */
    unmute(): void;
    /**
     * Enables/disables the compressor
     */
    setCompressorEnabled(enabled: boolean): void;
    /**
     * Sets compressor parameters
     */
    setCompressorParams(params: {
        threshold?: number;
        knee?: number;
        ratio?: number;
        attack?: number;
        release?: number;
    }): void;
    /**
     * Gets the current output level (0-1)
     */
    getLevel(): number;
    /**
     * Gets frequency data for visualization
     */
    getFrequencyData(): Uint8Array;
    /**
     * Gets waveform data for visualization
     */
    getWaveformData(): Uint8Array;
    /**
     * Connects an additional output destination
     */
    connectDestination(destination: AudioNode): void;
    /**
     * Disconnects from a destination
     */
    disconnectDestination(destination: AudioNode): void;
    /**
     * Disposes of the output
     */
    dispose(): void;
}
//# sourceMappingURL=Output.d.ts.map