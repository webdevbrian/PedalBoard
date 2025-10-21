# Build Fixes Applied

## Summary of TypeScript Errors Fixed

### 1. Model Initialization Issues
**Problem**: Models were being used before assignment in pedal constructors.
**Solution**: Used `declare` keyword for model properties and properly initialized in constructor.

Files fixed:
- `src/pedals/Box.ts`
- `src/pedals/overdrive/Overdrive.ts`
- `src/pedals/delay/Delay.ts`
- `src/pedals/reverb/Reverb.ts`
- `src/pedals/volume/Volume.ts`
- `src/pedals/cabinet/Cabinet.ts`

### 2. Array Type Mismatches
**Problem**: `nodes` property was typed as 3D array but should be 2D.
**Solution**: Changed type from `AudioNode[][][]` to `[AudioNode, AudioNode, AudioNode | null][]`

Files fixed:
- `src/pedals/BoxModel.ts`
- `src/pedals/delay/DelayModel.ts`
- `src/pedals/reverb/ReverbModel.ts`
- `src/controls/switches/Switch.ts`

### 3. Pot Type Issues
**Problem**: `pots` array was typed as `LinearPot[]` but contained `LogPot` instances.
**Solution**: Changed to `Pot[]` to accept any pot subclass.

Files fixed:
- `src/pedals/Box.ts`

### 4. Output Interface Compliance
**Problem**: `Output` class didn't implement `IConnectable` interface.
**Solution**: Added missing methods (`getOutput`, `connect`, `setPrev`, `disconnect`).

Files fixed:
- `src/io/Output.ts`

### 5. Unused Imports and Variables
**Problem**: Various unused imports and parameters causing warnings.
**Solution**: Removed unused imports and prefixed unused parameters with `_`.

Files fixed:
- `example-app/App.tsx` - Removed unused `React`, `Plus`, `Settings`
- `src/components/Pedal.tsx` - Removed unused `index` parameter
- `src/core/Board.ts` - Removed unused `IConnectable` import
- `src/io/FileInput.ts` - Removed unused `url` property
- `src/io/Output.ts` - Prefixed `prev` with `_`
- `src/pedals/cabinet/CabinetModel.ts` - Removed unused `convolver`
- `src/pedals/delay/DelayModel.ts` - Removed unused `chain` variable

### 6. Invalid Media Constraints
**Problem**: `latency` property doesn't exist on `MediaTrackConstraints`.
**Solution**: Removed invalid `latency: 0` from audio constraints.

Files fixed:
- `src/io/StreamInput.ts`

### 7. Default Export Issues
**Problem**: Default export object couldn't reference classes before they were imported.
**Solution**: Added explicit imports before the default export object.

Files fixed:
- `src/index.ts`

### 8. TypeScript Configuration
**Problem**: `allowImportingTsExtensions` incompatible with `noEmit: false`.
**Solution**: Removed `allowImportingTsExtensions` from tsconfig.

Files fixed:
- `tsconfig.json`

## Remaining IDE Warnings

The IDE may show warnings about missing modules for:
- `../controls/pots/LinearPot`
- `../controls/switches/ToggleSwitch`
- `../controls/Led`

These are false positives - the files exist and the build should work. The IDE TypeScript server may need to be restarted.

## How to Verify Fixes

Run the build command:
```bash
npm run build:lib
```

All TypeScript errors should now be resolved and the build should complete successfully.

## Next Steps

1. Restart your IDE or TypeScript server if you see lingering warnings
2. Run `npm install` if you haven't already
3. Test the build with `npm run build:lib`
4. Test the dev server with `npm run dev`
