/**
 * Pedalboard.js - Modern TypeScript library for guitar effects
 * @version 2.0.0
 */
export { Stage } from './core/Stage';
export { Board } from './core/Board';
export { Connectable } from './core/Connectable';
export { ConnectableModel } from './core/ConnectableModel';
export { Box } from './pedals/Box';
export { BoxModel } from './pedals/BoxModel';
export { Overdrive } from './pedals/overdrive/Overdrive';
export { OverdriveModel } from './pedals/overdrive/OverdriveModel';
export { Delay } from './pedals/delay/Delay';
export { DelayModel } from './pedals/delay/DelayModel';
export { Reverb } from './pedals/reverb/Reverb';
export { ReverbModel } from './pedals/reverb/ReverbModel';
export { Volume } from './pedals/volume/Volume';
export { VolumeModel } from './pedals/volume/VolumeModel';
export { Cabinet } from './pedals/cabinet/Cabinet';
export { CabinetModel } from './pedals/cabinet/CabinetModel';
export { Pot } from './controls/pots/Pot';
export { LinearPot } from './controls/pots/LinearPot';
export { LogPot } from './controls/pots/LogPot';
export { Switch } from './controls/switches/Switch';
export { ToggleSwitch } from './controls/switches/ToggleSwitch';
export { MomentarySwitch } from './controls/switches/MomentarySwitch';
export { Led } from './controls/Led';
export { Input } from './io/Input';
export { FileInput } from './io/FileInput';
export { StreamInput } from './io/StreamInput';
export { Output } from './io/Output';
export { EventEmitter } from './utils/EventEmitter';
export * from './types';
import { Stage } from './core/Stage';
import { Board } from './core/Board';
import { Overdrive } from './pedals/overdrive/Overdrive';
import { Delay } from './pedals/delay/Delay';
import { Reverb } from './pedals/reverb/Reverb';
import { Volume } from './pedals/volume/Volume';
import { Cabinet } from './pedals/cabinet/Cabinet';
declare const _default: {
    Stage: typeof Stage;
    Board: typeof Board;
    pedals: {
        Overdrive: typeof Overdrive;
        Delay: typeof Delay;
        Reverb: typeof Reverb;
        Volume: typeof Volume;
        Cabinet: typeof Cabinet;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map