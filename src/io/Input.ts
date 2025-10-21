/**
 * Base input class for audio sources
 */

import { EventEmitter } from '../utils/EventEmitter';

export class Input extends EventEmitter {
  protected context: AudioContext;
  protected outputNode: GainNode;
  protected source?: AudioNode;
  protected isPlaying: boolean = false;

  constructor(context: AudioContext) {
    super();
    this.context = context;
    this.outputNode = this.context.createGain();
  }

  /**
   * Connects the input to a destination
   */
  connect(destination: AudioNode | { getInput(): AudioNode }): void {
    if ('getInput' in destination) {
      this.outputNode.connect(destination.getInput());
    } else {
      this.outputNode.connect(destination);
    }
  }

  /**
   * Disconnects the input
   */
  disconnect(): void {
    try {
      this.outputNode.disconnect();
    } catch (e) {
      // Already disconnected
    }
  }

  /**
   * Starts playing the input
   */
  play(): void {
    this.isPlaying = true;
    this.emit('play');
  }

  /**
   * Stops playing the input
   */
  stop(): void {
    this.isPlaying = false;
    this.emit('stop');
  }

  /**
   * Gets the output node
   */
  getOutput(): AudioNode {
    return this.outputNode;
  }

  /**
   * Checks if input is playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Sets the volume of the input
   */
  setVolume(value: number): void {
    value = Math.max(0, Math.min(1, value));
    this.outputNode.gain.value = value;
  }

  /**
   * Gets the volume of the input
   */
  getVolume(): number {
    return this.outputNode.gain.value;
  }

  /**
   * Disposes of the input
   */
  dispose(): void {
    this.stop();
    this.disconnect();
    this.removeAllListeners();
  }
}
