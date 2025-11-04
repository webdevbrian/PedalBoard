/**
 * Base Connectable component. It hosts other components as children, has a model and IO functionality.
 * Modern TypeScript implementation
 */

import { IConnectable, IConnectableModel } from '../types';
import { ConnectableModel } from './ConnectableModel';
import { EventEmitter } from '../utils/EventEmitter';

export abstract class Connectable extends EventEmitter implements IConnectable {
  protected model: IConnectableModel;
  protected context: AudioContext;
  protected components: any[] = [];

  constructor(context: AudioContext, ModelClass: typeof ConnectableModel = ConnectableModel) {
    super();
    this.context = context;
    this.model = new ModelClass(context);
    this.createChildComponents();
    this.bindModelEvents();
  }

  /**
   * Initializes the component and all child components with their default values.
   * Call this after construction is complete.
   */
  initialize(): void {
    this.initializeChildComponents();
  }

  /**
   * Creates child components such as pots and switches.
   * Override in subclasses
   */
  protected createChildComponents(): void {
    this.components = [];
  }

  /**
   * Initializes all child components with their default values.
   * Override in subclasses if custom initialization order is needed.
   */
  protected initializeChildComponents(): void {
    this.components.forEach(component => {
      if (component.initialize && typeof component.initialize === 'function') {
        component.initialize();
      }
    });
  }

  /**
   * Binds model events. Override in subclasses if needed
   */
  protected bindModelEvents(): void {
    // Override in subclasses
  }

  /**
   * Gets the input buffer
   */
  getInput(): AudioNode {
    return this.model.getInput();
  }

  /**
   * Gets the output buffer
   */
  getOutput(): AudioNode {
    return this.model.getOutput();
  }

  /**
   * Sets the previous pedal in the chain
   */
  setPrev(prev: IConnectable): void {
    this.model.setPrev(prev.getOutput());
  }

  /**
   * Connects to another pedal
   */
  connect(destination: IConnectable): void {
    destination.setPrev(this);
    this.model.connect(destination.getInput());
  }

  /**
   * Disconnects the output
   */
  disconnect(): void {
    this.model.disconnect();
  }

  /**
   * Disposes of the component
   */
  dispose(): void {
    this.components.forEach(component => {
      if (component.dispose) {
        component.dispose();
      }
    });
    this.model.dispose();
    this.removeAllListeners();
  }
}
