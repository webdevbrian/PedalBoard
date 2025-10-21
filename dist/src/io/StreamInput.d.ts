/**
 * Stream input for live audio (microphone/line-in)
 */
import { Input } from './Input';
export declare class StreamInput extends Input {
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
//# sourceMappingURL=StreamInput.d.ts.map