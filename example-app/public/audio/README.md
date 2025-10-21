# Audio Assets

This folder contains sample audio files and impulse responses for the Pedalboard.js example application.

## Structure

### `/samples/`
Contains 5 sample MP3 audio files for testing the pedal effects:
- `sample1.mp3` - Guitar sample 1
- `sample2.mp3` - Guitar sample 2
- `sample3.mp3` - Guitar sample 3
- `sample4.mp3` - Guitar sample 4
- `sample5.mp3` - Guitar sample 5

These files are accessible in the AudioControls component for quick testing.

### `/ir/reverb/`
Contains impulse response files for reverb effects:
- `pcm90cleanplate.wav` - Lexicon PCM90 clean plate reverb impulse response

### `/ir/speaker/`
Contains impulse response files for cabinet/speaker simulation:
- `AK-SPKRS_VinUs_002.wav` - Vintage US speaker cabinet impulse response

## Usage in Code

Sample audio files can be loaded using:
```typescript
await stage.play('/audio/samples/sample1.mp3');
```

Impulse responses can be loaded for reverb:
```typescript
await reverb.loadImpulse('/audio/ir/reverb/pcm90cleanplate.wav');
```

Or for cabinet simulation:
```typescript
await cabinet.loadImpulse('/audio/ir/speaker/AK-SPKRS_VinUs_002.wav');
```
