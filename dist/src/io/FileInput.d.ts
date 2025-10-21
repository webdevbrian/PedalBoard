/**
 * File input for playing audio files
 */
import { Input } from './Input';
export declare class FileInput extends Input {
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
//# sourceMappingURL=FileInput.d.ts.map