/**
 * Knob component for pedal controls
 */
import React from 'react';
interface KnobProps {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
    label?: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}
export declare const Knob: React.FC<KnobProps>;
export {};
//# sourceMappingURL=Knob.d.ts.map