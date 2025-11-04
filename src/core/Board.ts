/**
 * Board class - hosts pedals and manages routing between them
 * Modern TypeScript implementation
 */

import { Connectable } from './Connectable';
import { ConnectableModel } from './ConnectableModel';
import { Box } from '../pedals/Box';
import { IConnectable } from '../types';

export class Board extends Connectable {
  private pedals: Box[] = [];
  private mediaStreamDestination?: MediaStreamAudioDestinationNode;

  constructor(context: AudioContext) {
    super(context, ConnectableModel);
  }

  /**
   * Adds pedals to the board
   */
  addPedals(pedals: Box[]): void {
    pedals.forEach(pedal => this.addPedal(pedal));
  }

  /**
   * Adds a single pedal to the board
   */
  addPedal(pedal: Box): void {
    // Ensure pedal is initialized before adding
    if (typeof pedal.initialize === 'function') {
      pedal.initialize();
    }
    this.pedals.push(pedal);
    this.routeInternal();
    this.emit('pedalAdded', pedal);
  }

  /**
   * Adds a pedal at a specific position
   */
  addPedalAt(pedal: Box, index: number): void {
    // Ensure pedal is initialized before adding
    if (typeof pedal.initialize === 'function') {
      pedal.initialize();
    }
    this.pedals.splice(index, 0, pedal);
    this.routeInternal();
    this.emit('pedalAdded', pedal);
  }

  /**
   * Removes a pedal from the board
   */
  removePedal(pedal: Box): void {
    const index = this.pedals.indexOf(pedal);
    if (index !== -1) {
      this.pedals.splice(index, 1);
      pedal.disconnect();
      this.routeInternal();
      this.emit('pedalRemoved', pedal);
    }
  }

  /**
   * Removes a pedal at a specific index
   */
  removePedalAt(index: number): Box | undefined {
    if (index >= 0 && index < this.pedals.length) {
      const pedal = this.pedals.splice(index, 1)[0];
      pedal.disconnect();
      this.routeInternal();
      this.emit('pedalRemoved', pedal);
      return pedal;
    }
    return undefined;
  }

  /**
   * Gets all pedals on the board
   */
  getPedals(): Box[] {
    return [...this.pedals];
  }

  /**
   * Gets a pedal at a specific index
   */
  getPedalAt(index: number): Box | undefined {
    return this.pedals[index];
  }

  /**
   * Moves a pedal to a new position
   */
  movePedal(fromIndex: number, toIndex: number): void {
    if (fromIndex >= 0 && fromIndex < this.pedals.length &&
        toIndex >= 0 && toIndex < this.pedals.length) {
      const pedal = this.pedals.splice(fromIndex, 1)[0];
      this.pedals.splice(toIndex, 0, pedal);
      this.routeInternal();
    }
  }

  /**
   * Overrides connect to maintain pedal routing
   */
  connect(destination: IConnectable): void {
    // Store the destination for outputBuffer
    const connectableModel = this.model as ConnectableModel;
    (connectableModel as any).next = destination.getInput();
    
    // Connect outputBuffer to destination
    this.model.outputBuffer.connect(destination.getInput());
    
    // Ensure pedals are routed
    this.routeInternal();
  }

  /**
   * Routes the internal signal chain through all pedals
   */
  private routeInternal(): void {
    // Disconnect all existing connections
    this.pedals.forEach(pedal => pedal.disconnect());
    
    try {
      this.model.inputBuffer.disconnect();
      this.model.outputBuffer.disconnect();
    } catch (e) {
      // Might not be connected
    }

    if (this.pedals.length === 0) {
      // No pedals, connect input directly to output
      this.model.inputBuffer.connect(this.model.outputBuffer);
    } else {
      // Connect input to first pedal
      this.model.inputBuffer.connect(this.pedals[0].getInput());
      
      // Connect pedals in series
      for (let i = 0; i < this.pedals.length - 1; i++) {
        this.pedals[i].connect(this.pedals[i + 1]);
      }
      
      // Connect last pedal to output
      const lastPedal = this.pedals[this.pedals.length - 1];
      lastPedal.getOutput().connect(this.model.outputBuffer);
      
      // Set the next connection for bypass to work properly
      (lastPedal as any).model.next = this.model.outputBuffer;
    }

    // Reconnect outputBuffer to destination if set
    const connectableModel = this.model as ConnectableModel;
    const next = (connectableModel as any).next;
    if (next) {
      this.model.outputBuffer.connect(next);
    }

    // Connect to media stream if set
    if (this.mediaStreamDestination) {
      this.model.outputBuffer.connect(this.mediaStreamDestination);
    }
  }

  /**
   * Sets media stream destination for WebRTC
   */
  setMediaStreamDestination(destination: MediaStreamAudioDestinationNode): void {
    this.mediaStreamDestination = destination;
    this.routeInternal();
  }

  /**
   * Clears all pedals from the board
   */
  clear(): void {
    this.pedals.forEach(pedal => pedal.disconnect());
    this.pedals = [];
    this.routeInternal();
  }

  /**
   * Disposes of the board and all its pedals
   */
  dispose(): void {
    this.pedals.forEach(pedal => pedal.dispose());
    this.pedals = [];
    super.dispose();
  }

  /**
   * Serializes the board configuration
   */
  toJSON(): any {
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

  /**
   * Loads board configuration from JSON
   */
  fromJSON(data: any, pedalFactory?: (type: string) => any): void {
    if (!data || !data.pedals) {
      throw new Error('Invalid preset format');
    }

    // Clear all existing pedals
    const existingPedals = [...this.pedals];
    existingPedals.forEach(pedal => {
      this.removePedal(pedal);
    });

    // Recreate pedals from preset data
    data.pedals.forEach((pedalData: any) => {
      if (!pedalFactory) {
        console.warn('No pedal factory provided, cannot recreate pedals');
        return;
      }

      const pedal = pedalFactory(pedalData.name);

      if (pedal) {
        // Initialize pedal first (sets default values)
        if (typeof pedal.initialize === 'function') {
          pedal.initialize();
        }

        // Restore pot values (overrides defaults from initialize)
        pedalData.pots?.forEach((potData: any) => {
          const pot = pedal.pots.find((p: any) => p.getName() === potData.name);
          if (pot) {
            pot.setActualValue(potData.value);
          }
        });

        // Add pedal to board (skip initialization since we already did it)
        this.pedals.push(pedal);

        // Restore bypass state
        if (pedalData.bypassed !== pedal.isBypassed()) {
          pedal.bypassSwitch.toggle();
        }
      } else {
        console.warn(`Failed to create pedal of type: ${pedalData.name}`);
      }
    });

    // Re-route the board
    this.routeInternal();
  }
}
