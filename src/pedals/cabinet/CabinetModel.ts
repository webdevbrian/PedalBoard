/**
 * Cabinet simulator model - simulates guitar cabinet frequency response
 */

import { BoxModel } from '../BoxModel';

export class CabinetModel extends BoxModel {
  private lowShelf: BiquadFilterNode;
  private highShelf: BiquadFilterNode;
  private midPeak: BiquadFilterNode;
  private lowPass: BiquadFilterNode;
  private highPass: BiquadFilterNode;
  private convolver?: ConvolverNode;
  private cabinetType: 'vintage' | 'modern' | 'british' | 'custom' = 'vintage';

  constructor(context: AudioContext) {
    super(context);
    
    // Create EQ filters to simulate cabinet response
    this.highPass = this.context.createBiquadFilter();
    this.highPass.type = 'highpass';
    this.highPass.frequency.value = 80; // Remove sub-bass
    this.highPass.Q.value = 0.7;
    
    this.lowShelf = this.context.createBiquadFilter();
    this.lowShelf.type = 'lowshelf';
    this.lowShelf.frequency.value = 200;
    this.lowShelf.gain.value = -2;
    
    this.midPeak = this.context.createBiquadFilter();
    this.midPeak.type = 'peaking';
    this.midPeak.frequency.value = 800;
    this.midPeak.Q.value = 0.5;
    this.midPeak.gain.value = 3;
    
    this.highShelf = this.context.createBiquadFilter();
    this.highShelf.type = 'highshelf';
    this.highShelf.frequency.value = 3000;
    this.highShelf.gain.value = -4;
    
    this.lowPass = this.context.createBiquadFilter();
    this.lowPass.type = 'lowpass';
    this.lowPass.frequency.value = 5000; // Cabinet roll-off
    this.lowPass.Q.value = 0.7;
    
    // Set up effects chain
    this.effects = [
      this.highPass,
      this.lowShelf,
      this.midPeak,
      this.highShelf,
      this.lowPass,
      this.level
    ];
    
    // Apply default vintage cabinet settings
    this.setCabinetType('vintage');
  }

  /**
   * Sets the cabinet type with predefined EQ curves
   */
  setCabinetType(type: 'vintage' | 'modern' | 'british' | 'custom'): void {
    this.cabinetType = type;
    
    switch (type) {
      case 'vintage':
        // Warm, mid-focused vintage tone
        this.highPass.frequency.value = 80;
        this.lowShelf.frequency.value = 200;
        this.lowShelf.gain.value = -2;
        this.midPeak.frequency.value = 800;
        this.midPeak.gain.value = 3;
        this.highShelf.frequency.value = 3000;
        this.highShelf.gain.value = -4;
        this.lowPass.frequency.value = 5000;
        break;
        
      case 'modern':
        // Scooped mids, extended highs and lows
        this.highPass.frequency.value = 60;
        this.lowShelf.frequency.value = 150;
        this.lowShelf.gain.value = 2;
        this.midPeak.frequency.value = 500;
        this.midPeak.gain.value = -3;
        this.highShelf.frequency.value = 4000;
        this.highShelf.gain.value = 2;
        this.lowPass.frequency.value = 8000;
        break;
        
      case 'british':
        // Aggressive mids, tight bass
        this.highPass.frequency.value = 100;
        this.lowShelf.frequency.value = 250;
        this.lowShelf.gain.value = -3;
        this.midPeak.frequency.value = 1200;
        this.midPeak.gain.value = 5;
        this.highShelf.frequency.value = 2500;
        this.highShelf.gain.value = -2;
        this.lowPass.frequency.value = 6000;
        break;
        
      case 'custom':
        // User-defined, start with flat response
        this.highPass.frequency.value = 20;
        this.lowShelf.gain.value = 0;
        this.midPeak.gain.value = 0;
        this.highShelf.gain.value = 0;
        this.lowPass.frequency.value = 20000;
        break;
    }
  }

  /**
   * Sets the bass response
   */
  setBass(value: number): void {
    // Map 0-10 to -10 to +10 dB
    value = Math.max(0, Math.min(10, value));
    this.lowShelf.gain.value = (value - 5) * 2;
  }

  /**
   * Sets the mid response
   */
  setMid(value: number): void {
    // Map 0-10 to -10 to +10 dB
    value = Math.max(0, Math.min(10, value));
    this.midPeak.gain.value = (value - 5) * 2;
  }

  /**
   * Sets the treble response
   */
  setTreble(value: number): void {
    // Map 0-10 to -10 to +10 dB
    value = Math.max(0, Math.min(10, value));
    this.highShelf.gain.value = (value - 5) * 2;
  }

  /**
   * Sets the presence (high frequency emphasis)
   */
  setPresence(value: number): void {
    // Map 0-10 to 3000-8000 Hz
    value = Math.max(0, Math.min(10, value));
    this.lowPass.frequency.value = 3000 + (value * 500);
  }

  /**
   * Gets the current cabinet type
   */
  getCabinetType(): string {
    return this.cabinetType;
  }
}
