/**
 * Stage class - manages the entire audio pipeline
 * Modern TypeScript implementation
 */

import { EventEmitter } from '../utils/EventEmitter';
import { Board } from './Board';
import { Input } from '../io/Input';
import { FileInput } from '../io/FileInput';
import { StreamInput } from '../io/StreamInput';
import { Output } from '../io/Output';

export class Stage extends EventEmitter {
  private context: AudioContext;
  private board?: Board;
  private input: Input;
  private output: Output;
  private mediaStreamDestination?: MediaStreamAudioDestinationNode;

  constructor() {
    super();
    
    // Create audio context
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    
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
  getContext(): AudioContext {
    return this.context;
  }

  /**
   * Resumes the audio context if suspended
   */
  async resume(): Promise<void> {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  /**
   * Sets the board on the stage
   */
  setBoard(board: Board): void {
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
  getBoard(): Board | undefined {
    return this.board;
  }

  /**
   * Routes the audio signal through the chain
   */
  private route(): void {
    if (!this.board) return;
    
    // Disconnect everything first
    this.input.disconnect();
    
    // Connect input -> board -> output
    this.input.connect(this.board);
    this.board.connect(this.output);
  }

  /**
   * Plays an audio file
   */
  async play(url: string): Promise<void> {
    // Stop current input
    this.input.stop();
    this.input.disconnect();
    
    // Create new file input
    const fileInput = new FileInput(this.context, url);
    this.input = fileInput;
    
    // Wait for file to load
    await new Promise<void>((resolve, reject) => {
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
  async playFile(file: File): Promise<void> {
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
  async startLiveInput(): Promise<void> {
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
  stop(): void {
    this.input.stop();
  }

  /**
   * Sets the input
   */
  setInput(input: Input): void {
    this.input.stop();
    this.input.disconnect();
    this.input = input;
    this.route();
  }

  /**
   * Gets the current input
   */
  getInput(): Input {
    return this.input;
  }

  /**
   * Gets the output
   */
  getOutput(): Output {
    return this.output;
  }

  /**
   * Sets the master volume
   */
  setVolume(value: number): void {
    this.output.setVolume(value);
  }

  /**
   * Gets the master volume
   */
  getVolume(): number {
    return this.output.getVolume();
  }

  /**
   * Sets media stream destination for WebRTC
   */
  setMediaStreamDestination(destination: MediaStreamAudioDestinationNode): void {
    this.mediaStreamDestination = destination;
    if (this.board) {
      this.board.setMediaStreamDestination(destination);
    }
  }

  /**
   * Creates a media stream destination
   */
  createMediaStreamDestination(): MediaStreamAudioDestinationNode {
    const destination = this.context.createMediaStreamDestination();
    this.setMediaStreamDestination(destination);
    return destination;
  }

  /**
   * Gets audio analysis data
   */
  getAnalysisData(): {
    inputLevel: number;
    outputLevel: number;
    frequencyData: Uint8Array;
    waveformData: Uint8Array;
  } {
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
  dispose(): void {
    this.input.dispose();
    this.output.dispose();
    if (this.board) {
      this.board.dispose();
    }
    this.context.close();
    this.removeAllListeners();
  }
}
