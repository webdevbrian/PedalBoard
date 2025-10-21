# Quick Start Guide - Pedalboard.js v2

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

That's it! You should see the Pedalboard.js interface with sample pedals.

## 🎸 Basic Usage

### Try the Example App

The example app demonstrates all features:
- Add/remove pedals
- Adjust pedal settings
- Upload audio files or use microphone input
- Save/load presets

### Code Example

Create your own pedalboard in just a few lines:

```typescript
import { Stage, Board, Overdrive, Delay, Reverb } from '@pedalboard/core';

// Initialize
const stage = new Stage();
const board = new Board(stage.getContext());

// Add pedals
const overdrive = new Overdrive(stage.getContext());
const delay = new Delay(stage.getContext());
const reverb = new Reverb(stage.getContext());

board.addPedals([overdrive, delay, reverb]);
stage.setBoard(board);

// Play audio
await stage.play('/audio/sample.mp3');
```

## 📦 Build for Production

```bash
# Build the library
npm run build:lib

# Build the example app
npm run build
```

## 🎛️ Available Pedals

- **Overdrive** - Distortion/overdrive effect
- **Delay** - Echo/delay effect
- **Reverb** - Room/hall reverb
- **Volume** - Simple volume control
- **Cabinet** - Guitar cabinet simulator

## 🎨 Using React Components

```tsx
import { PedalBoard, AudioControls } from '@pedalboard/core/components';

function App() {
  const stage = new Stage();
  const board = new Board(stage.getContext());
  
  return (
    <>
      <AudioControls stage={stage} />
      <PedalBoard board={board} />
    </>
  );
}
```

## 📚 Next Steps

- Read the full [README](README-NEW.md)
- Check the [Migration Guide](MIGRATION.md) if coming from v1
- Explore the [example app source](example-app/)
- Create custom pedals

## 🆘 Troubleshooting

### Audio Context not starting?
Click anywhere on the page first. Browsers require user interaction to start audio.

### No sound?
1. Check your volume (both system and in-app)
2. Make sure you've uploaded an audio file or enabled microphone
3. Check that pedals aren't bypassed (LED should be on)

### Microphone not working?
1. Allow microphone permissions when prompted
2. Make sure you're using HTTPS (required for getUserMedia)
3. Check your browser console for errors

## 📝 Commands Reference

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:lib    # Build library only
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🎉 Ready to Rock!

You're all set! Start experimenting with different pedal combinations and create your perfect tone.
