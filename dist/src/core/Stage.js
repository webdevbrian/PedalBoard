/**
 * Stage class - manages the entire audio pipeline
 * Modern TypeScript implementation
 */
import { EventEmitter } from '../utils/EventEmitter';
import { Input } from '../io/Input';
import { FileInput } from '../io/FileInput';
import { StreamInput } from '../io/StreamInput';
import { Output } from '../io/Output';
export class Stage extends EventEmitter {
    constructor() {
        super();
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "board", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "input", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "output", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mediaStreamDestination", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Create audio context
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        // Initialize IO
        this.input = new Input(this.context);
        this.output = new Output(this.context);
        // Handle context state changes
        this.context.addEventListener('statechange', () => {
            this.emit('statechange', this.context.state);
        });
    }
    /**
     * Gets the audio context
     */
    getContext() {
        return this.context;
    }
    /**
     * Resumes the audio context if suspended
     */
    async resume() {
        if (this.context.state === 'suspended') {
            await this.context.resume();
        }
    }
    /**
     * Sets the board on the stage
     */
    setBoard(board) {
        // Disconnect old board
        if (this.board) {
            this.input.disconnect();
            this.board.disconnect();
            this.board.dispose();
        }
        // Set new board
        this.board = board;
        // Set media stream destination if available
        if (this.mediaStreamDestination) {
            this.board.setMediaStreamDestination(this.mediaStreamDestination);
        }
        // Route audio
        this.route();
        this.emit('boardChange', board);
    }
    /**
     * Gets the current board
     */
    getBoard() {
        return this.board;
    }
    /**
     * Routes the audio signal through the chain
     */
    route() {
        if (!this.board)
            return;
        // Disconnect everything first
        this.input.disconnect();
        // Connect input -> board -> output
        this.input.connect(this.board);
        this.board.connect(this.output);
    }
    /**
     * Plays an audio file
     */
    async play(url) {
        // Stop current input
        this.input.stop();
        this.input.disconnect();
        // Create new file input
        const fileInput = new FileInput(this.context, url);
        this.input = fileInput;
        // Wait for file to load
        await new Promise((resolve, reject) => {
            fileInput.once('loaded', () => resolve());
            fileInput.once('error', (error) => reject(error));
        });
        // Route and play
        this.route();
        fileInput.play();
    }
    /**
     * Plays an uploaded file
     */
    async playFile(file) {
        // Stop current input
        this.input.stop();
        this.input.disconnect();
        // Create new file input
        const fileInput = new FileInput(this.context);
        await fileInput.loadFileObject(file);
        this.input = fileInput;
        // Route and play
        this.route();
        fileInput.play();
    }
    /**
     * Starts live input (microphone/line-in)
     */
    async startLiveInput() {
        // Stop current input
        this.input.stop();
        this.input.disconnect();
        // Create stream input
        const streamInput = new StreamInput(this.context, false);
        this.input = streamInput;
        // Start stream
        await streamInput.startStream();
        // Route audio
        this.route();
    }
    /**
     * Stops the current input
     */
    stop() {
        this.input.stop();
    }
    /**
     * Sets the input
     */
    setInput(input) {
        this.input.stop();
        this.input.disconnect();
        this.input = input;
        this.route();
    }
    /**
     * Gets the current input
     */
    getInput() {
        return this.input;
    }
    /**
     * Gets the output
     */
    getOutput() {
        return this.output;
    }
    /**
     * Sets the master volume
     */
    setVolume(value) {
        this.output.setVolume(value);
    }
    /**
     * Gets the master volume
     */
    getVolume() {
        return this.output.getVolume();
    }
    /**
     * Sets media stream destination for WebRTC
     */
    setMediaStreamDestination(destination) {
        this.mediaStreamDestination = destination;
        if (this.board) {
            this.board.setMediaStreamDestination(destination);
        }
    }
    /**
     * Creates a media stream destination
     */
    createMediaStreamDestination() {
        const destination = this.context.createMediaStreamDestination();
        this.setMediaStreamDestination(destination);
        return destination;
    }
    /**
     * Gets audio analysis data
     */
    getAnalysisData() {
        return {
            inputLevel: this.input instanceof StreamInput ? this.input.getLevel() : 0,
            outputLevel: this.output.getLevel(),
            frequencyData: this.output.getFrequencyData(),
            waveformData: this.output.getWaveformData()
        };
    }
    /**
     * Disposes of the stage and all resources
     */
    dispose() {
        this.input.dispose();
        this.output.dispose();
        if (this.board) {
            this.board.dispose();
        }
        this.context.close();
        this.removeAllListeners();
    }
}
