/**
 * Cabinet simulator pedal - simulates guitar cabinet
 */

import { Box } from '../Box';
import { CabinetModel } from './CabinetModel';
import { LinearPot } from '../../controls/pots/LinearPot';
import { SelectorPot } from '../../controls/pots/SelectorPot';

export class Cabinet extends Box {
  declare protected model: CabinetModel;
  public readonly name = 'cabinet';
  
  private bassPot!: LinearPot;
  private midPot!: LinearPot;
  private treblePot!: LinearPot;
  private presencePot!: LinearPot;
  private typePot!: SelectorPot;

  constructor(context: AudioContext) {
    super(context, CabinetModel);
  }

  /**
   * Creates the pots for this pedal
   */
  protected createPots(): void {
    super.createPots();

    const typeKeys = ['vintage', 'modern', 'british', 'custom'] as const;
    const typeLabels = ['VNT', 'MOD', 'BRT', 'CUS'];
    this.typePot = new SelectorPot(
      (index: number) => this.model.setCabinetType(typeKeys[index as 0 | 1 | 2 | 3]),
      'type',
      typeLabels,
      0 // default vintage (index 0)
    );

    // Bass EQ (default flat at 5)
    this.bassPot = new LinearPot(
      (value: number) => this.model.setBass(value),
      'bass',
      10,
      0,
      10,
      5 // default flat
    );

    // Mid EQ (default flat at 5)
    this.midPot = new LinearPot(
      (value: number) => this.model.setMid(value),
      'mid',
      10,
      0,
      10,
      5 // default flat
    );

    // Treble EQ (default flat at 5)
    this.treblePot = new LinearPot(
      (value: number) => this.model.setTreble(value),
      'treble',
      10,
      0,
      10,
      5 // default flat
    );

    // Presence (default medium at 5)
    this.presencePot = new LinearPot(
      (value: number) => this.model.setPresence(value),
      'presence',
      10,
      0,
      10,
      5 // default medium
    );

    this.pots.push(this.typePot, this.bassPot, this.midPot, this.treblePot, this.presencePot);
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
