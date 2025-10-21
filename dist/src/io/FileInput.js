/**
 * File input for playing audio files
 */
import { Input } from './Input';
export class FileInput extends Input {
    constructor(context, url) {
        super(context);
        Object.defineProperty(this, "buffer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bufferSource", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "startTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "pauseTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        if (url) {
            this.loadFile(url);
        }
    }
    /**
     * Loads an audio file from URL
     */
    async loadFile(url) {
        this.emit('loading');
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            this.buffer = await this.context.decodeAudioData(arrayBuffer);
            this.emit('loaded', this.buffer);
        }
        catch (error) {
            console.error('Failed to load audio file:', error);
            this.emit('error', error);
            throw error;
        }
    }
    /**
     * Loads audio from an ArrayBuffer
     */
    async loadArrayBuffer(arrayBuffer) {
        this.emit('loading');
        try {
            this.buffer = await this.context.decodeAudioData(arrayBuffer);
            this.emit('loaded', this.buffer);
        }
        catch (error) {
            console.error('Failed to decode audio data:', error);
            this.emit('error', error);
            throw error;
        }
    }
    /**
     * Loads audio from a File object (for file uploads)
     */
    async loadFileObject(file) {
        const arrayBuffer = await file.arrayBuffer();
        await this.loadArrayBuffer(arrayBuffer);
    }
    /**
     * Plays the loaded audio file
     */
    play(when = 0) {
        if (!this.buffer) {
            console.error('No audio buffer loaded');
            return;
        }
        // Stop any existing playback
        this.stop();
        // Create new buffer source
        this.bufferSource = this.context.createBufferSource();
        this.bufferSource.buffer = this.buffer;
        this.bufferSource.connect(this.outputNode);
        // Handle playback ended
        this.bufferSource.onended = () => {
            this.isPlaying = false;
            this.emit('ended');
        };
        // Start playback
        const offset = this.pauseTime;
        this.bufferSource.start(when, offset);
        this.startTime = this.context.currentTime - offset;
        this.isPlaying = true;
        this.emit('play');
    }
    /**
     * Stops playback
     */
    stop() {
        if (this.bufferSource && this.isPlaying) {
            try {
                this.bufferSource.stop();
                this.bufferSource.disconnect();
            }
            catch (e) {
                // Already stopped
            }
            this.bufferSource = undefined;
        }
        this.pauseTime = 0;
        this.isPlaying = false;
        this.emit('stop');
    }
    /**
     * Pauses playback (can be resumed)
     */
    pause() {
        if (this.isPlaying && this.bufferSource) {
            this.pauseTime = this.context.currentTime - this.startTime;
            this.stop();
            this.emit('pause');
        }
    }
    /**
     * Resumes playback from pause
     */
    resume() {
        if (!this.isPlaying && this.pauseTime > 0) {
            this.play();
        }
    }
    /**
     * Gets the duration of the loaded audio
     */
    getDuration() {
        return this.buffer ? this.buffer.duration : 0;
    }
    /**
     * Gets the current playback position
     */
    getCurrentTime() {
        if (this.isPlaying) {
            return this.context.currentTime - this.startTime;
        }
        return this.pauseTime;
    }
    /**
     * Sets the playback position
     */
    seek(time) {
        const wasPlaying = this.isPlaying;
        this.stop();
        this.pauseTime = Math.max(0, Math.min(time, this.getDuration()));
        if (wasPlaying) {
            this.play();
        }
    }
    /**
     * Sets playback to loop
     */
    setLoop(loop) {
        if (this.bufferSource) {
            this.bufferSource.loop = loop;
        }
    }
    /**
     * Disposes of the input
     */
    dispose() {
        this.stop();
        this.buffer = undefined;
        super.dispose();
    }
}
