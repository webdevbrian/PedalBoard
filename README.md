# Pedalboard.js v2.0

<img width="1546" height="897" alt="image" src="https://github.com/user-attachments/assets/a21a223d-0564-4487-8c9a-aef53d1bc3e9" />


A modern TypeScript library for creating guitar effects and audio processing using the Web Audio API. Complete rewrite of the original pedalboard.js with modern tooling, React components, and improved architecture.

## 🎸 Features

- **Modern TypeScript** - Fully typed, modern ES6+ syntax
- **React Components** - Beautiful, interactive UI components
- **Web Audio API** - Powerful audio processing capabilities
- **Modular Architecture** - Clean separation of concerns
- **Real-time Processing** - Live input from microphone/line-in
- **Preset System** - Save and load pedal configurations
- **Extensible** - Easy to create custom pedals

## 🚀 Quick Start

### Installation

```bash
npm install @pedalboard/core
```

### Basic Usage

```typescript
import { Stage, Board, Overdrive, Delay, Reverb } from '@pedalboard/core';

// Create the stage (audio context manager)
const stage = new Stage();

// Create a board to hold pedals
const board = new Board(stage.getContext());

// Create some pedals
const overdrive = new Overdrive(stage.getContext());
const delay = new Delay(stage.getContext());
const reverb = new Reverb(stage.getContext());

// Configure pedals
overdrive.setDrive(5);
overdrive.setTone(7);
delay.setDelayTimer(0.3);
reverb.setRoomSize(5);

// Add pedals to board
board.addPedals([overdrive, delay, reverb]);

// Set board on stage
stage.setBoard(board);

// Play an audio file
await stage.play('/path/to/audio.mp3');

// Or use live input
await stage.startLiveInput();
```

### React Components

```tsx
import { PedalBoard, AudioControls } from '@pedalboard/core/components';

function App() {
  const [stage] = useState(() => new Stage());
  const [board] = useState(() => new Board(stage.getContext()));

  return (
    <div>
      <AudioControls stage={stage} />
      <PedalBoard board={board} />
    </div>
  );
}
```

## 📦 Available Pedals

### Overdrive
Adds distortion/overdrive effect to your signal.

```typescript
const overdrive = new Overdrive(context);
overdrive.setDrive(7);    // 0-10: amount of distortion
overdrive.setTone(5);     // 0-10: brightness
overdrive.setLevel(8);    // 0-10: output volume
```

### Delay
Creates echo/delay effects.

```typescript
const delay = new Delay(context);
delay.setDelayTimer(0.5);     // 0-2: delay time in seconds
delay.setFeedbackGain(0.4);   // 0-0.95: feedback amount
delay.setMix(0.5);           // 0-1: dry/wet mix
```

### Reverb
Adds room/hall reverb effects.

```typescript
const reverb = new Reverb(context);
reverb.setRoomSize(7);      // 0-10: size of reverb space
reverb.setMix(0.3);         // 0-1: dry/wet mix
reverb.setBrightness(5);    // 0-10: high frequency content
```

### Volume
Simple volume control.

```typescript
const volume = new Volume(context);
volume.setVolume(8);        // 0-10: output level
```

### Cabinet
Guitar cabinet simulator with EQ.

```typescript
const cabinet = new Cabinet(context);
cabinet.setCabinetType('vintage'); // 'vintage', 'modern', 'british', 'custom'
cabinet.setBass(5);         // 0-10: bass EQ
cabinet.setMid(5);          // 0-10: mid EQ
cabinet.setTreble(5);       // 0-10: treble EQ
cabinet.setPresence(5);     // 0-10: presence
```

## 🛠️ Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/pedalboard.js.git
cd pedalboard.js

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build the library (outputs to dist/)
npm run build:lib

# Build the example app (outputs to dist-app/)
npm run build:app

# Build both library and example app
npm run build
```

### Preview

```bash
# Build and preview the example app production build at http://localhost:4173
npm run preview
```

### NPM Scripts

- **dev**: Start the Vite dev server for the example app at http://localhost:3000
- **build**: Build both the library and the example app
- **build:lib**: Clean `dist/` and build the library with `tsup` into `dist/`
- **build:app**: Build the example app with Vite into `dist-app/`
- **preview**: Build the app and serve `dist-app/` with Vite Preview (port 4173 by default)
- **clean**: Remove `dist/` and `dist-app/`
- **test**: Run unit tests with Vitest
- **lint**: Lint the codebase with ESLint
- **type-check**: Run TypeScript type checking only

### Output Directories

- **Library artifacts**: `dist/`
- **Example app build**: `dist-app/`

### Testing

```bash
npm run test
```

## 🎨 Creating Custom Pedals

```typescript
import { Box, BoxModel } from '@pedalboard/core';

// Create the model (audio processing)
class MyPedalModel extends BoxModel {
  private filter: BiquadFilterNode;

  constructor(context: AudioContext) {
    super(context);
    
    this.filter = this.context.createBiquadFilter();
    this.filter.type = 'bandpass';
    this.filter.frequency.value = 1000;
    
    this.effects = [this.filter, this.level];
  }

  setFrequency(freq: number) {
    this.filter.frequency.value = freq;
  }
}

// Create the pedal (controls)
class MyPedal extends Box {
  readonly name = 'mypedal';

  constructor(context: AudioContext) {
    super(context, MyPedalModel);
  }

  protected createPots() {
    super.createPots();
    
    const freqPot = new LinearPot(
      (value) => this.model.setFrequency(value),
      'frequency',
      2000,
      100,
      2100
    );
    
    this.pots.push(freqPot);
  }
}
```

## 🔧 Architecture

### Core Concepts

- **Stage**: Manages the audio context and routing
- **Board**: Container for pedals, handles signal chain
- **Pedal (Box)**: Individual effect unit with controls
- **Pot**: Rotary control (knob) for parameters
- **Switch**: On/off or momentary switch
- **LED**: Visual indicator for pedal state

### Signal Flow

```
Input (File/Stream) → Board → Pedal1 → Pedal2 → ... → Output (Speakers)
```

## 🌐 Browser Support

- Chrome 66+
- Firefox 60+
- Safari 14.1+
- Edge 79+

Note: Requires Web Audio API support. Some features like live input may require HTTPS.

## 📄 Migration from v1

### Key Changes

1. **TypeScript** - Complete TypeScript rewrite
2. **No Google Closure** - Removed dependency on Closure Library
3. **Modern Build** - Uses Vite instead of shell scripts
4. **React Components** - Pre-built UI components
5. **Simplified API** - Cleaner, more intuitive methods

### Migration Example

```javascript
// Old (v1)
var stage = new pb.Stage();
var board = new pb.Board(stage.getContext());
var od = new pb.stomp.Overdrive(stage.getContext());
board.addPedals([od]);

// New (v2)
import { Stage, Board, Overdrive } from '@pedalboard/core';

const stage = new Stage();
const board = new Board(stage.getContext());
const overdrive = new Overdrive(stage.getContext());
board.addPedals([overdrive]);
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📝 License

GPL-3.0 License - see LICENSE file for details.

## 🙏 Credits

- Original pedalboard.js by Armagan Amcalar
- Modern rewrite by Brian
- Built with Web Audio API
- UI components with React and Tailwind CSS

## 📚 Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Original pedalboard.js](https://github.com/dashersw/pedalboard.js)
