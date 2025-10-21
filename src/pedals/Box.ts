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
  declare public volumePot: LinearPot;
  declare public bypassSwitch: ToggleSwitch;
  declare public led: Led;
  declare public pots: Pot[];
  declare public switches: ToggleSwitch[];
  declare public leds: Led[];
  
  // Abstract property that subclasses must implement
  abstract readonly name: string;

  constructor(context: AudioContext, ModelClass: typeof BoxModel = BoxModel) {
    super(context, ModelClass as any);
  }

  /**
   * Creates the potentiometers for this pedal
   */
  protected createPots(): void {
    // Initialize pots array
    this.pots = [];
    
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
    // Initialize arrays
    this.switches = [];
    this.leds = [];
    
    // Create bypass switch (default to bypassed/off so pedal starts disabled)
    this.bypassSwitch = new ToggleSwitch('bypass', false);
    
    // Create LED that follows bypass switch
    this.led = new Led(this.bypassSwitch);
    
    this.leds = [this.led];
    this.switches = [this.bypassSwitch];
    
    // Handle bypass switching
    this.bypassSwitch.on('change', (state: boolean) => {
      if (state) {
        // Enabled - route through effects
        this.model.enable();
        this.led.setState(true);
      } else {
        // Bypassed - route around effects  
        this.model.bypass();
        this.led.setState(false);
      }
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
    
    // After routing, apply the current bypass state
    if (this.bypassSwitch) {
      const isBypassed = !this.bypassSwitch.getState(); // false = bypassed
      if (isBypassed) {
        this.model.bypass();
      }
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
