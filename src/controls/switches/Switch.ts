/**
 * Base switch class for pedal switches
 */

import { EventEmitter } from '../../utils/EventEmitter';
import { ISwitchState } from '../../types';

export abstract class Switch extends EventEmitter {
  protected state: boolean = false;
  protected name: string;
  protected nodes?: [AudioNode, AudioNode, AudioNode | null][];

  constructor(name: string, defaultState: boolean = false) {
    super();
    this.name = name;
    this.state = defaultState;
  }

  /**
   * Sets the switch state
   */
  setState(state: boolean): void {
    if (this.state !== state) {
      this.state = state;
      this.emit('change', state);
      this.emit(state ? 'on' : 'off');
      this.routeNodes();
    }
  }

  /**
   * Gets the current state
   */
  getState(): boolean {
    return this.state;
  }

  /**
   * Toggles the switch state
   */
  abstract toggle(): void;

  /**
   * Sets the audio nodes for bypass routing
   * Format: [[activeNode, inputNode, bypassNode], ...]
   */
  setNodes(nodes: [AudioNode, AudioNode, AudioNode | null][]): void {
    this.nodes = nodes;
    this.routeNodes();
  }

  /**
   * Routes audio nodes based on switch state
   */
  protected routeNodes(): void {
    if (!this.nodes) return;
    
    this.nodes.forEach(nodeSet => {
      const [activeNode, inputNode, bypassNode] = nodeSet;
      
      try {
        // Disconnect input from both paths
        inputNode.disconnect();
        
        if (this.state) {
          // Active: route through effect
          inputNode.connect(activeNode);
        } else if (bypassNode) {
          // Bypassed: route directly to bypass node
          inputNode.connect(bypassNode);
        }
      } catch (e) {
        // Nodes might not be connected yet
      }
    });
  }

  /**
   * Gets the switch configuration
   */
  getConfig(): ISwitchState {
    return {
      on: this.state,
      momentary: this.isMomentary()
    };
  }

  /**
   * Returns whether this is a momentary switch
   */
  abstract isMomentary(): boolean;

  /**
   * Gets the switch name
   */
  getName(): string {
    return this.name;
  }
}
