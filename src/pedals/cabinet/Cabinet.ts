/**
 * Cabinet simulator pedal - simulates guitar cabinet
 */

import { Box } from '../Box';
import { CabinetModel } from './CabinetModel';
import { LinearPot } from '../../controls/pots/LinearPot';

export class Cabinet extends Box {
  declare protected model: CabinetModel;
  public readonly name = 'cabinet';
  
  private bassPot!: LinearPot;
  private midPot!: LinearPot;
  private treblePot!: LinearPot;
  private presencePot!: LinearPot;

  constructor(context: AudioContext) {
    super(context, CabinetModel);
  }

  /**
   * Creates the pots for this pedal
   */
  protected createPots(): void {
    super.createPots();
    
    // Bass EQ
    this.bassPot = new LinearPot(
      (value: number) => this.model.setBass(value),
      'bass',
      10,
      0,
      10
    );
    
    // Mid EQ
    this.midPot = new LinearPot(
      (value: number) => this.model.setMid(value),
      'mid',
      10,
      0,
      10
    );
    
    // Treble EQ
    this.treblePot = new LinearPot(
      (value: number) => this.model.setTreble(value),
      'treble',
      10,
      0,
      10
    );
    
    // Presence
    this.presencePot = new LinearPot(
      (value: number) => this.model.setPresence(value),
      'presence',
      10,
      0,
      10
    );
    
    // Add to pots array
    this.pots.push(this.bassPot, this.midPot, this.treblePot, this.presencePot);
    
    // Set default values (neutral EQ)
    this.bassPot.setActualValue(5);
    this.midPot.setActualValue(5);
    this.treblePot.setActualValue(5);
    this.presencePot.setActualValue(5);
  }

  /**
   * Sets the cabinet type
   */
  setCabinetType(type: 'vintage' | 'modern' | 'british' | 'custom'): void {
    this.model.setCabinetType(type);
  }

  /**
   * Sets the bass EQ
   */
  setBass(value: number): void {
    this.bassPot.setActualValue(value);
  }

  /**
   * Sets the mid EQ
   */
  setMid(value: number): void {
    this.midPot.setActualValue(value);
  }

  /**
   * Sets the treble EQ
   */
  setTreble(value: number): void {
    this.treblePot.setActualValue(value);
  }

  /**
   * Sets the presence
   */
  setPresence(value: number): void {
    this.presencePot.setActualValue(value);
  }
}
