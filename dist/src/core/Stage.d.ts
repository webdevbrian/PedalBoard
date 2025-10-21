/**
 * Stage class - manages the entire audio pipeline
 * Modern TypeScript implementation
 */
import { EventEmitter } from '../utils/EventEmitter';
import { Board } from './Board';
import { Input } from '../io/Input';
import { Output } from '../io/Output';
export declare class Stage extends EventEmitter {
    private context;
    private board?;
    private input;
    private output;
    private mediaStreamDestination?;
    constructor();
    /**
     * Gets the audio context
     */
    getContext(): AudioContext;
    /**
     * Resumes the audio context if suspended
     */
    resume(): Promise<void>;
    /**
     * Sets the board on the stage
     */
    setBoard(board: Board): void;
    /**
     * Gets the current board
     */
    getBoard(): Board | undefined;
    /**
     * Routes the audio signal through the chain
     */
    private route;
    /**
     * Plays an audio file
     */
    play(url: string): Promise<void>;
    /**
     * Plays an uploaded file
     */
    playFile(file: File): Promise<void>;
    /**
     * Starts live input (microphone/line-in)
     */
    startLiveInput(): Promise<void>;
    /**
     * Stops the current input
     */
    stop(): void;
    /**
     * Sets the input
     */
    setInput(input: Input): void;
    /**
     * Gets the current input
     */
    getInput(): Input;
    /**
     * Gets the output
     */
    getOutput(): Output;
    /**
     * Sets the master volume
     */
    setVolume(value: number): void;
    /**
     * Gets the master volume
     */
    getVolume(): number;
    /**
     * Sets media stream destination for WebRTC
     */
    setMediaStreamDestination(destination: MediaStreamAudioDestinationNode): void;
    /**
     * Creates a media stream destination
     */
    createMediaStreamDestination(): MediaStreamAudioDestinationNode;
    /**
     * Gets audio analysis data
     */
    getAnalysisData(): {
        inputLevel: number;
        outputLevel: number;
        frequencyData: Uint8Array;
        waveformData: Uint8Array;
    };
    /**
     * Disposes of the stage and all resources
     */
    dispose(): void;
}
//# sourceMappingURL=Stage.d.ts.map