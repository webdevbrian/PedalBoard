/**
 * Base pedal class
 * Modern TypeScript implementation
 */

import { Connectable } from '../core/Connectable';
import { BoxModel } from './BoxModel';
import { LinearPot } from '../controls/pots/LinearPot';
import { Pot } from '../controls/pots/Pot';
import { ToggleSwitch } from '../controls/switches/ToggleSwitch';
import { Led } from '../controls/Led';
import { IConnectable } from '../types';

export abstract class Box extends Connectable {
  declare protected model: BoxModel;
  public volumePot!: LinearPot;
  public bypassSwitch!: ToggleSwitch;
  public led!: Led;
  public pots: Pot[] = [];
  public switches: ToggleSwitch[] = [];
  public leds: Led[] = [];
  
  // Abstract property that subclasses must implement
  abstract readonly name: string;

  constructor(context: AudioContext, ModelClass: typeof BoxModel = BoxModel) {
    super(context, ModelClass as any);
    this.model = new ModelClass(context) as BoxModel;
  }

  /**
   * Creates the potentiometers for this pedal
   */
  protected createPots(): void {
    // Create volume pot that controls the level gain
    this.volumePot = new LinearPot(
      (value: number) => this.model.setLevel(value),
      'volume',
      1,
      0,
      10
    );
    this.volumePot.setValue(10); // Default to full volume
    
    this.pots = [this.volumePot];
  }

  /**
   * Creates the switches for this pedal
   */
  protected createSwitches(): void {
    // Create bypass switch
    this.bypassSwitch = new ToggleSwitch('bypass');
    
    // Create LED that follows bypass switch
    this.led = new Led(this.bypassSwitch);
    
    this.leds = [this.led];
    this.switches = [this.bypassSwitch];
    
    // Handle bypass switching
    this.bypassSwitch.on('change', (state: boolean) => {
      if (state) {
        this.model.enable();
      } else {
        this.model.bypass();
      }
      // Small delay to avoid clicks
      setTimeout(() => {
        if (state) {
          this.model.enable();
        } else {
          this.model.bypass();
        }
      }, 10);
    });
  }

  /**
   * Override createChildComponents to create pots and switches
   */
  protected createChildComponents(): void {
    this.createPots();
    this.createSwitches();
  }

  /**
   * Connects to another pedal and sets up bypass nodes
   */
  connect(destination: IConnectable): void {
    super.connect(destination);
    
    // Set up bypass switch nodes if needed
    if (this.bypassSwitch && this.model.nodes) {
      // The bypass switch will handle routing between effect and bypass
      this.bypassSwitch.setNodes(this.model.nodes);
    }
  }

  /**
   * Sets the volume level
   */
  setLevel(value: number): void {
    this.volumePot.setValue(value);
  }

  /**
   * Gets the current volume level
   */
  getLevel(): number {
    return this.volumePot.getValue();
  }

  /**
   * Toggles the bypass state
   */
  toggleBypass(): void {
    this.bypassSwitch.toggle();
  }

  /**
   * Sets the bypass state
   */
  setBypass(bypassed: boolean): void {
    this.bypassSwitch.setState(!bypassed);
  }

  /**
   * Gets the bypass state
   */
  isBypassed(): boolean {
    return !this.bypassSwitch.getState();
  }
}
