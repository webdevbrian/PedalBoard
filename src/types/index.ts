/**
 * Core type definitions for Pedalboard.js
 */

export interface IAudioNode {
  connect(destination: AudioNode | AudioParam): AudioNode;
  disconnect(): void;
}

export interface IConnectable {
  getInput(): AudioNode;
  getOutput(): AudioNode;
  connect(destination: IConnectable): void;
  disconnect(): void;
  setPrev(prev: IConnectable): void;
}

export interface IConnectableModel {
  context: AudioContext;
  inputBuffer: GainNode;
  outputBuffer: GainNode;
  effects: AudioNode[];
  chain: AudioNode[];
  connect(destination: AudioNode): void;
  disconnect(): void;
  getInput(): AudioNode;
  getOutput(): AudioNode;
  setPrev(prev: AudioNode): void;
  routeInternal(): void;
  dispose(): void;
}

export interface IPotValue {
  value: number;
  min: number;
  max: number;
  step?: number;
  logarithmic?: boolean;
  options?: string[];
}

export interface ISwitchState {
  on: boolean;
  momentary?: boolean;
}

export interface IPedalConfig {
  name: string;
  bypass?: boolean;
  params?: Record<string, any>;
}

export interface IBoardConfig {
  name?: string;
  pedals: IPedalConfig[];
}

export type PotType = 'linear' | 'logarithmic';
export type SwitchType = 'toggle' | 'momentary';
export type PedalType = 'overdrive' | 'delay' | 'reverb' | 'cabinet' | 'volume' | 'custom';

export interface IPedalDefinition {
  type: PedalType;
  name: string;
  manufacturer?: string;
  pots: {
    name: string;
    type: PotType;
    defaultValue: number;
    min: number;
    max: number;
    param?: string; // AudioParam to control
  }[];
  switches: {
    name: string;
    type: SwitchType;
    defaultState: boolean;
  }[];
}
