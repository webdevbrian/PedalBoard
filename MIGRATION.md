# Migration Guide: Pedalboard.js v1 to v2

This guide helps you migrate from the original Pedalboard.js (v1) to the modern TypeScript version (v2).

## Major Changes

### 1. Technology Stack

**v1 (Original)**
- Google Closure Library
- tartJS framework
- Closure Compiler
- Plain JavaScript
- Custom build scripts (shell)

**v2 (Modern)**
- TypeScript
- React (optional for UI)
- Vite build tool
- ES6+ modules
- NPM scripts

### 2. Installation

**v1:**
```html
<script src="dist/compiled.js"></script>
```

**v2:**
```bash
npm install @pedalboard/core
```

```javascript
import { Stage, Board, Overdrive } from '@pedalboard/core';
```

### 3. Namespace Changes

**v1:**
```javascript
// Everything under pb namespace
var stage = new pb.Stage();
var board = new pb.Board(context);
var overdrive = new pb.stomp.Overdrive(context);
var pot = new pb.pot.Linear(handler, 'volume', 1);
```

**v2:**
```typescript
// Direct imports
import { Stage, Board, Overdrive, LinearPot } from '@pedalboard/core';

const stage = new Stage();
const board = new Board(context);
const overdrive = new Overdrive(context);
const pot = new LinearPot(handler, 'volume', 1);
```

### 4. API Changes

#### Stage

**v1:**
```javascript
var stage = new pb.Stage();
stage.setBoard(board);
stage.play('audio/sample.mp3');
```

**v2:**
```typescript
const stage = new Stage();
stage.setBoard(board);
await stage.play('/audio/sample.mp3'); // Now returns a Promise
```

#### Board

**v1:**
```javascript
var board = new pb.Board(context);
board.addPedals([pedal1, pedal2]);
board.addPedalAt(pedal3, 1);
```

**v2:**
```typescript
const board = new Board(context);
board.addPedals([pedal1, pedal2]);
board.addPedalAt(pedal3, 1); // Same API
```

#### Pedals

**v1:**
```javascript
var overdrive = new pb.stomp.Overdrive(context);
overdrive.setDrive(0.5);
overdrive.setLevel(0.7);
```

**v2:**
```typescript
const overdrive = new Overdrive(context);
overdrive.setDrive(5);  // Now uses 0-10 scale consistently
overdrive.setLevel(7);  // Now uses 0-10 scale consistently
```

### 5. Event Handling

**v1 (Google Closure events):**
```javascript
goog.events.listen(
  switch.model, 
  pb.footswitch.SwitchModel.EventType.ON,
  handler
);
```

**v2 (Native EventEmitter):**
```typescript
switch.on('change', (state: boolean) => {
  console.log('Switch state:', state);
});

// Or
switch.addEventListener('change', handler);
```

### 6. Component Creation

**v1:**
```javascript
pb.stomp.MyPedal = function(context) {
  goog.base(this, context);
};
goog.inherits(pb.stomp.MyPedal, pb.stomp.Box);

pb.stomp.MyPedal.prototype.createPots = function() {
  // ...
};
```

**v2:**
```typescript
class MyPedal extends Box {
  readonly name = 'mypedal';
  
  constructor(context: AudioContext) {
    super(context, MyPedalModel);
  }
  
  protected createPots(): void {
    // ...
  }
}
```

### 7. Model Pattern

**v1:**
```javascript
pb.stomp.MyPedalModel = function(context) {
  goog.base(this, context);
};
goog.inherits(pb.stomp.MyPedalModel, pb.stomp.BoxModel);
```

**v2:**
```typescript
class MyPedalModel extends BoxModel {
  constructor(context: AudioContext) {
    super(context);
  }
}
```

### 8. UI Components

**v1:**
- Custom DOM manipulation
- jQuery-based UI
- Manual event binding

**v2:**
- React components available
- Modern component architecture
- Declarative UI

```tsx
import { PedalBoard, Pedal, Knob } from '@pedalboard/core/components';

<PedalBoard board={board}>
  <Pedal pedal={overdrive} />
</PedalBoard>
```

### 9. Build Process

**v1:**
```bash
./scripts/deps.sh
./scripts/build.sh
```

**v2:**
```bash
npm run build
npm run dev  # Development server
```

### 10. TypeScript Benefits

**v2 provides full TypeScript support:**

```typescript
interface IPedalConfig {
  name: string;
  bypass?: boolean;
  params?: Record<string, any>;
}

// Full intellisense and type checking
const config: IPedalConfig = {
  name: 'overdrive',
  bypass: false,
  params: { drive: 5, tone: 7 }
};
```

## Step-by-Step Migration

### Step 1: Update Dependencies

Remove old script tags and install the new package:

```bash
npm install @pedalboard/core
```

### Step 2: Update Imports

Replace namespace-based code with ES6 imports:

```typescript
// Old
var stage = new pb.Stage();

// New
import { Stage } from '@pedalboard/core';
const stage = new Stage();
```

### Step 3: Update Event Handlers

Replace Google Closure events with native EventEmitter:

```typescript
// Old
goog.events.listen(pedal, 'change', handler);

// New
pedal.on('change', handler);
```

### Step 4: Update Pedal Configuration

Adjust value ranges (most now use 0-10 scale):

```typescript
// Old (various scales)
overdrive.setDrive(0.3);  // 0-1 scale

// New (consistent 0-10 scale)
overdrive.setDrive(3);    // 0-10 scale
```

### Step 5: Handle Async Operations

Many operations are now async:

```typescript
// Old
stage.play('audio.mp3');

// New
await stage.play('audio.mp3');
```

### Step 6: Update UI (Optional)

If using the UI, replace custom DOM code with React components:

```tsx
// Old - Manual DOM manipulation
var pedalElement = document.createElement('div');
pedalElement.className = 'pedal';

// New - React components
<Pedal pedal={overdrive} />
```

## Common Issues and Solutions

### Issue: "goog is not defined"
**Solution:** Remove all Google Closure dependencies and use ES6 imports.

### Issue: "Cannot find namespace pb"
**Solution:** Import specific classes instead of using namespace.

### Issue: Build errors with shell scripts
**Solution:** Use npm scripts instead:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

### Issue: Event handlers not working
**Solution:** Update to new EventEmitter API:
```typescript
// Use .on() instead of goog.events.listen
pedal.on('event', handler);
```

## Need Help?

- Check the [README](README-NEW.md) for updated documentation
- Review the [example app](example-app/) for working code
- File an issue on GitHub for migration problems
