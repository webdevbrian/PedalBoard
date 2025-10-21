/**
 * File input for playing audio files
 */

import { Input } from './Input';

export class FileInput extends Input {
  private buffer?: AudioBuffer;
  private bufferSource?: AudioBufferSourceNode;
  private startTime: number = 0;
  private pauseTime: number = 0;

  constructor(context: AudioContext, url?: string) {
    super(context);
    if (url) {
      this.loadFile(url);
    }
  }

  /**
   * Loads an audio file from URL
   */
  async loadFile(url: string): Promise<void> {
    this.emit('loading');
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.buffer = await this.context.decodeAudioData(arrayBuffer);
      this.emit('loaded', this.buffer);
    } catch (error) {
      console.error('Failed to load audio file:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Loads audio from an ArrayBuffer
   */
  async loadArrayBuffer(arrayBuffer: ArrayBuffer): Promise<void> {
    this.emit('loading');
    
    try {
      this.buffer = await this.context.decodeAudioData(arrayBuffer);
      this.emit('loaded', this.buffer);
    } catch (error) {
      console.error('Failed to decode audio data:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Loads audio from a File object (for file uploads)
   */
  async loadFileObject(file: File): Promise<void> {
    const arrayBuffer = await file.arrayBuffer();
    await this.loadArrayBuffer(arrayBuffer);
  }

  /**
   * Plays the loaded audio file
   */
  play(when: number = 0): void {
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
  stop(): void {
    if (this.bufferSource && this.isPlaying) {
      try {
        this.bufferSource.stop();
        this.bufferSource.disconnect();
      } catch (e) {
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
  pause(): void {
    if (this.isPlaying && this.bufferSource) {
      this.pauseTime = this.context.currentTime - this.startTime;
      this.stop();
      this.emit('pause');
    }
  }

  /**
   * Resumes playback from pause
   */
  resume(): void {
    if (!this.isPlaying && this.pauseTime > 0) {
      this.play();
    }
  }

  /**
   * Gets the duration of the loaded audio
   */
  getDuration(): number {
    return this.buffer ? this.buffer.duration : 0;
  }

  /**
   * Gets the current playback position
   */
  getCurrentTime(): number {
    if (this.isPlaying) {
      return this.context.currentTime - this.startTime;
    }
    return this.pauseTime;
  }

  /**
   * Sets the playback position
   */
  seek(time: number): void {
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
  setLoop(loop: boolean): void {
    if (this.bufferSource) {
      this.bufferSource.loop = loop;
    }
  }

  /**
   * Disposes of the input
   */
  dispose(): void {
    this.stop();
    this.buffer = undefined;
    super.dispose();
  }
}
