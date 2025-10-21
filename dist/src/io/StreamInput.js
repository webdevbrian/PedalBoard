/**
 * Stream input for live audio (microphone/line-in)
 */
import { Input } from './Input';
export class StreamInput extends Input {
    constructor(context, autoStart = true) {
        super(context);
        Object.defineProperty(this, "stream", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sourceNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "analyser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "constraints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Default constraints for audio input
        this.constraints = {
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            },
            video: false
        };
        if (autoStart) {
            this.startStream();
        }
    }
    /**
     * Starts the audio stream
     */
    async startStream() {
        try {
            this.emit('requesting');
            // Request microphone access
            this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
            // Create source node from stream
            this.sourceNode = this.context.createMediaStreamSource(this.stream);
            // Create analyser for level monitoring
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 256;
            // Connect nodes
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.outputNode);
            this.isPlaying = true;
            this.emit('loaded');
            this.emit('play');
        }
        catch (error) {
            console.error('Failed to get audio stream:', error);
            this.emit('error', error);
            throw error;
        }
    }
    /**
     * Stops the audio stream
     */
    stop() {
        if (this.sourceNode) {
            try {
                this.sourceNode.disconnect();
            }
            catch (e) {
                // Already disconnected
            }
            this.sourceNode = undefined;
        }
        if (this.analyser) {
            try {
                this.analyser.disconnect();
            }
            catch (e) {
                // Already disconnected
            }
            this.analyser = undefined;
        }
        if (this.stream) {
            // Stop all tracks
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = undefined;
        }
        this.isPlaying = false;
        this.emit('stop');
    }
    /**
     * Gets the current audio level (0-1)
     */
    getLevel() {
        if (!this.analyser || !this.isPlaying) {
            return 0;
        }
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        // Calculate average level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        return sum / (dataArray.length * 255);
    }
    /**
     * Gets frequency data for visualization
     */
    getFrequencyData() {
        if (!this.analyser) {
            return new Uint8Array(0);
        }
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        return dataArray;
    }
    /**
     * Gets time domain data for waveform visualization
     */
    getWaveformData() {
        if (!this.analyser) {
            return new Uint8Array(0);
        }
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteTimeDomainData(dataArray);
        return dataArray;
    }
    /**
     * Sets custom constraints for the media stream
     */
    setConstraints(constraints) {
        this.constraints = constraints;
    }
    /**
     * Restarts the stream with new constraints
     */
    async restart() {
        this.stop();
        await this.startStream();
    }
    /**
     * Checks if microphone permission is granted
     */
    static async checkPermission() {
        try {
            const result = await navigator.permissions.query({ name: 'microphone' });
            return result.state;
        }
        catch (error) {
            console.error('Failed to check microphone permission:', error);
            return 'prompt';
        }
    }
    /**
     * Gets available audio input devices
     */
    static async getAudioDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(device => device.kind === 'audioinput');
        }
        catch (error) {
            console.error('Failed to enumerate devices:', error);
            return [];
        }
    }
    /**
     * Switches to a different audio input device
     */
    async switchDevice(deviceId) {
        this.constraints.audio = {
            ...(typeof this.constraints.audio === 'object' ? this.constraints.audio : {}),
            deviceId: { exact: deviceId }
        };
        await this.restart();
    }
    /**
     * Disposes of the input
     */
    dispose() {
        this.stop();
        super.dispose();
    }
}
