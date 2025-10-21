/**
 * Base connectable component model. Hosts input and output buffer, chain and effects base.
 * Modern TypeScript implementation of the original ConnectableModel
 */

import { IConnectableModel } from '../types';

export class ConnectableModel implements IConnectableModel {
  public context: AudioContext;
  public inputBuffer: GainNode;
  public outputBuffer: GainNode;
  public chain: AudioNode[] = [];
  public effects: AudioNode[] = [];
  
  protected prev?: AudioNode;
  protected next?: AudioNode;
  private disposed = false;

  constructor(context: AudioContext) {
    this.context = context;
    this.inputBuffer = this.context.createGain();
    this.outputBuffer = this.context.createGain();
  }

  /**
   * Connects the output of the audio node of this model to another audio node.
   */
  connect(destination: AudioNode): void {
    this.next = destination;
    this.chain = [
      this.inputBuffer,
      ...this.effects,
      this.outputBuffer,
      this.next
    ].filter(Boolean) as AudioNode[];
    
    this.routeInternal();
  }

  /**
   * Gets the input buffer
   */
  getInput(): AudioNode {
    return this.inputBuffer;
  }

  /**
   * Gets the output buffer
   */
  getOutput(): AudioNode {
    return this.outputBuffer;
  }

  /**
   * Sets the previous node in the chain
   */
  setPrev(prev: AudioNode): void {
    this.prev = prev;
  }

  /**
   * Routes the internal effects chain
   */
  routeInternal(): void {
    const chain = this.chain;
    
    // Disconnect all existing connections first
    chain.forEach(node => {
      try {
        node.disconnect();
      } catch (e) {
        // Node might not be connected, that's okay
      }
    });
    
    // Connect the chain
    for (let i = 0; i < chain.length - 1; i++) {
      try {
        chain[i].connect(chain[i + 1]);
      } catch (e) {
        console.error('Error connecting audio nodes:', e);
      }
    }
  }

  /**
   * Disconnects the output buffer
   */
  disconnect(): void {
    try {
      this.outputBuffer.disconnect();
    } catch (e) {
      // Already disconnected, that's okay
    }
  }

  /**
   * Disposes of the model and cleans up resources
   */
  dispose(): void {
    if (this.disposed) return;
    
    this.disconnect();
    this.chain = [];
    this.effects = [];
    this.disposed = true;
  }
}
