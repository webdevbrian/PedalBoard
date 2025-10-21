/**
 * Momentary switch - only active while pressed
 */
import { Switch } from './Switch';
export declare class MomentarySwitch extends Switch {
    private pressTimer?;
    /**
     * Presses the switch (turns on)
     */
    press(): void;
    /**
     * Releases the switch (turns off)
     */
    release(): void;
    /**
     * Toggles momentarily (press and release after delay)
     */
    toggle(): void;
    /**
     * Returns true as this is a momentary switch
     */
    isMomentary(): boolean;
    /**
     * Cleanup
     */
    dispose(): void;
}
//# sourceMappingURL=MomentarySwitch.d.ts.map