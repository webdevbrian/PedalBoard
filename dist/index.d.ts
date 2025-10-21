/**
 * Simple EventEmitter implementation for TypeScript
 */
type EventListener = (...args: any[]) => void;
declare class EventEmitter {
    private events;
    on(event: string, listener: EventListener): this;
    off(event: string, listener: EventListener): this;
    emit(event: string, ...args: any[]): this;
    once(event: string, listener: EventListener): this;
    removeAllListeners(event?: string): this;
    listenerCount(event: string): number;
    addEventListener: (event: string, listener: EventListener) => this;
    removeEventListener: (event: string, listener: EventListener) => this;
    dispatchEvent: (event: string, ...args: any[]) => this;
}

/**
 * Core type definitions for Pedalboard.js
 */
interface IAudioNode {
    connect(destination: AudioNode | AudioParam): AudioNode;
    disconnect(): void;
}
interface IConnectable {
    getInput(): AudioNode;
    getOutput(): AudioNode;
    connect(destination: IConnectable): void;
    disconnect(): void;
    setPrev(prev: IConnectable): void;
}
interface IConnectableModel {
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
interface IPotValue {
    value: number;
    min: number;
    max: number;
    step?: number;
    logarithmic?: boolean;
}
interface ISwitchState {
    on: boolean;
    momentary?: boolean;
}
interface IPedalConfig {
    name: string;
    bypass?: boolean;
    params?: Record<string, any>;
}
interface IBoardConfig {
    name?: string;
    pedals: IPedalConfig[];
}
type PotType = 'linear' | 'logarithmic';
type SwitchType = 'toggle' | 'momentary';
type PedalType = 'overdrive' | 'delay' | 'reverb' | 'cabinet' | 'volume' | 'custom';
interface IPedalDefinition {
    type: PedalType;
    name: string;
    manufacturer?: string;
    pots: {
        name: string;
        type: PotType;
        defaultValue: number;
        min: number;
        max: number;
        param?: string;
    }[];
    switches: {
        name: string;
        type: SwitchType;
        defaultState: boolean;
    }[];
}

/**
 * Base connectable component model. Hosts input and output buffer, chain and effects base.
 * Modern TypeScript implementation of the original ConnectableModel
 */

declare class ConnectableModel implements IConnectableModel {
    context: AudioContext;
    inputBuffer: GainNode;
    outputBuffer: GainNode;
    chain: AudioNode[];
    effects: AudioNode[];
    protected prev?: AudioNode;
    protected next?: AudioNode;
    private disposed;
    constructor(context: AudioContext);
    /**
     * Connects the output of the audio node of this model to another audio node.
     */
    connect(destination: AudioNode): void;
    /**
     * Gets the input buffer
     */
    getInput(): AudioNode;
    /**
     * Gets the output buffer
     */
    getOutput(): AudioNode;
    /**
     * Sets the previous node in the chain
     */
    setPrev(prev: AudioNode): void;
    /**
     * Routes the internal effects chain
     */
    routeInternal(): void;
    /**
     * Disconnects the output buffer
     */
    disconnect(): void;
    /**
     * Disposes of the model and cleans up resources
     */
    dispose(): void;
}

/**
 * Base Connectable component. It hosts other components as children, has a model and IO functionality.
 * Modern TypeScript implementation
 */

declare abstract class Connectable extends EventEmitter implements IConnectable {
    protected model: IConnectableModel;
    protected context: AudioContext;
    protected components: any[];
    constructor(context: AudioContext, ModelClass?: typeof ConnectableModel);
    /**
     * Creates child components such as pots and switches.
     * Override in subclasses
     */
    protected createChildComponents(): void;
    /**
     * Binds model events. Override in subclasses if needed
     */
    protected bindModelEvents(): void;
    /**
     * Gets the input buffer
     */
    getInput(): AudioNode;
    /**
     * Gets the output buffer
     */
    getOutput(): AudioNode;
    /**
     * Sets the previous pedal in the chain
     */
    setPrev(prev: IConnectable): void;
    /**
     * Connects to another pedal
     */
    connect(destination: IConnectable): void;
    /**
     * Disconnects the output
     */
    disconnect(): void;
    /**
     * Disposes of the component
     */
    dispose(): void;
}

/**
 * Base pedal component model
 * Modern TypeScript implementation
 */

declare class BoxModel extends ConnectableModel {
    level: GainNode;
    nodes: [AudioNode, AudioNode, AudioNode | null][];
    constructor(context: AudioContext);
    /**
     * Sets the level of the effect
     */
    setLevel(newLevel: number): void;
    /**
     * Routes the internal effects chain and sets up bypass nodes
     */
    routeInternal(): void;
    /**
     * Enables the effect (removes bypass)
     */
    enable(): void;
    /**
     * Bypasses the effect
     */
    bypass(): void;
}

/**
 * Base Pot (potentiometer) class
 * Modern TypeScript implementation
 */

declare abstract class Pot extends EventEmitter {
    protected value: number;
    protected min: number;
    protected max: number;
    protected step: number;
    protected name: string;
    protected handler?: (value: number) => void;
    protected audioParam?: AudioParam;
    constructor(handlerOrParam: ((value: number) => void) | AudioParam, name: string, multiplier?: number, min?: number, max?: number);
    /**
     * Sets the value of the pot (0-1 range, will be mapped to min-max)
     */
    setValue(normalizedValue: number): void;
    /**
     * Sets the actual value (not normalized)
     */
    setActualValue(value: number): void;
    /**
     * Maps normalized value (0-1) to actual range
     * Override in subclasses for different curves
     */
    protected abstract mapValue(normalizedValue: number): number;
    /**
     * Gets the current value
     */
    getValue(): number;
    /**
     * Gets the normalized value (0-1)
     */
    getNormalizedValue(): number;
    /**
     * Gets the pot configuration
     */
    getConfig(): IPotValue;
    /**
     * Gets the pot name
     */
    getName(): string;
}

/**
 * Linear potentiometer - maps input linearly to output
 */

declare class LinearPot extends Pot {
    /**
     * Maps normalized value (0-1) to actual range using linear mapping
     */
    protected mapValue(normalizedValue: number): number;
}

/**
 * Base switch class for pedal switches
 */

declare abstract class Switch extends EventEmitter {
    protected state: boolean;
    protected name: string;
    protected nodes?: [AudioNode, AudioNode, AudioNode | null][];
    constructor(name: string, defaultState?: boolean);
    /**
     * Sets the switch state
     */
    setState(state: boolean): void;
    /**
     * Gets the current state
     */
    getState(): boolean;
    /**
     * Toggles the switch state
     */
    abstract toggle(): void;
    /**
     * Sets the audio nodes for bypass routing
     * Format: [[activeNode, inputNode, bypassNode], ...]
     */
    setNodes(nodes: [AudioNode, AudioNode, AudioNode | null][]): void;
    /**
     * Routes audio nodes based on switch state
     */
    protected routeNodes(): void;
    /**
     * Gets the switch configuration
     */
    getConfig(): ISwitchState;
    /**
     * Returns whether this is a momentary switch
     */
    abstract isMomentary(): boolean;
    /**
     * Gets the switch name
     */
    getName(): string;
}

/**
 * Toggle switch - stays in position until toggled again
 */

declare class ToggleSwitch extends Switch {
    /**
     * Toggles the switch state
     */
    toggle(): void;
    /**
     * Returns false as this is not a momentary switch
     */
    isMomentary(): boolean;
}

/**
 * LED indicator that follows a switch state
 */

declare class Led extends EventEmitter {
    private switch;
    private state;
    constructor(switchControl: Switch);
    /**
     * Sets the LED state
     */
    setState(state: boolean): void;
    /**
     * Gets the LED state
     */
    getState(): boolean;
    /**
     * Checks if LED is on
     */
    isOn(): boolean;
    /**
     * Checks if LED is off
     */
    isOff(): boolean;
}

/**
 * Base pedal class
 * Modern TypeScript implementation
 */

declare abstract class Box extends Connectable {
    protected model: BoxModel;
    volumePot: LinearPot;
    bypassSwitch: ToggleSwitch;
    led: Led;
    pots: Pot[];
    switches: ToggleSwitch[];
    leds: Led[];
    abstract readonly name: string;
    constructor(context: AudioContext, ModelClass?: typeof BoxModel);
    /**
     * Creates the potentiometers for this pedal
     */
    protected createPots(): void;
    /**
     * Creates the switches for this pedal
     */
    protected createSwitches(): void;
    /**
     * Override createChildComponents to create pots and switches
     */
    protected createChildComponents(): void;
    /**
     * Connects to another pedal and sets up bypass nodes
     */
    connect(destination: IConnectable): void;
    /**
     * Sets the volume level
     */
    setLevel(value: number): void;
    /**
     * Gets the current volume level
     */
    getLevel(): number;
    /**
     * Toggles the bypass state
     */
    toggleBypass(): void;
    /**
     * Sets the bypass state
     */
    setBypass(bypassed: boolean): void;
    /**
     * Gets the bypass state
     */
    isBypassed(): boolean;
}

/**
 * Board class - hosts pedals and manages routing between them
 * Modern TypeScript implementation
 */

declare class Board extends Connectable {
    private pedals;
    private mediaStreamDestination?;
    constructor(context: AudioContext);
    /**
     * Adds pedals to the board
     */
    addPedals(pedals: Box[]): void;
    /**
     * Adds a single pedal to the board
     */
    addPedal(pedal: Box): void;
    /**
     * Adds a pedal at a specific position
     */
    addPedalAt(pedal: Box, index: number): void;
    /**
     * Removes a pedal from the board
     */
    removePedal(pedal: Box): void;
    /**
     * Removes a pedal at a specific index
     */
    removePedalAt(index: number): Box | undefined;
    /**
     * Gets all pedals on the board
     */
    getPedals(): Box[];
    /**
     * Gets a pedal at a specific index
     */
    getPedalAt(index: number): Box | undefined;
    /**
     * Moves a pedal to a new position
     */
    movePedal(fromIndex: number, toIndex: number): void;
    /**
     * Routes the internal signal chain through all pedals
     */
    private routeInternal;
    /**
     * Sets media stream destination for WebRTC
     */
    setMediaStreamDestination(destination: MediaStreamAudioDestinationNode): void;
    /**
     * Clears all pedals from the board
     */
    clear(): void;
    /**
     * Disposes of the board and all its pedals
     */
    dispose(): void;
    /**
     * Serializes the board configuration
     */
    toJSON(): any;
}

/**
 * Base input class for audio sources
 */

declare class Input extends EventEmitter {
    protected context: AudioContext;
    protected outputNode: GainNode;
    protected source?: AudioNode;
    protected isPlaying: boolean;
    constructor(context: AudioContext);
    /**
     * Connects the input to a destination
     */
    connect(destination: AudioNode | {
        getInput(): AudioNode;
    }): void;
    /**
     * Disconnects the input
     */
    disconnect(): void;
    /**
     * Starts playing the input
     */
    play(): void;
    /**
     * Stops playing the input
     */
    stop(): void;
    /**
     * Gets the output node
     */
    getOutput(): AudioNode;
    /**
     * Checks if input is playing
     */
    getIsPlaying(): boolean;
    /**
     * Sets the volume of the input
     */
    setVolume(value: number): void;
    /**
     * Gets the volume of the input
     */
    getVolume(): number;
    /**
     * Disposes of the input
     */
    dispose(): void;
}

/**
 * Output class for audio destination (speakers)
 */

declare class Output extends EventEmitter implements IConnectable {
    private context;
    private inputNode;
    private masterVolume;
    private compressor;
    private limiter;
    private analyser;
    constructor(context: AudioContext);
    /**
     * Gets the input node for connections
     */
    getInput(): AudioNode;
    /**
     * Gets the output node (returns destination for compatibility)
     */
    getOutput(): AudioNode;
    /**
     * Connects to another destination (for IConnectable compatibility)
     */
    connect(destination: IConnectable): void;
    /**
     * Sets previous in chain (for IConnectable compatibility)
     */
    setPrev(_prev: IConnectable): void;
    /**
     * Disconnects (for IConnectable compatibility)
     */
    disconnect(): void;
    /**
     * Sets the master volume (0-1)
     */
    setVolume(value: number): void;
    /**
     * Gets the master volume
     */
    getVolume(): number;
    /**
     * Mutes the output
     */
    mute(): void;
    /**
     * Unmutes the output
     */
    unmute(): void;
    /**
     * Enables/disables the compressor
     */
    setCompressorEnabled(enabled: boolean): void;
    /**
     * Sets compressor parameters
     */
    setCompressorParams(params: {
        threshold?: number;
        knee?: number;
        ratio?: number;
        attack?: number;
        release?: number;
    }): void;
    /**
     * Gets the current output level (0-1)
     */
    getLevel(): number;
    /**
     * Gets frequency data for visualization
     */
    getFrequencyData(): Uint8Array;
    /**
     * Gets waveform data for visualization
     */
    getWaveformData(): Uint8Array;
    /**
     * Connects an additional output destination
     */
    connectDestination(destination: AudioNode): void;
    /**
     * Disconnects from a destination
     */
    disconnectDestination(destination: AudioNode): void;
    /**
     * Disposes of the output
     */
    dispose(): void;
}

/**
 * Stage class - manages the entire audio pipeline
 * Modern TypeScript implementation
 */

declare class Stage extends EventEmitter {
    private context;
    private board?;
    private input;
    private output;
    private mediaStreamDestination?;
    constructor();
    /**
     * Gets the audio context
     */
    getContext(): AudioContext;
    /**
     * Resumes the audio context if suspended
     */
    resume(): Promise<void>;
    /**
     * Sets the board on the stage
     */
    setBoard(board: Board): void;
    /**
     * Gets the current board
     */
    getBoard(): Board | undefined;
    /**
     * Routes the audio signal through the chain
     */
    private route;
    /**
     * Plays an audio file
     */
    play(url: string): Promise<void>;
    /**
     * Plays an uploaded file
     */
    playFile(file: File): Promise<void>;
    /**
     * Starts live input (microphone/line-in)
     */
    startLiveInput(): Promise<void>;
    /**
     * Stops the current input
     */
    stop(): void;
    /**
     * Sets the input
     */
    setInput(input: Input): void;
    /**
     * Gets the current input
     */
    getInput(): Input;
    /**
     * Gets the output
     */
    getOutput(): Output;
    /**
     * Sets the master volume
     */
    setVolume(value: number): void;
    /**
     * Gets the master volume
     */
    getVolume(): number;
    /**
     * Sets media stream destination for WebRTC
     */
    setMediaStreamDestination(destination: MediaStreamAudioDestinationNode): void;
    /**
     * Creates a media stream destination
     */
    createMediaStreamDestination(): MediaStreamAudioDestinationNode;
    /**
     * Gets audio analysis data
     */
    getAnalysisData(): {
        inputLevel: number;
        outputLevel: number;
        frequencyData: Uint8Array;
        waveformData: Uint8Array;
    };
    /**
     * Disposes of the stage and all resources
     */
    dispose(): void;
}

/**
 * Overdrive pedal model - creates distortion effect
 */

declare class OverdriveModel extends BoxModel {
    private waveShaper;
    private lowPass;
    private lowPassFreq;
    private driveAmount;
    constructor(context: AudioContext);
    /**
     * Creates wave shaper curve for distortion
     */
    private createWSCurve;
    /**
     * Sets the drive (distortion) level
     * @param value 0-10 range
     */
    setDrive(value: number): void;
    /**
     * Sets the tone (brightness) level
     * @param value 0-10 range
     */
    setTone(value: number): void;
    /**
     * Gets the current drive amount
     */
    getDrive(): number;
    /**
     * Gets the current tone frequency
     */
    getTone(): number;
}

/**
 * Overdrive pedal - adds distortion/overdrive effect
 */

declare class Overdrive extends Box {
    protected model: OverdriveModel;
    readonly name = "overdrive";
    private drivePot;
    private tonePot;
    constructor(context: AudioContext);
    /**
     * Creates the pots for this pedal
     */
    protected createPots(): void;
    /**
     * Sets the drive amount
     */
    setDrive(value: number): void;
    /**
     * Gets the drive amount
     */
    getDrive(): number;
    /**
     * Sets the tone
     */
    setTone(value: number): void;
    /**
     * Gets the tone
     */
    getTone(): number;
}

/**
 * Delay pedal model - creates echo/delay effect
 */

declare class DelayModel extends BoxModel {
    private delay;
    private feedback;
    private wetGain;
    private dryGain;
    private maxDelayTime;
    constructor(context: AudioContext);
    /**
     * Routes internal connections
     */
    routeInternal(): void;
    /**
     * Sets the delay time in seconds
     * @param time Delay time in seconds (0 to maxDelayTime)
     */
    setDelayTime(time: number): void;
    /**
     * Sets the feedback amount (how much of the delayed signal feeds back)
     * @param amount 0-1 range (be careful with values close to 1)
     */
    setFeedback(amount: number): void;
    /**
     * Sets the wet/dry mix
     * @param mix 0-1 range (0 = fully dry, 1 = fully wet)
     */
    setMix(mix: number): void;
    /**
     * Gets the current delay time
     */
    getDelayTime(): number;
    /**
     * Gets the current feedback amount
     */
    getFeedback(): number;
    /**
     * Gets the current mix
     */
    getMix(): number;
}

/**
 * Delay pedal - adds echo/delay effect
 */

declare class Delay extends Box {
    protected model: DelayModel;
    readonly name = "delay";
    private timePot;
    private feedbackPot;
    private mixPot;
    constructor(context: AudioContext);
    /**
     * Creates the pots for this pedal
     */
    protected createPots(): void;
    /**
     * Sets the delay time (0-10 maps to 0-2 seconds)
     */
    setDelayTimer(value: number): void;
    /**
     * Sets the feedback gain (0-10 maps to 0-95%)
     */
    setFeedbackGain(value: number): void;
    /**
     * Sets the mix (0-10 maps to 0-100%)
     */
    setMix(value: number): void;
    /**
     * Gets the delay time in seconds
     */
    getDelayTime(): number;
    /**
     * Gets the feedback amount
     */
    getFeedback(): number;
    /**
     * Gets the mix amount
     */
    getMix(): number;
}

/**
 * Reverb pedal model - creates reverb/room effect using convolution
 */

declare class ReverbModel extends BoxModel {
    private convolver;
    private wetGain;
    private dryGain;
    private impulseBuffer?;
    constructor(context: AudioContext);
    /**
     * Generates an impulse response for the reverb
     * @param duration Duration of the reverb tail in seconds
     * @param decay Decay factor (how quickly it fades)
     * @param brightness High frequency content (0-1)
     */
    private generateImpulse;
    /**
     * Routes internal connections
     */
    routeInternal(): void;
    /**
     * Sets the room size (generates new impulse)
     * @param size 0-10 range (maps to 0.5-4 seconds)
     */
    setRoomSize(size: number): void;
    /**
     * Sets the wet/dry mix
     * @param mix 0-1 range (0 = fully dry, 1 = fully wet)
     */
    setMix(mix: number): void;
    /**
     * Sets the brightness of the reverb
     * @param brightness 0-10 range
     */
    setBrightness(brightness: number): void;
    /**
     * Loads a custom impulse response from URL
     */
    loadImpulse(url: string): Promise<void>;
}

/**
 * Reverb pedal - adds reverb/room effect
 */

declare class Reverb extends Box {
    protected model: ReverbModel;
    readonly name = "reverb";
    private roomSizePot;
    private mixPot;
    private brightnessPot;
    constructor(context: AudioContext);
    /**
     * Creates the pots for this pedal
     */
    protected createPots(): void;
    /**
     * Sets the room size
     */
    setRoomSize(value: number): void;
    /**
     * Sets the mix (overrides setLevel for compatibility)
     */
    setLevel(value: number): void;
    /**
     * Sets the brightness
     */
    setBrightness(value: number): void;
    /**
     * Loads a custom impulse response
     */
    loadImpulse(url: string): Promise<void>;
}

/**
 * Volume pedal model - simple gain control
 */

declare class VolumeModel extends BoxModel {
    constructor(context: AudioContext);
    /**
     * Sets the volume (0-10 range)
     */
    setVolume(value: number): void;
    /**
     * Gets the current volume
     */
    getVolume(): number;
}

/**
 * Volume pedal - simple volume control
 */

declare class Volume extends Box {
    protected model: VolumeModel;
    readonly name = "volume";
    constructor(context: AudioContext);
    /**
     * Creates the pots for this pedal
     */
    protected createPots(): void;
    /**
     * Sets the volume
     */
    setVolume(value: number): void;
    /**
     * Gets the volume
     */
    getVolume(): number;
}

/**
 * Cabinet simulator model - simulates guitar cabinet frequency response
 */

declare class CabinetModel extends BoxModel {
    private lowShelf;
    private highShelf;
    private midPeak;
    private lowPass;
    private highPass;
    private cabinetType;
    constructor(context: AudioContext);
    /**
     * Sets the cabinet type with predefined EQ curves
     */
    setCabinetType(type: 'vintage' | 'modern' | 'british' | 'custom'): void;
    /**
     * Sets the bass response
     */
    setBass(value: number): void;
    /**
     * Sets the mid response
     */
    setMid(value: number): void;
    /**
     * Sets the treble response
     */
    setTreble(value: number): void;
    /**
     * Sets the presence (high frequency emphasis)
     */
    setPresence(value: number): void;
    /**
     * Gets the current cabinet type
     */
    getCabinetType(): string;
}

/**
 * Cabinet simulator pedal - simulates guitar cabinet
 */

declare class Cabinet extends Box {
    protected model: CabinetModel;
    readonly name = "cabinet";
    private bassPot;
    private midPot;
    private treblePot;
    private presencePot;
    constructor(context: AudioContext);
    /**
     * Creates the pots for this pedal
     */
    protected createPots(): void;
    /**
     * Sets the cabinet type
     */
    setCabinetType(type: 'vintage' | 'modern' | 'british' | 'custom'): void;
    /**
     * Sets the bass EQ
     */
    setBass(value: number): void;
    /**
     * Sets the mid EQ
     */
    setMid(value: number): void;
    /**
     * Sets the treble EQ
     */
    setTreble(value: number): void;
    /**
     * Sets the presence
     */
    setPresence(value: number): void;
}

/**
 * Logarithmic potentiometer - maps input logarithmically to output
 * Better for audio applications where human perception is logarithmic
 */

declare class LogPot extends Pot {
    /**
     * Maps normalized value (0-1) to actual range using logarithmic mapping
     */
    protected mapValue(normalizedValue: number): number;
}

/**
 * Momentary switch - only active while pressed
 */

declare class MomentarySwitch extends Switch {
    private pressTimer?;
    /**
     * Presses the switch (turns on)
     */
    press(): void;
    /**
     * Releases the switch (turns off)
     */
    release(): void;
    /**
     * Toggles momentarily (press and release after delay)
     */
    toggle(): void;
    /**
     * Returns true as this is a momentary switch
     */
    isMomentary(): boolean;
    /**
     * Cleanup
     */
    dispose(): void;
}

/**
 * File input for playing audio files
 */

declare class FileInput extends Input {
    private buffer?;
    private bufferSource?;
    private startTime;
    private pauseTime;
    constructor(context: AudioContext, url?: string);
    /**
     * Loads an audio file from URL
     */
    loadFile(url: string): Promise<void>;
    /**
     * Loads audio from an ArrayBuffer
     */
    loadArrayBuffer(arrayBuffer: ArrayBuffer): Promise<void>;
    /**
     * Loads audio from a File object (for file uploads)
     */
    loadFileObject(file: File): Promise<void>;
    /**
     * Plays the loaded audio file
     */
    play(when?: number): void;
    /**
     * Stops playback
     */
    stop(): void;
    /**
     * Pauses playback (can be resumed)
     */
    pause(): void;
    /**
     * Resumes playback from pause
     */
    resume(): void;
    /**
     * Gets the duration of the loaded audio
     */
    getDuration(): number;
    /**
     * Gets the current playback position
     */
    getCurrentTime(): number;
    /**
     * Sets the playback position
     */
    seek(time: number): void;
    /**
     * Sets playback to loop
     */
    setLoop(loop: boolean): void;
    /**
     * Disposes of the input
     */
    dispose(): void;
}

/**
 * Stream input for live audio (microphone/line-in)
 */

declare class StreamInput extends Input {
    private stream?;
    private sourceNode?;
    private analyser?;
    private constraints;
    constructor(context: AudioContext, autoStart?: boolean);
    /**
     * Starts the audio stream
     */
    startStream(): Promise<void>;
    /**
     * Stops the audio stream
     */
    stop(): void;
    /**
     * Gets the current audio level (0-1)
     */
    getLevel(): number;
    /**
     * Gets frequency data for visualization
     */
    getFrequencyData(): Uint8Array;
    /**
     * Gets time domain data for waveform visualization
     */
    getWaveformData(): Uint8Array;
    /**
     * Sets custom constraints for the media stream
     */
    setConstraints(constraints: MediaStreamConstraints): void;
    /**
     * Restarts the stream with new constraints
     */
    restart(): Promise<void>;
    /**
     * Checks if microphone permission is granted
     */
    static checkPermission(): Promise<PermissionState>;
    /**
     * Gets available audio input devices
     */
    static getAudioDevices(): Promise<MediaDeviceInfo[]>;
    /**
     * Switches to a different audio input device
     */
    switchDevice(deviceId: string): Promise<void>;
    /**
     * Disposes of the input
     */
    dispose(): void;
}

/**
 * Pedalboard.js - Modern TypeScript library for guitar effects
 * @version 2.0.0
 */

declare const _default: {
    Stage: typeof Stage;
    Board: typeof Board;
    pedals: {
        Overdrive: typeof Overdrive;
        Delay: typeof Delay;
        Reverb: typeof Reverb;
        Volume: typeof Volume;
        Cabinet: typeof Cabinet;
    };
};

export { Board, Box, BoxModel, Cabinet, CabinetModel, Connectable, ConnectableModel, Delay, DelayModel, EventEmitter, FileInput, type IAudioNode, type IBoardConfig, type IConnectable, type IConnectableModel, type IPedalConfig, type IPedalDefinition, type IPotValue, type ISwitchState, Input, Led, LinearPot, LogPot, MomentarySwitch, Output, Overdrive, OverdriveModel, type PedalType, Pot, type PotType, Reverb, ReverbModel, Stage, StreamInput, Switch, type SwitchType, ToggleSwitch, Volume, VolumeModel, _default as default };
