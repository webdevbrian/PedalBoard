/**
 * Toggle switch - stays in position until toggled again
 */
import { Switch } from './Switch';
export class ToggleSwitch extends Switch {
    /**
     * Toggles the switch state
     */
    toggle() {
        this.setState(!this.state);
    }
    /**
     * Returns false as this is not a momentary switch
     */
    isMomentary() {
        return false;
    }
}
